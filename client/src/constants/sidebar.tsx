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
import { ChartNoAxesGantt, FolderKanban, Newspaper, User, Users } from 'lucide-react'
import CreateIdeaIcon from '@/components/icons/CreateIdeaIcon'
import TeamIcon from '@/components/icons/TeamIcon'
import MyRequestIcon from '@/components/icons/MyRequestIcon'
import ListIdeaSupervisorIcon from '@/components/icons/ListIdeaSupervisorIcon'
import ListSupervisorIcon from '@/components/icons/ListSupervisorIcon'
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
    href: '/news',
    label: 'News Center',
    icon: <Newspaper />
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
    href: '/idea',
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
    href: '/assign-requests',
    label: 'Assign Request',
    icon: <AssignTaskIcon />
  },
  {
    href: '/management/deadlines',
    label: 'Deadlines Management',
    icon: <ChartNoAxesGantt />
  },
  {
    href: '/management/students',
    label: 'Student Management',
    icon: <User />
  },
  {
    href: '/management/teachers',
    label: 'Teachers Management',
    icon: <Users />
  },
  {
    href: '/management/projects',
    label: 'Projects Management',
    icon: <FolderKanban />
  },
  {
    href: '/management/news',
    label: 'News Management',
    icon: <Newspaper />
  },
  {
    href: '/create-idea',
    label: 'Create Idea',
    icon: <CreateIdeaIcon />
  },
  {
    href: '/team',
    label: 'Team',
    icon: <TeamIcon />
  },
  {
    href: '/my-request',
    label: 'My Request',
    icon: <MyRequestIcon />
  },
  {
    href: '/list-idea-supervisor',
    label: 'List Idea Supervisor',
    icon: <ListIdeaSupervisorIcon />
  },
  {
    href: '/list-supervisor',
    label: 'List Supervisor',
    icon: <ListSupervisorIcon />
  }
]
