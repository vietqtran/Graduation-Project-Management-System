'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, Building, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Project } from '@/types/project.type'
import { useRouter } from 'next/navigation'

interface ProjectListProps {
  projects: Project[]
}

const getStatusText = (status: number) => {
  const statusMap: Record<number, { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    1: { text: 'Required', variant: 'secondary' },
    2: { text: 'Waiting', variant: 'secondary' },
    3: { text: 'Pending', variant: 'secondary' },
    4: { text: 'Rejected', variant: 'destructive' },
    5: { text: 'Closed', variant: 'destructive' },
    6: { text: 'Expired', variant: 'destructive' },
    7: { text: 'Registered', variant: 'secondary' },
    8: { text: 'Activated', variant: 'default' },
    9: { text: 'Processing', variant: 'secondary' },
    10: { text: 'Completed', variant: 'default' },
    11: { text: 'Matched', variant: 'default' },
    12: { text: 'Unmatched', variant: 'secondary' },
    14: { text: 'Scheduled', variant: 'secondary' },
    15: { text: 'Draft', variant: 'secondary' },
    16: { text: 'Submitted', variant: 'secondary' },
    17: { text: 'Approved', variant: 'default' },
    18: { text: 'Cancelled', variant: 'destructive' },
    19: { text: 'Blocked', variant: 'destructive' },
    20: { text: 'Inactive', variant: 'secondary' },
    21: { text: 'Ungrouped', variant: 'secondary' },
    22: { text: 'Available', variant: 'default' },
    23: { text: 'Pass', variant: 'default' },
    24: { text: 'Failed', variant: 'destructive' },
    26: { text: 'Topic', variant: 'secondary' }
  }

  if (statusMap[status]) return statusMap[status]
  return { text: 'Unknown', variant: 'secondary' }
}

export default function ProjectList({ projects }: Readonly<ProjectListProps>) {
  const router = useRouter()

  const handleProjectClick = (id: string) => {
    router.push(`/project/${id}`)
  }

  return (
    <div className='grid gap-6 p-5 md:grid-cols-2 lg:grid-cols-3'>
      {(projects.list ?? projects)?.map((project) => (
        <Card
          key={project._id}
          className='cursor-pointer hover:shadow-md transition-shadow'
          onClick={() => handleProjectClick(project._id)}
        >
          <CardHeader>
            <div className='flex justify-between items-start'>
              <CardTitle className='text-xl'>{project.name}</CardTitle>
              <Badge
                variant={getStatusText(project.status).variant as 'default' | 'secondary' | 'destructive' | 'outline'}
              >
                {getStatusText(project.status).text}
              </Badge>
            </div>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>
                {project.members.length} member{project.members.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <BookOpen className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>
                {project.field.map((f) => f.name).join(', ')} - {project.major.map((m) => m.name).join(', ')}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <Building className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{project.campus.name}</span>
            </div>

            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col items-start gap-3'>
            <div className='w-full'>
              <p className='text-sm font-medium mb-2'>Team Leader</p>
              <div className='flex items-center gap-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={project?.leader?.avatar} alt={project?.leader?.display_name} />
                  <AvatarFallback>
                    {project?.leader?.first_name[0]}
                    {project?.leader?.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm'>{project?.leader?.display_name}</span>
              </div>
            </div>

            {project?.supervisor?.length > 0 && (
              <div className='w-full'>
                <p className='text-sm font-medium mb-2'>Supervisor</p>
                <div className='flex items-center gap-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={project.supervisor[0].avatar} alt={project.supervisor[0].display_name} />
                    <AvatarFallback>
                      {project?.supervisor[0]?.first_name}
                      {project?.supervisor[0]?.last_name}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm'>{project.supervisor[0].display_name}</span>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
