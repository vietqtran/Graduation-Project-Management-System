// src/components/ui/AddTask.tsx

import React, { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import instance from '@/utils/axios'
import useClickOutside from '@/hooks/useClickOutside'

interface AddTaskProps {
  columnId: string
  projectId: string
  onTaskAdded: () => void
}

const AddTask: React.FC<AddTaskProps> = ({ columnId, projectId, onTaskAdded }) => {
  const [isAddTask, setIsAddTask] = useState(false)
  const [taskName, setTaskName] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const wrapperRef = useClickOutside<HTMLDivElement>(() => setIsAddTask(false))

  const handleShowInput = () => {
    setIsAddTask(true)
    setTimeout(() => ref.current?.focus(), 10)
  }

  const handleAddTask = async () => {
    if (!taskName.trim()) return
    await instance.post(
      `/board/project/${projectId}/tasks`,
      {
        name: taskName,
        project: projectId,
        column: columnId,
        type: 'task'
      },
      { withCredentials: true }
    )
    setTaskName('')
    setIsAddTask(false)
    onTaskAdded()
  }

  return (
    <div ref={wrapperRef} className='flex-shrink-0 p-2'>
      {isAddTask ? (
        <div className='flex flex-col gap-1.5'>
          <Textarea
            ref={ref}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className='bg-background resize-none'
          />
          <div className='flex items-center gap-2'>
            <Button onClick={handleAddTask} className='bg-blue-500 hover:bg-blue-600'>
              Add task
            </Button>
            <div
              onClick={() => setIsAddTask(false)}
              className='h-full rounded-lg cursor-pointer p-2 aspect-square bg-transparent hover:bg-neutral-300'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'>
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  d='M19 5L5 19M5 5l14 14'
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div
          tabIndex={0}
          onClick={handleShowInput}
          className='p-2 gap-2 rounded-lg hover:bg-neutral-100 flex items-center cursor-pointer'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'>
            <path
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              d='M12 4v16m8-8H4'
            />
          </svg>
          <span className='font-medium text-sm'>Add a task</span>
        </div>
      )}
    </div>
  )
}

export default AddTask
