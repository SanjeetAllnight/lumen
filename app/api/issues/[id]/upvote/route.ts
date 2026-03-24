import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

// PATCH /api/issues/[id]/upvote — atomically increment upvotes
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = doc(db, "issues", id);

    await updateDoc(docRef, {
      upvotes: increment(1),
      affectedCount: increment(1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/issues/[id]/upvote]", error);
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
