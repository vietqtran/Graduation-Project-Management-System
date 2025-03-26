import BoardPage from './_components/ui/Board'
import CheckProjectExistsProvider from '@/components/providers/CheckProjectExistsProvider'
import React from 'react'

const page = () => {
  return (
    <CheckProjectExistsProvider>
      <BoardPage />
    </CheckProjectExistsProvider>
  )
}

export default page
