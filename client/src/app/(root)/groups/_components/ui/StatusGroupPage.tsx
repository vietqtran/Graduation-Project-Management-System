'use client'
import React from 'react'
import StatusBar from './StatusBar'
import StatusTable from './StatusTable'
import { useState, useEffect } from 'react'
import instance from '@/utils/axios'

interface Task {
  remark: string
  created_at: Date
  status: string
  description: string
  commentCount: number
}

const TeacherDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>(['All'])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await instance.get('/request/get-all-requests', { withCredentials: true })
        if (response.status !== 200) {
          throw new Error('Failed to fetch tasks')
        }
        setTasks(response.data.data) // Assuming the response is an array of tasks
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, []) // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const handleFilterChange = (selectedLabels: string[]) => {
    setFilteredStatuses((prev) => (JSON.stringify(prev) === JSON.stringify(selectedLabels) ? prev : selectedLabels))
  }

  return (
    <div className='p-6'>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <StatusBar onFilterChange={handleFilterChange} />
          <StatusTable tasks={tasks} filteredStatuses={filteredStatuses} />
        </>
      )}
    </div>
  )
}

export default TeacherDashboard
