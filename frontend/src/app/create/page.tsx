"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sparkles,
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  Hash,
  Award,
  BookOpen,
  PenTool,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAssignmentStore } from "@/store/assignmentStore";
import { createAssignment } from "@/lib/api";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  grade: z.string().min(1, "Grade/Level is required"),
  questionTypes: z
    .array(z.string())
    .min(1, "Select at least one question type"),
  numberOfQuestions: z
    .number()
    .min(1, "Minimum 1 question")
    .max(100, "Maximum 100 questions"),
  totalMarks: z
    .number()
    .min(1, "Minimum 1 mark")
    .max(500, "Maximum 500 marks"),
  dueDate: z.string().min(1, "Due date is required"),
  additionalInstructions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const QUESTION_TYPES = [
  { id: "mcq", label: "Multiple Choice (MCQ)", icon: "🔘" },
  { id: "short-answer", label: "Short Answer", icon: "✏️" },
  { id: "long-answer", label: "Long Answer / Essay", icon: "📝" },
  { id: "true-false", label: "True / False", icon: "✅" },
  { id: "fill-blanks", label: "Fill in the Blanks", icon: "📋" },
  { id: "match", label: "Match the Following", icon: "🔗" },
];

const GRADES = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Undergraduate",
  "Postgraduate",
];

export default function CreatePage() {
  const router = useRouter();
  const { setFormData, setIsSubmitting, isSubmitting, setError } =
    useAssignmentStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      topic: "",
      grade: "",
      questionTypes: [],
      numberOfQuestions: 10,
      totalMarks: 50,
      dueDate: "",
      additionalInstructions: "",
    },
  });

  const toggleQuestionType = (typeId: string) => {
    const updated = selectedTypes.includes(typeId)
      ? selectedTypes.filter((t) => t !== typeId)
      : [...selectedTypes, typeId];
    setSelectedTypes(updated);
    setValue("questionTypes", updated, { shouldValidate: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      setFormData({ ...data, file: selectedFile });

      const response = await createAssignment({
        ...data,
        additionalInstructions: data.additionalInstructions || "",
        file: selectedFile || undefined,
      });

      if (response.success) {
        router.push(`/assignment/${response.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Veda</span>{" "}
              <span className="text-foreground/80">AI</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
              <PenTool className="w-4 h-4" />
              Create Assessment
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Design Your <span className="gradient-text">Question Paper</span>
            </h1>
            <p className="text-muted-foreground">
              Fill in the details below and let AI craft the perfect assessment
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Subject & Topic */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-600" />
                Subject Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics"
                    {...register("subject")}
                    className={errors.subject ? "border-red-300" : ""}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Quadratic Equations"
                    {...register("topic")}
                    className={errors.topic ? "border-red-300" : ""}
                  />
                  {errors.topic && (
                    <p className="text-xs text-red-500">
                      {errors.topic.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Grade Selection */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-600" />
                Grade / Level
              </h3>
              <div className="space-y-2">
                <Label htmlFor="grade">Select Grade *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("grade", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    id="grade"
                    className={errors.grade ? "border-red-300" : ""}
                  >
                    <SelectValue placeholder="Choose grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.grade && (
                  <p className="text-xs text-red-500">{errors.grade.message}</p>
                )}
              </div>
            </div>

            {/* Question Types */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-violet-600" />
                Question Types *
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {QUESTION_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleQuestionType(type.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedTypes.includes(type.id)
                        ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                        : "border-gray-100 hover:border-violet-200 hover:bg-violet-50/50"
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.questionTypes && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.questionTypes.message}
                </p>
              )}
            </div>

            {/* Questions & Marks */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-600" />
                Paper Configuration
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfQuestions">Number of Questions *</Label>
                  <Input
                    id="numberOfQuestions"
                    type="number"
                    min={1}
                    max={100}
                    {...register("numberOfQuestions", { valueAsNumber: true })}
                    className={errors.numberOfQuestions ? "border-red-300" : ""}
                  />
                  {errors.numberOfQuestions && (
                    <p className="text-xs text-red-500">
                      {errors.numberOfQuestions.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalMarks">Total Marks *</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    min={1}
                    max={500}
                    {...register("totalMarks", { valueAsNumber: true })}
                    className={errors.totalMarks ? "border-red-300" : ""}
                  />
                  {errors.totalMarks && (
                    <p className="text-xs text-red-500">
                      {errors.totalMarks.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...register("dueDate")}
                    className={errors.dueDate ? "border-red-300" : ""}
                  />
                  {errors.dueDate && (
                    <p className="text-xs text-red-500">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-violet-600" />
                Reference Material (Optional)
              </h3>
              {!selectedFile ? (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-200"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Click to upload PDF or text file
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Max 10MB
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl border border-violet-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 hover:bg-violet-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-violet-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Additional Instructions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-violet-600" />
                Additional Instructions
              </h3>
              <Textarea
                id="additionalInstructions"
                placeholder="Any specific instructions for the AI (e.g., focus on application-based questions, include diagrams, etc.)"
                {...register("additionalInstructions")}
                className="min-h-[100px]"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full text-lg h-14 rounded-2xl"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Assessment...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Generate Question Paper
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
