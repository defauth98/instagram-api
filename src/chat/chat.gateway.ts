import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io'


@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly chatService: ChatService) { }

  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('ChatGateway')

  afterInit() {
    this.logger.log('init')
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('join_chat')
  async handleEvent(@MessageBody() data: string): Promise<void> {
    console.log(data)

    // await this.chatService.createChat({ userId: 1, userId2: 2 })

    await this.chatService.createMessage({ chatId: 2, content: 'message ', userId: 1 })
  }
}
