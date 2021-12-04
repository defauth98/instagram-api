import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Messages } from './entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Messages])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule { }
