import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodAgent } from "../../../../lib/agent/langchain/index"

export async function POST(request: NextRequest) {
  try {
    const { dishname } = await request.json();
    console.log("Received dishName:", dishname);
    if (!dishname) {
      return NextResponse.json({ error: "Dish name is required" }, { status: 400 });
    }

    const result = await analyzeFoodAgent(dishname);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in analyzeFoodAgent:", error);
    return NextResponse.json({ error: "Failed to analyze food" }, { status: 500 });
  }
}