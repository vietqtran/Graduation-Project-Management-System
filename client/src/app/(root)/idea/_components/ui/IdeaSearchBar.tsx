'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search } from 'lucide-react'

// Import ProjectIdea type from ReviewIdeas
export interface ProjectIdea {
  _id: string
  name: string
  field: string
  status: 'planning' | 'in-progress' | 'completed'
  campus: string
  description: string
  created_at: string
  updated_at: string
  priority?: 'low' | 'medium' | 'high'
}

interface ProjectSearchAndFilterProps {
  projects?: ProjectIdea[]
  onFilteredProjects: (filteredProjects: ProjectIdea[]) => void
}

const ProjectSearchAndFilter: React.FC<ProjectSearchAndFilterProps> = ({ projects = [], onFilteredProjects }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [fieldFilter, setFieldFilter] = useState<string | null>(null)
  const [campusFilter, setCampusFilter] = useState<string | null>(null)

  // Get unique fields, statuses, and campuses for dropdown
  const fields = [...new Set(projects.map((p) => p.field))]
  const statuses = [...new Set(projects.map((p) => p.status))]
  const campuses = [...new Set(projects.map((p) => p.campus))]

  // Filter logic
  const applyFilters = () => {
    const filteredProjects = projects.filter(
      (project) =>
        // Search term filter (name or description)
        (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        // Status filter
        (statusFilter ? project.status === statusFilter : true) &&
        // Field filter
        (fieldFilter ? project.field === fieldFilter : true) &&
        // Campus filter
        (campusFilter ? project.campus === campusFilter : true)
    )

    onFilteredProjects(filteredProjects)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter(null)
    setFieldFilter(null)
    setCampusFilter(null)
    onFilteredProjects(projects)
  }

  return (
    <div className='flex space-x-2 w-full'>
      <div className='flex-grow relative'>
        <Input
          type='text'
          placeholder='Search projects...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            // Optional: immediate filtering as user types
            const filteredProjects = projects.filter(
              (project) =>
                project.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                project.description.toLowerCase().includes(e.target.value.toLowerCase())
            )
            onFilteredProjects(filteredProjects)
          }}
          className='pr-10'
        />
        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' size='icon'>
            <Filter size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80'>
          <div className='grid gap-4'>
            <div className='space-y-2'>
              <h4 className='font-medium leading-none'>Filter Projects</h4>
              <p className='text-sm text-muted-foreground'>Refine your project search</p>
            </div>

            <div className='grid gap-2'>
              <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={fieldFilter || ''} onValueChange={(value) => setFieldFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Field' />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={campusFilter || ''} onValueChange={(value) => setCampusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Campus' />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map((campus) => (
                    <SelectItem key={campus} value={campus}>
                      {campus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex justify-between'>
              <Button variant='outline' onClick={resetFilters} size='sm'>
                Reset
              </Button>
              <Button onClick={applyFilters} size='sm'>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ProjectSearchAndFilter
