'use client'

import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

interface Request {
  id: number
  status: string
  amount: number
  customer: string
  site: string
  date: string
  scheduled: string
  assignedTo: string
}

interface RequestTableProps {
  requests: Request[]
}

const RequestTable: React.FC<RequestTableProps> = ({ requests }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead>Assigned To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.status}</TableCell>
            <TableCell>${request.amount}</TableCell>
            <TableCell>{request.customer}</TableCell>
            <TableCell>{request.site}</TableCell>
            <TableCell>{request.date}</TableCell>
            <TableCell>{request.scheduled}</TableCell>
            <TableCell>{request.assignedTo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RequestTable
