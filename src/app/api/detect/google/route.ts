// src/app/api/detect-label/route.ts

import { NextRequest, NextResponse } from "next/server";
import vision from "@google-cloud/vision";

// Init Google Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const base64Image = body.base64Image;

    if (!base64Image) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const [result] = await client.labelDetection({
      image: { content: base64Image.split(",")[1] }, // Remove base64 prefix
    });

    const labels = result.labelAnnotations || [];
    const topLabel = labels
      .filter((l) => (l.score ?? 0) > 0.5)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];

    return NextResponse.json({
      label: topLabel?.description || "Could not detect dish name",
    });
  } catch (err) {
    console.error("Vision API Error:", err);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}