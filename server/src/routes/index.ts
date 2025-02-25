import { authRoutes } from './auth.route'
import { deadlineRoutes } from './deadline.route'
import { documentRoutes } from './document.route'
import { manageUserRoutes } from './manage-users.route'
import { parameterRoutes } from './parameter.route'
import { projectRoutes } from './project.route'
import { publicRoutes } from './public.route'
import { s3Routes } from './s3.route'
import { userRoutes } from './user.route'
import { ideaRoutes } from './idea.route'

const routes = {
  authRoutes,
  userRoutes,
  deadlineRoutes,
  parameterRoutes,
  projectRoutes,
  s3Routes,
  manageUserRoutes,
  publicRoutes,
  documentRoutes,
  ideaRoutes
}

export default routes
