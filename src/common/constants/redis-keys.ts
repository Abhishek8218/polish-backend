

export const REDIS_KEYS = {
    refreshToken: (userId: string) => `refresh-token:${userId}`,
    rateLimitKey: (userId: string) => `rate-limit:polish:${userId}`    
}