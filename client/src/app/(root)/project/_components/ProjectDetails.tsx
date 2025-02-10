import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Field } from '@/types/field.type'
import FieldBadge from '@/components/common/FieldBadge'
import LeaderStar from '@/components/common/LeaderStar'
import { Major } from '@/types/major.type'
import MajorBadge from '@/components/common/MajorBadge'
import { Project } from '@/types/project.type'
import ProjectStatusBadge from '@/components/common/ProjectStatusBadge'
import React from 'react'
import { Separator } from '@/components/ui/seperator'
import { User } from '@/types/user.type'

interface ProjectDetailsProps {
  project: Project | null
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <div className='w-full mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <div className='space-y-6'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-2xl font-bold'>{project?.name}</h1>
            <p className='text-gray-600 mt-2'>{project?.description}</p>
          </div>

          <ProjectStatusBadge status={project?.status ?? 0} />
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-6'>
          <div>
            <h2 className='text-lg font-semibold mb-3'>Project Information</h2>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Category:</span> {project?.category === 1 && 'Student'}
                {project?.category === 2 && 'Lecturer'}
              </p>
              <p>
                <span className='font-medium'>Stage:</span> {project?.stage}
              </p>
              <p>
                <span className='font-medium'>Campus:</span> {project?.campus.name}
              </p>
            </div>
          </div>

          <div>
            <h2 className='text-lg font-semibold mb-3'>Fields & Majors</h2>
            <div className='flex flex-wrap gap-2'>
              {project?.field.map((f: Field) => <FieldBadge description={f.description} name={f.name} key={f._id} />)}
              {project?.major.map((m: Major) => <MajorBadge description={m.description} name={m.name} key={m._id} />)}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className='text-lg font-semibold mb-3'>Members</h2>
          <div className='flex flex-col gap-3'>
            {project?.members.map((m: User) => (
              <div key={m._id} className='flex items-center space-x-4'>
                <Avatar className='border'>
                  <AvatarImage src={m.avatar} alt={m.display_name} />
                  <AvatarFallback>
                    {m.first_name[0]}
                    {m.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='flex items-center justify-start gap-3'>
                    <p className='font-medium'>{m.display_name}</p>
                    {m._id === project.leader._id && <LeaderStar />}
                    <div className='flex items-center gap-2'>
                      {m.field?.map((field: Field) => (
                        <FieldBadge name={field.name} description={field.description} key={field._id} />
                      ))}
                      {m.major?.map((major: Major) => (
                        <MajorBadge name={major.name} key={major._id} description={major.description} />
                      ))}
                    </div>
                  </div>
                  <p className='text-sm text-gray-600'>{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-lg font-semibold mb-3'>Supervisors</h2>
          <div className='grid grid-cols-2 gap-4'>
            {project?.supervisor.map((supervisor: User) => (
              <div key={supervisor._id} className='flex items-center space-x-4'>
                <Avatar className='border'>
                  <AvatarImage src={supervisor.avatar} alt={supervisor.display_name} />
                  <AvatarFallback>
                    {supervisor.first_name[0]}
                    {supervisor.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>{supervisor.display_name}</p>
                  <p className='text-sm text-gray-600'>{supervisor.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-gray-50 p-4 rounded-md'>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <p className='text-sm text-gray-600'>Members</p>
              <p className='text-xl font-semibold'>{project?.members.length}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Tasks</p>
              <p className='text-xl font-semibold'>{project?.tasks.length}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Slow Count</p>
              <p className='text-xl font-semibold'>{project?.slow_count}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
