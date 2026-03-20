"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";

export default function MobileHeader() {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden">
          <img src="/logo.png" alt="VedaAI" className="w-full h-full object-cover" />
        </div>
        <span className="text-base font-bold tracking-tight text-foreground">
          VedaAI
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="relative p-1.5">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-veda-orange rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-veda-orange">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=DPS"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <button className="p-1.5">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
}
