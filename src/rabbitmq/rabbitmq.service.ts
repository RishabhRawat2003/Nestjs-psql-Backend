import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService
  implements OnModuleInit, OnModuleDestroy
{
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(
        process.env.RABBITMQ_URL || 'amqp://localhost',
      );

      this.connection.on('close', () => {
        console.error('RabbitMQ disconnected. Reconnecting...');
        setTimeout(() => this.connect(), 5000);
      });

      this.connection.on('error', (err) => {
        console.error('RabbitMQ error:', err);
      });

      this.channel = await this.connection.createChannel();
      console.log('🐰 RabbitMQ connected & channel ready');
    } catch (err) {
      console.error('RabbitMQ connection failed:', err);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async waitForChannel(): Promise<amqp.Channel> {
    while (!this.channel) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return this.channel;
  }

  getChannel(): amqp.Channel {
    return this.channel;
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}