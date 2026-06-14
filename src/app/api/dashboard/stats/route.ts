/**
 * @module api/dashboard/stats
 * @description Dashboard statistics API endpoint.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardStats } from "@/services/dashboard.service";
import { handleApiError, AuthenticationError } from "@/lib/errors";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const stats = await getDashboardStats(session.user.id);

    return NextResponse.json({ data: stats });
  } catch (error) {
    return handleApiError(error);
  }
}
