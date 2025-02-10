import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class ApproveRequestDto {
  @IsMongoId()
  approve_user: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Remark cannot exceed 500 characters' })
  remark?: string;
}
