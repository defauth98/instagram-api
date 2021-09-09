import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import * as jwt from 'jsonwebtoken';
import * as yup from 'yup';
import * as bcrypt from 'bcrypt';

const generateToken = (id: string) =>
  jwt.sign({ id }, 'asfdnsaklfndkjsafkjd', {
    expiresIn: '86400',
  });

@Injectable()
export class UserService {
  constructor(private connection: Connection) {}

  async create(newUser: CreateUserDto): Promise<any> {
    const schema = yup.object().shape({
      name: yup.string().required().min(4),
      email: yup.string().required().min(4),
      password: yup.string().required().min(4),
    });

    schema
      .validate(newUser)
      .then(async () => {
        const userRepository = this.connection.getRepository(User);

        const userHasExists = await userRepository.find({
          email: newUser.email,
        });

        if (userHasExists.length) {
          return { message: 'User already exists' };
        }

        const saltOrRounds = 10;
        const password = 'random_password';
        const password_hash = await bcrypt.hash(password, saltOrRounds);

        const newuser = userRepository.create({
          name: newUser.name,
          email: newUser.email,
          password: password_hash,
        });

        const savedUser = await userRepository.save(newuser);
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
    const usersRepository = this.connection.getRepository(User);
    return usersRepository.find();
  }

  findOne(id: number) {
    const usersRepository = this.connection.getRepository(User);
    return usersRepository.find({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async closeDB() {
    const userRepository = this.connection.getRepository(User);
    await userRepository.clear();
    await this.connection.close();
  }
}
