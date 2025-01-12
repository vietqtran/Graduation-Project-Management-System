'use client'

import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import React, { useState } from 'react'

import BoardHeader from './_components/layouts/BoardHeader'
import BoardLayout from './_components/layouts/BoardLayout'
import Column from './_components/ui/Column'
import SimpleBar from 'simplebar-react'

interface Task {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: 'column_1',
    title: 'Column 1',
    tasks: Array.from({ length: 10 }, (_, i) => ({
      id: `task_1_${i + 1}`,
      title: `Task 1.${i + 1}`
    }))
  },
  {
    id: 'column_2',
    title: 'Column 2',
    tasks: Array.from({ length: 12 }, (_, i) => ({
      id: `task_2_${i + 1}`,
      title: `Task 2.${i + 1}`
    }))
  },
  {
    id: 'column_3',
    title: 'Column 3',
    tasks: Array.from({ length: 15 }, (_, i) => ({
      id: `task_3_${i + 1}`,
      title: `Task 3.${i + 1}`
    }))
  },
  {
    id: 'column_4',
    title: 'Column 4',
    tasks: Array.from({ length: 11 }, (_, i) => ({
      id: `task_4_${i + 1}`,
      title: `Task 4.${i + 1}`
    }))
  },
  {
    id: 'column_5',
    title: 'Column 5',
    tasks: Array.from({ length: 13 }, (_, i) => ({
      id: `task_5_${i + 1}`,
      title: `Task 5.${i + 1}`
    }))
  }
]

const Page = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    if (type === 'column') {
      const newColumns = Array.from(columns)
      const [removed] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, removed)
      setColumns(newColumns)
      return
    }

    const sourceColumn = columns.find((col: Column) => col.id === source.droppableId)
    const destColumn = columns.find((col: Column) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks)
      const [removed] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, removed)

      const newColumns = columns.map((col: Column) => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: newTasks }
        }
        return col
      })

      setColumns(newColumns)
    } else {
      // Moving between columns
      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = Array.from(destColumn.tasks)
      const [removed] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, removed)

      const newColumns = columns.map((col: Column) => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: sourceTasks }
        }
        if (col.id === destColumn.id) {
          return { ...col, tasks: destTasks }
        }
        return col
      })

      setColumns(newColumns)
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
                  className={`flex items-start justify-start size-full p-3`}
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
