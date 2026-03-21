"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Calendar,
  Plus,
  Minus,
  X,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Mic,
  Image as ImageIcon,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAssignmentStore } from "@/store/assignmentStore";
import { createAssignment } from "@/lib/api";

interface QuestionTypeRow {
  id: string;
  type: string;
  numQuestions: number;
  marks: number;
}

const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Answer Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "True/False",
  "Fill in the Blanks",
  "Match the Following",
];

export default function CreatePage() {
  const router = useRouter();
  const { isSubmitting, setIsSubmitting, error, setError } = useAssignmentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [chapter, setChapter] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [questionTypes, setQuestionTypes] = useState<QuestionTypeRow[]>([
    { id: "1", type: "Multiple Choice Questions", numQuestions: 4, marks: 1 },
    { id: "2", type: "Short Questions", numQuestions: 3, marks: 2 },
    { id: "3", type: "Diagram/Graph-Based Questions", numQuestions: 5, marks: 5 },
    { id: "4", type: "Numerical Problems", numQuestions: 5, marks: 5 },
  ]);

  const totalQuestions = questionTypes.reduce(
    (sum, qt) => sum + qt.numQuestions,
    0
  );
  const totalMarks = questionTypes.reduce(
    (sum, qt) => sum + qt.numQuestions * qt.marks,
    0
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const addQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      {
        id: Date.now().toString(),
        type: QUESTION_TYPE_OPTIONS[0],
        numQuestions: 1,
        marks: 1,
      },
    ]);
  };

  const removeQuestionType = (id: string) => {
    setQuestionTypes(questionTypes.filter((qt) => qt.id !== id));
  };

  const updateQuestionType = (
    id: string,
    field: keyof QuestionTypeRow,
    value: string | number
  ) => {
    setQuestionTypes(
      questionTypes.map((qt) =>
        qt.id === id ? { ...qt, [field]: value } : qt
      )
    );
  };

  const incrementValue = (id: string, field: "numQuestions" | "marks") => {
    setQuestionTypes(
      questionTypes.map((qt) =>
        qt.id === id ? { ...qt, [field]: qt[field] + 1 } : qt
      )
    );
  };

  const decrementValue = (id: string, field: "numQuestions" | "marks") => {
    setQuestionTypes(
      questionTypes.map((qt) =>
        qt.id === id && qt[field] > 1
          ? { ...qt, [field]: qt[field] - 1 }
          : qt
      )
    );
  };

  const handleSubmit = async () => {
    if (!chapter.trim()) {
      setError("Please enter a chapter or subject name.");
      return;
    }
    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        subject: chapter,
        topic: chapter,
        grade: "Grade 10",
        questionTypes: questionTypes.map((qt) => qt.type),
        numberOfQuestions: totalQuestions,
        totalMarks: totalMarks,
        dueDate: dueDate,
        additionalInstructions: additionalInfo,
        file: selectedFile || undefined,
      };

      const response = await createAssignment(payload);
      if (response.success) {
        // Save to local storage for the assignments list page
        try {
          const stored = JSON.parse(localStorage.getItem("veda_assignments") || "[]");
          const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
          stored.push({
            id: response.data.id,
            title: `Assignment: ${chapter || "New Topic"}`,
            assignedDate: currentDate,
            dueDate: dueDate ? dueDate.split('-').reverse().join('-') : currentDate
          });
          localStorage.setItem("veda_assignments", JSON.stringify(stored));
        } catch (e) {
          console.error("Failed to save to local storage", e);
        }

        router.push(`/assignment/${response.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout topBarTitle="Assignment">
      <div className="px-4 md:px-8 w-full">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Create Assignment
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[18px]">
            Set up a new assignment for your students
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-900 rounded-full w-1/3 transition-all" />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#f0f0f0] rounded-[32px] p-6 md:p-8 mb-8">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1 tracking-tight">
              Assignment Details
            </h2>
            <p className="text-sm text-gray-400">
              Basic information about your assignment
            </p>
          </div>

          {/* File Upload */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-3xl p-8 mb-4 text-center cursor-pointer transition-colors hover:border-gray-400"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm font-bold text-foreground">
                  {selectedFile.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="p-1.5 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-6 h-6 text-foreground mb-3" />
                <p className="text-sm font-semibold text-foreground mb-1">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-xs text-gray-400 mb-5">
                  JPEG, PNG, upto 10MB
                </p>
                <button
                  type="button"
                  className="px-5 py-2 text-xs font-bold bg-[#e5e5e5] text-foreground rounded-full hover:bg-gray-300 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center mb-8">
            Upload images of your preferred document/image
          </p>

          {/* Due Date & Chapter */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-5 py-3.5 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-veda-orange/20 transition-all text-gray-500"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full px-5 py-3.5 pr-12 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-veda-orange/20 transition-all text-gray-500"
                placeholder="Choose a chapter"
              />
              <ImageIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
            </div>
          </div>

          {/* Question Type Table */}
          <div className="mb-2">
            <div className="flex items-center gap-4 md:gap-8 mb-4">
              <span className="text-sm font-bold text-foreground flex-1">
                Question Type
              </span>
              <span className="text-sm font-bold text-foreground text-center w-[120px] md:w-[140px]">
                No. of Questions
              </span>
              <span className="text-sm font-bold text-foreground text-center w-[100px] md:w-[120px]">
                Marks
              </span>
            </div>

            <div className="space-y-4">
              {questionTypes.map((qt) => (
                <div key={qt.id} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  {/* Type Selector & Remove Button */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1">
                      <select
                        value={qt.type}
                        onChange={(e) =>
                          updateQuestionType(qt.id, "type", e.target.value)
                        }
                        className="w-full px-5 py-3.5 text-sm font-medium text-foreground rounded-full bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-veda-orange/20 transition-all pr-10"
                      >
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => removeQuestionType(qt.id)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 md:gap-8 justify-between md:justify-start">
                    {/* Number of Questions Counter */}
                    <div className="flex items-center justify-between bg-white rounded-full px-2 py-2 w-[120px] md:w-[140px]">
                      <button
                        onClick={() => decrementValue(qt.id, "numQuestions")}
                        className="px-2 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold text-foreground px-2">
                        {qt.numQuestions}
                      </span>
                      <button
                        onClick={() => incrementValue(qt.id, "numQuestions")}
                        className="px-2 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Marks Counter */}
                    <div className="flex items-center justify-between bg-white rounded-full px-2 py-2 w-[100px] md:w-[120px]">
                      <button
                        onClick={() => decrementValue(qt.id, "marks")}
                        className="px-2 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold text-foreground px-2">
                        {qt.marks}
                      </span>
                      <button
                        onClick={() => incrementValue(qt.id, "marks")}
                        className="px-2 text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Question Type */}
            <button
              onClick={addQuestionType}
              className="flex items-center gap-3 mt-6 text-sm font-bold text-foreground hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              Add Question Type
            </button>
          </div>

          {/* Totals */}
          <div className="text-right space-y-1.5 mb-8 mt-4">
            <p className="text-sm text-foreground">
              Total Questions : <span className="font-bold">{totalQuestions}</span>
            </p>
            <p className="text-sm text-foreground">
              Total Marks : <span className="font-bold">{totalMarks}</span>
            </p>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3">
              Additional Information (For better output)
            </label>
            <div className="relative">
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="e.g Generate a question paper for 3 hour exam duration.."
                className="w-full px-6 py-5 text-sm rounded-3xl border border-dashed border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-veda-orange/20 transition-all min-h-[100px] resize-none placeholder-gray-400"
              />
              <button className="absolute bottom-4 right-4 p-1.5 bg-[#e5e5e5] rounded-full hover:bg-gray-300 transition-colors">
                <Mic className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
