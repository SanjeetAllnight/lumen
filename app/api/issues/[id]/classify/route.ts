import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateSummary, classifyIssue } from "@/lib/gemini";

export const dynamic = "force-dynamic";

// POST /api/issues/[id]/classify
// Called fire-and-forget from the client after the issue is created.
// Runs Gemini AI, then patches priority + aiSummary + category back into Firestore.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, description } = await req.json();

    if (!id || !title || !description) {
      return NextResponse.json({ error: "id, title and description required" }, { status: 400 });
    }

    const [aiSummary, classification] = await Promise.all([
      generateSummary(description),
      classifyIssue(title, description),
    ]);

    // Only write priority when AI returned a real value — never persist null
    // which would overwrite a valid pre-existing priority.
    const patch: Record<string, unknown> = {
      aiSummary,
      category: classification.category,
    };
    if (classification.priority !== null) {
      patch.priority = classification.priority;
    }

    console.log("[classify route] Patch for", id, "→", patch);

    await updateDoc(doc(db, "issues", id), patch);

    return NextResponse.json({ id, ...patch });
  } catch (error) {
    console.error("[POST /api/issues/[id]/classify]", error);
    return NextResponse.json({ error: "Classification failed" }, { status: 500 });
  }
}

