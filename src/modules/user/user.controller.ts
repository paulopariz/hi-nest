import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user-update.dto';
import { UpdatePatchUserDto } from './dto/user-update-patch.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UserAuth } from '../../common/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Query('search') search: string) {
    return this.userService.getAll(search);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@UserAuth() user: User, @Body() data: UpdateUserDto) {
    return this.userService.update(user.id, data);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateName(@UserAuth() user: User, @Body() data: UpdatePatchUserDto) {
    return this.userService.updatePatch(user.id, data);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@UserAuth() user: User) {
    await this.userService.delete(user.id);

    return { ok: true };
  }
}
