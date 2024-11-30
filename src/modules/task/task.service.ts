import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/task-create.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskDto, ownerId: number) {
    return this.prisma.task.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

  async getAll(ownerId: number) {
    return this.prisma.task.findMany({
      where: {
        ownerId,
      },
    });
  }

  async getById(id: number, ownerId: number) {
    await this.isExists(id);

    const task = await this.prisma.task.findUnique({
      where: {
        id,
        ownerId,
      },
    });

    if (!task)
      throw new ForbiddenException('The task does not belong to this user.');

    return task;
  }

  async delete(id: number, ownerId: number) {
    await this.isExists(id);
    await this.isOwner(id, ownerId);

    await this.prisma.task.delete({
      where: {
        id,
        ownerId,
      },
    });
  }

  private async isOwner(id: number, ownerId: number) {
    const isExists = await this.prisma.task.count({ where: { id, ownerId } });

    if (isExists === 0)
      throw new ForbiddenException('The task does not belong to this user.');
  }

  private async isExists(id: number) {
    const isExists = await this.prisma.task.count({ where: { id } });
    if (isExists === 0) throw new NotFoundException('Task not found.');
  }
}
