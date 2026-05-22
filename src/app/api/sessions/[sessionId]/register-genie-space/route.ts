import { NextRequest, NextResponse } from 'next/server';
import { databricksClient } from '@/lib/databricks';
import { v4 as uuidv4 } from 'uuid';

const COLUMN_METADATA_TABLE = "chat_sessions.sessions.column_metadata";

interface RegisterGenieSpaceParams {
    params: {
        sessionId: string;
    }
}

// Helper function to execute SQL and fetch results
async function executeSql(query: string) {
    const warehouseId = process.env.DATABRICKS_WAREHOUSE_ID;
    if (!warehouseId) {
        throw new Error('DATABRICKS_WAREHOUSE_ID is not set');
    }
    
    const statementResponse = await databricksClient.post('/api/2.0/sql/statements', {
        statement: query,
        warehouse_id: warehouseId,
        wait_timeout: '50s'
    });

    return statementResponse.data?.result?.data_array || [];
}


export async function POST(req: NextRequest, { params }: RegisterGenieSpaceParams) {
    const { sessionId } = params;
    
    const spaceId = process.env.DATABRICKS_SPACE_ID;
    const targetTable = `chat_sessions.sessions.session_${sessionId}_cleaned`;

    if (!spaceId) {
        return NextResponse.json({ error: 'DATABRICKS_SPACE_ID is not set' }, { status: 500 });
    }

    try {
        // STEP 1: FETCH EXISTING GENIE SPACE
        const getUrl = `/api/2.0/genie/spaces/${spaceId}?include_serialized_space=true`;
        const spaceResponse = await databricksClient.get(getUrl);
        const serializedSpace = spaceResponse.data.serialized_space;
        const spaceJson = JSON.parse(serializedSpace);

        // STEP 2: FETCH COLUMN METADATA
        const metadataQuery = `
            SELECT clean_column_name, final_column_description, recommended_genie_instruction
            FROM ${COLUMN_METADATA_TABLE}
            WHERE session_id = '${sessionId}'
        `;
        const metadataRows = await executeSql(metadataQuery);

        // STEP 3: BUILD COLUMN CONFIGS
        let columnConfigs = metadataRows.map((row: any) => ({
            column_name: row[0],
            enable_format_assistance: true,
            enable_entity_matching: true
        })).filter((c: any) => c.column_name);
        
        columnConfigs = columnConfigs.sort((a: any, b: any) => a.column_name.localeCompare(b.column_name));

        // STEP 4: BUILD TABLE OBJECT
        const tableObject = {
            identifier: targetTable,
            description: ["Cleaned healthcare patient dataset enriched using AI semantic profiling."],
            column_configs: columnConfigs
        };
        
        // STEP 5: UPDATE TABLES
        if (!spaceJson.data_sources) spaceJson.data_sources = {};
        
        // Only include the newly created table
        spaceJson.data_sources.tables = [tableObject];
        
        // STEP 6: BUILD & UPDATE INSTRUCTIONS
        if (!spaceJson.instructions) spaceJson.instructions = {};
        
        const semanticContents = metadataRows.map((row: any) => {
            const [columnName, description, genieInstruction] = row;
            const parts = [];
            if (description) parts.push(`Column '${columnName}': ${description}`);
            if (genieInstruction) parts.push(`Instruction: ${genieInstruction}`);
            return parts.join("\\n");
        }).filter(Boolean);

        spaceJson.instructions.text_instructions = [{
            id: uuidv4().replace(/-/g, ''),
            content: semanticContents
        }];

        // STEP 7 & 8: SERIALIZE & PATCH SPACE
        const updatedSerializedSpace = JSON.stringify(spaceJson);
        const payload = { serialized_space: updatedSerializedSpace };
        const patchUrl = `/api/2.0/genie/spaces/${spaceId}`;

        await databricksClient.patch(patchUrl, payload);
        
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Failed to register genie space:', error.response?.data || error.message);
        return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
    }
}
