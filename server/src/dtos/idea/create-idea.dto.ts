import { IsArray, IsMongoId, IsString, IsOptional, MinLength, ArrayNotEmpty } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  @MinLength(3, {
    message: 'Project name must be at least 3 characters long.',
  })
  name: string;

  @IsString()
  @MinLength(10, {
    message: 'Description must be at least 10 characters long.',
  })
  description: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'At least one major must be selected.' })
  @IsMongoId({ each: true, message: 'Each major must be a valid MongoDB ID.' })
  major: string[];

  @IsArray()
  @ArrayNotEmpty({ message: 'At least one field must be selected.' })
  @IsMongoId({ each: true, message: 'Each field must be a valid MongoDB ID.' })
  field: string[];

  @IsMongoId()
  campus: string;

  @IsMongoId()
  leader: string;

  @ArrayNotEmpty({ message: 'At least one member must be selected.' })
  @IsMongoId({ each: true })
  @IsArray()
  members: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true ,  message: 'Each supervisor must be a valid MongoDB ID.' })
  supervisor: string[];
}