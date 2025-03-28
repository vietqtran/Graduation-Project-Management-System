import { STUDENT_INQUIRY_STATUS } from '@/constants/status'
import { processSortObject, SortObject } from '@/helpers/sort-helper'
import { Transform, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator'

export class StudentCreateInquiryDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string
}

const validFields = ['created_at', 'answered_at']

export class StudentGetListInquiriesDto {
  @IsOptional()
  @IsEnum(STUDENT_INQUIRY_STATUS, { message: 'Invalid status' })
  status?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  //   @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number = 10

  //a object to store sort options (suitable for sort by mongoose)
  @IsOptional()
  @IsObject({ message: 'Sort must be an object' })
  @ValidateNested()
  @Transform(({ value }) => processSortObject(value, { created_at: -1 }, validFields)) // ✅ Xử lý `sort` trước khi vào service
  sort?: SortObject
}
