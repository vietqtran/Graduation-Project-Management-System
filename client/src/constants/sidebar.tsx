import AssignTaskIcon from '@/components/icons/AssignTaskIcon'
import DashboardIcon from '@/components/icons/DashboardIcon'
import ManageGroupsIcon from '@/components/icons/ManageGroupsIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import ProjectIcon from '@/components/icons/ProjectIcon'
import ReviewIdeaIcon from '@/components/icons/ReviewIdeaIcon'
import SubmitTopicIcon from '@/components/icons/SubmitTopicIcon'
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
  }
  
]

export const TEACHER_SIDEBAR_LINKS = [
  {
    href: '/teacher/review-idea',
    label: 'Duyệt đề tài',
    icon: <ReviewIdeaIcon />
  },
  {
    href: '/teacher/submit-topic',
    label: 'Gửi đề tài',
    icon: <SubmitTopicIcon />
  },
  {
    href: '/teacher/groups',
    label: 'Quản lý nhóm',
    icon: <ManageGroupsIcon />
  },
  {
    href: '/teacher/assign-tasks',
    label: 'Giao task',
    icon: <AssignTaskIcon />
  }
]
