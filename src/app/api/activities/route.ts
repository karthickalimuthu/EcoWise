/**
 * @module api/activities
 * @description Activity CRUD API endpoints.
 * GET: List activities with filters
 * POST: Create new activity
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { activityCreateSchema, activityQuerySchema } from "@/domain/validators";
import { logActivity, getUserActivities } from "@/services/carbon.service";
import { handleApiError, AuthenticationError } from "@/lib/errors";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    const { searchParams } = new URL(request.url);
    const query = activityQuerySchema.parse({
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      offset: searchParams.get("offset") ?? undefined,
    });

    const activities = await getUserActivities(session.user.id, query);

    return NextResponse.json({ data: activities });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    const body = await request.json();
    const validated = activityCreateSchema.parse(body);

    const activity = await logActivity(session.user.id, validated);

    return NextResponse.json(
      { data: activity, message: "Activity logged successfully" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
