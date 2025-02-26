'use client'

import type { Column, Task } from '@/types/task.type'
import { DragDropContext, type DropResult, Droppable } from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'

import BoardHeader from './_components/layouts/BoardHeader'
import BoardLayout from './_components/layouts/BoardLayout'
import ColumnComponent from './_components/ui/Column'
import SimpleBar from 'simplebar-react'
import instance from '@/utils/axios'
import { useProject } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const BoardPage = () => {
  const { project } = useProject()
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    fetchColumns()
    fetchTasks()
  }, [project?._id])

  const fetchColumns = async () => {
    if (project?._id) {
      const res = await instance.get(`/board/project/${project?._id}/columns`, { withCredentials: true })
      setColumns(res.data.data.filter((col: Column) => !col.is_archived))
    }
  }

  const fetchTasks = async () => {
    if (project?._id) {
      const res = await instance.get(`/board/project/${project?._id}/tasks`, { withCredentials: true })
      setTasks(res.data.data.filter((task: Task) => !task.is_archived))
    }
  }

  const handleAddColumn = async () => {
    if (!project?._id) return

    await instance.post(
      `/board/project/${project._id}/columns`,
      {
        title: 'New Column',
        project: project._id
      },
      { withCredentials: true }
    )
    fetchColumns()
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    if (type === 'column') {
      const newColumns = [...columns]
      const [movedColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, movedColumn)

      setColumns(newColumns)

      try {
        await instance.post(
          `/board/columns/${draggableId}/move`,
          { position: destination.index },
          { withCredentials: true }
        )
      } catch (error) {
        const originalColumns = [...columns]
        setColumns(originalColumns)
        console.error('Failed to move column:', error)
      }
      return
    }

    const sourceColumn = columns.find((col) => col._id === source.droppableId)
    const destColumn = columns.find((col) => col._id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    const movedTask = tasks.find((task) => task._id === draggableId)
    if (!movedTask) return

    const newTasks = [...tasks]
    const updatedTask = { ...movedTask, column: destColumn }
    const taskIndex = newTasks.findIndex((task) => task._id === draggableId)
    newTasks[taskIndex] = updatedTask

    setTasks(newTasks)

    try {
      await instance.post(
        `/board/tasks/${draggableId}/move`,
        {
          destinationColumnId: destination.droppableId,
          position: destination.index
        },
        { withCredentials: true }
      )
    } catch (error) {
      const originalTasks = [...tasks]
      setTasks(originalTasks)
      console.error('Failed to move task:', error)
    }
  }

  return (
    <BoardLayout>
      <BoardHeader />
      <SimpleBar
        style={{
          maxHeight: 'calc(100vh - 112px)',
          minHeight: 'calc(100vh - 112px)'
        }}
        className='w-full z-0 select-none overflow-auto'
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='relative max-h-[calc(100vh - 112px)] h-[calc(100vh - 112px)] z-0 flex flex-col'>
            <Droppable droppableId='board' type='column' direction='horizontal'>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='flex items-start justify-start size-full p-3'
                >
                  {columns.map((column, index) => (
                    <ColumnComponent
                      key={column._id}
                      column={column}
                      tasks={tasks.filter((task) => task.column._id === column._id)}
                      index={index}
                      onUpdate={fetchColumns}
                      onTaskUpdate={fetchTasks}
                    />
                  ))}
                  {provided.placeholder}
                  <div className='flex-shrink-0 min-w-72 h-fit'>
                    <Button
                      onClick={handleAddColumn}
                      variant='outline'
                      className='w-full h-12 border-2 border-dashed hover:border-solid hover:border-primary'
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Add Column
                    </Button>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </SimpleBar>
    </BoardLayout>
  )
}

export default BoardPage
