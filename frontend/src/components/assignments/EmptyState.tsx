"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration */}
      <div className="w-64 md:w-[320px] max-w-full aspect-[4/3] mb-8 flex justify-center">
        <img
          src="/no-assignment.png"
          alt="No assignments"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text */}
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 text-center">
        No assignments yet
      </h2>
      <p className="text-sm md:text-base text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      {/* CTA Button */}
      <Link
        href="/create"
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Your First Assignment
      </Link>
    </div>
  );
}
