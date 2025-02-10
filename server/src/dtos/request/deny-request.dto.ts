import { IsMongoId, IsString, MaxLength } from 'class-validator';

export class DenyRequestDto {
  @IsMongoId()
  approve_user: string;

  @IsString()
  @MaxLength(500, { message: 'Remark cannot exceed 500 characters' })
  remark: string;
}
