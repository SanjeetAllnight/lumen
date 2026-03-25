import { NextResponse } from "next/server";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * DELETE /api/clear/issues
 * Wipes all documents from the "issues" collection.
 * FOR DEVELOPMENT USE ONLY — remove or secure before production.
 */
export async function DELETE() {
  try {
    const snap = await getDocs(collection(db, "issues"));
    const promises = snap.docs.map(d => deleteDoc(doc(db, "issues", d.id)));
    await Promise.all(promises);
    return NextResponse.json({ deleted: snap.size });
  } catch (err) {
    console.error("[DELETE /api/clear/issues]", err);
    return NextResponse.json({ error: "Failed to clear issues" }, { status: 500 });
  }
}
