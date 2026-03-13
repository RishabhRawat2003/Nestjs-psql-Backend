import Redis from 'ioredis';

const REDIS_CONFIG = {
  host: '127.0.0.1',
  port: 6379,
};

// For caching
export const redisCache = new Redis(REDIS_CONFIG);
redisCache.on('ready', () => console.log('[RedisCache] Connected to Redis!'));
redisCache.on('error', (err) => console.error('[RedisCache] Redis Error:', err));
