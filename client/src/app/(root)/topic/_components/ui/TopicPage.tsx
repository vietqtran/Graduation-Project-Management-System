'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import MajorSelection from './MajorSelect'
import TopicList from './TopicList'
import TopicSearchBar from './TopicSearchBar'
import TopicForm from './TopicForm'
import { Button } from '@/components/ui/button'

interface Message {
  type: 'success' | 'error';
  text: string;
}

const TopicPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterField, setFilterField] = useState('all')

  const handleSearch = (search: string, sort: string, filter: string) => {
    setSearchTerm(search)
    setSortOrder(sort)
    setFilterField(filter)
  }

  const handleSubmit = async (data: { [key: string]: string | number | boolean }) => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`http://localhost:8080/api/project/create-project-as-topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      credentials: "include" 
      })

      const result = await response.json()
      console.log('Server response:', result); 

      if (response.ok) {
        setMessage({ type: 'success', text: 'Topic submitted successfully!' })
        setIsDrawerOpen(false) // Đóng form sau khi submit thành công
      } else {
        setMessage({ type: 'error', text: result.message || 'Something went wrong' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit the topic.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <TopicSearchBar onOpenForm={() => setIsDrawerOpen(true)} onSearch={handleSearch} />
      <div className='flex gap-6 mt-4'>
        <MajorSelection onMajorSelect={setSelectedMajorId} />
        <TopicList selectedMajorId={selectedMajorId} searchTerm={searchTerm} sortOrder={sortOrder} filterField={filterField} />
      </div>

      {/* Hiển thị thông báo */}
      {message && (
        <div className={`p-2 rounded-md ${message.type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Drawer using Radix UI */}
      <Dialog.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-30' />
          <Dialog.Content className='fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg p-6 flex flex-col'>
            <div className='flex-1 overflow-y-auto'>
              <TopicForm onSubmit={handleSubmit} />
            </div>
            <div className='flex justify-end gap-6'>
              <Button variant='outline' onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button className='w-32' onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true }))} disabled={loading}>
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
