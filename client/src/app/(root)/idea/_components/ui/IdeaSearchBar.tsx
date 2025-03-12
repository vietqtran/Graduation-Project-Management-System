'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search } from 'lucide-react'
import instance from '@/utils/axios'
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
  leader: string
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
  const [majors, setMajors] = useState<Array<{ _id: string, name: string }> | null>(null)
  const [fields, setFields] = useState<Array<{ _id: string, name: string }> | null>(null)
  const [campuses, setCampuses] = useState<Array<{ _id: string, name: string }> | null>(null)

useEffect(() => {
  const fetchFilterData = async () => {
    try {
      const fieldsResponse = await instance.get('/public/fields', { withCredentials: true });
      const majorsResponse = await instance.get('/public/majors', { withCredentials: true });
      const campusesResponse = await instance.get('/public/campuses', { withCredentials: true });

      setFields(fieldsResponse.data.data);  
      setMajors(majorsResponse.data.data);
      setCampuses(campusesResponse.data.data);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  fetchFilterData();
}, []);

  const applyFilters = () => {
    const filteredProjects = projects.filter(
      (project) =>
        (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? project.status === statusFilter : true) &&
        (fieldFilter ? project.field === fieldFilter : true) &&
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
                  {majors?.map((major) => (
                    <SelectItem key={major._id} value={major.name}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={fieldFilter || ''} onValueChange={(value) => setFieldFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Field' />
                </SelectTrigger>
                <SelectContent>
                  {fields?.map((field) => (
                    <SelectItem key={field._id} value={field.name}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={campusFilter || ''} onValueChange={(value) => setCampusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Campus' />
                </SelectTrigger>
                <SelectContent>
                  {campuses?.map((campus) => (
                    <SelectItem key={campus._id} value={campus.name}>
                      {campus.name}
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
