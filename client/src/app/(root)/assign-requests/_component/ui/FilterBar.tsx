'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import RequestDialog from './RequestDialog'
import { STATUS_MASTER } from '@/constants/status.enum'
import instance from '@/utils/axios'
import { toast } from 'sonner'

interface FilterBarProps {
  onFilterChange: (filterData: {
    search?: string
    status?: string
    requestType?: string
    dateRange?: { start: string; end: string }
  }) => void
  onClearFilter: () => void
  setUserId: (id: string) => void
  setRefresh: (refresh: boolean | ((prev: boolean) => boolean)) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onClearFilter, setUserId, setRefresh }) => {
  const [searchValue, setSearchValue] = useState('')
  const [status, setStatus] = useState('all')
  const [requestType, setRequestType] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [groupName, setGroupName] = useState<{ leaderId: string; leaderName: string }[]>([])

  const currentFormData = useRef<{
    to_user: string
    type: string
    remark: string
    description: string
    document: string
    due_date: string
  } | null>(null)

  useEffect(() => {
    const fetchProjectIdeas = async () => {
      try {
        const response = await instance.get('/project/get-projects-to-review', { withCredentials: true })
        if (response.data) {
          const filteredProjectswithName = response.data.data.filter(
            (project: { status: string }) => project.status !== STATUS_MASTER.APPROVED.toString()
          )

          const leaders = filteredProjectswithName.map((project: { leader: { _id: string; username: string } }) => ({
            leaderId: project?.leader?._id,
            leaderName: project?.leader?.username
          }))

          setGroupName(leaders)
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
    setUserId('')
    onClearFilter()
  }

  const handleSubmit = (data: {
    to_user: string
    type: string
    remark: string
    description: string
    document: string
    due_date: string
  }) => {
    currentFormData.current = data
  }

  const confirmSubmit = async () => {
    if (!currentFormData.current) {
      toast.error('Please fill the form first')
      return
    }

    const { to_user, description, document, due_date } = currentFormData.current
    if (!to_user || !description || !due_date) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      await instance.post(
        '/request/create-request',
        {
          to_user: to_user,
          type: currentFormData.current.type,
          remark: currentFormData.current.remark,
          description: description,
          document: document,
          due_date: due_date
        },
        {
          withCredentials: true
        }
      )

      toast.success('Request created successfully!')
      setRefresh((prev) => !prev)
      setIsDialogOpen(false)
      currentFormData.current = null
    } catch (error) {
      console.error('Error creating request:', error)
      toast.error('Failed to create request')
    }
  }

  return (
    <Card className='p-4 mb-4'>
      <div className='space-y-4'>
        {/* Filters Section */}
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1 min-w-[300px]'>
            <Input
              value={searchValue}
              placeholder='Search by keyword'
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='assigned'>Assigned</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={requestType} onValueChange={setRequestType}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Request Types</SelectItem>
              <SelectItem value='project'>Project</SelectItem>
            </SelectContent>
          </Select>

          <div className='flex gap-2'>
            <Input
              type='date'
              value={dateRange.start}
              placeholder='Start Date'
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className='w-[180px]'
            />
            <Input
              type='date'
              value={dateRange.end}
              placeholder='End Date'
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className='w-[180px]'
            />
          </div>

          <div className='flex gap-2'>
            <Button variant='default' onClick={handleApplyFilter}>
              Apply Filter
            </Button>
            <Button variant='outline' onClick={handleClear}>
              Clear Filter
            </Button>
          </div>
        </div>

        {/* Groups Section */}
        <div className='space-y-2'>
          <Label>Available Groups</Label>
          <ScrollArea className='h-[100px] border rounded-md p-2'>
            <div className='flex flex-wrap gap-2'>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className='h-8 w-[200px]' />)
                : groupName.map((group, index) => {
                    const badgeVariants = ['default', 'secondary', 'destructive', 'outline'] as const
                    const variant = badgeVariants[index % badgeVariants.length]
                    return (
                      <Badge
                        key={group.leaderId}
                        variant={variant}
                        className='cursor-pointer hover:opacity-80'
                        onClick={() => {
                          setUserId(group.leaderId)
                        }}
                      >
                        Group {index + 1} | {group.leaderName}
                      </Badge>
                    )
                  })}
            </div>
          </ScrollArea>
        </div>

        {/* Add Request Button */}
        <div className='flex justify-end'>
          <Button onClick={() => setIsDialogOpen(true)}>Add Request</Button>
        </div>
      </div>

      <RequestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        onConfirm={confirmSubmit}
      />
    </Card>
  )
}

export default FilterBar
