'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import instance from '@/utils/axios'
import * as Dialog from '@radix-ui/react-dialog'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import RequestForm from './RequestForm'
import { STATUS_MASTER } from '@/constants/status.enum'

interface FilterBarProps {
  onFilterChange: (filterData: {
    search?: string
    status?: string
    requestType?: string
    dateRange?: { start: string; end: string }
  }) => void
  onClearFilter: () => void
  setUserId: (id: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onClearFilter, setUserId }) => {
  const [searchValue, setSearchValue] = useState('')
  const [status, setStatus] = useState('all')
  const [requestType, setRequestType] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [groupName, setGroupName] = useState<{ leaderId: string; leaderName: string }[]>([])

  const currentFormData = useRef<{
    to_user: string
    type: string
    remark: string
    description: string
    from_user: string
    document: string
    due_date: string
  } | null>(null)

  const currentUserId = 'currentUserId'

  useEffect(() => {
    const fetchProjectIdeas = async () => {
      try {
        const response = await instance.get('/project/get-projects-to-review', { withCredentials: true })
        if (response.data) {
          const filteredProjectswithName = response.data.data.filter(
            (project: { status: string }) => project.status !== STATUS_MASTER.APPROVED.toString()
          )

          const leaders = filteredProjectswithName.map((project: { leader: { _id: string; username: string } }) => ({
            leaderId: project.leader._id,
            leaderName: project.leader.username
          }))

          console.log(leaders)

          setGroupName(leaders)
          console.log('Project names: ', leaders)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching project ideas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectIdeas()
  }, [])
  const handleApplyFilter = () => {
    onFilterChange({
      search: searchValue || undefined,
      status: status === 'all' ? undefined : status,
      requestType: requestType === 'all' ? undefined : requestType,
      dateRange: dateRange.start && dateRange.end ? dateRange : undefined
    })
  }

  const handleClear = () => {
    setSearchValue('')
    setStatus('all')
    setRequestType('all')
    setDateRange({ start: '', end: '' })
    onClearFilter()
  }

  const handleSubmit = (data: {
    to_user: string
    type: string
    remark: string
    description: string
    from_user: string
    document: string
    due_date: string
  }) => {
    console.log('Form data received:', data)
    currentFormData.current = data
  }

  const confirmSubmit = async () => {
    if (!currentFormData.current) {
      toast.error('Please fill the form first')
      return
    }

    if (!currentFormData.current.from_user && currentUserId) {
      currentFormData.current.from_user = currentUserId
    }

    const { to_user, description, document, due_date, from_user } = currentFormData.current
    if (!to_user || !description || !document || !due_date || !from_user) {
      toast.error('Please fill all required fields')
      return
    }

    console.log('Payload data before sending:', currentFormData.current)

    try {
      const response = await instance.post(
        '/request/create-request',
        {
          to_user: to_user,
          type: currentFormData.current.type,
          remark: currentFormData.current.remark,
          description: description,
          from_user: from_user,
          document: document,
          due_date: due_date
        },
        {
          withCredentials: true
        }
      )

      console.log('API response:', response.data)
      toast.success('Request created successfully!')
      setIsDrawerOpen(false)
      currentFormData.current = null
    } catch (error) {
      console.error('Error creating request:', error)
      toast.error('ko tao moi request duoc')
    }
  }

  return (
    <div className='flex flex-wrap gap-4 items-center mb-4'>
      <div className='flex gap-2'>
        <Input
          value={searchValue}
          placeholder='Search by keyword'
          onChange={(e) => setSearchValue(e.target.value)}
          className='flex-1 w-[300px]'
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <span>{status === 'all' ? 'All Status' : status}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='assigned'>Assigned</SelectItem>
            <SelectItem value='completed'>Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={requestType} onValueChange={setRequestType}>
          <SelectTrigger>
            <span>{requestType === 'all' ? 'All Task Types' : requestType}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Request Types</SelectItem>
            <SelectItem value='project'>Project</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type='date'
          value={dateRange.start}
          placeholder='Start Date'
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          className='flex-1'
        />
        <Input
          type='date'
          value={dateRange.end}
          placeholder='End Date'
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          className='flex-1'
        />

        <Button variant='default' size='sm' onClick={handleApplyFilter}>
          Apply Filter
        </Button>

        <Button variant='outline' size='sm' onClick={handleClear}>
          Clear Filter
        </Button>
      </div>

      <div className='flex gap-2 justify-center items-center'>
        <div className='flex gap-2 justify-center items-center'>
          <div className='flex flex-wrap gap-4 items-center justify-center'>
            {loading
              ? 'Loading...'
              : groupName.map((group, index) => {
                  const labelColors = [
                    'border-red-500',
                    'border-purple-500',
                    'border-blue-500',
                    'border-green-500',
                    'border-orange-500'
                  ]

                  const groupIndex = index % labelColors.length
                  return (
                    <Label
                      onClick={() => {
                        setUserId(group.leaderId)
                        console.log(group.leaderId)
                      }}
                      key={index}
                      className={`text-center rounded-full border-2 ${labelColors[groupIndex]} p-2`}
                    >
                      {`Group ${index + 1} | ${group.leaderName}`}
                    </Label>
                  )
                })}
          </div>
        </div>

        <Button className='bg-yellow-500 text-white' size='sm' onClick={() => setIsDrawerOpen(true)}>
          Add Request
        </Button>
      </div>

      <Dialog.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-30' />
          <Dialog.Content className='fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg p-6 flex flex-col'>
            <div className='flex-1 overflow-y-auto'>
              <RequestForm onClose={() => setIsDrawerOpen(false)} onSubmit={handleSubmit} />
            </div>
            <div className='flex justify-end gap-6'>
              <Button variant='outline' onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant='default' onClick={confirmSubmit}>
                Submit
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default FilterBar
