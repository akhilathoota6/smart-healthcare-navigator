import Hospital from "../models/Hospital.js";
import { predictSpecialty } from "../services/geminiService.js";

export const getHospitalRecommendations = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({
        message: "Symptoms are required"
      });
    }

    console.log("Symptoms received:", symptoms);

    let specialty;
    let hospital;

    // 🔹 Helper: extract keywords
    const extractKeywords = (text) => {
      return text
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3);
    };

    // 🔹 Helper: get BEST hospital using scoring
    const findBestHospital = async (keywords) => {
      const hospitals = await Hospital.find({
        $or: keywords.map(word => ({
          symptom_text: { $regex: word, $options: "i" }
        }))
      });

      if (!hospitals.length) return null;

      return hospitals
        .map(h => {
          const matchCount = keywords.filter(word =>
            h.symptom_text.toLowerCase().includes(word)
          ).length;

          return { ...h.toObject(), score: matchCount };
        })
        .sort((a, b) => b.score - a.score || b.rating - a.rating)[0];
    };

    // 🔹 STEP 1: Try Gemini
    try {
      specialty = await predictSpecialty(symptoms);
      specialty = specialty?.trim();

      console.log("✅ AI Specialty:", specialty);

      hospital = await Hospital.findOne({
        specialty: specialty
      }).sort({ rating: -1, wait_time_minutes: 1 });

    } catch (err) {
      console.log("❌ Gemini failed → using keyword fallback");

      const keywords = extractKeywords(symptoms);
      console.log("Keywords:", keywords);

      hospital = await findBestHospital(keywords);
      specialty = hospital?.specialty;
    }

    // 🔹 STEP 2: If AI worked but no hospital found
    if (!hospital) {
      console.log("⚠️ No hospital from AI → fallback to keywords");

      const keywords = extractKeywords(symptoms);

      hospital = await findBestHospital(keywords);
      specialty = hospital?.specialty;
    }

    // 🔹 STEP 3: FINAL fallback
    if (!hospital) {
      console.log("⚠️ No match at all → using best hospital");

      hospital = await Hospital.findOne({}).sort({ rating: -1 });
      specialty = hospital?.specialty || "General Medicine";
    }

    console.log("🎯 Final specialty:", specialty);

    // 🔹 RESPONSE
    res.json({
      predictedSpecialty: specialty,
      hospital: hospital || null
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};