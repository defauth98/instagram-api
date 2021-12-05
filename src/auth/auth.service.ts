import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/create-auth.dto';

import * as bcrypt from 'bcrypt';
import { generateToken } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async login(loginData: LoginDTO) {
    const user = await this.userRepository.findOne({ email: loginData.email })

    if (!user) {
      return {
        message: "User not found"
      }
    }

    if (bcrypt.compareSync(loginData.password, user.password)) {
      const jwtToken = generateToken(String(user.id));

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name
      }

      return {
        message: "Login success",
        user: userData,
        token: jwtToken
      }
    }


    return {
      message: 'Password is invalid'
    }
  }
}