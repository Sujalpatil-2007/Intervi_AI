const buildInterviewPrompt = ({
  resume,
  targetRole,
  difficulty,
  questionCount,
}) => {
  return `
You are an expert technical interviewer.

Generate exactly ${questionCount} interview questions.

Target Role:
${targetRole}

Difficulty:
${difficulty}

Skills:
${resume.parsedSkills?.join(", ") || ""}

Projects:
${JSON.stringify(resume.parsedProjects)}

Experience:
${JSON.stringify(resume.parsedExperience)}

Education:
${JSON.stringify(resume.parsedEducation)}

Return ONLY valid JSON.

{
  "questions":[
    {
      "question":"",
      "type":"Technical",
      "difficulty":"${difficulty}",
      "expectedAnswer":"",
      "keywords":[]
    }
  ]
}
`;
};

module.exports = {
  buildInterviewPrompt,
};