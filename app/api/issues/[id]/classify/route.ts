import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { classifySeverity, classifyCategory, generateSummary } from "@/lib/classifier";

export const dynamic = "force-dynamic";

// POST /api/issues/[id]/classify — now uses rule-based classifier (no AI)
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

    const priority  = classifySeverity(title, description);
    const category  = classifyCategory(title, description);
    const aiSummary = generateSummary(title, description);

    console.log("[classify route] rule-based →", { id, priority, category });

    const patch = { priority, category, aiSummary };
    await updateDoc(doc(db, "issues", id), patch);

    return NextResponse.json({ id, ...patch });
  } catch (error) {
    console.error("[POST /api/issues/[id]/classify]", error);
    return NextResponse.json({ error: "Classification failed" }, { status: 500 });
  }
}
