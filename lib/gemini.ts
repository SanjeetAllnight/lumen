import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateSummary(description: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) return description.substring(0, 120);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are a campus operations assistant. Summarize this student complaint in exactly one short, clear sentence (max 20 words).\n\nComplaint: ${description}`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/^["']|["']$/g, "").replace(/^(Summary:|AI Summary:)/i, "").trim();
  } catch (error) {
    console.error("[Gemini] Failed to generate summary:", error);
    return description.substring(0, 120);
  }
}

export async function analyzeImage(base64Image: string): Promise<{ title: string; description: string }> {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error("No API key");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const base64Data = base64Image.split(",")[1];
    const mimeType = base64Image.split(";")[0].split(":")[1];

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { text: "Analyze this image of a campus issue. Provide a short, professional title and a clear, detailed description of the problem shown. Return ONLY a JSON object in this exact format: {\"title\": \"...\", \"description\": \"...\"}" },
          { inlineData: { data: base64Data, mimeType } }
        ]
      }]
    });
    
    let text = result.response.text().trim();
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    }
    const parsed = JSON.parse(text);
    return { title: parsed.title, description: parsed.description };
  } catch (err) {
    console.error("[Gemini Image Analysis] Error:", err);
    throw err;
  }
}

export async function refineText(title: string, description: string): Promise<{ title: string; description: string }> {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error("No API key");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are a professional facility management assistant. A student reported a campus issue with the following title and description. Refine and improve the text to make it clearer, more professional, and actionable while preserving the original intent. Return ONLY a JSON object in this exact format: {\"title\": \"...\", \"description\": \"...\"}\n\nOriginal Title: ${title}\nOriginal Description: ${description}`;
    
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    }
    const parsed = JSON.parse(text);
    return { title: parsed.title, description: parsed.description };
  } catch (err) {
    console.error("[Gemini Text Refinement] Error:", err);
    throw err;
  }
}
