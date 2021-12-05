import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { UserModule } from './user/user.module';
import { PostsModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

import { User } from './user/entities/user.entity';
import { Chat } from './chat/entities/chat.entity';
import { Messages } from './chat/entities/messages.entity';
import { Post } from './posts/entities/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'docker',
      database: 'instagram',
      entities: [Post, User, Chat, Messages],
      synchronize: true,
    }),
    UserModule,
    PostsModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
