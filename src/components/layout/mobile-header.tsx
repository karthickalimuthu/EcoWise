"use client";

import { Menu, Leaf } from "lucide-react";
import Link from "next/link";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

export default function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
  return (
    <header className="mobile-header">
      <button 
        onClick={onOpenSidebar}
        className="p-2 -ml-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-lg font-bold"
        aria-label="EcoWise AI Dashboard"
      >
        <Leaf className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        <span className="gradient-text text-base">EcoWise AI</span>
      </Link>
      
      {/* Empty div for flex-between balance */}
      <div className="w-10"></div>
    </header>
  );
}
