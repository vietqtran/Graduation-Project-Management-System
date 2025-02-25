import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { RequestStatus } from '@/constants/request-status.enum';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  to_user: string;  

  @IsString()
  @IsNotEmpty()
  from_user: string;  

  @IsEnum(RequestStatus)
  status: RequestStatus = RequestStatus.PENDING;  

  @IsString()
  @IsNotEmpty()
  type: string;  

  @IsString()
  remark?: string;  
}
