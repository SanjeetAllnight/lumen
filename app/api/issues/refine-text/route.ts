import { NextRequest, NextResponse } from "next/server";

// refine-text — AI removed. Echoes input unchanged so callers don't break.
export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    }
    // No-op: return the original text as-is
    return NextResponse.json({ title, description });
  } catch (err) {
    console.error("[API /refine-text]", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
