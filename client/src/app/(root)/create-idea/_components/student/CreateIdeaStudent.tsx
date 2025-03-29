'use client'

import React, { useState } from 'react'

import { AxiosError } from 'axios'
import { Campus } from '@/types/campus.type'
import { Field } from '@/types/field.type'
import { Major } from '@/types/major.type'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import useCampus from '@/hooks/public/useCampus'
import useField from '@/hooks/public/useField'
import useMajor from '@/hooks/public/useMajor'
import { useRouter } from '@/hooks/useRouter'

// Định nghĩa types cho formData và errors
interface FormData {
  name: string
  description: string
  majors: string[]
  fields: string[]
  campus: string
}

interface FormErrors {
  name?: string
  description?: string
  majors?: string
  fields?: string
  campus?: string
}

// Component cho Field Checkboxes
const FieldCheckboxes: React.FC<{
  fields: Field[]
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: FormErrors
}> = ({ fields, formData, handleChange, errors }) => (
  <div className='mt-6'>
    <label className='block font-semibold text-gray-800'>
      Field <span className='text-red-500'>*</span>
    </label>
    <div className='mt-2 grid grid-cols-2 gap-3'>
      {fields.map((field: Field) => (
        <div key={field._id} className='flex items-center'>
          <input
            type='checkbox'
            id={`field-${field._id}`}
            name='fields'
            value={field._id}
            checked={formData.fields.includes(field._id)}
            onChange={handleChange}
            className='w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
            aria-invalid={!!errors.fields}
            aria-describedby={errors.fields ? `field-error-${field._id}` : undefined}
          />
          <label htmlFor={`field-${field._id}`} className='ml-2 text-gray-700'>
            {field.name}
          </label>
        </div>
      ))}
    </div>
    {errors.fields && (
      <p id='field-error' className='text-red-500 text-sm mt-1 flex items-center gap-1'>
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        {errors.fields}
      </p>
    )}
  </div>
)

// Component cho Major Checkboxes
const MajorCheckboxes: React.FC<{
  majors: Major[]
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: FormErrors
}> = ({ majors, formData, handleChange, errors }) => (
  <div className='mt-6'>
    <label className='block font-semibold text-gray-800'>
      Major <span className='text-red-500'>*</span>
    </label>
    <div className='mt-2 grid grid-cols-2 gap-3'>
      {majors.map((major: Major) => (
        <div key={major._id} className='flex items-center'>
          <input
            type='checkbox'
            id={`major-${major._id}`}
            name='majors'
            value={major._id}
            checked={formData.majors.includes(major._id)}
            onChange={handleChange}
            className='w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
            aria-invalid={!!errors.majors}
            aria-describedby={errors.majors ? `major-error-${major._id}` : undefined}
          />
          <label htmlFor={`major-${major._id}`} className='ml-2 text-gray-700'>
            {major.name}
          </label>
        </div>
      ))}
    </div>
    {errors.majors && (
      <p id='major-error' className='text-red-500 text-sm mt-1 flex items-center gap-1'>
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        {errors.majors}
      </p>
    )}
  </div>
)

// Component cho Campus Dropdown
const CampusDropdown: React.FC<{
  campuses: Campus[]
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  errors: FormErrors
  isLoading: boolean
}> = ({ campuses, formData, handleChange, errors, isLoading }) => (
  <div className='mt-6'>
    <label htmlFor='campus' className='block font-semibold text-gray-800'>
      Campus <span className='text-red-500'>*</span>
    </label>
    {isLoading ? (
      <div className='flex items-center gap-2'>
        <svg
          className='animate-spin h-5 w-5 text-purple-600'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
        <span>Loading campuses...</span>
      </div>
    ) : (
      <select
        id='campus'
        name='campus'
        value={formData.campus}
        onChange={handleChange}
        className={`w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 ${
          errors.campus ? 'border-red-500' : 'border-gray-300'
        }`}
        aria-invalid={!!errors.campus}
        aria-describedby={errors.campus ? 'campus-error' : undefined}
      >
        <option value=''>Select Campus</option>
        {campuses.map((campus: Campus) => (
          <option key={campus._id} value={campus._id}>
            {campus.name}
          </option>
        ))}
      </select>
    )}
    {errors.campus && (
      <p id='campus-error' className='text-red-500 text-sm mt-1 flex items-center gap-1'>
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        {errors.campus}
      </p>
    )}
  </div>
)

export default function CreateIdea() {
  const user = useAppSelector((state) => state.auth.user)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    majors: [],
    fields: [],
    campus: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const router = useRouter()
  const { campuses, isLoading: isLoadingCampuses, error: campusError } = useCampus()
  const { majors, isLoading: isLoadingMajors, error: majorError } = useMajor()
  const { fields, isLoading: isLoadingFields, error: fieldError } = useField()

  // Kiểm tra loading và error
  if (isLoadingCampuses || isLoadingMajors || isLoadingFields) {
    return <p>Loading...</p>
  }

  if (campusError || majorError || fieldError) {
    return <p>Error loading data</p>
  }

  // Hàm validate form
  const validateForm = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {}
    if (!data.name) newErrors.name = 'Project name is required'
    if (data.majors.length === 0) newErrors.majors = 'At least one major is required'
    if (data.fields.length === 0) newErrors.fields = 'At least one field is required'
    if (!data.campus) newErrors.campus = 'Campus is required'
    return newErrors
  }

  // Hàm xử lý lỗi API
  const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError && error.response) {
      const errorMessage = error.response.data.error.message
      if (errorMessage.includes('name')) {
        setErrors((prev) => ({ ...prev, name: 'Project name already exists' }))
      } else {
        toast.error(errorMessage || 'Validation error')
      }
    } else {
      toast.error('An unexpected error occurred')
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

    if (type === 'checkbox' && (name === 'fields' || name === 'majors')) {
      const values = formData[name] as string[]
      let updatedValues: string[]

      if ((e.target as HTMLInputElement).checked) {
        updatedValues = [...values, value]
      } else {
        updatedValues = values.filter((item) => item !== value)
      }

      setFormData({
        ...formData,
        [name]: updatedValues
      })

      if (updatedValues.length > 0) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors }
          delete newErrors[name as keyof FormErrors]
          return newErrors
        })
      }
    } else {
      setFormData({ ...formData, [name]: value })

      if (value.trim() !== '') {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors }
          delete newErrors[name as keyof FormErrors]
          return newErrors
        })
      }
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = validateForm(formData)

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
      setErrors({})
      setShowSuccessModal(true)
    } catch (error: unknown) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
    router.push('/team')
  }

  return (
    <div className='max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300 my-8'>
      <div className='bg-white p-8 rounded-xl shadow-lg border border-gray-100'>
        <h2 className='text-2xl font-bold text-center text-purple-700'>Create New Project</h2>

        {/* Project Name */}
        <div className='mt-6'>
          <label htmlFor='name' className='block font-semibold text-gray-800'>
            English Title <span className='text-red-500'>*</span>
          </label>
          <input
            id='name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='What is your idea?'
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id='name-error' className='text-red-500 text-sm mt-1 flex items-center gap-1'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div className='mt-6'>
          <label htmlFor='description' className='block font-semibold text-gray-800'>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg mt-2 h-32 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Describe your idea'
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id='description-error' className='text-red-500 text-sm mt-1 flex items-center gap-1'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {errors.description}
            </p>
          )}
        </div>

        {/* Field Checkboxes */}
        {isLoadingFields ? (
          <div className='flex items-center gap-2 mt-6'>
            <svg
              className='animate-spin h-5 w-5 text-purple-600'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            <span>Loading fields...</span>
          </div>
        ) : (
          <FieldCheckboxes fields={fields || []} formData={formData} handleChange={handleChange} errors={errors} />
        )}

        {/* Major Checkboxes */}
        {isLoadingMajors ? (
          <div className='flex items-center gap-2 mt-6'>
            <svg
              className='animate-spin h-5 w-5 text-purple-600'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            <span>Loading majors...</span>
          </div>
        ) : (
          <MajorCheckboxes majors={majors || []} formData={formData} handleChange={handleChange} errors={errors} />
        )}

        {/* Campus Dropdown */}
        <CampusDropdown
          campuses={campuses || []}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isLoading={isLoadingCampuses}
        />

        {/* Create Button */}
        <button
          onClick={handleSubmit}
          className={`w-full mt-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
          }`}
          disabled={loading}
        >
          {loading && (
            <svg
              className='animate-spin h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          )}
          {loading ? 'Creating...' : 'Create'}
        </button>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
            <div className='bg-white p-8 rounded-xl shadow-2xl text-center transform transition-all duration-300 scale-100'>
              <div className='text-green-500 text-5xl animate-bounce'>✔️</div>
              <p className='font-semibold text-xl mt-4 text-gray-800'>You created an idea successfully</p>
              <button
                onClick={handleCloseModal}
                className='mt-6 py-2 px-8 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200'
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
