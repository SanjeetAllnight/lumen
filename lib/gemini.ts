import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL = "gemini-2.0-flash";

function stripJsonFences(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

/**
 * Generates a one-sentence AI summary of a campus issue description.
 */
export async function generateSummary(description: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) return description.substring(0, 120);
    const model = genAI.getGenerativeModel({ model: MODEL });
    const prompt = `You are a campus operations assistant. Summarize this student complaint in exactly one short, clear sentence (max 20 words). Do not include any prefix like "Summary:" - just the sentence itself.\n\nComplaint: ${description}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text.replace(/^["']|["']$/g, "").replace(/^(Summary:|AI Summary:)/i, "").trim();
  } catch (error) {
    console.error("[Gemini] Failed to generate summary:", error);
    return description.substring(0, 120);
  }
}

/**
 * Analyzes a base64 image of a campus issue and returns a title + description.
 */
export async function analyzeImage(base64Image: string): Promise<{ title: string; description: string }> {
  if (!process.env.GEMINI_API_KEY) throw new Error("No GEMINI_API_KEY configured");

  const model = genAI.getGenerativeModel({ model: MODEL });
  const base64Data = base64Image.split(",")[1];
  const mimeType = (base64Image.split(";")[0].split(":")[1] || "image/jpeg") as "image/jpeg" | "image/png" | "image/webp";

  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: [
        {
          text: `Analyze this image of a campus issue. Provide a short professional title and a clear detailed description of the visible problem. 
Return ONLY valid JSON — no markdown, no explanation — in exactly this format:
{"title": "...", "description": "..."}`
        },
        { inlineData: { data: base64Data, mimeType } }
      ]
    }]
  });

  const raw = stripJsonFences(result.response.text());
  const parsed = JSON.parse(raw);
  return { title: parsed.title, description: parsed.description };
}

/**
 * Refines a student-submitted title and description using AI.
 */
export async function refineText(title: string, description: string): Promise<{ title: string; description: string }> {
  if (!process.env.GEMINI_API_KEY) throw new Error("No GEMINI_API_KEY configured");

  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `You are a professional facility management assistant. A student reported a campus issue. Refine and improve the text to be clearer, more professional, and actionable while preserving the original intent.
Return ONLY valid JSON — no markdown, no explanation — in exactly this format:
{"title": "...", "description": "..."}

Original Title: ${title}
Original Description: ${description}`;

  const result = await model.generateContent(prompt);
  const raw = stripJsonFences(result.response.text());
  const parsed = JSON.parse(raw);
  return { title: parsed.title, description: parsed.description };
}

/**
 * Classifies a campus issue by category and priority using Gemini AI.
 * Called server-side from POST /api/issues/[id]/classify.
 *
 * Returns null priority if classification fails — callers should NOT persist
 * a wrong default; the issue will simply show "Processing…" in the UI.
 */
export async function classifyIssue(
  title: string,
  description: string
): Promise<{ category: string; priority: "low" | "medium" | "high" | "critical" | null }> {
  const fallback = { category: "Facility", priority: null as null };
  if (!process.env.GEMINI_API_KEY) return fallback;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `You are an AI assistant for a college campus facility management system.
Your job is to classify the SEVERITY and CATEGORY of a student-reported issue.

━━━ SEVERITY RULES ━━━

CRITICAL — Immediate danger or total failure. Must be fixed within hours.
Examples:
  • Exposed or broken electric wire
  • Flooded area, major water leakage
  • Lift/elevator not working in an emergency
  • Fire, smoke, or chemical hazard
  • Structural damage to building
  • Student health emergency in campus

HIGH — Major disruption affecting many students. Needs same-day attention.
Examples:
  • No electricity in a classroom/lab for an entire day
  • No drinking water available in a department
  • Garbage not collected for multiple days causing hygiene issues
  • WiFi/internet down in the whole department
  • Projector/smartboard broken in a classroom used by many
  • Excessive student stress or mental health concerns at scale

MEDIUM — Noticeable issue affecting a group, not immediately dangerous.
Examples:
  • Broken chair or desk in classroom
  • Slow or intermittent internet
  • Washroom needs deep cleaning
  • Fan or light not working in one room
  • Canteen serving poor quality food
  • Single printer/scanner out of order

LOW — Minor cosmetic or individual inconvenience.
Examples:
  • Plastic bottles or litter lying around
  • Paint chipping off wall
  • Notice board looks untidy
  • Single bin missing from a room
  • Suggestion about campus aesthetics

━━━ INPUT ━━━
Title: ${title}
Description: ${description}

━━━ OUTPUT ━━━
Return ONLY valid JSON — no markdown, no explanation:
{
  "priority": "<one of: critical, high, medium, low>",
  "category": "<one of: Facility, Electrical, Network, Safety, Sanitary, Academic, Security, Other>"
}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // ── Pass 1: try clean JSON parse ──────────────────────────────────────────
    let priority: string | null = null;
    let category: string | null = null;
    try {
      const parsed = JSON.parse(stripJsonFences(rawText));
      priority = parsed.priority ?? null;
      category = parsed.category ?? null;
    } catch {
      // ── Pass 2: regex fallback — scan raw text for severity word ─────────────
      // Handles cases where Gemini wraps the JSON in explanation text
      const severityMatch = rawText.match(/\b(critical|high|medium|low)\b/i);
      const categoryMatch = rawText.match(/\b(Facility|Electrical|Network|Safety|Sanitary|Academic|Security|Other)\b/i);
      priority = severityMatch?.[1]?.toLowerCase() ?? null;
      category = categoryMatch?.[1] ?? null;
    }

    const validPriorities = ["low", "medium", "high", "critical"] as const;
    const validCategories = ["Facility", "Electrical", "Network", "Safety", "Sanitary", "Academic", "Security", "Other"];

    const cleanPriority = priority && validPriorities.includes(priority as typeof validPriorities[number])
      ? (priority as typeof validPriorities[number])
      : null;

    const cleanCategory = category && validCategories.includes(category)
      ? category
      : "Facility";

    console.log("[Gemini] classifyIssue →", { title, cleanPriority, cleanCategory });

    return { priority: cleanPriority, category: cleanCategory };
  } catch (err) {
    console.error("[Gemini] classifyIssue failed:", err);
    // Return null priority — do NOT default to "low"
    return fallback;
  }
}
