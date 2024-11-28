import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsArray, IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsString()
  @MinLength(1, { message: 'title cannot be empty' })
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(1, { message: 'description cannot be empty' })
  @IsOptional()
  description?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  members?: string[];
}
