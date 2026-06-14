/**
 * @module api/challenges/[id]/complete
 * @description Challenge completion API endpoint.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { completeChallenge } from "@/repositories/challenge.repository";
import { handleApiError, AuthenticationError } from "@/lib/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const { id } = await params;
    await completeChallenge(id, session.user.id);

    return NextResponse.json({ message: "Challenge completed! 🎉" });
  } catch (error) {
    return handleApiError(error);
  }
}
