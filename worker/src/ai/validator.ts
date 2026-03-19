import { z } from "zod";

// Zod schema for validation
const QuestionSchema = z.object({
  question: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]).transform((val) => {
    // Normalize difficulty values
    const normalized = val.toLowerCase().trim();
    if (["easy", "simple", "basic"].includes(normalized)) return "easy" as const;
    if (["medium", "moderate", "intermediate"].includes(normalized))
      return "medium" as const;
    if (["hard", "difficult", "advanced"].includes(normalized)) return "hard" as const;
    return "medium" as const;
  }),
  marks: z.number().positive(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});

const SectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().min(1),
  questions: z.array(QuestionSchema).min(1),
});

const PaperResultSchema = z.object({
  sections: z.array(SectionSchema).min(1),
});

export type PaperResult = z.infer<typeof PaperResultSchema>;

interface ValidationResult {
  success: boolean;
  data?: PaperResult;
  error?: string;
}

export function validatePaperResult(rawJson: string): ValidationResult {
  try {
    // Try to parse as JSON
    let parsed: any;
    try {
      // Clean up potential markdown code fences
      let cleaned = rawJson.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
      }
      cleaned = cleaned.trim();

      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      return {
        success: false,
        error: `Invalid JSON: ${(parseError as Error).message}`,
      };
    }

    // Validate against schema
    const result = PaperResultSchema.safeParse(parsed);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      const errors = result.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        success: false,
        error: `Schema validation failed: ${errors}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Validation error: ${error.message}`,
    };
  }
}
