'use client'

import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import React, { useEffect, useState } from 'react'

import BoardHeader from './_components/layouts/BoardHeader'
import BoardLayout from './_components/layouts/BoardLayout'
import Column from './_components/ui/Column'
import SimpleBar from 'simplebar-react'
import instance from '@/utils/axios'
import { useProject } from '@/hooks'

interface Task {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const Page = () => {
  const [columns, setColumns] = useState<Column[]>([])
  const [loading, setLoading] = useState(true)
  const { project } = useProject()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const columnResponse = await instance(`/board/project/${project?._id}/columns`, { withCredentials: true })
        const columnsData = columnResponse.data.data
        setColumns(columnsData)
      } catch (error) {
        console.error('Error fetching columns:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [project])

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    if (type === 'column') {
      const newColumns = Array.from(columns)
      const [movedColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, movedColumn)
      setColumns(newColumns)

      try {
        await instance.patch(
          `/api/columns/${draggableId}/move`,
          { position: destination.index },
          { withCredentials: true }
        )
      } catch (error) {
        console.error('Error moving column:', error)
        setColumns(columns)
      }
      return
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    const sourceTasks = Array.from(sourceColumn.tasks)
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : Array.from(destColumn.tasks)
    const [movedTask] = sourceTasks.splice(source.index, 1)
    destTasks.splice(destination.index, 0, movedTask)

    const newColumns = columns.map((col) => {
      if (col.id === sourceColumn.id) return { ...col, tasks: sourceTasks }
      if (col.id === destColumn.id) return { ...col, tasks: destTasks }
      return col
    })
    setColumns(newColumns)

    try {
      await instance.patch(
        `/api/tasks/${draggableId}/move`,
        {
          destinationColumnId: destination.droppableId,
          position: destination.index
        },
        {
          withCredentials: true
        }
      )
    } catch (error) {
      console.error('Error moving task:', error)
      setColumns(columns) // Revert on failure
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <BoardLayout>
      <BoardHeader />
      <SimpleBar
        style={{ maxHeight: 'calc(100vh - 112px)', minHeight: 'calc(100vh - 112px)' }}
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
                    <div key={column.id} className='relative'>
                      <Column column={column} tasks={column.tasks} index={index} />
                    </div>
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

export default Page