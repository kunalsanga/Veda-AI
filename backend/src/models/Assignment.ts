import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  options?: string[];
  answer?: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IPaperResult {
  sections: ISection[];
}

export interface IInputData {
  subject: string;
  topic: string;
  grade: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  dueDate: string;
  additionalInstructions: string;
  fileContent?: string;
}

export interface IAssignment extends Document {
  inputData: IInputData;
  status: "pending" | "processing" | "completed" | "failed";
  result: IPaperResult | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  marks: { type: Number, required: true },
  options: [{ type: String }],
  answer: { type: String },
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const InputDataSchema = new Schema<IInputData>({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  grade: { type: String, required: true },
  questionTypes: [{ type: String, required: true }],
  numberOfQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  dueDate: { type: String, required: true },
  additionalInstructions: { type: String, default: "" },
  fileContent: { type: String },
});

const AssignmentSchema = new Schema<IAssignment>(
  {
    inputData: { type: InputDataSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    result: {
      sections: [SectionSchema],
    },
    error: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model<IAssignment>("Assignment", AssignmentSchema);
