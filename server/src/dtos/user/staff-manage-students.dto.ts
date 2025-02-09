import { USER_STATUS } from "@/constants/status";
import { processSortObject, SortObject } from "@/helpers/sort-helper";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNumber, IsObject, IsOptional, IsString, Matches, Max, Min, ValidateNested } from "class-validator";

const validFields = ['display_name', 'email', 'code'];

export class GetListStudentsDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    display_name?: string;

    @IsOptional()
    @IsString({ message: 'Email must be a string' })
    email?: string;

    @IsOptional()
    is_leader?: boolean;

    @IsOptional()
    @IsEnum(USER_STATUS, { message: 'Invalid role' })
    status?: number;

    @IsOptional()
    @Matches(/^[A-Z0-9]+$/, { message: 'Code can only contain uppercase letters and numbers' })
    @IsString({ message: 'Code must be a string' })
    code?: string;

    @IsOptional()
    @IsMongoId({ message: 'Invalid Campus ID format' })
    campus?: string;

    @IsOptional()
    @IsMongoId({ message: 'Invalid Field ID format' })
    field?: [string];

    @IsOptional()
    @IsMongoId({ message: 'Invalid Major ID format' })
    major?: [string];

    @IsOptional()
    @IsString({ message: 'Project name must be a string' })
    project_name?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Page must be a number' })
    @Min(1, { message: 'Page must be at least 1' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Limit must be a number' })
    @Min(1, { message: 'Limit must be at least 1' })
    @Max(100, { message: 'Limit cannot exceed 100' })
    limit?: number = 10;

    //a object to store sort options (suitable for sort by mongoose)
    @IsOptional()
    @IsObject({ message: 'Sort must be an object' })
    @ValidateNested()
    @Type(() => Object)
    @Transform(({ value }) => processSortObject(value, { created_at: -1 }, validFields)) // ✅ Xử lý `sort` trước khi vào service
    sort?: SortObject;



}