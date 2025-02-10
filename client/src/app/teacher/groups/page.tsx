'use client'
import { useState } from 'react'
const page = () => {
  if (typeof window === 'undefined') {
    throw new Error('This page requires client-side rendering')
  }
  const [selectedIter, setSelectedIter] = useState(1)

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Group Management</h1>

      <div className='flex gap-4 mb-8'>
        {[1, 2, 3, 4, 5].map((iter) => (
          <button
            key={iter}
            onClick={() => setSelectedIter(iter)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors
              ${selectedIter === iter ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Iter {iter}
          </button>
        ))}
      </div>

      <div className='w-full overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border p-3 text-left'>Group Code</th>
              <th className='border p-3 text-left'>Group Name</th>
              <th className='border p-3 text-left'>Members</th>
              <th className='border p-3 text-left'>Topic</th>
              <th className='border p-3 text-left'>Status</th>
              <th className='border p-3 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border p-3'>G001</td>
              <td className='border p-3'>Group 1</td>
              <td className='border p-3'>5 members</td>
              <td className='border p-3'>Project Management System</td>
              <td className='border p-3'>
                <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm'>Completed</span>
              </td>
              <td className='border p-3'>
                <button className='text-blue-500 hover:text-blue-700'>Details</button>
              </td>
            </tr>
            <tr>
              <td className='border p-3'>G002</td>
              <td className='border p-3'>Group 2</td>
              <td className='border p-3'>4 members</td>
              <td className='border p-3'>E-Learning Platform</td>
              <td className='border p-3'>
                <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm'>In Progress</span>
              </td>
              <td className='border p-3'>
                <button className='text-blue-500 hover:text-blue-700'>Details</button>
              </td>
            </tr>
            <tr>
              <td className='border p-3'>G003</td>
              <td className='border p-3'>Group 3</td>
              <td className='border p-3'>3 members</td>
              <td className='border p-3'>Healthcare Management</td>
              <td className='border p-3'>
                <span className='px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm'>Delayed</span>
              </td>
              <td className='border p-3'>
                <button className='text-blue-500 hover:text-blue-700'>Details</button>
              </td>
            </tr>
            <tr>
              <td className='border p-3'>G004</td>
              <td className='border p-3'>Group 4</td>
              <td className='border p-3'>6 members</td>
              <td className='border p-3'>Financial Management</td>
              <td className='border p-3'>
                <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm'>Completed</span>
              </td>
              <td className='border p-3'>
                <button className='text-blue-500 hover:text-blue-700'>Details</button>
              </td>
            </tr>
            <tr>
              <td className='border p-3'>G005</td>
              <td className='border p-3'>Group 5</td>
              <td className='border p-3'>4 members</td>
              <td className='border p-3'>Cybersecurity</td>
              <td className='border p-3'>
                <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm'>In Progress</span>
              </td>
              <td className='border p-3'>
                <button className='text-blue-500 hover:text-blue-700'>Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page
