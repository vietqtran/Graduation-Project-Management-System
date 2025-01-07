import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'
import { userRoutes } from './routes/user.route'
import connect from './database'

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.connectdb()
    this.initializeMiddlewares()
    this.initializeSwagger()
    this.initializeRoutes()
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
  }
}

export default new App().app
