import { NextRequest, NextResponse } from "next/server";

const DATABRICKS_HOST =
  process.env.DATABRICKS_HOST!;

const DATABRICKS_PAT =
  process.env.DATABRICKS_PAT!;

const DATABRICKS_SPACE_ID =
  process.env.DATABRICKS_SPACE_ID!;

export async function GET(
  req: NextRequest
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const conversationId =
      searchParams.get(
        "conversation_id"
      );

    const messageId =
      searchParams.get(
        "message_id"
      );

    if (
      !conversationId ||
      !messageId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing conversation_id or message_id",
        },
        {
          status: 400,
        }
      );
    }

    // THIS WAS THE REAL BUG
    const endpoint = `${DATABRICKS_HOST}/api/2.0/genie/spaces/${DATABRICKS_SPACE_ID}/conversations/${conversationId}/messages/${messageId}`;

    console.log(
      "Polling endpoint:",
      endpoint
    );

    const response =
      await fetch(endpoint, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${DATABRICKS_PAT}`,
          "Content-Type":
            "application/json",
        },

        cache: "no-store",
      });

    const rawText =
      await response.text();

    console.log(
      "Raw Poll Response:",
      rawText
    );

    if (
      !rawText ||
      rawText.trim() === ""
    ) {
      return NextResponse.json({
        status: "PENDING",
      });
    }

    const data =
      JSON.parse(rawText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "Poll Route Error:",
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