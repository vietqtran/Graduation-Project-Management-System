import { Draggable, Droppable } from '@hello-pangea/dnd'

import AddTask from './AddTask'
import React from 'react'
import SimpleBar from 'simplebar-react'
import Task from './Task'

type Props = {
  column: {
    id: string
    title: string
  }
  tasks: {
    id: string
    title: string
  }[]
  index: number
}

const Column = ({ column, tasks, index }: Props) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            position: 'relative',
            ...provided.draggableProps.style
          }}
          className={`min-w-72 max-h-[calc(100vh-140px)] h-full flex flex-col rounded-lg shadow-md mr-3 border bg-neutral-200
            ${snapshot.isDragging ? 'ring-2 ring-blue-500' : ''}`}
          data-is-dragging={snapshot.isDragging}
        >
          <div
            {...provided.dragHandleProps}
            className='w-full flex-shrink-0 p-3 flex items-center gap-2 justify-between'
          >
            <span className='font-semibold text-sm'>{column.title}</span>
          </div>

          <Droppable droppableId={column.id} type='task'>
            {(provided) => (
              <SimpleBar className='flex flex-col w-full flex-1 overflow-y-auto z-0'>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-full overflow-auto transition-all duration-200`}
                >
                  <div className='px-2 gap-1.5 flex flex-col min-h-[5px]'>
                    {tasks.map((task, index) => (
                      <Task key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              </SimpleBar>
            )}
          </Droppable>
          <AddTask />
        </div>
      )}
    </Draggable>
  )
}

export default Column
