import { NextRequest, NextResponse } from "next/server";

// analyze-image — AI removed. Returns an empty result so callers don't break.
// To restore AI image analysis, re-implement with a vision model here.
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: "Image analysis is not available (AI removed)" },
    { status: 501 }
  );
}
