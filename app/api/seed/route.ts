import { NextResponse } from "next/server";

// Seed route is intentionally disabled.
// All events and issues must be submitted by real users.
// This endpoint exists only to prevent build errors.

export async function POST() {
  return NextResponse.json({
    message: "Seeding is disabled. All data must be submitted by users.",
  });
}
