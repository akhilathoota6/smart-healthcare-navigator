import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function predictSpecialty(symptoms) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"   // ✅ correct model
    });

    const prompt = `
You are a medical triage assistant.

Based on the patient symptoms, choose the MOST appropriate medical specialty.

IMPORTANT:
- Return ONLY ONE specialty
- No explanation
- No extra text

Allowed specialties:
Cardiology, Dermatology, Neurology, Orthopedics, General Medicine, Pulmonology, Gastroenterology, Psychiatry

Symptoms: ${symptoms}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log("🔥 Gemini RAW output:", text);

    // Clean response (important)
    const cleaned = text
      .trim()
      .split("\n")[0]
      .replace(/[^a-zA-Z &]/g, "");

    console.log("✅ Cleaned specialty:", cleaned);

    return cleaned;

  } catch (error) {
    console.error("❌ Gemini API FULL ERROR:", error);

    // 🔥 IMPORTANT: DO NOT return General Medicine here
    throw error;
  }
}