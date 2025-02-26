import React, { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Draggable } from '@hello-pangea/dnd'
import { Input } from '@/components/ui/input'
import instance from '@/utils/axios'
import { toast } from 'sonner'

interface Props {
  task: { id: string; title: string }
  index: number
}

const Task = ({ task, index }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  const handleUpdate = async () => {
    try {
      await instance.patch(`/api/tasks/${task.id}`, { title }, { withCredentials: true })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating task:', error)
      setTitle(task.title)
    }
  }

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/tasks/${task.id}`, { withCredentials: true })
      toast.success('Task deleted successfully')
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
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
              {isEditing ? (
                <div className='flex gap-2'>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className='text-sm' />
                  <Button onClick={handleUpdate} size='sm'>
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} size='sm' variant='outline'>
                    Cancel
                  </Button>
                </div>
              ) : (
                <span className='text-sm cursor-pointer' onClick={() => setIsEditing(true)}>
                  {title}
                </span>
              )}
              <div className='flex items-center justify-start gap-2 flex-wrap'>
                <Badge variant='secondary' className='bg-green-500 text-white'>
                  Label
                </Badge>
              </div>
            </div>
            <div className='p-2 border-t flex justify-between'>
              <Button onClick={handleDelete} variant='destructive' size='sm'>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default Task
