import { Post } from 'src/posts/entities/posts.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
    nullable:true
  })
  image_path?: string | null;

  @OneToMany(() => Post, post => post.User)
  posts: Post[]
}
