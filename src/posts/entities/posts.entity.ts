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

  @Column()
  image_path: string;

  @ManyToOne(() => User, user => user.id)
  User: User;
}
