/**
 * @module api/simulation/predict
 * @description Reduction simulation API endpoint.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { simulationSchema } from "@/domain/validators";
import { simulateReduction } from "@/domain/calculators/reduction-simulator";
import { handleApiError, AuthenticationError } from "@/lib/errors";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const body = await request.json();
    const validated = simulationSchema.parse(body);

    const result = simulateReduction(validated);

    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
