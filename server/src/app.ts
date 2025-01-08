import 'reflect-metadata'
import express, { Application } from 'express'
import RouteList from 'route-list'
import connect from './database'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Container } from 'typedi'
import { useContainer as useContainerRoutingControllers } from 'routing-controllers'
import { authRoutes, userRoutes } from './routes'
import { AuthService } from './services/auth.service'
import AccountModel from './models/account.model'

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.configureContainer()
    this.connectdb()
    this.initializeMiddlewares()
    this.initializeSwagger()
    this.initializeRoutes()
  }

  private configureContainer(): void {
    useContainerRoutingControllers(Container)
    Container.set(AuthService, AuthService)
    Container.set('AccountModel', AccountModel)
  }

  private connectdb(): void {
    connect()
  }

  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: '*'
      })
    )
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeSwagger(): void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'REST API Docs',
          version: '1.0.0'
        }
      },
      apis: ['./src/routes/*.ts', './src/models/*.ts']
    }

    const swaggerSpec = swaggerJSDoc(swaggerOptions)
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  }

  private initializeRoutes(): void {
    this.app.use('/api/users', userRoutes)
    this.app.use('/api/auth', authRoutes)
    const routesMap = RouteList.getRoutes(this.app, 'express')
    RouteList.printRoutes(routesMap)
  }
}

export default new App().app
