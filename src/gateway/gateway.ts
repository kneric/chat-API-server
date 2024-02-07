import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin:
      process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
  },
})
export class Gateway {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Server is running on ', process.env.NODE_ENV);
  }

  @SubscribeMessage('chatRoom')
  onNewMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const eventName = 'chatMsg';
    this.server.emit(eventName, {
      user: client.id,
      eventName,
      message,
    });
  }
}
