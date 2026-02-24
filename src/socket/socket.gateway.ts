import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ["polling", 'websocket'], // 🚀 Force WS (no polling) // remove polling for later
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('ChatGateway');

  constructor(private readonly jwtService: JwtService) { }

  afterInit() {
    this.logger.log('Socket server initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // const token = client.handshake.auth?.token;

      // if (!token) {
      //   client.disconnect();
      //   return;
      // }

      // const user = this.jwtService.verify(token);

      let user: any = {
        id: 1,
        name: 'Rishabh Rawat',
      }

      client.data.user = user;
      client.join(user.id);

      this.logger.log(`User ${user.id} connected`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User ${client?.data?.user?.id} disconnected`);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const sender = client.data.user;

    this.server.to(data.receiverId).emit('receive-message', {
      senderId: sender.id,
      message: data.message,
    });
  }


  emitUpdation(ids: number, tableName: string) {
    this.server.emit('live-update', { ids, table: tableName });
  }
}