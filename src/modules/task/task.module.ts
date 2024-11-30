import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [PrismaModule, UserModule, AuthModule],
})
export class TaskModule {}
