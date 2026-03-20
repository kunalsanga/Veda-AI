"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from "lucide-react";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title = "Assignment" }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3.5">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link
          href="/assignments"
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <LayoutGrid className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-semibold text-muted-foreground ml-2">
          {title}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative p-1.5">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-veda-orange rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-foreground">John Doe</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
