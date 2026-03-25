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

export const dynamic = "force-dynamic";

// GET /api/issues — fetch all issues, sorted by upvotes desc
export async function GET() {
  try {
    const q = query(collection(db, "issues"), orderBy("upvotes", "desc"));
    const snapshot = await getDocs(q);

    const issues = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
    }));

    return NextResponse.json(issues);
  } catch (error) {
    console.error("[GET /api/issues]", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

// POST /api/issues — save complaint instantly with NO AI wait and NO image wait.
// AI classification and image upload both happen async on the client AFTER this returns.
export async function POST(req: NextRequest) {
  try {
    let title = "", description = "", location = "", category = "", authorName = "", imageUrl = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      title       = (form.get("title")       as string) || "";
      description = (form.get("description") as string) || "";
      location    = (form.get("location")    as string) || "";
      category    = (form.get("category")    as string) || "";
      authorName  = (form.get("authorName")  as string) || "";
      // Client may pass a pre-uploaded Firebase Storage URL
      imageUrl    = (form.get("imageUrl")    as string) || "";
    } else {
      const body  = await req.json();
      title       = body.title       || "";
      description = body.description || "";
      location    = body.location    || "";
      category    = body.category    || "";
      authorName  = body.authorName  || "";
      imageUrl    = body.imageUrl    || "";
    }

    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    }

    // Write to Firestore immediately — priority/aiSummary patched later by /classify
    const newIssue = {
      title,
      description,
      aiSummary:  "",
      location:   location   || "Unknown",
      category:   category   || "Facility",
      priority:   null,       // filled async by POST /api/issues/[id]/classify
      authorName: authorName || "Student Reporter",
      status:     "reported",
      upvotes:    0,
      imageUrl:   imageUrl   || "",
      createdAt:  Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "issues"), newIssue);

    return NextResponse.json({
      id: docRef.id,
      ...newIssue,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/issues]", error);
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}
