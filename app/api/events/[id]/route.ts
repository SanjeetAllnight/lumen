import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET /api/events/[id] — fetch single event
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const snapshot = await getDoc(doc(db, "events", id));
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const data = snapshot.data();
    return NextResponse.json({
      id: snapshot.id,
      ...data,
      date: data.date?.toDate?.().toISOString?.() ?? null,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
    });
  } catch (error) {
    console.error("[GET /api/events/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// PATCH /api/events/[id] — approve or reject an event (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "status must be 'approved' or 'rejected'" }, { status: 400 });
    }

    await updateDoc(doc(db, "events", id), { status });
    return NextResponse.json({ id, status });
  } catch (error) {
    console.error("[PATCH /api/events/[id]]", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
