import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as yup from 'yup';
import { InjectRepository } from '@nestjs/typeorm';

export const generateToken = (id: string) =>
  jwt.sign({ id }, 'asfdnsaklfndkjsafkjd', {
    expiresIn: '86400',
  });

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(newUser: CreateUserDto): Promise<any> {
    const schema = yup.object().shape({
      name: yup.string().required().min(4),
      email: yup.string().required().min(4),
      password: yup.string().required().min(4),
    });

    return schema
      .validate(newUser)
      .then(async () => {
        const userHasExists = await this.userRepository.find({
          email: newUser.email,
        });

        if (userHasExists.length) {
          return { message: 'User already exists' };
        }

        const saltOrRounds = 10;

        const password_hash = await bcrypt.hash(newUser.password, saltOrRounds);

        const createdUser = this.userRepository.create({
          name: newUser.name,
          email: newUser.email,
          password: password_hash,
        });

        const savedUser = await this.userRepository.save(createdUser);

        const jwtToken = generateToken(String(savedUser.id));

        return {
          message: 'User created successfully',
          user: {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
          },
          token: jwtToken,
        };
      })
      .catch((error) => {
        return {
          message: error.message,
        };
      });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ select: ['name', 'email', 'id'] });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(
      { id },
      {
        select: ['id', 'name', 'email'],
      });


    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ id: number; email: string; name: string }> {
    await this.userRepository.update({ id }, updateUserDto);

    return {
      id,
      name: updateUserDto.name,
      email: updateUserDto.email,
    };
  }

  async remove(id: number) {
    await this.userRepository.delete({ id });

    return { id };
  }
}
