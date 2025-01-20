import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; username: string; password: string }) {
    const { name, username, password } = body;
    const user = await this.authService.register(name, username, password);
    return user;
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const result = await this.authService.login(username, password);
    return result;
  }
}
