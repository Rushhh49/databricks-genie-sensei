import { NextRequest, NextResponse } from 'next/server';
import { databricksClient } from '@/lib/databricks';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, filePath, fileType, answers } = await req.json();

    if (!sessionId || !filePath || !fileType) {
      return NextResponse.json({ error: 'sessionId, filePath, and fileType are required.' }, { status: 400 });
    }

    const jobId = process.env.DATABRICKS_JOB_ID_1;
    if (!jobId) {
        return NextResponse.json({ error: 'DATABRICKS_JOB_ID_1 is not set' }, { status: 500 });
    }

    const userAnswer = answers ? JSON.stringify(answers) : "";

    const response = await databricksClient.post('/api/2.1/jobs/run-now', {
      job_id: jobId,
      notebook_params: {
        session_id: sessionId,
        file_path: filePath,
        file_type: fileType,
        user_answer: userAnswer,
      },
    });

    return NextResponse.json({ runId: response.data.run_id });

  } catch (error: any) {
    console.error('Failed to start job:', error);
    return NextResponse.json({ error: error.message || 'Failed to start job.' }, { status: 500 });
  }
}
