import { GoogleGenerativeAI } from "@google/generative-ai";

interface InputData {
  subject: string;
  topic: string;
  grade: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions: string;
  fileContent?: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  },
});

function buildPrompt(input: InputData): string {
  const questionTypeStr = input.questionTypes.join(", ");

  const prompt = `You are an expert educational assessment creator. Generate a structured question paper based on the following requirements:

Subject: ${input.subject}
Topic: ${input.topic}
Grade/Level: ${input.grade}
Question Types: ${questionTypeStr}
Number of Questions: ${input.numberOfQuestions}
Total Marks: ${input.totalMarks}
${input.additionalInstructions ? `Additional Instructions: ${input.additionalInstructions}` : ""}
${input.fileContent ? `\nReference Material:\n${input.fileContent.substring(0, 3000)}` : ""}

IMPORTANT RULES:
1. You MUST respond with ONLY valid JSON and nothing else - no markdown, no explanation, no code fences.
2. Distribute questions across sections logically based on question types.
3. Each question must have a difficulty level: "easy", "medium", or "hard".
4. Distribute marks so they total exactly ${input.totalMarks}.
5. For MCQ questions, include an "options" array with 4 options and an "answer" field.
6. Mix difficulty levels appropriately.
7. Generate exactly ${input.numberOfQuestions} questions total across all sections.

The JSON must follow this EXACT structure:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "question": "question text here",
          "difficulty": "easy",
          "marks": 2,
          "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
          "answer": "A) option1"
        }
      ]
    }
  ]
}

Generate the question paper now. Respond with ONLY the JSON object.`;

  return prompt;
}

export async function generateQuestionPaper(input: InputData): Promise<string> {
  const prompt = buildPrompt(input);

  try {
    const systemInstruction =
      "You are an expert educational assessment creator. You MUST respond with ONLY valid JSON. No markdown formatting, no code blocks, no explanations - just pure JSON.";

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
    });

    const response = result.response;
    const content = response.text();

    if (!content) {
      throw new Error("No content in Gemini response");
    }

    return content;
  } catch (error: any) {
    console.error("Gemini API error:", error.message);
    throw new Error(`AI generation failed: ${error.message}`);
  }
}
