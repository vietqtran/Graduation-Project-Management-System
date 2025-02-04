import { IsNotEmpty, IsString, IsEnum, MaxLength, IsMongoId, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateParameterDto {
    @IsNotEmpty({ message: 'Parameter name is required' })
    @IsString({ message: 'Parameter name must be a string' })
    param_name: string;

    @IsNotEmpty({ message: 'Parameter value is required' })
    @IsString({ message: 'Parameter value must be a string' })
    param_value: string;

    @IsNotEmpty({ message: 'Parameter type is required' })
    @IsEnum(['string', 'number', 'boolean', 'date'], { message: '{VALUE} is not a valid parameter type' })
    param_type: 'string' | 'number' | 'boolean' | 'date';

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
    description?: string;

}

export class UpdateParameterDto {
    @IsNotEmpty({ message: 'Parameter ID is required' })
    @IsMongoId({ message: 'Invalid Parameter ID format' })
    _id: string;

    //không sửa name

    @IsNotEmpty({ message: 'Parameter value is required' })
    @IsString({ message: 'Parameter value must be a string' })
    param_value: string;

    @IsNotEmpty({ message: 'Parameter type is required' })
    @IsEnum(['string', 'number', 'boolean', 'date'], { message: '{VALUE} is not a valid parameter type' })
    param_type: 'string' | 'number' | 'boolean' | 'date';

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
    description?: string;
}

export class DeleteParameterDto {
    @IsNotEmpty({ message: 'Parameter ID is required' })
    @IsMongoId({ message: 'Invalid Parameter ID format' })
    _id: string;
}
