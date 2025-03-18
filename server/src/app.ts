import 'reflect-metadata'

import express, { Application, NextFunction, Request, Response } from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'

import { PassportConfig } from './configs/passport.config'
import RouteList from 'route-list'
import { authMiddleware } from './middlewares/authorization.middleware'
import connect from './database'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from './middlewares/response-handler.middleware'
import passport from 'passport'
import routes from './routes'
import session from 'express-session'

class App {
  public app: Application
  public server: http.Server
  public io: SocketIOServer

  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
      }
    })

    this.app.use(cookieParser())
    this.connectDb()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializePassport()
    this.initializeSocketIO()
    this.app.use(errorHandler)
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
    this.app.use('/api/public', routes.publicRoutes)
    this.app.use('/api/users', routes.userRoutes)
    this.app.use('/api/auth', routes.authRoutes)
    this.app.use(authMiddleware())
    this.app.use('/api/upload', routes.s3Routes)
    this.app.use('/api/deadline', routes.deadlineRoutes)
    this.app.use('/api/parameter', routes.parameterRoutes)
    this.app.use('/api/request', routes.requestRoutes)
    this.app.use('/api/project', routes.projectRoutes)
    this.app.use('/api/manage-users', routes.manageUserRoutes)
    this.app.use('/api/documents', routes.documentRoutes)
    this.app.use('/api/ideas', routes.ideaRoutes)
    this.app.use('/api/board', routes.taskRoutes)
    this.app.use('/api/invite', routes.inviteRoutes)
    this.app.use('/api/supervisor', routes.supervisorRoutes)
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const error = new Error(`Cannot ${req.method} ${req.originalUrl}`)
      ;(error as any).statusCode = 404
      next(error)
    })

    const routesMap = RouteList.getRoutes(this.app, 'express')

    RouteList.printRoutes(routesMap)
  }

  private initializeSocketIO(): void {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      socket.on('join-board', (projectId: string) => {
        socket.join(`board-${projectId}`)
        console.log(`User ${socket.id} joined board: ${projectId}`)
      })

      socket.on('leave-board', (projectId: string) => {
        socket.leave(`board-${projectId}`)
        console.log(`User ${socket.id} left board: ${projectId}`)
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
    })

    // Make io accessible globally
    this.app.set('io', this.io)
  }
}

export default new App().server
