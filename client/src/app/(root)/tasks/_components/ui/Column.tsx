import { Draggable, Droppable } from '@hello-pangea/dnd'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SimpleBar from 'simplebar-react'
import Task from './Task'
import instance from '@/utils/axios'

type Props = {
  column: { id: string; title: string }
  tasks: { id: string; title: string }[]
  index: number
}

const Column = ({ column, tasks, index }: Props) => {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [columnTitle, setColumnTitle] = useState(column.title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return
    try {
      // const response = await axios.post('/api/tasks', {
      //   title: newTaskTitle,
      //   columnId: column.id,
      //   projectId: 'project1'
      // })
      // const newTask = response.data.data
      // const updatedTasks = [...tasks, newTask]
      setNewTaskTitle('')
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleUpdateTitle = async () => {
    try {
      await instance.patch(`/api/columns/${column.id}`, { title: columnTitle }, { withCredentials: true })
      setIsEditingTitle(false)
    } catch (error) {
      console.error('Error updating column title:', error)
      setColumnTitle(column.title) // Revert on failure
    }
  }

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{ position: 'relative', ...provided.draggableProps.style }}
          className={`min-w-72 max-h-[calc(100vh-140px)] h-full flex flex-col rounded-lg shadow-md mr-3 border bg-neutral-200 ${
            snapshot.isDragging ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div
            {...provided.dragHandleProps}
            className='w-full flex-shrink-0 p-3 flex items-center gap-2 justify-between'
          >
            {isEditingTitle ? (
              <div className='flex gap-2'>
                <Input value={columnTitle} onChange={(e) => setColumnTitle(e.target.value)} className='text-sm' />
                <Button onClick={handleUpdateTitle} size='sm'>
                  Save
                </Button>
              </div>
            ) : (
              <span className='font-semibold text-sm cursor-pointer' onClick={() => setIsEditingTitle(true)}>
                {columnTitle}
              </span>
            )}
          </div>

          <Droppable droppableId={column.id} type='task'>
            {(provided) => (
              <SimpleBar className='flex flex-col w-full flex-1 overflow-y-auto z-0'>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='w-full overflow-auto transition-all duration-200'
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
          <div className='p-2'>
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder='Add a task'
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask} className='mt-2 w-full'>
              Add Task
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default Column