import React, { useState } from 'react'
import { Task, TaskLabel } from '@/types/task.type'

import AvatarGroup from '@/components/ui/avatar-group'
import { Badge } from '@/components/ui/badge'
import { Draggable } from '@hello-pangea/dnd'
import FileIcon from '@/components/icons/FileIcon'
import { User } from '@/types/user.type'
import axios from 'axios'

interface TaskProps {
  task: Task
  index: number
  onUpdate: () => void
}

const TaskComponent: React.FC<TaskProps> = ({ task, index, onUpdate }) => {
  const [name, setName] = useState(task.name)

  const handleUpdate = async () => {
    await axios.put(`/api/tasks/${task._id}`, { name })
    onUpdate()
  }

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            rotate: snapshot.isDragging ? '3deg' : '0deg'
          }}
          className={`bg-background shadow-md border rounded-lg select-none ${
            snapshot.isDragging
              ? 'shadow-xl rotate-3 cursor-grabbing bg-white ring-2 ring-blue-500 z-[9999]'
              : 'cursor-grab hover:bg-neutral-50'
          } transition-colors duration-200`}
        >
          <div className='flex flex-col'>
            <div className='p-2'>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleUpdate}
                className='text-sm bg-transparent border-none outline-none w-full'
              />
              <div className='flex items-center justify-start gap-2 flex-wrap'>
                {task.labels.map((label: TaskLabel, idx) => (
                  <Badge key={idx} variant='secondary' style={{ backgroundColor: label.color }}>
                    {label.text}
                  </Badge>
                ))}
              </div>
            </div>
            <div className='gap-1 flex flex-col p-2 border-t'>
              <div className='flex flex-wrap justify-start items-center gap-y-1 gap-x-2'>
                {task.documents.length > 0 && (
                  <div className='flex gap-1 items-center'>
                    <FileIcon />
                    <span className='text-sm'>{task.documents.length}</span>
                  </div>
                )}
              </div>
              <div className='flex justify-end'>
                <AvatarGroup
                  className='size-6'
                  avatars={task.assignees.map((assignee: User) => ({
                    src: assignee.avatar ?? 'https://i.pravatar.cc/300',
                    alt: assignee.username
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default TaskComponent
