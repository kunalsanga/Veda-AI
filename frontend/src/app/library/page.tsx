"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, BookOpen } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import AssignmentCard from "@/components/assignments/AssignmentCard";
import Link from "next/link";

interface AssignmentData {
  id: string;
  title: string;
  assignedDate: string;
  dueDate: string;
}

export default function LibraryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("veda_assignments");
      if (stored) {
        setAssignments(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load assignments", e);
    }
    setIsLoaded(true);
  }, []);

  const hasAssignments = assignments.length > 0;

  const handleView = (id: string) => {
    router.push(`/assignment/${id}`);
  };

  const handleDelete = (id: string) => {
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    localStorage.setItem("veda_assignments", JSON.stringify(updated));
  };

  if (!isLoaded) return null;

  return (
    <AppLayout topBarTitle="My Library" libraryCount={hasAssignments ? assignments.length : undefined}>
      <div className="px-4 md:px-8">
        <div className="lg:hidden mb-4">
          <div className="flex items-center mb-2">
            <button onClick={() => router.back()} className="p-1 mr-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-foreground flex-1 text-center pr-7">My Library</h1>
          </div>
        </div>

        {hasAssignments ? (
          <>
            <div className="hidden lg:block mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h1 className="text-xl font-bold text-foreground">
                  My Library
                </h1>
              </div>
              <p className="text-sm text-muted-foreground ml-[18px]">
                Access and manage all your saved assignments and generated papers.
              </p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter<span className="hidden lg:inline"> By</span></span>
              </button>

              <div className="flex-1 max-w-[200px] lg:max-w-xs ml-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Library"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-veda-orange/20 focus:border-veda-orange transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
              {assignments
                .filter((a) =>
                  a.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    id={assignment.id}
                    title={assignment.title}
                    assignedDate={assignment.assignedDate}
                    dueDate={assignment.dueDate}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
            
            <div className="hidden lg:flex fixed bottom-8 left-[240px] right-0 justify-center z-30 pointer-events-none">
              <Link
                href="/create"
                className="pointer-events-auto inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create Assignment
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 text-center">
              No saved assignments yet
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
              Your library is currently empty. Any assignments you create and save will appear here for quick access later.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-white rounded-full bg-gray-900 hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Assignment
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
