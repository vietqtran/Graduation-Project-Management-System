import { Newspaper, Users } from 'lucide-react'

import AssignTaskIcon from '@/components/icons/AssignTaskIcon'
import CreateIdeaIcon from '@/components/icons/CreateIdeaIcon'
import DashboardIcon from '@/components/icons/DashboardIcon'
import { HugeiconsDocumentAttachment } from '@/components/icons/DocumentIcon'
import IdeaIcon from '@/components/icons/ReviewIdeaIcon'
import ListSupervisorIcon from '@/components/icons/ListSupervisorIcon'
import ManageGroupsIcon from '@/components/icons/ManageGroupsIcon'
import MyRequestIcon from '@/components/icons/MyRequestIcon'
import ProjectIcon from '@/components/icons/ProjectIcon'
import SubmitTopicIcon from '@/components/icons/SubmitTopicIcon'
import TaskIcon from '@/components/icons/TaskIcon'
import TeamIcon from '@/components/icons/TeamIcon'

export const SIDEBAR_LINKS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    roles: ['student', 'supervisor', 'admin', 'supervisor', 'staff']
  },
  {
    href: '/project',
    label: 'Project',
    icon: <ProjectIcon />,
    roles: ['student', 'supervisor']
  },
  {
    href: '/news',
    label: 'News Center',
    icon: <Newspaper />
  },
  {
    href: '/documents',
    label: 'Documents',
    icon: <HugeiconsDocumentAttachment />,
    roles: ['student', 'supervisor', 'admin', 'supervisor', 'staff']
  },
  {
    href: '/tasks',
    label: 'Tasks',
    icon: <TaskIcon />,
    roles: ['student', 'supervisor']
  },
  {
    href: '/idea',
    label: 'Idea',
    icon: <IdeaIcon />,
    roles: ['student', 'supervisor']
  },
  {
    href: '/topic',
    label: 'Submit Topic',
    icon: <SubmitTopicIcon />,
    roles: ['student', 'supervisor']
  },
  {
    href: '/groups',
    label: 'Manage Groups',
    icon: <ManageGroupsIcon />,
    roles: ['supervisor']
  },
  {
    href: '/assign-requests',
    label: 'Assign Request',
    icon: <AssignTaskIcon />,
    roles: ['supervisor']
  },
  {
    href: '/management/deadlines',
    label: 'Deadlines Management',
    icon: <Users />,
    roles: ['admin', 'staff']
  },
  {
    href: '/management/students',
    label: 'Student Management',
    icon: <Users />,
    roles: ['admin', 'staff']
  },
  {
    href: '/management/teachers',
    label: 'Teachers Management',
    icon: <Users />,
    roles: ['admin', 'staff']
  },
  {
    href: '/management/projects',
    label: 'Projects Management',
    icon: <Users />,
    roles: ['admin', 'staff']
  },
  {
    href: '/management/news',
    label: 'News Management',
    icon: <Newspaper />
  },
  {
    href: '/create-idea',
    label: 'Create Idea',
    icon: <CreateIdeaIcon />,
    roles: ['student']
  },
  {
    href: '/team',
    label: 'Team',
    icon: <TeamIcon />,
    roles: ['student', 'supervisor']
  },
  {
    href: '/my-request',
    label: 'My Request',
    icon: <MyRequestIcon />,
    roles: ['supervisor', 'student']
  },
  {
    href: '/list-supervisor',
    label: 'List Supervisors',
    icon: <ListSupervisorIcon />,
    roles: ['student']
  },
  {
    href: '/list-idea-supervisor',
    label: 'List Idea Supervisors',
    icon: <ListSupervisorIcon />,
    roles: ['student']
  }
]
