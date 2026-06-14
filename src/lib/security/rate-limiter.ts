import { Redis } from "@upstash/redis";

export interface RateLimitConfig {
  /** Maximum requests per window */
  readonly maxRequests: number;
  /** Window duration in milliseconds */
  readonly windowMs: number;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly resetTime: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 60,
  windowMs: 60_000, // 1 minute
};

/** Auth-specific rate limit: stricter (10 requests per minute) */
export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60_000,
};

/** API-specific rate limit: moderate (60 requests per minute) */
export const API_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 60,
  windowMs: 60_000,
};

// Initialize Upstash Redis if configured, otherwise null
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Fallback in-memory store for local dev
interface RateLimitEntry { count: number; resetTime: number; }
const fallbackStore = new Map<string, RateLimitEntry>();

/**
 * Check if a request from the given identifier is within rate limits.
 * Uses Upstash Redis if configured, otherwise falls back to memory.
 * @param identifier - Usually the client IP address or email
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed, remaining count, and reset time
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<RateLimitResult> {
  const now = Date.now();
  const resetTime = now + config.windowMs;

  if (redis) {
    try {
      const key = `rate_limit:${identifier}`;
      const [count] = await redis.pipeline()
        .incr(key)
        .pexpire(key, config.windowMs)
        .exec() as [number, number];

      return {
        allowed: count <= config.maxRequests,
        remaining: Math.max(0, config.maxRequests - count),
        resetTime,
      };
    } catch (e) {
      console.error("Redis rate limit error, falling back:", e);
      // Fall through to memory
    }
  }

  // Fallback memory implementation
  const entry = fallbackStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    fallbackStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }

  entry.count += 1;
  return {
    allowed: entry.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}
