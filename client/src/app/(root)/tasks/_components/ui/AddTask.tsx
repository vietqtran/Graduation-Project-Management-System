import React, { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import useClickOutside from '@/hooks/useClickOutside'

const AddTask = () => {
  const [isAddTask, setIsAddTask] = React.useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const wrapperRef = useClickOutside<HTMLDivElement>(() => setIsAddTask(false))

  const handleShowInput = () => {
    setIsAddTask(true)
    setTimeout(() => {
      ref.current?.focus()
    }, 10)
  }

  return (
    <div ref={wrapperRef} className='flex-shrink-0 p-2'>
      {isAddTask ? (
        <div className='flex flex-col gap-1.5'>
          <div className=''>
            <Textarea ref={ref} className='bg-background resize-none' />
          </div>
          <div className='flex items-center gap-2'>
            <Button className='bg-blue-500 hover:bg-blue-600'>Add task</Button>
            <div
              onClick={() => setIsAddTask(false)}
              className='h-full rounded-lg cursor-pointer p-2 aspect-square relative bg-transparent hover:bg-neutral-300'
            >
              <span className=' text-black'>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'>
                  <path
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    d='M19 5L5 19M5 5l14 14'
                    color='currentColor'
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          tabIndex={0}
          onClick={handleShowInput}
          className='p-2 gap-2 rounded-lg hover:bg-neutral-100 flex items-center cursor-pointer'
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'>
            <path
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              d='M12 4v16m8-8H4'
              color='currentColor'
            />
          </svg>
          <span className='font-medium text-sm'>Add a task</span>
        </div>
      )}
    </div>
  )
}

export default AddTask
