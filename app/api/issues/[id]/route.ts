import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

// GET /api/issues/[id] — fetch a single issue by Firestore document ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = doc(db, "issues", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const data = snapshot.data();
    return NextResponse.json({
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
    });
  } catch (error) {
    console.error("[GET /api/issues/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch issue" }, { status: 500 });
  }
}

// PATCH /api/issues/[id] — update status (admin), OR patch background fields (imageUrl, priority, aiSummary)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, technician, note, imageUrl, priority, aiSummary, category, addSubscriber, removeSubscriber } = body;

    const payload: Record<string, unknown> = {};

    // ─── Status update (admin flow) ────────────────────────────────────────────
    if (status !== undefined) {
      const validStatuses = ["reported", "assigned", "in_progress", "resolved", "dismissed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      payload.status = status;
      if (technician) payload.technician = technician;
      if (note) {
        payload.updates = arrayUnion({
          status,
          note,
          timestamp: new Date().toISOString(),
        });
      }

      // ─── Notification Fan-out ────────────────────────────────────────────────
      try {
        const issueRef = doc(db, "issues", id);
        const issueSnap = await getDoc(issueRef);
        if (issueSnap.exists()) {
          const issueData = issueSnap.data();
          const subscribers = issueData.subscribers || [];
          if (subscribers.length > 0) {
            const notifCol = collection(db, "notifications");
            const now = new Date().toISOString();
            const title = issueData.title || "an issue";
            const readableStatus = status.replace("_", " ").toUpperCase();
            
            await Promise.all(
              subscribers.map((userId: string) =>
                addDoc(notifCol, {
                  userId,
                  issueId: id,
                  message: `Status updated to ${readableStatus} for: ${title}`,
                  read: false,
                  createdAt: now,
                })
              )
            );
          }
        }
      } catch (err) {
        console.error("[PATCH /api/issues/[id]] Failed to fan-out notifications", err);
      }
    }

    // ─── Background async patches (image upload, AI classify) ──────────────────────────────
    if (imageUrl        !== undefined) payload.imageUrl  = imageUrl;
    if (priority        !== undefined) payload.priority  = priority;
    if (aiSummary       !== undefined) payload.aiSummary = aiSummary;
    if (category        !== undefined) payload.category  = category;
    // ─── Subscription (Notify Me) ───────────────────────────────────────────────────────
    // arrayUnion de-dupes: adding existing userId is a no-op in Firestore
    if (addSubscriber    !== undefined) payload.subscribers = arrayUnion(addSubscriber);
    if (removeSubscriber !== undefined) payload.subscribers = arrayRemove(removeSubscriber);

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await updateDoc(doc(db, "issues", id), payload);
    return NextResponse.json({ id, ...payload });
  } catch (error) {
    console.error("[PATCH /api/issues/[id]]", error);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}

