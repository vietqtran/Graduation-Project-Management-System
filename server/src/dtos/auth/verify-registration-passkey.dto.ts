import { RegistrationResponseJSON } from '@simplewebauthn/types'

export interface VerifyRegistrationPasskeyDto {
  email: string
  device_id: string
  device: string
  response: RegistrationResponseJSON
  challenge: string
}
