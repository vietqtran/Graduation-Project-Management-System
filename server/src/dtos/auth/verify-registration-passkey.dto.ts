import { RegistrationResponseJSON } from '@simplewebauthn/types'

export interface VerifyRegistrationPasskeyDto {
  response: RegistrationResponseJSON
  challenge: string
}
