import { Module, Global } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { SocketModule } from 'src/socket/socket.module';

@Global()
@Module({
  imports: [SocketModule],
  providers: [RabbitMQService, ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class RabbitMQModule { }