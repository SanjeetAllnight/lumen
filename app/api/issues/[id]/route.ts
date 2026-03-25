import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

// GET /api/issues/[id] — fetch a single issue by Firestore document ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = doc(db, "issues", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const data = snapshot.data();
    return NextResponse.json({
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
    });
  } catch (error) {
    console.error("[GET /api/issues/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch issue" }, { status: 500 });
  }
}

// PATCH /api/issues/[id] — update issue status and timeline (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, technician, note } = await req.json();

    const validStatuses = ["reported", "assigned", "in_progress", "resolved", "dismissed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const payload: any = { status };
    if (technician) {
      payload.technician = technician;
    }

    if (note) {
      payload.updates = arrayUnion({
        status,
        note,
        timestamp: new Date().toISOString()
      });
    }

    await updateDoc(doc(db, "issues", id), payload);
    return NextResponse.json({ id, ...payload });
  } catch (error) {
    console.error("[PATCH /api/issues/[id]]", error);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}
