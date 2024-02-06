import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin:
      process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
  },
})
export class Gateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit(): any {
    this.server.on('connection', () => {
      console.log('Server is running on ', process.env.NODE_ENV);
    });
  }

  @SubscribeMessage('chatRoom')
  onNewMessage(@MessageBody() message: any) {
    const eventName = 'chatMsg';
    this.server.emit(eventName, {
      // username
      eventName,
      message,
    });
  }
}
