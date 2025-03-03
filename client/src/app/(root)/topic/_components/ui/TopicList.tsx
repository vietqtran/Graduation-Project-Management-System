'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaEdit, FaTrashAlt, FaInfoCircle } from 'react-icons/fa'
import instance from '@/utils/axios'

export interface Project {
  _id: string
  name: string
  description: string
  majorId?: string // Thêm `majorId` để lọc
}

interface TopicListProps {
  selectedMajorId: string | null // Major đang được chọn
}

const parseDescription = (desc: string) => {
  const match = desc.match(
    /^(.*?)\s*Requirements:\s*([.\s\S]*?)\s*Prerequisites:\s*([.\s\S]*?)\s*Guidelines:\s*([.\s\S]*)$/
  )

  if (match) {
    return {
      mainDescription: match[1].trim(),
      requirements: match[2].trim(),
      prerequisites: match[3].trim(),
      guidelines: match[4].trim()
    }
  }

  return {
    mainDescription: desc,
    requirements: 'N/A',
    prerequisites: 'N/A',
    guidelines: 'N/A'
  }
}

const TopicList: React.FC<TopicListProps> = ({ selectedMajorId }) => {
  const [topics, setTopics] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(true)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await instance.get('/project/get-project-with-null-status', { withCredentials: true })
        console.log(response.data)
        if (response.data.data.length > 0) {
          setTopics(response.data.data)
          setHasData(true)
        } else {
          setHasData(false)
        }
      } catch (error) {
        console.error('Error fetching topics:', error)
        setHasData(false)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  // **Lọc topics theo `selectedMajorId`**
  const filteredTopics = selectedMajorId
    ? topics.filter(topic => topic.majorId === selectedMajorId)
    : topics

 return (
  <div className='flex flex-col gap-2 p-4 border rounded-lg shadow-md w-full h-full'>
    <h2 className='text-lg font-semibold mb-2'>Available Topics</h2>

    {loading ? (
      <div className="text-center text-gray-500">Loading...</div>
    ) : hasData && filteredTopics.length > 0 ? (
      filteredTopics.map((topic) => {
        const { mainDescription, requirements, prerequisites, guidelines } = parseDescription(topic.description)

        return (
          <div key={topic._id} className='p-3 border rounded-lg bg-gray-100 w-full relative'>
            <h3 className='font-medium text-lg'>{topic.name}</h3>
            <p className='text-sm text-gray-600'>{mainDescription}</p>
            <p className='text-sm'>
              <strong>Requirements:</strong> {requirements}
            </p>
            <p className='text-sm'>
              <strong>Prerequisites:</strong> {prerequisites}
            </p>
            <p className='text-sm'>
              <strong>Guidelines:</strong> {guidelines}
            </p>

            {/* Các icon sửa, xóa và chi tiết */}
            <div className='absolute top-2 right-2 flex gap-3'>
              <button className='text-blue-500 hover:text-blue-700' title='Edit'>
                <FaEdit size={20} />
              </button>
              <button className='text-red-500 hover:text-red-700' title='Delete'>
                <FaTrashAlt size={20} />
              </button>
              <button className='text-green-500 hover:text-green-700' title='Detail'>
                <FaInfoCircle size={20} />
              </button>
            </div>
          </div>
        )
      })
    ) : (
      <div className="flex flex-col items-center justify-center mt-10">
        <Image src="/gif/no-data.gif" alt="No data" width={100} height={100} />
        <p className="text-gray-500 mt-2">No Data</p>
      </div>
    )}
  </div>
)

}

export default TopicList
