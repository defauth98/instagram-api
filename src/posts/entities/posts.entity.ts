import { User } from "../../user/entities/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({
    nullable: true,
  })
  image_path?: string | null;

  @ManyToOne(() => User, user => user.posts)
  User: User;
}
