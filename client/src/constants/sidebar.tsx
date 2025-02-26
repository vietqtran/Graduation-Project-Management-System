import DashboardIcon from '@/components/icons/DashboardIcon'
import { HugeiconsDocumentAttachment } from '@/components/icons/DocumentIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import ProjectIcon from '@/components/icons/ProjectIcon'
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
    href: '/management/students',
    label: 'Student Management',
    icon: <Users />
  },
  {
    href: '/management/teachers',
    label: 'Teachers Management',
    icon: <Users />
  }
  // {
  //   href: '/idea/idea-list',
  //   label: 'Idea',
  //   icon: <IdeaIcon />
  // },
  // {
  //   href: '/submit-topic',
  //   label: 'Submit Topic',
  //   icon: <SubmitTopicIcon />
  // },
  // {
  //   href: '/groups',
  //   label: 'Manage Groups',
  //   icon: <ManageGroupsIcon />
  // },
  // {
  //   href: '/assign-tasks',
  //   label: 'Assign Tasks',
  //   icon: <AssignTaskIcon />
  // }
]
