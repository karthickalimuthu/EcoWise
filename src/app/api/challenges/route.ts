/**
 * @module api/challenges
 * @description Challenge management API endpoints.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { challengeCreateSchema } from "@/domain/validators";
import { generateChallenge } from "@/features/ai/challenge-generator";
import {
  createChallenge,
  findAllChallenges,
} from "@/repositories/challenge.repository";
import { handleApiError, AuthenticationError } from "@/lib/errors";
import type { ActivityCategory } from "@/domain/types/carbon.types";
import type { ChallengeType } from "@/domain/types/challenge.types";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const challenges = await findAllChallenges(session.user.id);

    return NextResponse.json({ data: challenges });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const body = await request.json();
    const validated = challengeCreateSchema.parse(body);

    const challengeOutput = generateChallenge(
      validated.type as ChallengeType,
      validated.category as ActivityCategory | undefined
    );

    const challenge = await createChallenge(session.user.id, challengeOutput);

    return NextResponse.json(
      { data: challenge, message: "Challenge created" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
