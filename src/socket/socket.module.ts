import { Module } from '@nestjs/common';
import { ChatGateway } from './socket.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [ChatGateway],
  exports: [ChatGateway], 
})
export class SocketModule {}