import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { RequestStatus } from '@/constants/request-status.enum';
import { IUser } from '@/models/user.model'; // Import IUser if necessary

export class UpdateRequestDto {
  @IsString()
  @IsOptional()
  title?: string;  

  @IsString()
  @IsOptional()
  remark?: string; 

  @IsString()
  @IsOptional()
  type?: string;  

  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;  

  @IsMongoId()
  @IsOptional()
  approve_user?: IUser['_id'];  
  @IsMongoId()
  @IsOptional()
  to_user?: IUser['_id']; 

  @IsMongoId()
  @IsOptional()
  from_user?: IUser['_id'];  
}
