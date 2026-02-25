import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class ProducerService {
  constructor(private readonly rmq: RabbitMQService) { }

  async publishToQueue(queue: string, data: any) {
    const channel = this.rmq.getChannel();

    await channel.assertQueue(queue, { durable: true, arguments: { "x-max-priority": 10 } });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
      priority: 1
    });

    console.log(`📤 Sent to queue ${queue}`, data);
  }

  async publishEvent(exchange: string, data: any) {
    const channel = this.rmq.getChannel();

    await channel.assertExchange(exchange, 'fanout', { durable: true });

    channel.publish(exchange, '', Buffer.from(JSON.stringify(data)));

    console.log(`📢 Broadcasted:`, data);
  }
}