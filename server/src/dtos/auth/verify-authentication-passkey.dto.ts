import { AuthenticationResponseJSON } from '@simplewebauthn/server'

export interface VerifyAuthenticationPasskey {
  device_id: string
  device: string
  email: string
  response: AuthenticationResponseJSON
  challenge: string
}
