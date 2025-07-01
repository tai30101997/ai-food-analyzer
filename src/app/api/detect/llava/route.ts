import { NextRequest, NextResponse } from "next/server";
import { detectFoodAgent } from "../../../../../lib/agent/langchain/index"

export async function POST(req: NextRequest) {
  try {
    const { base64Image } = await req.json();

    if (!base64Image) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const response = await detectFoodAgent(base64Image);

    if (!response || typeof response !== "string") {
      return NextResponse.json({ error: "No response from LLaVA" }, { status: 500 });
    }

    const dishName = response.trim();
    console.log("Detected dish name:", dishName);
    if (dishName.toLowerCase().includes("không nhận") || dishName.length === 0) {
      return NextResponse.json({ label: "Không nhận diện được món ăn" });
    }

    return NextResponse.json({ label: dishName });
  } catch (error) {
    console.error("LLaVA Error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}