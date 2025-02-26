import React from 'react'

const AssignTasksPage = () => {
  return (
    <div className='flex h-full gap-4 p-4'>
      {/* Left side - Task list */}
      <div className='w-1/2 rounded-lg border bg-background p-4'>
        <h2 className='mb-4 text-xl font-semibold'>Task List</h2>
        <div className='flex flex-col gap-3'>
          {/* Example task cards */}
          <div className='rounded-md border p-3 hover:bg-muted'>
            <h3 className='font-medium'>Design Interface</h3>
            <p className='text-sm text-muted-foreground'>Deadline: 20/03/2024</p>
          </div>
          <div className='rounded-md border p-3 hover:bg-muted'>
            <h3 className='font-medium'>Build Database</h3>
            <p className='text-sm text-muted-foreground'>Deadline: 25/03/2024</p>
          </div>
        </div>
      </div>

      {/* Right side - Task form */}
      <div className='w-1/2 rounded-lg border bg-background p-4'>
        <h2 className='mb-4 text-xl font-semibold'>Create New Task</h2>
        <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='taskName' className='font-medium'>
              Task Name
            </label>
            <input id='taskName' type='text' className='rounded-md border p-2' placeholder='Enter task name' />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='deadline' className='font-medium'>
              Deadline
            </label>
            <input id='deadline' type='datetime-local' className='rounded-md border p-2' />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='requirements' className='font-medium'>
              Requirements
            </label>
            <textarea
              id='requirements'
              className='min-h-[120px] rounded-md border p-2'
              placeholder='Enter detailed requirements'
            />
          </div>

          <button
            type='submit'
            className='mt-2 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600'
          >
            Submit Task
          </button>
        </form>
      </div>
    </div>
  )
}

export default AssignTasksPage
