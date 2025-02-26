import { authRoutes } from './auth.route'
import { deadlineRoutes } from './deadline.route'
import { documentRoutes } from './document.route'
import { manageUserRoutes } from './manage-users.route'
import { parameterRoutes } from './parameter.route'
import { requestRoutes } from './request.route'
import { projectRoutes } from './project.route'
import { publicRoutes } from './public.route'
import { s3Routes } from './s3.route'
import { userRoutes } from './user.route'
import { ideaRoutes } from './idea.route'
import { taskRoutes } from './task.route'

const routes = {
  authRoutes,
  userRoutes,
  deadlineRoutes,
  parameterRoutes,
  requestRoutes,
  projectRoutes,
  s3Routes,
  manageUserRoutes,
  publicRoutes,
  documentRoutes,
  ideaRoutes,
  taskRoutes
}

export default routes
