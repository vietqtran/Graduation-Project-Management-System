// TeacherDashboard.tsx
import React from 'react'
import StatusBar from './StatusBar'
import StatusTable from './StatusTable'

const TeacherDashboard: React.FC = () => {
  const tasks = [
    {
      title: 'Math Homework',
      due: '2025-03-01 22:00:00',
      status: 'Overdue',
      description: 'Complete the math exercises',
      commentCount: 2
    },
    {
      title: 'Science Project',
      due: '2025-02-28 22:00:00',
      status: 'Submitted',
      description: 'Submit the science project report',
      commentCount: 5
    },
    {
      title: 'English Essay',
      due: '2025-03-05 22:00:00',
      status: 'In Progress',
      description: 'Write an essay on Shakespeare',
      commentCount: 3
    },
    {
      title: 'English Essay',
      due: '2025-03-05 22:00:00',
      status: 'Following',
      description: 'Write an essay on Shakespeare',
      commentCount: 3
    },
    {
      title: 'English Essay',
      due: '2025-03-05 22:00:00',
      status: 'In Progress',
      description: 'Write an essay on Shakespeare',
      commentCount: 3
    },
    {
      title: 'English Essay',
      due: '2025-03-05 22:00:00',
      status: 'Overdue',
      description: 'Write an essay on Shakespeare',
      commentCount: 3
    }
  ]

  return (
    <div className='p-6'>
      <StatusBar setIsFilterOpen={() => {}} />
      <StatusTable tasks={tasks} />
    </div>
  )
}

export default TeacherDashboard
