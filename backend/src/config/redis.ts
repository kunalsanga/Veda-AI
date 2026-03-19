import Redis from "ioredis";

let redis: Redis;

export async function connectRedis(): Promise<Redis> {
  redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });

  return redis;
}

export function getRedis(): Redis {
  if (!redis) {
    throw new Error("Redis not connected. Call connectRedis() first.");
  }
  return redis;
}

// Cache helpers
export async function getCachedResult(key: string): Promise<string | null> {
  try {
    return await getRedis().get(key);
  } catch {
    return null;
  }
}

export async function setCachedResult(
  key: string,
  value: string,
  ttlSeconds: number = 3600
): Promise<void> {
  try {
    await getRedis().setex(key, ttlSeconds, value);
  } catch (err) {
    console.error("Redis cache set error:", err);
  }
}
