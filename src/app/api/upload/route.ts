import { NextRequest, NextResponse } from 'next/server';
import { databricksClient } from '@/lib/databricks';
import fs from 'fs';

const SESSION_METADATA_TABLE = "chat_sessions.sessions.session_metadata";
const VOLUME_BASE_PATH = "/Volumes/chat_sessions/sessions/uploads";

// Helper to escape strings for SQL
const sql_string = (value: string) => `'${value.replace(/'/g, "''")}'`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const sessionId = formData.get('sessionId') as string;
    const uploadedFile = formData.get('file') as File;

    if (!sessionId || !uploadedFile) {
      return NextResponse.json({ error: 'Session ID and file are required.' }, { status: 400 });
    }

    const extension = uploadedFile.name.split('.').pop();
    const volumeFilePath = `${VOLUME_BASE_PATH}/${sessionId}.${extension}`;

    const fileContent = Buffer.from(await uploadedFile.arrayBuffer());

    await databricksClient.put(
        `/api/2.0/fs/files${volumeFilePath}`,
        fileContent,
        {
          headers: { 'Content-Type': 'application/octet-stream' },
          params: {
            overwrite: true
          }
        }
    );

    const updateQuery = `
      UPDATE ${SESSION_METADATA_TABLE}
      SET
          upload_status = 'UPLOADED',
          original_file_name = ${sql_string(uploadedFile.name)},
          uploaded_path = ${sql_string(volumeFilePath)},
          updated_at = current_timestamp()
      WHERE session_id = ${sql_string(sessionId)}
    `;

    const warehouseId = process.env.DATABRICKS_WAREHOUSE_ID;
     if (!warehouseId) {
        return NextResponse.json({ error: 'DATABRICKS_WAREHOUSE_ID is not set' }, { status: 500 });
    }

    await databricksClient.post('/api/2.0/sql/statements', {
      statement: updateQuery,
      warehouse_id: warehouseId,
    });


    return NextResponse.json({ success: true, filePath: volumeFilePath });
  } catch (error: any) {
    console.error('Upload failed:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Upload failed.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
