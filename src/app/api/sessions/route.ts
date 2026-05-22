import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { databricksClient } from '@/lib/databricks';

const SESSION_METADATA_TABLE = "chat_sessions.sessions.session_metadata";

// Helper to escape strings for SQL
const sql_string = (value: string) => `'${value.replace(/'/g, "''")}'`;

export async function POST() {
  try {
    const newSessionId = uuidv4().substring(0, 8);
    const deltaTableName = `chat_sessions.sessions.session_${newSessionId}_cleaned`;

    const insertQuery = `
      INSERT INTO ${SESSION_METADATA_TABLE}
      (session_id, delta_table_name, status, created_at, upload_status, updated_at, semantic_status)
      VALUES (
        ${sql_string(newSessionId)},
        ${sql_string(deltaTableName)},
        'created',
        current_timestamp(),
        'PENDING_UPLOAD',
        current_timestamp(),
        'PENDING'
      )
    `;

    // This requires a warehouse ID. I need to get this from an env var.
    // I will add it to the .env.example file.
    // For now I will hardcode a placeholder.
    const warehouseId = process.env.DATABRICKS_WAREHOUSE_ID;
    if (!warehouseId) {
        return NextResponse.json({ error: 'DATABRICKS_WAREHOUSE_ID is not set' }, { status: 500 });
    }
    
    await databricksClient.post('/api/2.0/sql/statements', {
      statement: insertQuery,
      warehouse_id: warehouseId,
    });

    return NextResponse.json({ sessionId: newSessionId });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
