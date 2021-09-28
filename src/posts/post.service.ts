import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/posts.entity';

import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createPostDto: CreatePostDto, file: Express.Multer.File) {
    const { userId, description } = createPostDto;

    const user = await this.userRepository.findOne({ id: userId })

    const image_url = `http://localhost:3333/posts/${file.filename}`

    const newPost = new Post();
    newPost.description = description;
    newPost.image_path = image_url;
    newPost.User = user;

    await this.postRepository.save(newPost);

    return {
      id: newPost.id,
      userId,
      imagePath: image_url,
      description
    };
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: ["User"],
    })

    return posts;
  }

  async findByUserId() {
    const posts = await this.postRepository.find();

    return posts
  }
}
