import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const DetailIdea: React.FC = () => {
  const ideaDetails = [
    { label: 'Title', value: 'Innovative Project' },
    { label: 'Description', value: 'This is a groundbreaking idea that aims to revolutionize the industry.' },
    { label: 'Author', value: 'John Doe' },
    { label: 'Date', value: 'February 25, 2025' },
    { label: 'Category', value: 'Technology' },
    { label: 'Impact', value: 'High' },
    { label: 'Investment Needed', value: '$500,000' },
    { label: 'Stage', value: 'Prototype' },
    { label: 'Target Audience', value: 'Startups & Enterprises' },
    { label: 'Market Size', value: '$10B' },
    { label: 'Team Members', value: '5' },
    { label: 'Timeline', value: '6 months' },
    { label: 'Key Challenges', value: 'Market adoption & funding' }
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>View Idea Details</Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl font-bold text-blue-600'>Detail Idea</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-1/3 font-bold text-gray-700'>Field</TableHead>
              <TableHead className='text-gray-700'>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideaDetails.map((detail, index) => (
              <TableRow key={index}>
                <TableCell className='font-bold text-gray-600'>{detail.label}:</TableCell>
                <TableCell className='text-gray-600'>{detail.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

export default DetailIdea
