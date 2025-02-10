'use client'
import React from 'react'

const page = () => {
  const [selectedMajor, setSelectedMajor] = React.useState<string>('')

  const majors = [
    'Software Engineering',
    'Information Security',
    'Information Systems',
    'Artificial Intelligence',
    'Digital Art & Design'
  ]

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Submit Topic</h1>

      <div className='flex gap-6'>
        {/* Left sidebar with major buttons */}
        <div className='w-64 flex flex-col gap-2'>
          {majors.map((major) => (
            <button
              key={major}
              onClick={() => setSelectedMajor(major)}
              className={`p-3 text-left rounded-lg font-medium transition-colors
                ${selectedMajor === major ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {major}
            </button>
          ))}
        </div>

        {/* Right side form */}
        <div className='flex-1'>
          {selectedMajor ? (
            <form className='max-w-2xl space-y-4'>
              <h2 className='text-xl font-semibold mb-4'>Topic for {selectedMajor}</h2>

              <div>
                <label className='block mb-1 font-medium'>Topic Name</label>
                <input type='text' className='w-full p-2 border rounded-lg' placeholder='Enter topic name' />
              </div>

              <div>
                <label className='block mb-1 font-medium'>Description</label>
                <textarea
                  className='w-full p-2 border rounded-lg min-h-32'
                  placeholder='Provide detailed description about the topic'
                />
              </div>

              <div>
                <label className='block mb-1 font-medium'>Skill Requirements</label>
                <input
                  type='text'
                  className='w-full p-2 border rounded-lg'
                  placeholder='e.g., React, Node.js, Java,...'
                />
              </div>

              <div>
                <label className='block mb-1 font-medium'>Maximum Student Capacity</label>
                <input type='number' min='1' className='w-full p-2 border rounded-lg' />
              </div>

              <button
                type='submit'
                className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
              >
                Submit Topic
              </button>
            </form>
          ) : (
            <div className='grid place-items-center h-full text-gray-500'>Please select a major to submit a topic</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page
