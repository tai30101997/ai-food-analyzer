import { NextRequest, NextResponse } from "next/server";
import { suggestFoodAgent } from "../../../../lib/agent/langchain/index";

export async function POST(request: NextRequest) {
  try {
    const { userQuery } = await request.json();
    if (!userQuery) {
      return NextResponse.json({ error: "User query is required" }, { status: 400 });
    }
    const result = await suggestFoodAgent(userQuery);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in suggestFoodAgent:", error);
    return NextResponse.json({ error: "Failed to suggest food" }, { status: 500 });
  }
}
