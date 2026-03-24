import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
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
