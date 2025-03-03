'use client'

import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

interface Request {
  id: number
  remark: string
  to_user: string
  type: string
  from_user: string
  document: string
  due_date?: string // Có thể null hoặc undefined
  status: string
  create_at?: string // Có thể null hoặc undefined
  update_at?: string // Có thể null hoặc undefined
}

interface RequestTableProps {
  requests: Request[]
}

const RequestTable: React.FC<RequestTableProps> = ({ requests }) => {
  console.log('data', requests)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Remark</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>To User</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.status || 'N/A'}</TableCell>
            <TableCell>{request.remark || 'N/A'}</TableCell>
            <TableCell>{request.create_at ? new Date(request.create_at).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell>{request.update_at ? new Date(request.update_at).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell>{request.due_date ? new Date(request.due_date).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell>{request.to_user || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RequestTable
