const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeResume(resumeText) {
  const prompt = `
You are an expert technical recruiter.

Analyze the following resume.

Return ONLY valid JSON.

{
  "skills": [],
  "projects": [],
  "experience": [],
  "education": [],
  "targetRoles": []
}

Resume:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
}

module.exports = {
  analyzeResume,
};
