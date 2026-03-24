import { NextResponse } from "next/server";
import { collection, getDocs, setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SEED_ISSUES = [
  { id: "north-lib",       title: "North Library Air Conditioning Outage",    description: "Levels 3, 4, and 5 are currently uninhabitable. Student medical reports increasing. Infrastructure team arrival estimated in 45 minutes.", aiSummary: "AC failure on 3 floors of the North Library is causing heat-related distress for hundreds of students.", location: "Library",        category: "Facility",  upvotes: 2419, affectedCount: 842, status: "reported" },
  { id: "maker-space",     title: "Petition for 24/7 Access to the Maker Space", description: "Engineering students are requesting extended hours for thesis projects. Current 9 PM closure is hindering production cycles.", aiSummary: "Students demand round-the-clock Maker Space access to meet project deadlines beyond current 9 PM closing time.", location: "Computer Dept",  category: "Facility",  upvotes: 1200, affectedCount: 320, status: "in_progress" },
  { id: "main-gate",       title: "Main Gate WiFi Node Connectivity",          description: "WiFi drops intermittently at the main gate area, affecting students waiting for rides and attending outdoor lectures.",         aiSummary: "Intermittent WiFi failure at the main gate disrupts students during outdoor sessions.",                        location: "Main Gate",      category: "IT",        upvotes: 410,  affectedCount: 150, status: "resolved" },
  { id: "network-sector-4",title: "Total Network Outage: Sector 4",            description: "Multiple students indicate a physical line break near the main router hub. This is currently affecting 450 residents since 02:00 AM.", aiSummary: "A physical line break has knocked out all network access for 450 students in Dormitory A since 2 AM.",        location: "Hostel",         category: "IT",        upvotes: 342,  affectedCount: 450, status: "reported" },
  { id: "library-hvac",    title: "Library HVAC Malfunction",                  description: "The 3rd floor reading room temperature has reached 28°C. Reports indicate a potential compressor failure.",                         aiSummary: "A broken HVAC compressor has made the 3rd floor reading room unbearably hot at 28°C.",                         location: "Library",        category: "Facility",  upvotes: 88,   affectedCount: 88,  status: "in_progress" },
  { id: "water-cooler",    title: "Cafeteria Water Cooler Filter",              description: "Maintenance scheduled for tomorrow at 10:00 AM. Routine replacement cycle exceeded.",                                               aiSummary: "Overdue water cooler filter replacement is scheduled for tomorrow morning at the cafeteria.",                   location: "Canteen",        category: "Facility",  upvotes: 12,   affectedCount: 12,  status: "reported" },
  { id: "gym-glass",       title: "Shattered Glass - Gym Entry",               description: "Safety hazard identified at Main Gym Entrance. Reported by 5 students in the last 10 minutes.",                                    aiSummary: "Shattered glass at the gym entrance poses an immediate safety hazard for all students entering.",               location: "Ground",         category: "Security",  upvotes: 45,   affectedCount: 45,  status: "reported" },
];

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

    // Seed issues (skip if already exist)
    const issueSnap = await getDocs(collection(db, "issues"));
    if (issueSnap.size === 0) {
      for (const issue of SEED_ISSUES) {
        const { id, ...data } = issue;
        await setDoc(doc(db, "issues", id), { ...data, createdAt: now });
      }
    }

    // Seed events (skip if already exist)
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
      issues: issueSnap.size === 0 ? SEED_ISSUES.length : "already seeded",
      events: eventSnap.size === 0 ? SEED_EVENTS.length : "already seeded",
    });
  } catch (error) {
    console.error("[POST /api/seed]", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
