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
