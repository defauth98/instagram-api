import { User } from "src/user/entities/user.entity";
import { Messages } from '../entities/messages.entity'
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.chats)
  User: number;

  @ManyToOne(() => User, user => user.chats)
  User2: number;

  @OneToMany(() => Messages, message => message.Chat)
  Messages?: Messages[] | null;
}
