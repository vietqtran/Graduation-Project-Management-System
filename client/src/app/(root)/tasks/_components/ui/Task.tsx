import AvatarGroup from '@/components/ui/avatar-group'
import { Badge } from '@/components/ui/badge'
import { Draggable } from '@hello-pangea/dnd'
import FileIcon from '@/components/icons/FileIcon'
import React from 'react'

interface Props {
  task: {
    id: string
    title: string
  }
  index: number
}

const Task = ({ task, index }: Props) => {
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
          className={`bg-background shadow-md border rounded-lg select-none
          ${snapshot.isDragging ? 'shadow-xl rotate-3 cursor-grabbing bg-white ring-2 ring-blue-500 z-[9999]' : 'cursor-grab hover:bg-neutral-50'}
          transition-colors duration-200`}
        >
          <div className='flex flex-col'>
            <div className='p-2'>
              <span className='text-sm'>{task.title}</span>
              <div className='flex items-center justify-start gap-2 flex-wrap'>
                <Badge variant={'secondary'} className='bg-green-500 text-white'>
                  Label
                </Badge>
                <Badge variant={'secondary'} className='bg-green-500 text-white'>
                  Label
                </Badge>
                <Badge variant={'secondary'} className='bg-green-500 text-white'>
                  Label
                </Badge>
              </div>
            </div>
            <div className='gap-1 flex flex-col p-2 border-t'>
              <div className='flex flex-wrap justify-start items-center gap-y-1 gap-x-2'>
                <div className='flex gap-1 items-center'>
                  <FileIcon />
                  <span className='text-sm'>10</span>
                </div>
              </div>
              <div className='flex justify-end'>
                <AvatarGroup
                  className='size-6'
                  avatars={[
                    { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
                    { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
                    { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
                    { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
                    { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
                    { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
                    { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
                    { src: 'https://i.pravatar.cc/300', alt: 'avatar' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default Task
