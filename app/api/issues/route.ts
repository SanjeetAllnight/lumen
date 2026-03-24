import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateSummary } from "@/lib/gemini";

// GET /api/issues — fetch all issues, sorted by upvotes desc
export async function GET() {
  try {
    const q = query(collection(db, "issues"), orderBy("upvotes", "desc"));
    const snapshot = await getDocs(q);

    const issues = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to ISO string for JSON serialization
      createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
    }));

    return NextResponse.json(issues);
  } catch (error) {
    console.error("[GET /api/issues]", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

// POST /api/issues — create new issue with Gemini AI summary
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, location, category } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "title and description are required" },
        { status: 400 }
      );
    }

    // Generate AI summary using Gemini
    const aiSummary = await generateSummary(description);

    const newIssue = {
      title,
      description,
      aiSummary,
      location: location || "Unknown",
      category: category || "General",
      upvotes: 0,
      affectedCount: 1,
      status: "reported",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "issues"), newIssue);

    return NextResponse.json({
      id: docRef.id,
      ...newIssue,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/issues]", error);
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}
