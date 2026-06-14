/**
 * @module app/(authenticated)/layout
 * @description Layout for all authenticated pages.
 * Wraps pages with sidebar navigation.
 */

import Sidebar from "@/components/layout/sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main id="main-content" className="main-content flex-1">
        {children}
      </main>
    </div>
  );
}
