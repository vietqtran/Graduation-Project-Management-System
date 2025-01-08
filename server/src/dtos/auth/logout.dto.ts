import { IsString } from 'class-validator'

export class LogoutDto {
  @IsString()
  device_id: string

  @IsString()
  user_id: string
}
