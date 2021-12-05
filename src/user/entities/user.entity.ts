import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Chat } from '../../chat/entities/chat.entity';
import { Post } from '../../posts/entities/posts.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true
  })
  image_path?: string | null;

  @OneToMany(() => Post, post => post.User)
  posts: Post[]

  @OneToMany(() => Chat, chat => chat.User)
  chats: Chat[]
}
