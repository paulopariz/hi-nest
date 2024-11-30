import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user-create.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { UpdatePatchUserDto } from './dto/user-update-patch.dto';

import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const password = await this.generatePasswordHash(data.password);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password,
      },
    });

    return {
      ...user,
      password: undefined,
    };
  }

  async getAll(search: string): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        createdAt: true,
      },
    });
  }

  async getById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    const { password, ...dataUser } = user;
    return dataUser;
  }

  async update(
    id: number,
    data: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const password = await this.generatePasswordHash(data.password);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        password,
      },
    });

    const { password: newPassword, ...dataUser } = user;
    return dataUser;
  }

  async updatePatch(
    id: number,
    data: UpdatePatchUserDto,
  ): Promise<Omit<User, 'password'>> {
    await this.isExists(id);

    if (data.password) {
      data.password = await this.generatePasswordHash(data.password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password: newPassword, ...dataUser } = user;
    return dataUser;
  }

  async delete(id: number) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async isExists(id: number) {
    const isExists = await this.prisma.user.count({ where: { id } });
    if (isExists === 0) throw new NotFoundException('User not found.');
  }

  private async generatePasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
