"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, BookOpen, MonitorPlay } from "lucide-react";

const tabs = [
  { label: "Home", href: "/", icon: LayoutGrid },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "AI Toolkit", href: "/toolkit", icon: MonitorPlay },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 pb-[env(safe-area-inset-bottom)] rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[60px] ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
