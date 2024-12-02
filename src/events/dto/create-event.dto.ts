import { IsArray, IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(1, { message: 'title cannot be empty' })
  title: string;

  @IsString()
  @MinLength(1, { message: 'description cannot be empty' })
  description: string;

  @IsString()
  city: string;
  @IsArray()
  @IsMongoId({ each: true })
  members: string[];
}
