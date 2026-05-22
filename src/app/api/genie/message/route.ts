import { NextRequest, NextResponse } from "next/server";

const DATABRICKS_HOST =
  process.env.DATABRICKS_HOST!;

const DATABRICKS_PAT =
  process.env.DATABRICKS_PAT!;

const DATABRICKS_SPACE_ID =
  process.env.DATABRICKS_SPACE_ID!;

export async function POST(
  req: NextRequest
) {
  try {
    const body =
      await req.json();

    const endpoint = `${DATABRICKS_HOST}/api/2.0/genie/spaces/${DATABRICKS_SPACE_ID}/conversations/${body.conversation_id}/messages`;

    console.log(
      "Send Message Endpoint:",
      endpoint
    );

    const response =
      await fetch(endpoint, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${DATABRICKS_PAT}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          content:
            body.message,
        }),
      });

    const rawText =
      await response.text();

    console.log(
      "Send Message Response:",
      rawText
    );

    const data =
      JSON.parse(rawText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "Message Route Error:",
      error
    );

    return NextResponse.json(
      {
        error: true,
        message:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}