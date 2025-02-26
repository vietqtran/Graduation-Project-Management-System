// src/components/ui/Column.tsx

import { Column, Task } from '@/types/task.type'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import React, { memo, useCallback } from 'react'

import AddTask from './AddTask'
import { Input } from '@/components/ui/input'
import SimpleBar from 'simplebar-react'
import TaskComponent from './Task'
import instance from '@/utils/axios'
import useClickOutside from '@/hooks/useClickOutside'

interface ColumnProps {
  column: Column
  tasks: Task[]
  index: number
  onUpdate: () => void
  onTaskUpdate: () => void
}

const ColumnComponent: React.FC<ColumnProps> = ({ column, tasks, index, onUpdate, onTaskUpdate }) => {
  const [title, setTitle] = React.useState(column.title)
  const [isEditing, setIsEditing] = React.useState(false)
  const handleUpdateTitle = useCallback(
    async (newTitle: string) => {
      if (!newTitle) return
      await instance.patch(`/board/columns/${column._id}`, { title: newTitle }, { withCredentials: true })
      onUpdate()
      setTimeout(() => {
        setIsEditing(false)
      }, 200)
    },
    [column.title]
  )
  const ref = useClickOutside<HTMLDivElement>(() => handleUpdateTitle(title))

  return (
    <Draggable draggableId={column._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            position: 'relative',
            ...provided.draggableProps.style
          }}
          className={`min-w-72 max-h-[calc(100vh-140px)] h-full flex flex-col rounded-lg shadow-md mr-3 border bg-neutral-200 ${
            snapshot.isDragging ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div
            {...provided.dragHandleProps}
            className='w-full flex-shrink-0 flex items-center gap-2 justify-between'
            ref={ref}
          >
            {isEditing ? (
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='font-semibold flex-1 outline-offset-0 !ring-0 text-sm bg-transparent border-none outline-none w-full'
              />
            ) : (
              <div
                className='px-3 py-2 font-semibold whitespace-nowrap truncate line-clamp-1 text-sm bg-transparent border-none outline-none w-full'
                onClick={() => setIsEditing(true)}
              >
                <p className='max-w-full truncate'>{column.title}</p>
              </div>
            )}
          </div>
          <Droppable droppableId={column._id} type='task'>
            {(provided) => (
              <SimpleBar className='flex flex-col w-full flex-1 overflow-y-auto z-0'>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='w-full overflow-auto transition-all duration-200'
                >
                  <div className='px-2 gap-1.5 flex flex-col min-h-[5px]'>
                    {tasks.map((task, index) => (
                      <TaskComponent key={task._id} task={task} index={index} onUpdate={onTaskUpdate} />
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              </SimpleBar>
            )}
          </Droppable>
          <AddTask columnId={column._id} projectId={column.project} onTaskAdded={onTaskUpdate} />
        </div>
      )}
    </Draggable>
  )
}

export default memo(ColumnComponent)
