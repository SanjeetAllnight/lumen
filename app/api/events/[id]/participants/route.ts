import { NextRequest, NextResponse } from "next/server";
import {
  collection, addDoc, getDocs, query, where, Timestamp, doc, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

// ─── GET /api/events/[id]/participants ─────────────────────────────────────────
// Returns all participants for an event (admin use) or checks if a specific
// user has already joined (query param: ?userId=xxx)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const col = collection(db, "events", id, "participants");

    // If userId provided, just check membership
    if (userId) {
      const q = query(col, where("userId", "==", userId));
      const snap = await getDocs(q);
      return NextResponse.json({ joined: !snap.empty });
    }

    // Otherwise return full list (admin)
    const snap = await getDocs(col);
    const participants = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json(participants);
  } catch (err) {
    console.error("[GET /api/events/[id]/participants]", err);
    return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 });
  }
}

// ─── POST /api/events/[id]/participants ────────────────────────────────────────
// Registers a user as interested in an event. Prevents duplicates.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { userId, name, email, department } = body;

    if (!userId || !name || !email || !department) {
      return NextResponse.json({ error: "userId, name, email, and department are required" }, { status: 400 });
    }

    // Verify event exists
    const eventDoc = await getDoc(doc(db, "events", id));
    if (!eventDoc.exists()) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const col = collection(db, "events", id, "participants");

    // Duplicate check
    const existing = query(col, where("userId", "==", userId));
    const existingSnap = await getDocs(existing);
    if (!existingSnap.empty) {
      return NextResponse.json({ error: "already_joined" }, { status: 409 });
    }

    const participant = {
      userId,
      name,
      email,
      department,
      joinedAt: Timestamp.now(),
    };

    const docRef = await addDoc(col, participant);
    console.log(`[POST /api/events/${id}/participants] Registered: ${email} (${department})`);

    return NextResponse.json({ id: docRef.id, ...participant, joinedAt: new Date().toISOString() }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/events/[id]/participants]", err);
    return NextResponse.json({ error: "Failed to register participant" }, { status: 500 });
  }
}
