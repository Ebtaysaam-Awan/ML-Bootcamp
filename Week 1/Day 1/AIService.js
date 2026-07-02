require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

/**
 * Small helper: sends a prompt to Gemini and returns the raw text.
 */
async function callGemini(prompt) {
  const result = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return result.text;
}

/**
 * Helper: some models wrap JSON in ```json ... ``` code fences — strip that
 * before parsing so JSON.parse doesn't fail on clean valid JSON.
 */
function safeParseJSON(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    return { error: "Failed to parse JSON", rawResponse: raw };
  }
}

/* ------------------------------------------------------------------ */
/* 1. LEAD QUALIFICATION                                              */
/* ------------------------------------------------------------------ */
async function qualifyLead(leadInfo) {
  const prompt = `You are a sales assistant. Based on this lead info, classify them and respond ONLY with valid JSON, no extra text, in this exact shape:
{
  "score": "Hot" | "Warm" | "Cold",
  "reason": "one sentence explanation"
}

Lead info: ${leadInfo}`;

  try {
    const raw = await callGemini(prompt);
    return safeParseJSON(raw);
  } catch (err) {
    return { error: "API call failed", details: err.message };
  }
}

/* ------------------------------------------------------------------ */
/* 2. SUPPORT TICKET CLASSIFIER                                       */
/* ------------------------------------------------------------------ */
async function classifyTicket(ticketText) {
  const prompt = `Classify this support ticket and respond ONLY with valid JSON, no extra text, in this exact shape:
{
  "category": "Billing" | "Technical" | "General",
  "urgency": "Low" | "Medium" | "High"
}

Ticket: ${ticketText}`;

  try {
    const raw = await callGemini(prompt);
    return safeParseJSON(raw);
  } catch (err) {
    return { error: "API call failed", details: err.message };
  }
}

/* ------------------------------------------------------------------ */
/* 3. EMAIL DRAFTER                                                   */
/* ------------------------------------------------------------------ */
async function draftEmail(context) {
  const prompt = `Write a short, professional email based on this context. Include a subject line. Output only the email, formatted as:

Subject: ...

Body...

Context: ${context}`;

  try {
    return await callGemini(prompt);
  } catch (err) {
    return `Error: could not generate email (${err.message})`;
  }
}

/* ------------------------------------------------------------------ */
/* 4. DATA EXTRACTOR FROM RAW TEXT                                    */
/* ------------------------------------------------------------------ */
async function extractData(rawText) {
  const prompt = `Extract structured data from this text and respond ONLY with valid JSON, no extra text, in this exact shape (use null for missing fields):
{
  "name": string | null,
  "email": string | null,
  "phone": string | null
}

Text: ${rawText}`;

  try {
    const raw = await callGemini(prompt);
    return safeParseJSON(raw);
  } catch (err) {
    return { error: "API call failed", details: err.message };
  }
}

/* ------------------------------------------------------------------ */
/* DEMO RUN                                                            */
/* ------------------------------------------------------------------ */
async function main() {
  console.log("--- Lead Qualification ---");
  console.log(
    await qualifyLead(
      "Company: TechCorp. 500 employees. Asking about enterprise pricing, wants a demo next week, budget confirmed at $50k/year."
    )
  );

  console.log("\n--- Support Ticket Classification ---");
  console.log(
    await classifyTicket(
      "I've been charged twice for my subscription this month and I need this fixed ASAP, it's affecting my business."
    )
  );

  console.log("\n--- Email Draft ---");
  console.log(
    await draftEmail(
      "To: client John. Purpose: follow up after demo call, ask if they have questions, offer a 15 min call this week."
    )
  );

  console.log("\n--- Data Extraction ---");
  console.log(
    await extractData(
      "Hey it's Sarah from BuildRight Construction, sarah.b@buildright.com, call me at 555-0192."
    )
  );
}

if (require.main === module) {
  main().catch((err) => console.error("Error:", err));
}

module.exports = { qualifyLead, classifyTicket, draftEmail, extractData };
