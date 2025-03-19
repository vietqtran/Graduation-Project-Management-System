import { STUDENT_INQUIRY_STATUS } from '@/constants/status'
import { processSortObject, SortObject } from '@/helpers/sort-helper'
import { Transform, Type } from 'class-transformer'
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator'

export class StaffAnswerStudentInquiryDto {
  @IsNotEmpty({ message: 'Inquiry ID is required' })
  @IsMongoId({ message: 'Invalid Inquiry ID format' })
  _id: string

  @IsNotEmpty({ message: 'Answer is required' })
  @IsString({ message: 'Answer must be a string' })
  answer: string
}

const validFields = ['created_at', 'updated_at']
export class StaffGetListStudentInquiriesDto {
  @IsOptional()
  @IsEnum(STUDENT_INQUIRY_STATUS, { message: 'Invalid status' })
  status?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10

  //a object to store sort options (suitable for sort by mongoose)
  @IsOptional()
  @IsObject({ message: 'Sort must be an object' })
  @ValidateNested()
  @Type(() => Object)
  @Transform(({ value }) => processSortObject(value, { created_at: -1 }, validFields)) // ✅ Xử lý `sort` trước khi vào service
  sort?: SortObject
}
