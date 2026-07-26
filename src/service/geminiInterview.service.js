const {GoogleGenAI} = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateInterviewQuestions(prompt) {
  try {
    const response = await ai.models.generateContent({
    model: "gemini-3.6-flash", // or your preferred model
    contents: prompt,
  });

  let text = response.text;

  // Remove markdown if Gemini returns it
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(text);

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Invalid AI response.");
  }

  return parsed.questions;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  generateInterviewQuestions,
}