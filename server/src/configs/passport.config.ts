import { AuthService } from '../services/auth.service'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import passport from 'passport'

export class PassportConfig {
  private readonly authService: AuthService

  constructor() {
    this.authService = new AuthService()
    this.initializePassport()
  }

  private initializePassport(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: 'http://localhost:5000/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = profile
            console.log(user)
            return done(null, user)
          } catch (error) {
            return done(error as Error, undefined)
          }
        }
      )
    )

    passport.serializeUser((user, done) => {
      done(null, user)
    })

    passport.deserializeUser((user, done) => {
      done(null, user as Express.User)
    })
  }
}
