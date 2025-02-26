import AssignTaskIcon from '@/components/icons/AssignTaskIcon'
import DashboardIcon from '@/components/icons/DashboardIcon'
import { HugeiconsDocumentAttachment } from '@/components/icons/DocumentIcon'
import ManageGroupsIcon from '@/components/icons/ManageGroupsIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import ProjectIcon from '@/components/icons/ProjectIcon'
import IdeaIcon from '@/components/icons/ReviewIdeaIcon'
import SubmitTopicIcon from '@/components/icons/SubmitTopicIcon'
import TaskIcon from '@/components/icons/TaskIcon'
import TimetableIcon from '@/components/icons/TimetableIcon'
import { Users } from 'lucide-react'
export const SIDEBAR_LINKS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <DashboardIcon />
  },
  {
    href: '/project',
    label: 'Project',
    icon: <ProjectIcon />
  },
  {
    href: '/documents',
    label: 'Documents',
    icon: <HugeiconsDocumentAttachment />
  },
  {
    href: '/timetable',
    label: 'Timetable',
    icon: <TimetableIcon />
  },
  {
    href: '/messages',
    label: 'Message',
    icon: <MessageIcon />
  },
  {
    href: '/tasks',
    label: 'Tasks',
    icon: <TaskIcon />
  },
  {
    href: '/idea/idea-list',
    label: 'Idea',
    icon: <IdeaIcon />
  },
  {
    href: '/topic',
    label: 'Submit Topic',
    icon: <SubmitTopicIcon />
  },
  {
    href: '/groups',
    label: 'Manage Groups',
    icon: <ManageGroupsIcon />
  },
  {
    href: '/assign-tasks',
    label: 'Assign Tasks',
    icon: <AssignTaskIcon />
  },
  {
    href: '/management/teachers',
    label: 'Teachers Management',
    icon: <Users />
  },
  {
    href: '/management/students',
    label: 'Student Management',
    icon: <Users />
  },
]
