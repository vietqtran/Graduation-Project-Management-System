import { authRoutes, userRoutes } from './routes'
import express, { Application } from 'express'

import RouteList from 'route-list'
import connect from './database'
import cookieParser from 'cookie-parser'
import cors from 'cors'

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.app.use(cookieParser())
    this.connectdb()
    this.initializeMiddlewares()
    this.initializeRoutes()
  }

  private connectdb(): void {
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
  }

  private initializeRoutes(): void {
    this.app.use('/api/users', userRoutes)
    this.app.use('/api/auth', authRoutes)
    const routesMap = RouteList.getRoutes(this.app, 'express')
    RouteList.printRoutes(routesMap)
  }
}

export default new App().app
