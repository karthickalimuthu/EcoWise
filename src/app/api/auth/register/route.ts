/**
 * @module api/auth/register
 * @description User registration API endpoint.
 * Validates input with Zod, creates user with hashed password.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { registerSchema } from "@/domain/validators";
import { registerUser } from "@/services/auth.service";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/security/rate-limiter";
import { getClientIp } from "@/lib/security/audit-logger";
import { RateLimitError } from "@/lib/errors/app-error";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateCheck = await checkRateLimit(`register:${ip}`, AUTH_RATE_LIMIT);

    if (!rateCheck.allowed) {
      throw new RateLimitError();
    }

    const body = await request.json();
    const validated = registerSchema.parse(body);

    const user = await registerUser(validated, ip);

    return NextResponse.json(
      {
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileType: user.profileType,
        },
        message: "Registration successful",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
