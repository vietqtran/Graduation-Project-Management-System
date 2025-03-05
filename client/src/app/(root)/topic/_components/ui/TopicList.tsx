'use client'

import instance from '@/utils/axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaInfoCircle, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'sonner'
import TopicModal from './TopicModal'
import ConfirmModal from './ConfirmModal'

export interface Project {
  _id: string
  name: string
  description: string
  majorId?: string
  major: { _id: string; name: string }[]
  field: { _id: string; name: string }[]
  document: string
  campus: { _id: string; name: string } | null
  category: string
}

interface TopicListProps {
  selectedMajorId: string | null
  searchTerm: string
  sortOrder: string
  filterField: string
  refresh: boolean
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
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

const TopicList: React.FC<TopicListProps> = ({
  selectedMajorId,
  searchTerm,
  sortOrder,
  filterField,
  refresh,
  setRefresh
}) => {
  const [topics, setTopics] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState<Project | null>(null)
  const [modalType, setModalType] = useState<'update' | 'detail' | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string | null }>({ id: null })
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await instance.get('/project/get-project-with-null-status', { withCredentials: true })
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
  }, [refresh, selectedMajorId, searchTerm, sortOrder, filterField])

  const handleDelete = async (id: string) => {
    setConfirmDelete({ id })
  }

  const confirmDeleteTopic = async () => {
    if (!confirmDelete.id) return

    try {
      await instance.delete(`/project/delete-topic/${confirmDelete.id}`, { withCredentials: true })
      toast.success('Topic deleted successfully!')
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error deleting topic:', error)
      toast.error('Failed to delete topic.')
    } finally {
      setConfirmDelete({ id: null })
    }
  }

  const handleEdit = (topic: Project) => {
    setSelectedTopic(topic)
    setModalType('update')
  }

  const handleDetail = async (id: string) => {
    try {
      const response = await instance.get(`/project/detail-topic/${id}`, { withCredentials: true })
      console.log('Detailed Topic Response:', response.data)
      setSelectedTopic(response.data)
      setModalType('detail')
    } catch (error) {
      console.error('Error fetching topic details:', error)
      toast.error('Failed to fetch topic details.')
    }
  }

  const closeModal = () => {
    setSelectedTopic(null)
    setModalType(null)
  }

  return (
    <div className='flex flex-col gap-2 p-4 border rounded-lg shadow-md w-full h-full'>
      <h2 className='text-lg font-semibold mb-2'>Available Topics</h2>

      {loading ? (
        <div className='text-center text-gray-500'>Loading...</div>
      ) : hasData && topics.length > 0 ? (
        topics.map((topic) => {
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

              <div className='absolute top-2 right-2 flex gap-3'>
                <button className='text-blue-500 hover:text-blue-700' title='Edit' onClick={() => handleEdit(topic)}>
                  <FaEdit size={20} />
                </button>
                <button
                  className='text-red-500 hover:text-red-700'
                  title='Delete'
                  onClick={() => handleDelete(topic._id)}
                >
                  <FaTrashAlt size={20} />
                </button>
                <button
                  className='text-green-500 hover:text-green-700'
                  title='Detail'
                  onClick={() => handleDetail(topic._id)}
                >
                  <FaInfoCircle size={20} />
                </button>
              </div>
            </div>
          )
        })
      ) : (
        <div className='flex flex-col items-center justify-center mt-10'>
          <Image src='/gif/no-data.gif' alt='No data' width={100} height={100} />
          <p className='text-gray-500 mt-2'>No Data for {selectedMajorId}</p>
        </div>
      )}

      {modalType && selectedTopic && (
        <TopicModal topic={selectedTopic} type={modalType} onClose={closeModal} onSubmit={() => setRefresh(!refresh)} />
      )}

      <ConfirmModal
        isOpen={!!confirmDelete.id}
        onClose={() => setConfirmDelete({ id: null })}
        onConfirm={confirmDeleteTopic}
      />
    </div>
  )
}

export default TopicList
