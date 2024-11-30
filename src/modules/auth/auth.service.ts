import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const { id, email, name } = user;
    const accessToken = this.jwtService.sign(
      { id, email, name },
      { expiresIn: '2 days', subject: String(id) },
    );

    return { accessToken };
  }

  async virifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async createUser(data: AuthCreateUserDto) {
    const newUser = await this.userService.create(data);
    return this.generateToken(newUser);
  }

  async login(data: AuthLoginDto) {
    const { email, password } = data;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    const invalidData = !user || !(await compare(password, user.password));
    if (invalidData) throw new UnauthorizedException('The data is not valid.');

    return this.generateToken(user);
  }
}
