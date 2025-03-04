'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import MajorSelection from './MajorSelect'
import TopicList from './TopicList'
import TopicSearchBar from './TopicSearchBar'
import TopicForm from './TopicForm'
import { Button } from '@/components/ui/button'
import instance from '@/utils/axios'
import { toast } from 'sonner'

const TopicPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterField, setFilterField] = useState('all')
  const [refresh, setRefresh] = useState(false)

  const handleSearch = (search: string, sort: string, filter: string) => {
    setSearchTerm(search)
    setSortOrder(sort)
    setFilterField(filter)
  }

  const handleSubmit = async (data: { [key: string]: string | number | boolean }) => {
    setLoading(true)

    try {
      const response = await instance.post('/project/create-project-as-topic', data, {
        withCredentials: true
      })

      console.log('Server response:', response.data)
      toast.success('Topic submitted successfully!')
      setIsDrawerOpen(false)
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error submitting topic:', error)
      toast.error('Failed to submit topic!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <TopicSearchBar onOpenForm={() => setIsDrawerOpen(true)} onSearch={handleSearch} />
      <div className='flex gap-6 mt-4'>
        <MajorSelection onMajorSelect={setSelectedMajorId} />
        <TopicList
          refresh={refresh}
          selectedMajorId={selectedMajorId}
          searchTerm={searchTerm}
          sortOrder={sortOrder}
          filterField={filterField}
        />
      </div>

      {/* Drawer using Radix UI */}
      <Dialog.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-30' />
          <Dialog.Content className='fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg p-6 flex flex-col'>
            <div className='flex-1 overflow-y-auto'>
              <TopicForm onSubmit={handleSubmit} />
            </div>
            <div className='flex justify-end gap-6'>
              <Button variant='outline' onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button
                className='w-32'
                onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true }))}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default TopicPage
