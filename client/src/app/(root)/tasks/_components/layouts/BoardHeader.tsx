import { Button } from '@/components/ui/button'
import React from 'react'

const BoardHeader = () => {
  return (
    <div className='h-12 px-4 flex items-center gap-4 border-b justify-between'>
      <div className='flex items-center gap-2'>
        <h3 className='font-semibold'>Graduation Project Management System</h3>
      </div>
      <div className='flex items-center gap-3'>
        <Button variant='outline' size='sm'>
          Filters
        </Button>
      </div>
    </div>
  )
}

export default BoardHeader
