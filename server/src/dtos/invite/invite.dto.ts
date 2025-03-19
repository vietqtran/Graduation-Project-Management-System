import { IsMongoId, IsString, IsEnum, IsNotEmpty, IsEmail } from 'class-validator'
import { InviteStatus } from '@/constants/invite-status-enum'

export class InviteDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ each: true, message: 'Sender user must be a valid MongoDB ID.' })
  from_user: string

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  to_user: string

  @IsNotEmpty()
  @IsString()
  @IsMongoId({ each: true, message: 'Project must be a valid MongoDB ID.' })
  project: string

  @IsEnum(InviteStatus)
  status: InviteStatus = InviteStatus.PENDING
}
