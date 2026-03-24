import Redis from 'ioredis';

const REDIS_CONFIG = {
  host: '127.0.0.1',
  port: 6379,
  // production redis -> RedisInsight
  // host: 'redis-13879.c277.us-east-1-3.ec2.cloud.redislabs.com',
  // port: 13879,
  // username: 'default',
  // password: 'lWmYcYfTkUcag85L0zru2HGYgDjWa9aU',
};

// For caching
export const redisCache = new Redis(REDIS_CONFIG);
redisCache.on('ready', () => console.log('[RedisCache] Connected to Redis!'));
redisCache.on('error', (err) => console.error('[RedisCache] Redis Error:', err));
