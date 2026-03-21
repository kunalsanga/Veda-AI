"use client";

import AppLayout from "@/components/layout/AppLayout";
import { MonitorPlay, Sparkles, BookA, FileCheck, BrainCircuit, ScanText } from "lucide-react";

export default function ToolkitPage() {
  const tools = [
    {
      id: "generator",
      title: "Question Generator",
      description: "Quickly generate customized test questions on any topic.",
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      color: "bg-amber-50"
    },
    {
      id: "analyzer",
      title: "Paper Analyzer",
      description: "Upload existing papers to extract metadata and analyze difficulty.",
      icon: <ScanText className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      id: "grader",
      title: "Smart Grader",
      description: "Automatically grade student answers based on your rubric.",
      icon: <FileCheck className="w-8 h-8 text-green-500" />,
      color: "bg-green-50"
    },
    {
      id: "planner",
      title: "Lesson Planner",
      description: "Draft comprehensive lesson plans structured for your curriculum.",
      icon: <BookA className="w-8 h-8 text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      id: "tutor",
      title: "AI Assistant",
      description: "Chat with an AI trained specifically for educational insights.",
      icon: <BrainCircuit className="w-8 h-8 text-rose-500" />,
      color: "bg-rose-50"
    }
  ];

  return (
    <AppLayout topBarTitle="AI Teacher's Toolkit">
      <div className="px-4 md:px-8">
        <div className="lg:hidden mb-4">
          <div className="flex items-center mb-2">
            <h1 className="text-lg font-bold text-foreground flex-1 text-center pr-7">AI Teacher's Toolkit</h1>
          </div>
        </div>

        <div className="hidden lg:block mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <h1 className="text-xl font-bold text-foreground">
              AI Teacher's Toolkit
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[18px]">
            Supercharge your workflow with purpose-built AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mb-8 mt-4">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow h-full pb-8 cursor-pointer relative group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${tool.color}`}>
                {tool.icon}
              </div>
              <h3 className="text-lg md:text-xl font-black tracking-tight text-foreground mb-2 pt-1">{tool.title}</h3>
              <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">{tool.description}</p>
              
              <button className="flex items-center justify-center gap-2 bg-gray-900 text-white w-full py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors">
                Launch Tool
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
