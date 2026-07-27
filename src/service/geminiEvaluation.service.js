const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const evaluateInterview = async (prompt) => {
  try {
    console.log("Prompt received:", prompt);
    console.log("Type:", typeof prompt);

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Evaluation prompt is invalid.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    throw error;
  }
};

module.exports = {
  evaluateInterview,
};