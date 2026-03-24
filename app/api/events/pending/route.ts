import { NextResponse } from "next/server";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET /api/events/pending — fetch all pending events for admin review
export async function GET() {
  try {
    const q = query(
      collection(db, "events"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.().toISOString?.() ?? null,
      createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
    }));
    return NextResponse.json(events);
  } catch (error) {
    console.error("[GET /api/events/pending]", error);
    return NextResponse.json({ error: "Failed to fetch pending events" }, { status: 500 });
  }
}
