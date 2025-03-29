// TaskComponent.jsx

import React, { memo } from 'react'
import { Task, TaskLabel } from '@/types/task.type'

import AvatarGroup from '@/components/ui/avatar-group'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'
import FileIcon from '@/components/icons/FileIcon'
import { User } from '@/types/user.type'
import { format } from 'date-fns'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'

interface TaskProps {
  task: Task
  index: number
  onUpdate: () => void
  onOpen: (taskId: string) => void // To open the drawer
  isEditing: boolean
  isViewOnly?: boolean
}

const TaskComponent: React.FC<TaskProps> = ({ task, index, onUpdate, onOpen, isEditing = false, isViewOnly }) => {
  const handleToggleComplete = async () => {
    if (isViewOnly) {
      toast.error('You are supervisor, you just have view permission')
      return
    }
    try {
      await instance.patch(`/board/tasks/${task._id}`, { is_completed: !task.is_completed }, { withCredentials: true })
      onUpdate()
    } catch (error) {
      console.error('Failed to update task completion status', error)
    }
  }

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpen(task._id)} // Trigger drawer
          style={{
            ...provided.draggableProps.style,
            rotate: snapshot.isDragging ? '3deg' : '0deg'
          }}
          className={`bg-background shadow-md border rounded-lg select-none ${
            snapshot.isDragging
              ? 'shadow-xl rotate-3 cursor-grabbing bg-white ring-2 ring-blue-500 z-[9999]'
              : 'cursor-grab hover:bg-neutral-50'
          } transition-colors duration-200 ${isEditing ? 'border-2 border-blue-500' : ''}`}
        >
          <div className='flex flex-col'>
            <div className='p-2 flex items-start flex-col gap-2'>
              <div onClick={(e) => e.stopPropagation()} className='flex items-center justify-start w-full'>
                <Checkbox
                  checked={task.is_completed}
                  onCheckedChange={handleToggleComplete}
                  onClick={(e) => e.stopPropagation()}
                  className='mr-2'
                />
                {task.is_completed && <span className='text-sm text-muted-foreground'>Completed</span>}
                {!task.is_completed && <span className='text-sm text-muted-foreground'>Not Completed</span>}
              </div>
              <div>
                {task.priority === 'low' && (
                  <Badge className='bg-green-500' variant='default'>
                    Low
                  </Badge>
                )}
                {task.priority === 'medium' && (
                  <Badge className='bg-yellow-500' variant='default'>
                    Medium
                  </Badge>
                )}
                {task.priority === 'high' && (
                  <Badge className='bg-red-500' variant='default'>
                    High
                  </Badge>
                )}
                {task.priority === 'urgent' && (
                  <Badge className='bg-red-500' variant='default'>
                    Urgent
                  </Badge>
                )}
              </div>
              <p className={`text-sm max-w-full break-all ${task.is_completed ? 'line-through text-destructive' : ''}`}>
                {task.name}
              </p>
              {(task.start_date || task.due_date) && (
                <div className='flex items-center gap-4 w-full text-xs text-muted-foreground'>
                  {task.start_date && (
                    <div className='flex items-center gap-1'>
                      <CalendarIcon className='h-3 w-3' />
                      <span>Start: {format(new Date(task.start_date), 'MMM dd')}</span>
                    </div>
                  )}
                  {task.due_date && (
                    <div className='flex items-center gap-1'>
                      <CalendarIcon className='h-3 w-3' />
                      <span>Due: {format(new Date(task.due_date), 'MMM dd')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {task.labels.length > 0 && (
              <div className='p-2'>
                <div className='flex items-center justify-start gap-2 flex-wrap'>
                  {task.labels.map((label: TaskLabel, idx) => (
                    <Badge key={idx} variant='secondary' style={{ backgroundColor: label.color }}>
                      {label.text}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {task.documents.length > 0 ||
              (task.assignees.length > 0 && (
                <div className='gap-1 flex flex-col p-2 border-t'>
                  {task.documents.length > 0 && (
                    <div className='flex flex-wrap justify-start items-center gap-y-1 gap-x-2'>
                      {task.documents.length > 0 && (
                        <div className='flex gap-1 items-center'>
                          <FileIcon />
                          <span className='text-sm'>{task.documents.length}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {task.assignees.length > 0 && (
                    <div className='flex justify-end'>
                      <AvatarGroup
                        className='size-6'
                        avatars={task.assignees.map((assignee: User) => ({
                          src: assignee.avatar ?? 'https://avatar.iran.liara.run/public/boy',
                          alt: assignee.username
                        }))}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default memo(TaskComponent)
