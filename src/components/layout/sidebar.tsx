"use client";

/**
 * @module components/layout/sidebar
 * @description Application sidebar navigation with active state tracking.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Activity,
  Lightbulb,
  FlaskConical,
  Trophy,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/recommendations", label: "AI Coach", icon: Lightbulb },
  { href: "/simulator", label: "Simulator", icon: FlaskConical },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar" role="navigation" aria-label="Application navigation">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-lg font-bold mb-8 px-1"
        aria-label="EcoWise AI Dashboard"
      >
        <Leaf className="w-6 h-6 text-emerald-400" aria-hidden="true" />
        <span className="gradient-text">EcoWise AI</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[var(--color-border-default)] pt-4 mt-4">
        <Link href="/api/auth/signout" className="sidebar-link text-rose-400/70 hover:text-rose-400">
          <LogOut className="w-5 h-5" aria-hidden="true" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
