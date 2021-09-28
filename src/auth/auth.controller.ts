import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  Login(@Body() loginData: LoginDTO) {
    return this.authService.login(loginData);
  }
}
