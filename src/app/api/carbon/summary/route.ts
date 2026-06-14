/**
 * @module api/carbon/summary
 * @description Carbon footprint summary API endpoint.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { summaryQuerySchema } from "@/domain/validators";
import { getCarbonSummary } from "@/services/carbon.service";
import { handleApiError, AuthenticationError } from "@/lib/errors";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const { searchParams } = new URL(request.url);
    const { period } = summaryQuerySchema.parse({
      period: searchParams.get("period") ?? undefined,
    });

    const summary = await getCarbonSummary(session.user.id, period);

    return NextResponse.json({ data: summary });
  } catch (error) {
    return handleApiError(error);
  }
}
