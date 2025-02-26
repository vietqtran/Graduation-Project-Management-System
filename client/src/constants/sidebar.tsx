import DashboardIcon from '@/components/icons/DashboardIcon'
import { HugeiconsDocumentAttachment } from '@/components/icons/DocumentIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import ProjectIcon from '@/components/icons/ProjectIcon'
import IdeaIcon from '@/components/icons/ReviewIdeaIcon'
import TaskIcon from '@/components/icons/TaskIcon'
import TimetableIcon from '@/components/icons/TimetableIcon'
import CreateIdeaIcon from '@/components/icons/CreateIdeaIcon'
import TeamIcon from '@/components/icons/TeamIcon'
import ListIdeaOfSupervisorIcon from '@/components/icons/ListIdeaOfSupervisor'
import ListSupervisorIcon from '@/components/icons/ListSupervisorIcon'
import MyRequestIcon from '@/components/icons/MyRequestIcon'
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
  }
]

export const TEACHER_SIDEBAR_LINKS = [
  {
    href: '/idea/idea-list',
    label: 'Idea',
    icon: <IdeaIcon />
  },
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
 
