'use client'

import React, { useEffect, useState } from 'react'

import { RequestList } from './RequestList'
import { UploadModal } from './UploadModal'
import instance from '@/utils/axios'

const SubmitRequest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requests, setRequests] = React.useState([])
  const [uploadingRequest, setUploadingRequest] = React.useState('')
  const fetchRequests = async () => {
    try {
      const { data } = await instance.get('/request/student', { withCredentials: true })
      console.log(data)
      setRequests(data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchRequests()
  }, [])
  const handleAddRequest = async (ids: string[]) => {
    try {
      const { data } = await instance.post(
        `/request/student/upload`,
        { documentIds: ids, requestId: uploadingRequest },
        { withCredentials: true }
      )
      console.log(data)
      setIsModalOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='size-full p-5'>
      <RequestList
        onClickOpenUploadModal={(id: string) => {
          setUploadingRequest(id)
          setIsModalOpen(true)
        }}
        requests={requests}
      />
      <UploadModal
        isOpen={isModalOpen}
        requestId={uploadingRequest}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRequest}
      />
    </div>
  )
}

export default SubmitRequest
