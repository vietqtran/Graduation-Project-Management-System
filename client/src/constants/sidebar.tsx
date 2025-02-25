import DashboardIcon from '@/components/icons/DashboardIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import ProjectIcon from '@/components/icons/ProjectIcon'
import TaskIcon from '@/components/icons/TaskIcon'
import TimetableIcon from '@/components/icons/TimetableIcon'

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
 
