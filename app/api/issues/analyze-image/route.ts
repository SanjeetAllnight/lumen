import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const result = await analyzeImage(image);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API /analyze-image]", err);
    return NextResponse.json({ error: "Image analysis failed" }, { status: 500 });
  }
}
