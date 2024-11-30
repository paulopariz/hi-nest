import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task-create.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UserAuth } from '../../common/decorators/user.decorator';
import { User } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() data: CreateTaskDto, @UserAuth() user: User) {
    return this.taskService.create(data, user.id);
  }

  @Get()
  async getAll(@UserAuth() user: User) {
    return this.taskService.getAll(user.id);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number, @UserAuth() user: User) {
    return this.taskService.getById(id, user.id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @UserAuth() user: User) {
    await this.taskService.delete(id, user.id);
    return { ok: true };
  }
}
