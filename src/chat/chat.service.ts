import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto'
import { Chat } from './entities/chat.entity';
import { Messages } from './entities/messages.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,

  ) { }

  async createChat(createChatDto: CreateChatDto) {
    const { userId, userId2 } = createChatDto

    const chat = new Chat()

    chat.Messages = [];
    chat.User = userId;
    chat.User2 = userId2;

    const newChat = await this.chatRepository.save(chat)

    return newChat
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const { content, userId, chatId } = createMessageDto

    const message = new Messages()

    message.content = content;
    message.User = userId;
    message.Chat = chatId;

    const newMessage = await this.messageRepository.save(message)

    return newMessage;
  }
}
