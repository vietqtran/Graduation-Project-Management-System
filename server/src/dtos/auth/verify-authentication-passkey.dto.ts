import { AuthenticationResponseJSON } from '@simplewebauthn/server'

export interface VerifyAuthenticationPasskey {
  response: AuthenticationResponseJSON
  challenge: string
}
