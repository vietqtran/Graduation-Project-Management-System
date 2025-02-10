import { authRoutes } from './auth.route'
import { deadlineRoutes } from './deadline.route'
import { parameterRoutes } from './parameter.route'
import { projectRoutes } from './project.route'
import { userRoutes } from './user.route'

const routes = {
  authRoutes,
  userRoutes,
  deadlineRoutes,
  parameterRoutes,
  projectRoutes
}

export default routes
