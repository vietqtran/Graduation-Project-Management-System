import { PROJECT_STATUS } from "@/constants/status";
import { processSortObject, SortObject } from "@/helpers/sort-helper";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNumber, IsObject, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

const validProjectFields = ['name', 'mark', 'slow_count', 'created_at'];

export class StaffGetListProjectsDto {
  @IsOptional()
  @IsString({ message: 'Project name must be a string' })
  name?: string;

  @IsOptional()
  @IsMongoId({ message: 'Invalid major ID format' })
  major?: string;

  @IsOptional()
  @IsMongoId({ message: 'Invalid field ID format' })
  field?: string;

  @IsOptional()
  @IsMongoId({ message: 'Invalid campus ID format' })
  campus?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Mark must be a number' })
  mark?: number;

  @IsOptional()
  @IsEnum([1, 2], { message: 'Category must be either 1 (student topic) or 2 (lecturer topic)' })
  category?: 1 | 2;

  @IsOptional()
  @IsEnum(PROJECT_STATUS, { message: 'Invalid project status' })
  status?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Stage must be a number' })
  stage?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Slow count must be a number' })
  slow_count?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Number of members must be a number' })
  noMembers?: number;

  @IsOptional()
  @IsMongoId( {message: "Invalid supervior ID format"})
  supervisor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
//   @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number = 10;

  @IsOptional()
  @IsObject({ message: 'Sort must be an object' })
  @ValidateNested()
  @Transform(({ value }) => processSortObject(value, { created_at: -1 }, validProjectFields))
  sort?: SortObject;
}
