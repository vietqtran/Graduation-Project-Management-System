'use client'
import React, { useState, useEffect } from 'react'
import { useAppSelector } from '@/hooks'
import { Field } from '@/types/field.type'
import { Major } from '@/types/major.type'
import { Campus } from '@/types/campus.type'
import { useRouter } from '@/hooks/useRouter'
import instance from '@/utils/axios'
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
  const [errors, setErrors] = useState<Error>({})

  const [majors, setMajors] = useState<Major[]>([])
  const [fields, setFields] = useState<Field[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()
  useEffect(() => {
    async function fetchData() {
      try {
        // Lấy dữ liệu majors
        const majorResponse = await instance.get('/public/majors', { withCredentials: true })
        if (Array.isArray(majorResponse.data.data)) {
          setMajors(majorResponse.data.data)
        } else {
          console.error('Invalid data format for majors', majorResponse.data)
        }

        // Lấy dữ liệu fields
        const fieldResponse = await instance.get('/public/fields')
        if (Array.isArray(fieldResponse.data.data)) {
          setFields(fieldResponse.data.data)
        } else {
          console.error('Invalid data format for fields', fieldResponse.data)
        }

        // Lấy dữ liệu campuses
        const campusResponse = await instance.get('/public/campuses')
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
      return
    }

    if (!user) {
      return
    }

    setLoading(true)
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
      const res = await instance.post('/ideas/create-idea', ideaData, { withCredentials: true })
      console.log('Create idea response:', res.data)
      setFormData({ name: '', description: '', majors: [], fields: [], campus: '' })
      setErrors({}) // Xóa lỗi sau khi submit thành công
      setShowSuccessModal(true) // Show the success modal
    } catch (err) {
      console.error('Error creating idea:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
    router.push('/team')
  }

  return (
    <div className='max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300'>
      <h2 className='text-xl font-semibold text-center'>Create New Project</h2>

      {/* Project Name */}
      <div className='mt-4'>
        <label className='font-semibold text-gray-700'>English Title </label>
        <label className='text-red-500'>*</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className={`w-full border p-2 rounded-md mt-1 ${errors.name ? 'border-red-500' : ''}`}
          placeholder='What is your idea?'
        />
        {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
      </div>

      {/* Description */}
      <div className='mt-4'>
        <label className='font-semibold text-gray-700'>Description </label>
        <label className='text-red-500'>*</label>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          className={`w-full border p-2 rounded-md mt-1 h-24 ${errors.description ? 'border-red-500' : ''}`}
          placeholder='Describe your idea'
        ></textarea>
        {errors.description && <p className='text-red-500 text-sm'>{errors.description}</p>}
      </div>

      {/* Field and Major Checkboxes */}

      {/* Field Checkboxes */}
      <div className='mt-4'>
        <label className='font-semibold text-gray-700'>Field </label>
        <label className='text-red-500'>*</label>
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
        <label className='font-semibold text-gray-700'>Major </label>
        <label className='text-red-500'>*</label>
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
        <label className='font-semibold text-gray-700'>Campus </label>
        <label className='text-red-500'>*</label>
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

      {/* Create Button */}
      <button
        onClick={handleSubmit}
        className={`w-full mt-6 py-2 rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create'}
      </button>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-8 rounded-md shadow-lg text-center'>
            <div className='text-green-500 text-3xl'>✔️</div>
            <p className='font-semibold text-lg mt-2'>You created an idea successfully</p>
            <button onClick={handleCloseModal} className='mt-4 py-2 px-6 rounded-md bg-blue-600 text-white'>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
