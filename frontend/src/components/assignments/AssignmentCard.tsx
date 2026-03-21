"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

interface AssignmentCardProps {
  id: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AssignmentCard({
  id,
  title,
  assignedDate,
  dueDate,
  onView,
  onDelete,
}: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      onClick={() => onView?.(id)}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Title row */}
      <div className="flex items-start justify-between mb-8">
        <h3 className="text-lg md:text-xl font-black tracking-tight text-foreground pr-4 pt-1">{title}</h3>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
              >
                View Assignment
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center justify-between text-xs md:text-sm font-bold pt-4">
        <span className="text-foreground">
          Assigned on : <span className="font-normal text-muted-foreground">{assignedDate}</span>
        </span>
        <span className="text-foreground">
          Due : <span className="font-normal text-muted-foreground">{dueDate}</span>
        </span>
      </div>
    </div>
  );
}
