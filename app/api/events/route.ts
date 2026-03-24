import { NextRequest, NextResponse } from "next/server";
import {
  collection, getDocs, addDoc, query, orderBy, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET /api/events — fetch all events sorted by date desc
export async function GET() {
  try {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.().toISOString?.() ?? null,
      createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
    }));
    return NextResponse.json(events);
  } catch (error) {
    console.error("[GET /api/events]", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/events — create a new event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, location, category, date } = body;

    if (!title || !location) {
      return NextResponse.json({ error: "title and location are required" }, { status: 400 });
    }

    const newEvent = {
      title,
      description: description || "",
      location: location,
      category: category || "General",
      date: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(),
      attendees: 0,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "events"), newEvent);
    return NextResponse.json({
      id: docRef.id,
      ...newEvent,
      date: new Date(date || Date.now()).toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/events]", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
