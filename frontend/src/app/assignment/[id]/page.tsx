"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssignmentStore } from "@/store/assignmentStore";
import { getAssignment, regenerateAssignment } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";
import type { Assignment } from "@/store/assignmentStore";

// Difficulty Badge Component
function DifficultyBadge({
  difficulty,
}: {
  difficulty: "easy" | "medium" | "hard";
}) {
  const colors = {
    easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    hard: "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[difficulty]}`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="h-8 shimmer-bg rounded-lg w-3/4 mb-4" />
        <div className="h-4 shimmer-bg rounded-lg w-1/2 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-12 shimmer-bg rounded-lg w-1/3" />
              <div className="h-12 shimmer-bg rounded-lg w-1/3" />
              <div className="h-12 shimmer-bg rounded-lg w-1/3" />
            </div>
          ))}
        </div>
      </div>
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-8"
        >
          <div className="h-6 shimmer-bg rounded-lg w-1/4 mb-3" />
          <div className="h-4 shimmer-bg rounded-lg w-2/3 mb-6" />
          {[1, 2, 3].map((j) => (
            <div key={j} className="mb-4">
              <div className="h-4 shimmer-bg rounded-lg w-full mb-2" />
              <div className="h-4 shimmer-bg rounded-lg w-3/4" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Processing Animation
function ProcessingState({ progress }: { progress: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full gradient-primary opacity-20 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-3">
        Generating Your Question Paper
      </h2>
      <p className="text-muted-foreground mb-4">
        Our AI is crafting the perfect assessment for you
      </p>
      {progress && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-700 text-sm">
          <Zap className="w-4 h-4 animate-pulse" />
          {progress}
        </div>
      )}
      <div className="mt-8 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-violet-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// Error State
function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Generation Failed</h2>
      <p className="text-muted-foreground mb-6">{error}</p>
      <Button onClick={onRetry} size="lg" className="rounded-2xl">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

// Exam Paper Component
function ExamPaper({
  assignment,
  paperRef,
}: {
  assignment: Assignment;
  paperRef: React.RefObject<HTMLDivElement>;
}) {
  const result = assignment.result!;
  const totalMarks = result.sections.reduce(
    (acc, section) =>
      acc + section.questions.reduce((qAcc, q) => qAcc + q.marks, 0),
    0
  );

  return (
    <div ref={paperRef} className="max-w-4xl mx-auto" id="exam-paper">
      {/* Paper Header */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="gradient-primary p-6 text-white">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {assignment.inputData.subject}
            </h1>
            <p className="text-white/80 text-lg">{assignment.inputData.topic}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-muted-foreground text-xs">Grade</p>
              <p className="font-semibold">{assignment.inputData.grade}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-muted-foreground text-xs">Total Marks</p>
              <p className="font-semibold">{totalMarks}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-muted-foreground text-xs">Questions</p>
              <p className="font-semibold">
                {result.sections.reduce(
                  (acc, s) => acc + s.questions.length,
                  0
                )}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-muted-foreground text-xs">Due Date</p>
              <p className="font-semibold">
                {new Date(assignment.inputData.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Student Info */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Student Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                  Name:
                </span>
                <div className="flex-1 border-b-2 border-gray-300 pb-1" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                  Roll No:
                </span>
                <div className="flex-1 border-b-2 border-gray-300 pb-1" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                  Section:
                </span>
                <div className="flex-1 border-b-2 border-gray-300 pb-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Sections */}
      {result.sections.map((section, sIdx) => (
        <div
          key={sIdx}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden"
        >
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {section.title}
              </h2>
              <span className="text-sm text-muted-foreground">
                {section.questions.reduce((acc, q) => acc + q.marks, 0)} marks
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 italic">
              {section.instruction}
            </p>
          </div>
          <div className="p-6 space-y-6">
            {section.questions.map((question, qIdx) => (
              <div
                key={qIdx}
                className="group p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">
                    {qIdx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed mb-3">
                      {question.question}
                    </p>

                    {/* MCQ Options */}
                    {question.options && question.options.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        {question.options.map((option, oIdx) => (
                          <div
                            key={oIdx}
                            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-sm"
                          >
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <DifficultyBadge difficulty={question.difficulty} />
                      <span className="text-xs text-muted-foreground font-medium px-2.5 py-0.5 rounded-full bg-gray-100">
                        {question.marks}{" "}
                        {question.marks === 1 ? "mark" : "marks"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Page Component
export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = params.id as string;

  const {
    currentAssignment,
    setCurrentAssignment,
    progress,
    setProgress,
    error,
    setError,
  } = useAssignmentStore();

  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const { onEvent } = useSocket(assignmentId);

  // Fetch assignment data
  useEffect(() => {
    async function fetchAssignment() {
      try {
        setLoading(true);
        const response = await getAssignment(assignmentId);
        if (response.success) {
          setCurrentAssignment(response.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch assignment");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignment();
  }, [assignmentId, setCurrentAssignment, setError]);

  // Socket.io event listeners
  useEffect(() => {
    const unsubComplete = onEvent("generation-complete", (data: any) => {
      // Re-fetch to get full data
      getAssignment(assignmentId).then((res) => {
        if (res.success) {
          setCurrentAssignment(res.data);
          setProgress("");
        }
      });
    });

    const unsubProgress = onEvent("generation-progress", (data: any) => {
      setProgress(data.progress || "Processing...");
    });

    const unsubFailed = onEvent("generation-failed", (data: any) => {
      setError(data.error || "Generation failed");
      setProgress("");
      // Re-fetch to update status
      getAssignment(assignmentId).then((res) => {
        if (res.success) setCurrentAssignment(res.data);
      });
    });

    return () => {
      unsubComplete();
      unsubProgress();
      unsubFailed();
    };
  }, [assignmentId, onEvent, setCurrentAssignment, setProgress, setError]);

  // Handle regeneration
  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      setError(null);
      const response = await regenerateAssignment(assignmentId);
      if (response.success) {
        setCurrentAssignment({
          ...currentAssignment!,
          status: "pending",
          result: null,
          error: null,
        });
        setProgress("Starting regeneration...");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to regenerate");
    } finally {
      setRegenerating(false);
    }
  };

  // Handle PDF Export
  const handleExportPDF = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = document.getElementById("exam-paper");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      // Handle multi-page
      const pageHeight = pdfHeight;
      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        position,
        imgWidth * ratio,
        imgHeight * ratio
      );
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          position,
          imgWidth * ratio,
          imgHeight * ratio
        );
        heightLeft -= pageHeight;
      }

      const subject = currentAssignment?.inputData.subject || "paper";
      pdf.save(`${subject}-question-paper.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  const status = currentAssignment?.status;
  const isComplete = status === "completed" && currentAssignment?.result;
  const isFailed = status === "failed";
  const isProcessing =
    status === "pending" || status === "processing" || (!isComplete && !isFailed && !loading);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 no-print">
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
          <div className="flex items-center gap-3">
            {isComplete && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="rounded-xl"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      regenerating ? "animate-spin" : ""
                    }`}
                  />
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  onClick={handleExportPDF}
                  className="rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </>
            )}
            <Link
              href="/create"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              New Paper
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-16 px-4 md:px-6">
        {/* Status Header */}
        {!loading && (
          <div className="max-w-4xl mx-auto mb-8 no-print">
            <div className="flex items-center gap-3 mb-2">
              {isComplete && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Paper Generated Successfully</span>
                </div>
              )}
              {isProcessing && (
                <div className="flex items-center gap-2 text-amber-600">
                  <Clock className="w-5 h-5 animate-pulse" />
                  <span className="font-medium">Generating Paper...</span>
                </div>
              )}
              {isFailed && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Generation Failed</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {loading && <LoadingSkeleton />}
        {!loading && isProcessing && <ProcessingState progress={progress} />}
        {!loading && isFailed && (
          <ErrorState
            error={currentAssignment?.error || error || "Unknown error"}
            onRetry={handleRegenerate}
          />
        )}
        {!loading && isComplete && currentAssignment && (
          <ExamPaper assignment={currentAssignment} paperRef={paperRef} />
        )}
      </div>
    </div>
  );
}
