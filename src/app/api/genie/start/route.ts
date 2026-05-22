import { NextRequest, NextResponse } from "next/server";

const DATABRICKS_HOST = process.env.DATABRICKS_HOST!;
const DATABRICKS_PAT = process.env.DATABRICKS_PAT!;
const DATABRICKS_SPACE_ID = process.env.DATABRICKS_SPACE_ID!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${DATABRICKS_HOST}/api/2.0/genie/spaces/${DATABRICKS_SPACE_ID}/start-conversation`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DATABRICKS_PAT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}