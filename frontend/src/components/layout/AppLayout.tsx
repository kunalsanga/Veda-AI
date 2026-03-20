"use client";

import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import MobileTabBar from "./MobileTabBar";
import TopBar from "./TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
  topBarTitle?: string;
  assignmentCount?: number;
  libraryCount?: number;
  showTopBar?: boolean;
}

export default function AppLayout({
  children,
  topBarTitle = "Assignment",
  assignmentCount,
  libraryCount,
  showTopBar = true,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#dedede]">
      {/* Desktop Sidebar */}
      <Sidebar
        assignmentCount={assignmentCount}
        libraryCount={libraryCount}
      />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main content area */}
      <main className="lg:ml-[292px] lg:pr-4 lg:pt-4 lg:pb-4 min-h-screen lg:min-h-screen flex flex-col">
        {/* Desktop Top Bar */}
        {showTopBar && (
          <div className="hidden lg:block mb-6">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <TopBar title={topBarTitle} />
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="pt-14 lg:pt-0 pb-20 lg:pb-0 flex-1">
          {children}
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
