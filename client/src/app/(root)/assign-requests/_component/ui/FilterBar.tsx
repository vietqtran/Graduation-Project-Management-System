'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import * as Dialog from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import RequestForm from './RequestForm' // Import RequestForm component

interface FilterBarProps {
  onFilterChange: (filterData: {
    search?: string
    status?: string
    requestType?: string
    dateRange?: { start: string; end: string }
  }) => void
  onClearFilter: () => void
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onClearFilter }) => {
  const [searchValue, setSearchValue] = useState('')
  const [status, setStatus] = useState('all')
  const [requestType, setRequestType] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
        <div className='flex flex-wrap gap-4 items-center justify-center'>
          {' '}
          <Label className='text-center rounded-full border-2 border-red-500 p-2'>Group 1 | SE</Label>
          <Label className='text-center rounded-full border-2 border-purpe-500 p-2'>Group 2 | IT</Label>
          <Label className='text-center rounded-full border-2 border-blue-500 p-2'>Group 3 | HR</Label>
          <Label className='text-center rounded-full border-2 border-green-500 p-2'>Group 4 | Finance</Label>
          <Label className='text-center rounded-full border-2 border-orange-500 p-2'>Group 5 | Marketing</Label>
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
              <RequestForm onClose={() => setIsDrawerOpen(false)} onSubmit={(data) => console.log(data)} />
            </div>
            <div className='flex justify-end gap-6'>
              <Button variant='outline' onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant='default' onClick={() => setIsDrawerOpen(false)}>
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
