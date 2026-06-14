/**
 * @module app/(authenticated)/layout
 * @description Layout for all authenticated pages.
 * Wraps pages with sidebar navigation and mobile header.
 */

import AuthenticatedLayoutClient from "@/components/layout/authenticated-layout-client";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayoutClient>
      {children}
    </AuthenticatedLayoutClient>
  );
}
