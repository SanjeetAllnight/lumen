import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET /api/comments?issueId=[id] — fetch comments for a specific issue
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const issueId = searchParams.get("issueId");

    if (!issueId) {
      return NextResponse.json(
        { error: "issueId query param is required" },
        { status: 400 }
      );
    }

    const q = query(
      collection(db, "comments"),
      where("issueId", "==", issueId),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
    }));

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[GET /api/comments]", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/comments — create a new comment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { issueId, content, author } = body;

    if (!issueId || !content) {
      return NextResponse.json(
        { error: "issueId and content are required" },
        { status: 400 }
      );
    }

    const newComment = {
      issueId,
      content,
      author: author || "Anonymous",
      avatar: "person",
      likes: 0,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "comments"), newComment);

    return NextResponse.json({
      id: docRef.id,
      ...newComment,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/comments]", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
