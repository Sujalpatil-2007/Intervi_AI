const buildEvaluationPrompt = ({ interview, questions, answers }) => {
  const formattedQuestions = questions.map((question) => {
    const answer = answers.find(
      (item) => item.question.toString() === question._id.toString()
    );

    return {
      question: question.question,
      expectedAnswer: question.expectedAnswer,
      keywords: question.keywords,
      userAnswer: answer?.answer || "No answer provided",
    };
  });

  return `
You are a Senior Technical Interviewer.

Evaluate the candidate's interview professionally.

Score every answer out of 10.

Consider:

- Technical correctness
- Communication
- Completeness
- Practical knowledge
- Use of correct terminology

Return ONLY valid JSON.

Format:

{
  "overallScore": 0,
  "overallFeedback": "",
  "strengths": [],
  "weaknesses": [],
  "questionEvaluations": [
    {
      "question": "",
      "score": 0,
      "feedback": "",
      "improvement": ""
    }
  ]
}

Interview Role:
${interview.targetRole}

Difficulty:
${interview.difficulty}

Questions & Answers:

${JSON.stringify(formattedQuestions, null, 2)}
`;
};

module.exports = {
  buildEvaluationPrompt,
};