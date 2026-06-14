/**
 * @module lib/errors/error-handler
 * @description Centralized API error handler.
 * Converts any error into a consistent JSON response with proper status codes.
 * Prevents leaking internal details in production.
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, ValidationError } from "./app-error";

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Handle any error and return a standardized NextResponse.
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  // Zod validation errors
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(issue.message);
    }

    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  // Custom application errors
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.errors,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  // Unknown errors — don't leak internals in production
  const isDev = process.env.NODE_ENV === "development";
  const message = isDev && error instanceof Error
    ? error.message
    : "An unexpected error occurred";

  console.error("[API Error]", error);

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    { status: 500 }
  );
}
