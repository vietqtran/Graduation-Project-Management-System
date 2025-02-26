'use client'

import { Column, Task } from '@/types/task.type'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import React, { useEffect, useState } from 'react'

import BoardHeader from './_components/layouts/BoardHeader'
import BoardLayout from './_components/layouts/BoardLayout'
import ColumnComponent from './_components/ui/Column'
import SimpleBar from 'simplebar-react'
import instance from '@/utils/axios'
import { useProject } from '@/hooks'

const BoardPage = () => {
  const { project } = useProject()
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    fetchColumns()
    fetchTasks()
  }, [project])

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

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    if (type === 'column') {
      const newColumns = [...columns]
      const [movedColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, movedColumn)

      await instance.put(
        `/board/columns/${draggableId}/move`,
        { position: destination.index },
        { withCredentials: true }
      )
      setColumns(newColumns)
      return
    }

    const sourceColumn = columns.find((col) => col._id === source.droppableId)
    const destColumn = columns.find((col) => col._id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    const movedTask = tasks.find((task) => task._id === draggableId)
    if (!movedTask) return

    await instance.put(
      `/board/tasks/${draggableId}/move`,
      {
        destinationColumnId: destination.droppableId,
        position: destination.index
      },
      { withCredentials: true }
    )

    fetchTasks()
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
                      tasks={tasks.filter((task) => task.column === column._id)}
                      index={index}
                      onUpdate={fetchColumns}
                      onTaskUpdate={fetchTasks}
                    />
                  ))}
                  {provided.placeholder}
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
