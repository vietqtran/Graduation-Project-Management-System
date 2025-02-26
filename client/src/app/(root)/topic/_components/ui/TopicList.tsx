import React from 'react'
import { FaEdit, FaTrashAlt, FaInfoCircle } from 'react-icons/fa' // Import các icon từ FontAwesome

const topics = [
  {
    id: 1,
    name: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts and algorithms.',
    requirements: 'Basic Python knowledge',
    prerequisites: 'Linear Algebra, Probability & Statistics',
    guidelines: 'Refer to Andrew Ng’s ML course on Coursera'
  },
  {
    id: 2,
    name: 'Cybersecurity Essentials',
    description: 'Fundamental principles of cybersecurity and risk management.',
    requirements: 'Basic networking knowledge',
    prerequisites: 'Computer Networks, Operating Systems',
    guidelines: 'Read “The Web Application Hacker’s Handbook”'
  },
  {
    id: 3,
    name: 'Web Development with React',
    description: 'Building modern web applications using React.js.',
    requirements: 'Basic HTML, CSS, JavaScript',
    prerequisites: 'JavaScript ES6, DOM Manipulation',
    guidelines: 'Follow React documentation at react.dev'
  },
  {
    id: 4,
    name: 'Data Science & Analytics',
    description: 'Exploring data processing, visualization, and analysis techniques.',
    requirements: 'Python, Pandas, and Matplotlib',
    prerequisites: 'Statistics, Data Wrangling',
    guidelines: 'Explore Kaggle datasets and practice analysis'
  },
  {
    id: 5,
    name: 'Game Development with Unity',
    description: 'Creating interactive games using Unity and C#.',
    requirements: 'Basic C# knowledge',
    prerequisites: 'Object-Oriented Programming, 3D Math',
    guidelines: 'Follow Unity Learn tutorials'
  }
]

const TopicList = () => {
  return (
    <div className='flex flex-col gap-2 p-4 border rounded-lg shadow-md w-full h-full'>
      <h2 className='text-lg font-semibold mb-2'>Available Topics</h2>
      {topics.map((topic) => (
        <div key={topic.id} className='p-3 border rounded-lg bg-gray-100 w-full relative'>
          <h3 className='font-medium text-lg'>{topic.name}</h3>
          <p className='text-sm text-gray-600'>{topic.description}</p>
          <p className='text-sm'>
            <strong>Requirements:</strong> {topic.requirements}
          </p>
          <p className='text-sm'>
            <strong>Prerequisites:</strong> {topic.prerequisites}
          </p>
          <p className='text-sm'>
            <strong>Guidelines:</strong> {topic.guidelines}
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
      ))}
    </div>
  )
}

export default TopicList
