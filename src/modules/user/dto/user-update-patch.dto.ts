import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './user-create.dto';

export class UpdatePatchUserDto extends PartialType(CreateUserDto) {}
