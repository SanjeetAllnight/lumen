/**
 * lib/gemini.ts  — AI REMOVED
 * ─────────────────────────────────────────────────────────────────────────────
 * Gemini AI calls have been removed. All functions now delegate to the local
 * rule-based classifier in lib/classifier.ts.
 *
 * This file is kept so existing imports do not break. The GEMINI_API_KEY
 * environment variable is no longer used.
 */

import {
  classifySeverity,
  classifyCategory,
  generateSummary as _generateSummary,
  type Severity,
} from "@/lib/classifier";

/**
 * Returns a short summary of the complaint description (rule-based, no AI).
 */
export async function generateSummary(description: string): Promise<string> {
  return _generateSummary("", description);
}

/**
 * Stub retained for backward-compat. Not called — analyze-image route returns
 * an error-free stub response. No Gemini call is made.
 */
export async function analyzeImage(
  _base64Image: string
): Promise<{ title: string; description: string }> {
  return { title: "", description: "" };
}

/**
 * Stub retained for backward-compat. refine-text route now echoes input.
 */
export async function refineText(
  title: string,
  description: string
): Promise<{ title: string; description: string }> {
  return { title, description };
}

/**
 * Classifies severity and category using the keyword-based classifier.
 * Signature kept identical to the old Gemini version.
 */
export async function classifyIssue(
  title: string,
  description: string
): Promise<{ category: string; priority: Severity | null }> {
  const priority = classifySeverity(title, description);
  const category = classifyCategory(title, description);
  console.log("[classifier] classifyIssue →", { title, priority, category });
  return { priority, category };
}
