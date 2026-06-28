import type { FastifyRequest, FastifyReply } from "fastify";

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+(an?|acting\s+as)/i,
  /bypass\s+restrictions/i,
  /forget\s+(everything|what\s+I\s+said)/i,
  /new\s+role/i
];

export function isPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

const RATE_LIMIT_WINDOW = 60; // 60 seconds (1 minute) for Redis
const RATE_LIMIT_MAX = 5; // 5 requests per minute

const QUOTA_WINDOW = 24 * 60 * 60; // 24 hours in seconds
const QUOTA_MAX = 10; // 10 requests per 24 hours

export async function chatGuard(request: FastifyRequest, reply: FastifyReply) {
  const ip = request.ip;
  const now = Date.now();
  const redis = request.redis;

  if (!redis) {
    request.log.error("Redis is not decorated on request. Skipping rate limiter/quota checks.");
    return;
  }

  const { message } = request.body as { message: string };

  if (!message) {
    return;
  }

  // 1. Prompt Injection Guard
  if (isPromptInjection(message)) {
    return reply.status(400).send({ 
      error: "Prompt injection detected. Please ask relevant questions about Aditya's background and projects." 
    });
  }

  try {
    const rateLimitKey = `ratelimit:${ip}`;
    const quotaKey = `quota:${ip}`;
    const windowStart = now - (RATE_LIMIT_WINDOW * 1000);

    // 2. Sliding Window Rate Limiter using Redis Sorted Set
    const uniqueMember = `${now}-${Math.random()}`;
    const pipeline = redis.pipeline();
    
    pipeline.zadd(rateLimitKey, now, uniqueMember);
    pipeline.zremrangebyscore(rateLimitKey, 0, windowStart);
    pipeline.zcard(rateLimitKey);
    pipeline.expire(rateLimitKey, RATE_LIMIT_WINDOW);

    // 3. Quota Manager check (read-only first to prevent race condition/leak increment)
    pipeline.get(quotaKey);
    pipeline.ttl(quotaKey);

    const results = await pipeline.exec();
    if (!results) {
      throw new Error("Redis pipeline execution failed");
    }

    // Parse rate limit count from zcard results[2]
    const zcardErr = results[2][0];
    const rateCount = results[2][1] as number;
    if (zcardErr) throw zcardErr;

    if (rateCount > RATE_LIMIT_MAX) {
      return reply.status(429).send({ 
        error: "Too many requests. Please slow down and try again in a minute." 
      });
    }

    // Parse quota from get results[4] and ttl results[5]
    const quotaGetErr = results[4][0];
    const quotaCountVal = results[4][1] as string | null;
    if (quotaGetErr) throw quotaGetErr;

    const quotaTtlErr = results[5][0];
    const quotaTtl = results[5][1] as number;
    if (quotaTtlErr) throw quotaTtlErr;

    const quotaCount = quotaCountVal ? parseInt(quotaCountVal, 10) : 0;

    if (quotaCount >= QUOTA_MAX) {
      // Calculate remaining hours
      const secondsLeft = quotaTtl > 0 ? quotaTtl : QUOTA_WINDOW;
      const hoursLeft = Math.ceil(secondsLeft / 3600);
      return reply.status(403).send({ 
        error: `You have reached your daily quota of ${QUOTA_MAX} messages. Please try again in ${hoursLeft} hours.` 
      });
    }

    // 4. Increment Quota
    if (quotaCount === 0) {
      await redis.set(quotaKey, "1", "EX", QUOTA_WINDOW);
    } else {
      await redis.incr(quotaKey);
    }

  } catch (error) {
    request.log.error(error, "Error in chatGuard Redis operations");
    return reply.status(500).send({ error: "System security validation error" });
  }
}
