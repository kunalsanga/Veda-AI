"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  MonitorPlay,
  Clock,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: LayoutGrid },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: MonitorPlay },
  { label: "My Library", href: "/library", icon: Clock },
];

interface SidebarProps {
  assignmentCount?: number;
  libraryCount?: number;
}

export default function Sidebar({ assignmentCount, libraryCount }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 fixed left-4 top-4 bottom-4 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl overflow-hidden">
          <img src="/logo.png" alt="VedaAI" className="w-full h-full object-cover" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          VedaAI
        </span>
      </div>

      {/* Create Assignment Button */}
      <Link
        href="/create"
        className="block w-full mb-8 hover:opacity-90 transition-opacity"
      >
        <img src="/create-btn.png" alt="Create Assignment" className="w-full h-auto object-contain" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === "/assignments" && pathname.startsWith("/assignments")) ||
            (item.href === "/assignments" && pathname.startsWith("/create"));
          const Icon = item.icon;
          const count = item.label === "Assignments" ? assignmentCount : 
                        item.label === "My Library" ? libraryCount : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors hover:bg-gray-100 ${
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {count !== undefined && count > 0 && (
                <span className="bg-veda-orange text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[24px] text-center ml-1">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-auto pt-6 space-y-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-veda-orange to-veda-brown flex items-center justify-center overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=DPS"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              Delhi Public School
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
