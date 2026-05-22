import { NextRequest, NextResponse } from 'next/server';
import { databricksClient } from '@/lib/databricks';

interface GetRunParams {
    params: {
        runId: string;
    }
}

export async function GET(req: NextRequest, { params }: GetRunParams) {
  const { runId } = params;

  if (!runId) {
    return NextResponse.json({ error: 'runId is required.' }, { status: 400 });
  }

  try {
    const response = await databricksClient.get('/api/2.1/jobs/runs/get', {
      params: {
        run_id: runId,
      },
    });

    const { state } = response.data;

    return NextResponse.json({
      life_cycle_state: state?.life_cycle_state,
      result_state: state?.result_state,
    });

  } catch (error: any) {
    console.error(`Failed to get job status for runId ${runId}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to get job status.' }, { status: 500 });
  }
}
