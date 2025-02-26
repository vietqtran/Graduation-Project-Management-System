import { semesterRegex } from "@/constants/regex";
import { PROJECT_STATUS } from "@/constants/status";
import { getCurrentSemester } from "@/helpers/date-helper";
import { processSortObject, SortObject } from "@/helpers/sort-helper";
import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Matches, Max, MaxLength, Min, ValidateNested } from "class-validator";

const validProjectFields = ['name', 'mark', 'slow_count', 'created_at'];

export class StaffGetListProjectsDto {
  @IsOptional()
  @IsString({ message: 'Project name must be a string' })
  name?: string

  @IsOptional()
  @IsMongoId({ message: 'Invalid major ID format' })
  major?: string

  @IsOptional()
  @IsMongoId({ message: 'Invalid field ID format' })
  field?: string

  @IsOptional()
  @IsMongoId({ message: 'Invalid campus ID format' })
  campus?: string

  @IsOptional()
  @IsNumber({}, { message: 'Mark must be a number' })
  mark?: number

  @IsOptional()
  @IsEnum([1, 2], { message: 'Category must be either 1 (student topic) or 2 (lecturer topic)' })
  category?: 1 | 2

  @IsOptional()
  @IsEnum(PROJECT_STATUS, { message: 'Invalid project status' })
  status?: number

  @IsOptional()
  @IsNumber({}, { message: 'Stage must be a number' })
  stage?: number

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
  @IsString({ message: 'Semester must be a string' })
  @Matches(semesterRegex, { message: 'Invalid semester' })
  semester: string = getCurrentSemester();

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

export class StaffGetDetailProjectDto {
  @IsNotEmpty({ message: 'Project ID is required' })
  @IsMongoId({ message: 'Invalid project ID format' })
  _id?: string;
}

export class StaffUpdateProjectDto {
  @IsNotEmpty({ message: 'Project ID is required' })
  @IsMongoId({ message: 'Invalid project ID format' })
  _id: string;

  @IsNotEmpty()
  @IsString({ message: 'Project name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Project description must be a string' })
  description?: string;

  @IsArray({ message: 'Major must be an array' })
  @IsMongoId({ each: true, message: 'Invalid Major ID format' })
  major: string[]

  @IsArray({ message: 'Field must be an array' })
  @IsMongoId({ each: true, message: 'Invalid Field ID format' })
  field: string[]

  @IsNotEmpty({ message: 'Campus is required' })
  @IsMongoId({ message: 'Invalid Campus ID format' })
  campus: string

  @IsOptional()
  @IsNumber({}, { message: 'Mark must be a number' })
  mark?: number;

  @IsNotEmpty({ message: 'Category is required' })
  @IsEnum([1, 2], { message: 'Category must be either 1 (student topic) or 2 (lecturer topic)' })
  category: 1 | 2;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(PROJECT_STATUS, { message: 'Invalid project status' })
  status: number;

  @IsNotEmpty({ message: 'Stage is required' })
  @IsNumber({}, { message: 'Stage must be a number' })
  stage: number;

  @IsNotEmpty({ message: 'Slow count is required' })
  @IsNumber({}, { message: 'Slow count must be a number' })
  slow_count: number;

  @IsArray({ message: 'Members must be an array' })
  @IsMongoId({ each: true, message: 'Invalid Member ID format' })
  @ArrayMaxSize(5, { message: 'Number of members cannot exceed 5' })
  members: string[]

  @IsArray({ message: 'Supervisors must be an array' })
  @IsMongoId({ each: true, message: 'Invalid Supervisor ID format' })
  supervisor: string[]

  @IsNotEmpty({ message: 'Leader is required' })
  @IsMongoId({ message: 'Invalid Leader ID format' })
  leader: string

}
