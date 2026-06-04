import { FastifyReply, FastifyRequest } from "fastify";
import { REDIS_KEYS } from "../common/constants/redis-keys";
import { redis } from "../config/redis";
import { ApiError } from "../common/errors/api-errors";




const LIMIT = 10;
const WINDOW_SECONDS = 60;

export const polishRateLimit = 
async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const userId =  request.user.userId;
    const key = REDIS_KEYS.rateLimitKey(userId);

    const current =  await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, WINDOW_SECONDS);
    }

    if (current > LIMIT) {
        throw new ApiError(429, "Too many requests. Please try again later.");
    }
}
