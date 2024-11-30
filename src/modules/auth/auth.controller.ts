import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UserAuth } from '../../common/decorators/user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create')
  async createUser(@Body() data: AuthCreateUserDto) {
    return this.authService.createUser(data);
  }

  @Post('login')
  async login(@Body() data: AuthLoginDto) {
    return this.authService.login(data);
  }

  @UseGuards(AuthGuard)
  @Get('/my-user')
  async myUser(@UserAuth() user: User) {
    return user;
  }
}
