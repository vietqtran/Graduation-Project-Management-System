import CheckProjectExistsProvider from '@/components/providers/CheckProjectExistsProvider'
import DocumentManager from './_components/DocumentPage'
import React from 'react'

const page = () => {
  return (
    <CheckProjectExistsProvider>
      <DocumentManager />
    </CheckProjectExistsProvider>
  )
}

export default page
