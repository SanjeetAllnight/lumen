import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates a one-sentence AI summary of a campus issue description.
 * Falls back gracefully if the API key is missing or the call fails.
 */
export async function generateSummary(description: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return description.substring(0, 120);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a campus operations assistant. Summarize this student complaint in exactly one short, clear sentence (max 20 words). Do not include any prefix like "Summary:" - just the sentence itself.\n\nComplaint: ${description}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Strip any accidental markdown or quotes
    return text.replace(/^["']|["']$/g, "").replace(/^(Summary:|AI Summary:)/i, "").trim();
  } catch (error) {
    console.error("[Gemini] Failed to generate summary:", error);
    // Fallback to truncated description
    return description.substring(0, 120);
  }
}
