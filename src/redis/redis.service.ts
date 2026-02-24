import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { redisCache } from './redis.clients';

@Injectable()
export class RedisService
  implements OnModuleDestroy
{
  private client: Redis = redisCache;

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(
    key: string,
    value: any,
    ttlSeconds?: number,
  ): Promise<void> {
    const data = JSON.stringify(value);

    if (ttlSeconds) {
      await this.client.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, data);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async flush(): Promise<void> {
    await this.client.flushdb();
  }
}