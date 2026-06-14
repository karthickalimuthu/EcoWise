"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import MobileHeader from "./mobile-header";

export default function AuthenticatedLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <a href="#main-content" className="skip-nav">Skip to content</a>
      {/* Sidebar with mobile toggle state */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Wrapper Area (Accounts for sidebar width on desktop) */}
      <div className="main-wrapper flex-1 flex flex-col min-h-screen">
        {/* Mobile Header (hidden on desktop) */}
        <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Centered Content Area */}
        <main id="main-content" className="main-content auth-container flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
