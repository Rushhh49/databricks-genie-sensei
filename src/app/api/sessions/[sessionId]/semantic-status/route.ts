import { NextRequest, NextResponse } from 'next/server';
import { databricksClient } from '@/lib/databricks';

interface SemanticStatusParams {
    params: {
        sessionId: string;
    }
}

const SESSION_METADATA_TABLE = "chat_sessions.sessions.session_metadata";

export async function GET(req: NextRequest, { params }: SemanticStatusParams) {
    const { sessionId } = params;

    if (!sessionId) {
        return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    const query = `
        SELECT semantic_status
        FROM ${SESSION_METADATA_TABLE}
        WHERE session_id = '${sessionId}'
        LIMIT 1
    `;
    
    const warehouseId = process.env.DATABRICKS_WAREHOUSE_ID;
     if (!warehouseId) {
        return NextResponse.json({ error: 'DATABRICKS_WAREHOUSE_ID is not set' }, { status: 500 });
    }

    try {
        const statementResponse = await databricksClient.post('/api/2.0/sql/statements', {
            statement: query,
            warehouse_id: warehouseId,
            wait_timeout: '50s'
        });

        const { result } = statementResponse.data;

        if (!result || !result.data_array || result.data_array.length === 0) {
            return NextResponse.json({ error: 'Session not found or status not set.' }, { status: 404 });
        }
        
        const semanticStatus = result.data_array[0][0];
        
        return NextResponse.json({ semantic_status: semanticStatus });

    } catch (error: any) {
        console.error(`Failed to get semantic status for session ${sessionId}:`, error);
        return NextResponse.json({ error: error.message || 'Failed to get semantic status.' }, { status: 500 });
    }
}
