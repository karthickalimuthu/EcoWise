/**
 * @module api/recommendations
 * @description AI recommendation API endpoints.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  generateAndStoreRecommendations,
  getRecommendations,
  acceptUserRecommendation,
} from "@/services/recommendation.service";
import { handleApiError, AuthenticationError } from "@/lib/errors";
import type { ProfileType } from "@/domain/types/user.types";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const recommendations = await getRecommendations(session.user.id);

    return NextResponse.json({ data: recommendations });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const body = await request.json().catch(() => ({}));
    const action = (body as { action?: string }).action;

    if (action === "accept" && (body as { recommendationId?: string }).recommendationId) {
      await acceptUserRecommendation(
        (body as { recommendationId: string }).recommendationId,
        session.user.id
      );
      return NextResponse.json({ message: "Recommendation accepted" });
    }

    // Default: generate new recommendations
    const recommendations = await generateAndStoreRecommendations(
      session.user.id,
      session.user.profileType as ProfileType
    );

    return NextResponse.json(
      { data: recommendations, message: "Recommendations generated" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
