import { NextResponse } from "next/server";
import { collection, getDocs, setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Issues seed is intentionally removed — all issues must be submitted by real students.

const SEED_EVENTS = [
  { id: "ev-techfest",   title: "TechFest 2025",               description: "Annual inter-college technology festival with competitions, workshops, and guest lectures from industry leaders.", location: "Academic Block",  category: "Academic",  attendees: 850,  date: new Date("2025-04-10T10:00:00") },
  { id: "ev-hackathon",  title: "24-Hour Hackathon",            description: "Build innovative solutions to real campus problems. Prizes worth ₹50,000. Open to all departments.",           location: "Computer Dept",   category: "Academic",  attendees: 240,  date: new Date("2025-04-15T09:00:00") },
  { id: "ev-sports",     title: "Inter-Dept Sports Meet",       description: "Annual sports tournament covering cricket, football, volleyball, and athletics. All departments compete.",        location: "Ground",          category: "Sports",    attendees: 600,  date: new Date("2025-04-20T08:00:00") },
  { id: "ev-culturals",  title: "Cultural Night",               description: "A vibrant evening of music, dance, drama, and art showcasing campus talent. Open mic included.",                 location: "Academic Block",  category: "Cultural",  attendees: 1200, date: new Date("2025-04-25T18:00:00") },
  { id: "ev-workshop",   title: "AI/ML Workshop",               description: "Hands-on workshop covering machine learning fundamentals and practical demos with real datasets.",               location: "IT Dept",         category: "Academic",  attendees: 120,  date: new Date("2025-04-12T14:00:00") },
  { id: "ev-seminar",    title: "Industry Connect Seminar",     description: "Top recruiters from leading tech companies interact with final year students. Resume critique session included.", location: "Admin Block",     category: "Career",    attendees: 300,  date: new Date("2025-04-18T11:00:00") },
  { id: "ev-library",    title: "Book Fair & Reading Week",     description: "Browse 5000+ titles, exchange books, and participate in the reading challenge. Free entry.",                     location: "Library",         category: "Academic",  attendees: 450,  date: new Date("2025-04-08T10:00:00") },
  { id: "ev-canteen",    title: "Food Festival",                description: "Taste dishes from across India, prepared by student volunteers. All proceeds go to campus welfare fund.",        location: "Canteen",         category: "Cultural",  attendees: 900,  date: new Date("2025-04-22T12:00:00") },
];

export async function POST() {
  try {
    const now = Timestamp.now();

    // Seed events only (skip if already exist)
    const eventSnap = await getDocs(collection(db, "events"));
    if (eventSnap.size === 0) {
      for (const event of SEED_EVENTS) {
        const { id, ...data } = event;
        await setDoc(doc(db, "events", id), {
          ...data,
          date: Timestamp.fromDate(data.date),
          createdAt: now,
        });
      }
    }

    return NextResponse.json({
      message: "Seeded successfully",
      events: eventSnap.size === 0 ? SEED_EVENTS.length : "already seeded",
    });
  } catch (error) {
    console.error("[POST /api/seed]", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
