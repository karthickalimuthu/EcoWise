/**
 * @module api/activities/[id]
 * @description Single activity API endpoints.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { activityUpdateSchema } from "@/domain/validators";
import { getActivity, editActivity, removeActivity } from "@/services/carbon.service";
import { handleApiError, AuthenticationError } from "@/lib/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const { id } = await params;
    const activity = await getActivity(id, session.user.id);

    return NextResponse.json({ data: activity });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const { id } = await params;
    const body = await request.json();
    const validated = activityUpdateSchema.parse(body);

    const updated = await editActivity(id, session.user.id, validated);

    return NextResponse.json({ data: updated, message: "Activity updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const { id } = await params;
    await removeActivity(id, session.user.id);

    return NextResponse.json({ message: "Activity deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
