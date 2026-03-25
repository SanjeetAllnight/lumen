import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { generateSummary, classifyIssue } from "@/lib/gemini";

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

// POST /api/issues — create issue, run AI classification, upload image
// Accepts multipart/form-data OR application/json
export async function POST(req: NextRequest) {
  try {
    let title = "", description = "", location = "", category = "", authorName = "";
    let imageFile: Blob | null = null;
    let imageFileName = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      title = (form.get("title") as string) || "";
      description = (form.get("description") as string) || "";
      location = (form.get("location") as string) || "";
      category = (form.get("category") as string) || "";
      authorName = (form.get("authorName") as string) || "";
      const file = form.get("image") as File | null;
      if (file && file.size > 0) {
        imageFile = file;
        imageFileName = file.name;
      }
    } else {
      const body = await req.json();
      title = body.title || "";
      description = body.description || "";
      location = body.location || "";
      category = body.category || "";
      authorName = body.authorName || "";
    }

    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    }

    // Run AI classification + summary in parallel
    const [aiSummary, classification] = await Promise.all([
      generateSummary(description),
      classifyIssue(title, description),
    ]);

    // Upload image to Firebase Storage if provided
    let imageUrl = "";
    if (imageFile) {
      try {
        const ext = imageFileName.split(".").pop() || "jpg";
        const storageRef = ref(storage, `issues/${Date.now()}.${ext}`);
        const buffer = await imageFile.arrayBuffer();
        await uploadBytes(storageRef, new Uint8Array(buffer), {
          contentType: imageFile.type || "image/jpeg",
        });
        imageUrl = await getDownloadURL(storageRef);
      } catch (imgErr) {
        console.error("[POST /api/issues] Image upload failed:", imgErr);
        // Non-fatal — continue without image
      }
    }

    const newIssue = {
      title,
      description,
      aiSummary,
      location: location || "Unknown",
      // AI-determined fields (override user-provided category with AI's)
      category: classification.category || category || "Facility",
      priority: classification.priority,
      authorName: authorName || "Student Reporter",
      status: "reported",
      upvotes: 0,
      imageUrl,
      createdAt: Timestamp.now(),
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
