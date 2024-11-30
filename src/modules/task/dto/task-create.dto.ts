import {
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(100)
  description: string;
}
