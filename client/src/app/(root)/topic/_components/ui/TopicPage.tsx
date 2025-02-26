'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import MajorSelection from './MajorSelect'
import TopicList from './TopicList'
import TopicSearchBar from './TopicSearchBar'
import TopicForm from './TopicForm'
import { Button } from '@/components/ui/button'

const TopicPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div>
      <TopicSearchBar onOpenForm={() => setIsDrawerOpen(true)} />
      <div className='flex gap-6 mt-4'>
        <MajorSelection />
        <TopicList />
      </div>

      {/* Drawer using Radix UI */}
      <Dialog.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-30' />
          <Dialog.Content className='fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg p-6 flex flex-col'>
            <div className='flex-1 overflow-y-auto'>
              <TopicForm />
            </div>
            <div className='flex justify-end gap-2 p-1'>
              <Button variant='outline' onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className='w-32' onClick={() => setIsDrawerOpen(false)}>
                Submit
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default TopicPage
