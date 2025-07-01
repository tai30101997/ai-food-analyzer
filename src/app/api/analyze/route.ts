import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodAgent } from "../../../../lib/agent/langchain/index"

export async function POST(request: NextRequest) {
  try {
    const { dishName } = await request.json();
    console.log("Received dishName:", dishName);
    if (!dishName) {
      return NextResponse.json({ error: "Dish name is required" }, { status: 400 });
    }

    const result = await analyzeFoodAgent(dishName);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in analyzeFoodAgent:", error);
    return NextResponse.json({ error: "Failed to analyze food" }, { status: 500 });
  }
}