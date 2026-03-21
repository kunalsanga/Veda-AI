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
import AppLayout from "@/components/layout/AppLayout";
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

function ExamPaper({
  assignment,
  paperRef,
  onExportPDF,
}: {
  assignment: Assignment;
  paperRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => void;
}) {
  const result = assignment.result!;
  const totalMarks = result.sections.reduce(
    (acc, section) =>
      acc + section.questions.reduce((qAcc, q) => qAcc + q.marks, 0),
    0
  );

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      {/* Header text */}
      <div className="text-white mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <p className="text-[15px] font-medium leading-relaxed max-w-3xl">
          Certainly! Here is the customized Question Paper for your {assignment.inputData.grade} {assignment.inputData.subject} classes:
        </p>
        <Button onClick={onExportPDF} className="bg-white text-black hover:bg-gray-100 rounded-full h-10 px-6 shrink-0 flex items-center gap-2 font-semibold">
          <Download className="w-4 h-4" />
          Download as PDF
        </Button>
      </div>

      {/* The Paper itself */}
      <div ref={paperRef} id="exam-paper" className="bg-white rounded-[24px] p-8 md:p-12 text-black font-sans shadow-inner">
         
         {/* School Header */}
         <div className="text-center mb-10 text-gray-900 flex flex-col gap-1.5">
           <h1 className="text-3xl font-bold tracking-tight">Delhi Public School, Sector-4, Bokaro</h1>
           <p className="font-medium text-lg">Subject: {assignment.inputData.subject}</p>
           <p className="font-medium text-lg">Class: {assignment.inputData.grade}</p>
         </div>

         {/* Meta info row */}
         <div className="flex justify-between items-center text-[15px] font-semibold mb-6">
            <span>Time Allowed: 45 minutes</span>
            <span>Maximum Marks: {totalMarks}</span>
         </div>

         <p className="font-semibold text-[15px] mb-8">All questions are compulsory unless stated otherwise.</p>

         {/* Student Details */}
         <div className="space-y-4 mb-12 text-[15px] max-w-md font-semibold">
            <div className="flex gap-2 items-end">
              <span>Name:</span>
              <div className="flex-1 border-b-[1.5px] border-black pb-1"></div>
            </div>
            <div className="flex gap-2 items-end">
              <span>Roll Number:</span>
              <div className="flex-1 border-b-[1.5px] border-black pb-1"></div>
            </div>
            <div className="flex items-end flex-wrap">
              <span className="mr-2 mb-1">Class: {assignment.inputData.grade} Section:</span>
              <div className="flex-1 border-b-[1.5px] border-black pb-1 min-w-[50px]"></div>
            </div>
         </div>

         {/* Sections structure */}
         <div className="space-y-10">
           {result.sections.map((section, sIdx) => {
             return (
             <div key={sIdx}>
               <h2 className="text-xl font-bold text-center mb-6">{section.title}</h2>
               
               <div className="mb-6 space-y-1">
                 <p className="text-[14px] italic text-gray-800">
                    {section.instruction}
                 </p>
               </div>

               <div className="space-y-5">
                  {section.questions.map((question, qIdx) => {
                    const diffText = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
                    return (
                    <div key={qIdx} className="text-[15px] leading-relaxed flex gap-2">
                      <span className="shrink-0">{qIdx + 1}.</span>
                      <div>
                        <span className="text-gray-600">[{diffText}]</span>{" "}
                        <span>{question.question}</span>{" "}
                        <span className="text-gray-600">[{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]</span>
                        
                        {/* MCQ Options */}
                        {question.options && question.options.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options.map((opt, oIdx) => (
                              <div key={oIdx}>
                                 {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )} )}
               </div>
             </div>
           )} )}
         </div>

         {/* End marker */}
         <div className="mt-12 mb-16">
           <p className="font-semibold text-[15px] text-gray-800">End of Question Paper</p>
         </div>

         {/* Answer Key block */}
         <div className="pt-10 border-t-2 border-dashed border-gray-300">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Answer Key:</h2>
            <div className="space-y-6">
               {result.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-4">
                    {section.questions.map((question, qIdx) => (
                       <div key={qIdx} className="text-[15px] flex gap-2">
                          <span className="shrink-0 text-gray-700">{qIdx + 1}.</span>
                          <div className="leading-relaxed whitespace-pre-wrap text-gray-700">
                             {question.answer || "Answer not provided."}
                          </div>
                       </div>
                    ))}
                  </div>
               ))}
            </div>
         </div>

      </div>
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

    // 🔥 Fallback API Polling (Guaranteed Catch)
    let isPolling = true;
    const intervalId = setInterval(async () => {
      if (!isPolling) return;
      try {
        const res = await getAssignment(assignmentId);
        if (res.success) {
          const status = res.data.status;
          if (status === "completed" || status === "failed") {
            isPolling = false;
            clearInterval(intervalId);
            setCurrentAssignment(res.data);
            setProgress("");
          }
        }
      } catch (e) {
        // ignore polling errors quietly
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [assignmentId, setCurrentAssignment, setError, setProgress]);

  // Socket.io event listeners
  useEffect(() => {
    const unsubComplete = onEvent("generation-complete", (data: any) => {
      console.log("🔥 EVENT RECEIVED (Complete):", data);
      // Re-fetch to get full data
      getAssignment(assignmentId).then((res) => {
        if (res.success) {
          setCurrentAssignment(res.data);
          setProgress("");
        }
      });
    });

    const unsubProgress = onEvent("generation-progress", (data: any) => {
      console.log("⚡ EVENT RECEIVED (Progress):", data);
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
  const handleExportPDF = () => {
    window.print();
  };

  const status = currentAssignment?.status;
  const isComplete = status === "completed" && currentAssignment?.result;
  const isFailed = status === "failed";
  const isProcessing =
    status === "pending" || status === "processing" || (!isComplete && !isFailed && !loading);

  return (
    <AppLayout showTopBar={false}>
      <div className="min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-32px)] bg-[#4b4b4b] rounded-t-3xl lg:rounded-3xl p-6 md:p-8 flex flex-col">
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
          <ExamPaper assignment={currentAssignment} paperRef={paperRef} onExportPDF={handleExportPDF} />
        )}
      </div>
    </AppLayout>
  );
}
