import { NextRequest, NextResponse } from "next/server";
import { refineText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    }
    const result = await refineText(title, description);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API /refine-text]", err);
    return NextResponse.json({ error: "Text refinement failed" }, { status: 500 });
  }
}
