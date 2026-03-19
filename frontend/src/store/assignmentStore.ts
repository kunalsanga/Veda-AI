import { create } from "zustand";

export interface AssignmentFormData {
  subject: string;
  topic: string;
  grade: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  dueDate: string;
  additionalInstructions: string;
  file: File | null;
}

export interface Question {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  options?: string[];
  answer?: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface PaperResult {
  sections: Section[];
}

export interface Assignment {
  _id: string;
  inputData: AssignmentFormData;
  status: "pending" | "processing" | "completed" | "failed";
  result: PaperResult | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AssignmentStore {
  // Form state
  formData: AssignmentFormData;
  setFormData: (data: Partial<AssignmentFormData>) => void;
  resetFormData: () => void;

  // Current assignment
  currentAssignment: Assignment | null;
  setCurrentAssignment: (assignment: Assignment | null) => void;

  // Loading states
  isSubmitting: boolean;
  setIsSubmitting: (loading: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;

  // Progress
  progress: string;
  setProgress: (progress: string) => void;

  // Error
  error: string | null;
  setError: (error: string | null) => void;
}

const defaultFormData: AssignmentFormData = {
  subject: "",
  topic: "",
  grade: "",
  questionTypes: [],
  numberOfQuestions: 10,
  totalMarks: 50,
  dueDate: "",
  additionalInstructions: "",
  file: null,
};

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  formData: { ...defaultFormData },
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetFormData: () => set({ formData: { ...defaultFormData } }),

  currentAssignment: null,
  setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),

  isSubmitting: false,
  setIsSubmitting: (loading) => set({ isSubmitting: loading }),
  isGenerating: false,
  setIsGenerating: (generating) => set({ isGenerating: generating }),

  progress: "",
  setProgress: (progress) => set({ progress }),

  error: null,
  setError: (error) => set({ error }),
}));
