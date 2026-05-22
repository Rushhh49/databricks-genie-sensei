import { NextRequest, NextResponse } from 'next/server';
import { databricksClient } from '@/lib/databricks';

interface ColumnStatusesParams {
    params: {
        sessionId: string;
    }
}

const COLUMN_METADATA_TABLE = "chat_sessions.sessions.column_metadata";

export async function GET(req: NextRequest, { params }: ColumnStatusesParams) {
    const { sessionId } = params;

    if (!sessionId) {
        return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    const query = `
        SELECT column_name, get_column_statuses, clarifying_question
        FROM ${COLUMN_METADATA_TABLE}
        WHERE session_id = '${sessionId}'
    `;
    
    const warehouseId = process.env.DATABRICKS_WAREHOUSE_ID;
     if (!warehouseId) {
        return NextResponse.json({ error: 'DATABRICKS_WAREHOUSE_ID is not set' }, { status: 500 });
    }

    try {
        // This is a bit tricky. The statement API is asynchronous.
        // For a SELECT query, we need to submit it, poll for the result, and then fetch the result data.
        const statementResponse = await databricksClient.post('/api/2.0/sql/statements', {
            statement: query,
            warehouse_id: warehouseId,
            wait_timeout: '50s' // Wait for the result synchronously
        });

        const { result } = statementResponse.data;

        if (!result || !result.data_array) {
            return NextResponse.json([]);
        }

        const statuses = result.data_array.map((row: any) => ({
            column_name: row[0],
            semantic_status: row[1],
            clarifying_question: row[2],
        }));
        
        return NextResponse.json(statuses);

    } catch (error: any) {
        console.error(`Failed to get column statuses for session ${sessionId}:`, error);
        return NextResponse.json({ error: error.message || 'Failed to get column statuses.' }, { status: 500 });
    }
}
