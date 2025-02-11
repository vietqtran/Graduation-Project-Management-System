import { authRoutes } from './auth.route'
import { deadlineRoutes } from './deadline.route'
import { parameterRoutes } from './parameter.route'
import { projectRoutes } from './project.route'
import { s3Routes } from './s3.route'
import { userRoutes } from './user.route'

const routes = {
  authRoutes,
  userRoutes,
  deadlineRoutes,
  parameterRoutes,
  projectRoutes,
  s3Routes
}

export default routes
