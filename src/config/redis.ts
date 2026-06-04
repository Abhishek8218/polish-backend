import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (error) => {
  console.error('Redis error:', error);
});