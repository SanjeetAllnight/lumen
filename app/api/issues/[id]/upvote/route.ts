import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

// PATCH /api/issues/[id]/upvote
// Body: { action: "add" | "remove", userId: string }
// - "add"    → arrayUnion(userId) + increment(+1)
// - "remove" → arrayRemove(userId) + increment(-1)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { action = "add", userId } = body as { action?: "add" | "remove"; userId?: string };

    if (action !== "add" && action !== "remove") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const docRef = doc(db, "issues", id);
    const delta = action === "add" ? 1 : -1;

    const payload: Record<string, unknown> = {
      upvotes: increment(delta),
    };

    // Track which users have upvoted (userId is the auth uid or a stable anon id)
    if (userId) {
      payload.upvotedBy = action === "add" ? arrayUnion(userId) : arrayRemove(userId);
    }

    await updateDoc(docRef, payload);
    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error("[PATCH /api/issues/[id]/upvote]", error);
    return NextResponse.json({ error: "Failed to update upvote" }, { status: 500 });
  }
}
