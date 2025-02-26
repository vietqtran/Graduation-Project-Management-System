'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAppSelector } from '@/hooks'
import { Field } from '@/types/field.type'
import { Major } from '@/types/major.type'
import { Campus } from '@/types/campus.type'

interface Error {
  [key: string]: string | undefined
}
export default function CreateIdea() {
  const user = useAppSelector((state) => state.auth.user)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    majors: [] as string[], // Chứa mảng các major đã chọn
    fields: [] as string[], // Chứa mảng các field đã chọn
    campus: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Error>({}) 

  const [majors, setMajors] = useState<Major[]>([])
  const [fields, setFields] = useState<Field[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Lấy dữ liệu majors
        const majorResponse = await axios.get('http://localhost:8080/api/public/majors', { withCredentials: true })
        if (Array.isArray(majorResponse.data.data)) {
          setMajors(majorResponse.data.data)
        } else {
          console.error('Invalid data format for majors', majorResponse.data)
        }

        // Lấy dữ liệu fields
        const fieldResponse = await axios.get('http://localhost:8080/api/public/fields')
        if (Array.isArray(fieldResponse.data.data)) {
          setFields(fieldResponse.data.data)
        } else {
          console.error('Invalid data format for fields', fieldResponse.data)
        }

        // Lấy dữ liệu campuses
        const campusResponse = await axios.get('http://localhost:8080/api/public/campuses')
        if (Array.isArray(campusResponse.data.data)) {
          setCampuses(campusResponse.data.data)
        } else {
          console.error('Invalid data format for campuses', campusResponse.data)
        }
      } catch (error) {
        console.error('Error fetching data for dropdowns:', error)
      }
    }
    fetchData()
  }, [])

  // Handle input change for fields and majors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

    if (type === 'checkbox' && (name === 'fields' || name === 'majors')) {
      const values = formData[name] as string[]
      if ((e.target as HTMLInputElement).checked) {
        setFormData({
          ...formData,
          [name]: [...values, value]
        })
      } else {
        setFormData({
          ...formData,
          [name]: values.filter((item) => item !== value)
        })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    const newErrors: Error = {}
    if (!formData.name) newErrors.name = 'Project name is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (formData.majors.length === 0) newErrors.majors = 'At least one major is required'
    if (formData.fields.length === 0) newErrors.fields = 'At least one field is required'
    if (!formData.campus) newErrors.campus = 'Campus is required'

    // Nếu có lỗi, hiển thị thông báo và không gửi dữ liệu
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setMessage('Please fill in all required fields')
      return
    }

    if (!user) {
      setMessage('You need to login to create idea')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const ideaData = {
        name: formData.name,
        description: formData.description,
        major: formData.majors,
        field: formData.fields,
        campus: formData.campus,
        members: [user?._id],
        leader: user?._id
      }
      const res = await axios.post('http://localhost:8080/api/ideas/create-idea', ideaData, { withCredentials: true })
      console.log('Create idea response:', res.data)
      setMessage('Project created successfully!')
      setFormData({ name: '', description: '', majors: [], fields: [], campus: '' })
      setErrors({}) // Xóa lỗi sau khi submit thành công
    } catch (err) {
      setMessage('Something went wrong')
      console.error('Error creating idea:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300'>
      <h2 className='text-xl font-semibold text-center'>Create New Project</h2>

      {/* Project Name */}
      <div className='mt-4'>
        <label className='font-semibold text-gray-700'>Project Name *</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className={`w-full border p-2 rounded-md mt-1 ${errors.name ? 'border-red-500' : ''}`}
          placeholder='Enter project name'
        />
        {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
      </div>

      {/* Description */}
      <div className='mt-4'>
        <label className='font-semibold text-gray-700'>Description *</label>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          className={`w-full border p-2 rounded-md mt-1 h-24 ${errors.description ? 'border-red-500' : ''}`}
          placeholder='Describe your project'
        ></textarea>
        {errors.description && <p className='text-red-500 text-sm'>{errors.description}</p>}
      </div>

      {/* Field Checkboxes */}
      <div className='mt-4'>
        <label className='font-semibold text-gray-700'>Field *</label>
        <div className='space-y-2'>
          {fields.map((field: Field) => (
            <div key={field._id} className='flex items-center'>
              <input
                type='checkbox'
                name='fields'
                value={field._id}
                checked={formData.fields.includes(field._id)}
                onChange={handleChange}
                className='mr-2'
              />
              <label>{field.name}</label>
            </div>
          ))}
        </div>
        {errors.fields && <p className='text-red-500 text-sm'>{errors.fields}</p>}
      </div>

      {/* Major Checkboxes */}
      <div className='mt-4'>
        <label className='font-semibold text-gray-700'>Major *</label>
        <div className='space-y-2'>
          {majors.map((major: Major) => (
            <div key={major._id} className='flex items-center'>
              <input
                type='checkbox'
                name='majors'
                value={major._id}
                checked={formData.majors.includes(major._id)}
                onChange={handleChange}
                className='mr-2'
              />
              <label>{major.name}</label>
            </div>
          ))}
        </div>
        {errors.majors && <p className='text-red-500 text-sm'>{errors.majors}</p>}
      </div>

      {/* Campus Dropdown */}
      <div className='mt-4'>
        <label className='font-semibold text-gray-700'>Campus *</label>
        <select
          name='campus'
          value={formData.campus}
          onChange={handleChange}
          className={`w-full border p-2 rounded-md mt-1 ${errors.campus ? 'border-red-500' : ''}`}
        >
          <option value=''>Select Campus</option>
          {campuses.map((campus: Campus) => (
            <option key={campus._id} value={campus._id}>
              {campus.name}
            </option>
          ))}
        </select>
        {errors.campus && <p className='text-red-500 text-sm'>{errors.campus}</p>}
      </div>

      {/* Team Members */}
      <div className='mt-4'>
        <h3 className='font-semibold text-gray-700'>Team Members</h3>
        <div className='flex items-center justify-between mt-2'>
          <div className='flex items-center space-x-2'>
            <img src='avatar.jpg' alt='User Avatar' className='w-10 h-10 rounded-full' />
            <div>
              <p className='text-sm text-gray-600 font-semibold'>{user?.email}</p>
            </div>
          </div>
          <span className='text-blue-600 text-sm font-semibold'>Owner</span>
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={handleSubmit}
        className={`w-full mt-6 py-2 rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create'}
      </button>

      {/* Thông báo thành công */}
      {message && message.toLowerCase().includes('success') && (
        <div className='bg-green-500 text-white border-l-4 border-green-700 p-3 flex items-center mt-4 font-semibold'>
          <span className='mr-2'>✔️</span>
          {message}
        </div>
      )}

      {/* Thông báo lỗi */}
      {message && message.toLowerCase().includes('wrong') && (
        <div className='bg-red-500 text-white border-l-4 border-red-700 p-3 flex items-center mt-4 font-semibold'>
          <span className='mr-2'>⚠️</span>
          {message}
        </div>
      )}

      {/* Thông báo thông tin */}
      {message && !message.toLowerCase().includes('wrong') && !message.toLowerCase().includes('success') && (
        <div className='bg-blue-400 text-white border-l-4 border-blue-600 p-3 flex items-center mt-4 font-semibold'>
          <span className='mr-2'>ℹ️</span>
          {message}
        </div>
      )}
    </div>
  )
}
