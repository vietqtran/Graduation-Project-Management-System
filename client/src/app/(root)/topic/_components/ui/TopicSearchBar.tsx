'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import instance from '@/utils/axios'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TopicSearchBar({
  onOpenForm,
  onOpenFormProject,
  onSearch
}: {
  onOpenForm: () => void
  onOpenFormProject: () => void
  onSearch: (searchTerm: string, sortOrder: string, filterFieldId: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterFieldId, setFilterFieldId] = useState('all')
  const [loading, setLoading] = useState(true)
  interface Major {
    _id: string
    name: string
    description: string
  }

  const [fields, setFields] = useState<Major[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/public/fields', { withCredentials: true })
        setFields(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [loading])
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    onSearch(value, sortOrder, filterFieldId)
  }

  const handleSortChange = (value: string) => {
    setSortOrder(value)
    onSearch(searchTerm, value, filterFieldId)
  }

  const handleFilterChange = (value: string) => {
    setFilterFieldId(value)
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
        <Select value={filterFieldId} onValueChange={handleFilterChange}>
          <SelectTrigger className='w-full md:w-1/3'>
            <SelectValue placeholder='Filter field' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            {fields?.map((field) => (
              <SelectItem key={field._id} value={field._id}>
                {field?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onOpenForm} className='flex items-center w-full md:w-1/4'>
          <PlusCircle className='mr-2' /> Submit New Topic
        </Button>

        <Button onClick={onOpenFormProject} className='flex items-center w-full md:w-1/4'>
          <PlusCircle className='mr-2' /> Submit New Project 
        </Button>
      </div>
    </div>
  )
}
