import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string

  @IsString()
  username: string

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is $constraint1 characters.'
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one letter and one number.'
  })
  password: string
}
