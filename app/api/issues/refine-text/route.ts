import { NextRequest, NextResponse } from "next/server";
import { refineText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    if (!title && !description) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    const result = await refineText(title, description);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[POST /api/issues/refine-text]", error);
    return NextResponse.json({ error: "Refinement failed" }, { status: 500 });
  }
}
