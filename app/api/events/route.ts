import { NextRequest, NextResponse } from "next/server";
import {
  collection, getDocs, addDoc, query, orderBy, where, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET /api/events — fetch only approved events, sorted by date desc
export async function GET() {
  try {
    const q = query(
      collection(db, "events"),
      where("status", "==", "approved"),
      orderBy("date", "desc")
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
    console.error("[GET /api/events]", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// GET /api/events?pending=true — fetch pending events for admin
export async function OPTIONS() {
  return NextResponse.json({});
}

// POST /api/events — create a new event with status = pending
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title, description, location, date,
      imageUrl, coordinatorName, coordinatorPhone, coordinatorEmail, createdBy,
    } = body;

    if (!title || !location) {
      return NextResponse.json({ error: "title and location are required" }, { status: 400 });
    }

    const newEvent = {
      title,
      description: description || "",
      location,
      date: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(),
      imageUrl: imageUrl || "",
      coordinatorName: coordinatorName || "",
      coordinatorPhone: coordinatorPhone || "",
      coordinatorEmail: coordinatorEmail || "",
      status: "pending",
      createdBy: createdBy || "anonymous",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "events"), newEvent);
    return NextResponse.json({
      id: docRef.id,
      ...newEvent,
      date: new Date(date || Date.now()).toISOString(),
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/events]", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
