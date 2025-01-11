import { authRoutes, userRoutes } from './routes'
import express, { Application } from 'express'

import { PassportConfig } from './configs/passport.config'
import RouteList from 'route-list'
import connect from './database'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.app.use(cookieParser())
    this.connectDb()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializePassport()
  }

  private connectDb(): void {
    connect()
  }

  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true
      })
    )
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET ?? 'session_secret',
        resave: false,
        saveUninitialized: false
      })
    )
  }

  private initializePassport(): void {
    new PassportConfig()
    this.app.use(passport.initialize())
    this.app.use(passport.session())
  }

  private initializeRoutes(): void {
    this.app.use('/api/users', userRoutes)
    this.app.use('/api/auth', authRoutes)
    const routesMap = RouteList.getRoutes(this.app, 'express')
    RouteList.printRoutes(routesMap)
  }
}

export default new App().app
