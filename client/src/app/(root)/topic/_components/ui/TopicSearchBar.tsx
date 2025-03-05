'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

export default function TopicSearchBar({
  onOpenForm,
  onSearch
}: {
  onOpenForm: () => void
  onSearch: (searchTerm: string, sortOrder: string, filterField: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterField, setFilterField] = useState('all')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    onSearch(value, sortOrder, filterField)
  }

  const handleSortChange = (value: string) => {
    setSortOrder(value)
    onSearch(searchTerm, value, filterField)
  }

  const handleFilterChange = (value: string) => {
    setFilterField(value)
    onSearch(searchTerm, sortOrder, value)
  }

  return (
    <div className='p-4 shadow-md rounded bg-white'>
      <div className='flex flex-col md:flex-row gap-4 items-center'>
        <div className='w-full md:w-1/3'>
          <Input type='text' placeholder='Search topics...' value={searchTerm} onChange={handleSearchChange} />
        </div>
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className='w-full md:w-1/3'>
            <SelectValue placeholder='Sort' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='asc'>Sort A-Z</SelectItem>
            <SelectItem value='desc'>Sort Z-A</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterField} onValueChange={handleFilterChange}>
          <SelectTrigger className='w-full md:w-1/3'>
            <SelectValue placeholder='Filter field' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='SE'>Software Engineering</SelectItem>
            <SelectItem value='AI'>Artificial Intelligence</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onOpenForm} className='flex items-center w-full md:w-1/4'>
          <PlusCircle className='mr-2' /> Submit Topic
        </Button>
      </div>
    </div>
  )
}
