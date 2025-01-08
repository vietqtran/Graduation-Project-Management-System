import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class SignUpDto {
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string

  @IsString()
  @MaxLength(50, { message: 'Email must not exceed 50 characters' })
  username: string

  @IsString()
  @MaxLength(50, { message: 'Email must not exceed 50 characters' })
  first_name: string

  @IsString()
  @MaxLength(50, { message: 'Email must not exceed 50 characters' })
  last_name: string

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is $constraint1 characters.'
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one letter and one number.'
  })
  password: string

  @IsString()
  device_id: string

  @IsString()
  device: string
}
