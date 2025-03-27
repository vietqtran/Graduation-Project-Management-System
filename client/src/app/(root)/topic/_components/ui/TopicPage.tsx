'use client'

import { useState, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import MajorSelection from './MajorSelect'
import TopicList from './TopicList'
import TopicSearchBar from './TopicSearchBar'
import TopicForm from './TopicForm'
import TopicFormForProject from './TopicFormForProject'
import { Button } from '@/components/ui/button'
import instance from '@/utils/axios'
import { toast } from 'sonner'

// Định nghĩa FormData
interface FormData {
  name: string
  description: string
  major: string
  field: string
  document: string
  campus: string
  category: string
  leader: string
}

const TopicPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDrawerOpenProject, setIsDrawerOpenProject] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterFieldId, setFilterFieldId] = useState('all')
  const [refresh, setRefresh] = useState(true)
  const formRef = useRef<{ submit: () => void }>(null) // Ref để gọi submit từ TopicForm

  const handleSearch = (search: string, sort: string, filter: string) => {
    setSearchTerm(search)
    setSortOrder(sort)
    setFilterFieldId(filter)
  }

  const handleMajorSelect = (majorId: string | null) => {
    setSelectedMajorId(majorId)
  }

  const handleSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const response = await instance.post('/project/create-project-as-topic', data, {
        withCredentials: true
      })
      if (response.data.statusCode === 200) {
        toast.success('Topic submitted successfully!')
        setIsDrawerOpen(false)
        setIsDrawerOpenProject(false)
        setRefresh((prev) => !prev)
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra')
      }
    } catch (error: unknown) {
      toast.error('Leader already has a project')
      console.log('Chi tiết lỗi:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <TopicSearchBar onOpenForm={() => setIsDrawerOpen(true)} onOpenFormProject={() => setIsDrawerOpenProject(true)} onSearch={handleSearch} />
      <div className='flex gap-6 mt-4'>
        <MajorSelection onMajorSelect={handleMajorSelect} />
        <TopicList
          refresh={refresh}
          setRefresh={setRefresh}
          searchTerm={searchTerm}
          sortOrder={sortOrder}
          selectedMajorId={selectedMajorId}
          filterFieldId={filterFieldId}
        />
      </div>

      <Dialog.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-30' />
          <Dialog.Title></Dialog.Title>
          <Dialog.Content className='fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg p-6 flex flex-col'>
            <div className='flex-1 overflow-y-auto'>
              <TopicForm onSubmit={handleSubmit} ref={formRef} loading={loading} />
            </div>
            <div className='flex justify-end gap-6'>
              <Button variant='outline' onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className='w-32' onClick={() => formRef.current?.submit()} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={isDrawerOpenProject} onOpenChange={setIsDrawerOpenProject}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-30' />
          <Dialog.Title></Dialog.Title>
          <Dialog.Content className='fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg p-6 flex flex-col'>
            <div className='flex-1 overflow-y-auto'>
              <TopicFormForProject onSubmit={handleSubmit} ref={formRef} loading={loading} />
            </div>
            <div className='flex justify-end gap-6'>
              <Button variant='outline' onClick={() => setIsDrawerOpenProject(false)}>
                Cancel
              </Button>
              <Button className='w-32' onClick={() => formRef.current?.submit()} disabled={loading}>
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
