'use client'
import React, { useEffect, useState } from 'react'
import instance from '@/utils/axios'

interface Major {
  _id: string
  name: string
}

interface MajorSelectProps {
  onMajorSelect: (majorId: string| null, selectAll?:boolean) => void; // Thêm prop để truyền major ID khi bấm
}

const MajorSelection: React.FC<MajorSelectProps> = ({ onMajorSelect }) => {
  const [majors, setMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(true)

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await instance.get('/public/majors', { withCredentials: true })
        if (response.data.data && response.data.data.length > 0) {
          setMajors(response.data.data)
          setHasData(true)
        } else {
          setHasData(false)
        }
      } catch (error) {
        console.error('Error fetching majors:', error)
        setHasData(false)
      } finally {
        setLoading(false)
      }
    }

    fetchMajors()
  }, [])
  return (
  <div className='w-1/3 border rounded-lg p-4 self-start flex flex-col gap-2'>
    <h2 className='text-lg font-semibold mb-2'>Select Major</h2>

    {loading ? (
      <div className="text-center text-gray-500">Loading...</div>
    ) : hasData ? (
     <>
     <button className='p-2 rounded-md border bg-blue-700 border-gray-300 ' onClick={()=> onMajorSelect(null, true)}>Select all majors</button>
      {majors.map(major => (
        <button
          key={major._id}
          className='p-2 rounded-md border border-gray-300 hover:bg-gray-100'
          onClick={() => onMajorSelect(major._id, false)}
        >
          {major.name}
        </button>
      ))}
      </>
    ) : (
      <div>No majors available</div>
    )}
  </div>
)}


export default MajorSelection;
