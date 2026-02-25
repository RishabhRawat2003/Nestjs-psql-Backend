import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ChatGateway } from 'src/socket/socket.gateway';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(
    private readonly rmq: RabbitMQService,

    private readonly socket: ChatGateway
  ) { }

  async onModuleInit() {
    const channel = await this.rmq.waitForChannel();

    await this.consumeTasks(channel, 'task_queue');
    await this.subscribeToEvents(channel, 'logs_exchange');
  }

  async consumeTasks(channel, queue: string) {
    await channel.assertQueue(queue, { durable: true, arguments: { "x-max-priority": 10 } });
    channel.prefetch(1);

    console.log(`👷 Worker listening on ${queue}`);

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        console.log('Processing:', data);

        await this.processTask(data);
        channel.ack(msg);
      } catch (err) {
        console.error('Processing error:', err);
        channel.nack(msg, false, true);
      }
    });
  }

  async subscribeToEvents(channel, exchange: string) {
    await channel.assertExchange(exchange, 'fanout', { durable: true });

    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, exchange, '');

    channel.consume(q.queue, (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      console.log('📢 Event received:', data);

      channel.ack(msg);
    });
  }

  async processTask(data: any) {
    this.socket.emitUpdation(data.ids, data.tableName);
  }
}