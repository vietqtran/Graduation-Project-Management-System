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
import ListSupervisorIcon from '@/components/icons/ListSupervisorIcon'

export const SIDEBAR_LINKS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    roles: ['user', 'student', 'lecturer', 'admin', 'supervisor', 'staff']
  },
  {
    href: '/project',
    label: 'Project Management',
    icon: <ProjectIcon />,
    roles: ['admin', 'staff']
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
    roles: ['user', 'student', 'lecturer', 'admin', 'supervisor', 'staff']
  },
  {
    href: '/timetable',
    label: 'Timetable',
    icon: <TimetableIcon />,
    roles: ['user', 'student', 'lecturer', 'admin', 'supervisor', 'staff']
  },
  {
    href: '/messages',
    label: 'Message',
    icon: <MessageIcon />,
    roles: ['user', 'student', 'lecturer', 'admin', 'supervisor', 'staff']
  },
  {
    href: '/tasks',
    label: 'Tasks',
    icon: <TaskIcon />,
    roles: ['user', 'student', 'lecturer', 'admin', 'supervisor', 'staff']
  },
  {
    href: '/idea',
    label: 'Idea',
    icon: <IdeaIcon />,
    roles: ['user', 'student', 'lecturer']
  },
  {
    href: '/topic',
    label: 'Submit Topic',
    icon: <SubmitTopicIcon />,
    roles: ['user', 'student', 'lecturer']
  },
  {
    href: '/groups',
    label: 'Manage Groups',
    icon: <ManageGroupsIcon />,
    roles: ['lecturer']
  },
  {
    href: '/assign-requests',
    label: 'Assign Request',
    icon: <AssignTaskIcon />,
    roles: ['lecturer']
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
    roles: ['user', 'student']
  },
  {
    href: '/team',
    label: 'Team',
    icon: <TeamIcon />,
    roles: ['user', 'student']
  },
  {
    href: '/change-idea',
    label: 'Change Idea',
    icon: <IdeaIcon />,
    roles: ['user', 'student']
  },
  {
    href: '/delete-idea',
    label: 'Delete Idea',
    icon: <IdeaIcon />,
    roles: ['user', 'student']
  },
  {
    href: '/invite-member',
    label: 'Invite Member',
    icon: <Users />,
    roles: ['user', 'student']
  },
  {
    href: '/my-request',
    label: 'My Request',
    icon: <MyRequestIcon />,
    roles: ['lecturer']
  },
  {
    href: '/list-supervisor',
    label: 'List Supervisors',
    icon: <ListSupervisorIcon />,
    roles: ['user', 'student']
  },
  {
    href: '/invite-supervisor',
    label: 'Invite Supervisor',
    icon: <Users />,
    roles: ['user', 'student']
  }
]
