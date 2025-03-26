// team/_components/TeamPage.tsx
'use client'
import React, { useState } from 'react'
import IdeaAndTeam from './IdeaAndTeam'
import TeamRoleStudent from './TeamRoleStudent'
import Image from 'next/image'
import { LineMdLoadingLoop } from '@/components/icons/Loading'
import useIdea from '@/hooks/useIdea'
import { useAppSelector } from '@/hooks'
import { Button } from '@/components/ui/button'

export default function TeamPage() {
  const { project, supervisorProjects, isLoading } = useIdea()
  const user = useAppSelector((state) => state.auth.user)
  const [expandedProjects, setExpandedProjects] = useState<string[]>([])

  const toggleExpand = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    )
  }

  const toggleExpandAll = (expand: boolean) => {
    if (expand) {
      setExpandedProjects(supervisorProjects.map((proj) => proj._id))
    } else {
      setExpandedProjects([])
    }
  }

  if (isLoading) {
    return (
      <div className='size-full min-h-[80vh] grid place-items-center'>
        <LineMdLoadingLoop />
      </div>
    )
  }

  if (user?.roles.includes('student')) {
    if (project) {
      return <TeamRoleStudent project={project} />
    }
    return (
      <div className='w-full flex items-center justify-center flex-col'>
        <Image width={500} height={500} src='/images/empty-box.png' alt='loading' />
        <p className='text-center text-red-600'>
          You don&apos;t have any projects yet. Search for members and create together!
        </p>
      </div>
    )
  } else if (user?.roles.includes('supervisor')) {
    if (supervisorProjects.length > 0) {
      return (
        <div className='p-6 max-w-6xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-purple-700'>My Supervised Groups</h2>
            <div className='space-x-2'>
              <Button
                onClick={() => toggleExpandAll(true)}
                className='border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white bg-transparent'
              >
                Expand All
              </Button>
              <Button
                onClick={() => toggleExpandAll(false)}
                className='border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white bg-transparent'
              >
                Collapse All
              </Button>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-6'>
            {supervisorProjects.map((proj) => (
              <div key={proj._id} className='w-full'>
                <IdeaAndTeam
                  project={proj}
                  isExpanded={expandedProjects.includes(proj._id)}
                  onToggleExpand={() => toggleExpand(proj._id)}
                />
              </div>
            ))}
          </div>
        </div>
      )
    }
    return (
      <div className='w-full flex items-center justify-center flex-col'>
        <Image width={500} height={500} src='/images/empty-box.png' alt='loading' />
        <p className='text-center text-red-600'>You are not supervising any projects yet.</p>
      </div>
    )
  }

  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <p className='text-center text-red-600'>User role not recognized.</p>
    </div>
  )
}
