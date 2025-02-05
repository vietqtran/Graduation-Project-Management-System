'use client'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useManagement from '@/hooks/useManagement'
import { DeadlinesResponse, ParametersResponse } from '@/types/management.type'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { CONSTANTS } from '@/constants/constants'
import { Ellipsis, Plus } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AddParamDialog from './_components/dialog/add-param'
import EditParamDialog from './_components/dialog/edit-params'
import DeleteParamDialog from './_components/dialog/delete-param'
import EditDeadlineDialog from './_components/dialog/edit-deadline'

dayjs.extend(customParseFormat)

const ManageDeadlines = () => {
  const { getDeadlines, getParameters } = useManagement()
  const [deadlinesData, setDeadlinesData] = useState<DeadlinesResponse>([])
  const [parametersData, setParametersData] = useState<ParametersResponse>([])
  const [selectedParam, setSelectedParam] = useState<ParametersResponse[0] | null>(null)
  const [selectedDeleteParam, setSelectedDeleteParam] = useState<ParametersResponse[0] | null>(null)
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlinesResponse[0] | null>(null)

  const fetchDeadlines = async () => {
    const response = await getDeadlines({ semester: 'SP25' })
    setDeadlinesData(response)
  }
  const fetchParameters = async () => {
    const response = await getParameters()
    setParametersData(response)
  }

  useEffect(() => {
    fetchDeadlines()
    fetchParameters()
  }, [])

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Management</h1>

      {/* Term Selector */}
      <div className='mb-4'>
        <Label htmlFor='term' className='block font-medium mb-2'>
          Term
        </Label>
        <Input id='term' placeholder='SP25' disabled className='w-full' />
      </div>

      {/* Manage Deadlines Table */}
      <div className='mb-8'>
        <h2 className='text-lg font-semibold mb-2'>Deadlines</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Updated by</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Deadline Date</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deadlinesData.map((deadline, index) => (
              <TableRow key={deadline._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{deadline.created_by.display_name}</TableCell>
                <TableCell>{deadline.updated_by.display_name}</TableCell>
                <TableCell>{dayjs(deadline.created_at).format(CONSTANTS.FORMAT.DATE_TIME)}</TableCell>
                <TableCell>{dayjs(deadline.updated_at).format(CONSTANTS.FORMAT.DATE_TIME)}</TableCell>
                <TableCell>{dayjs(deadline.deadline_date).format(CONSTANTS.FORMAT.DATE_TIME)}</TableCell>
                <TableCell>{deadline.deadline_key}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm'>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedDeadline(deadline)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Manage Parameters Section */}
      <div>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-lg font-semibold mb-2'>Manage Parameters</h2>
          <AddParamDialog onSuccess={() => fetchDeadlines()}>
            <Button variant='outline' size='sm'>
              <Plus /> Add
            </Button>
          </AddParamDialog>
        </div>
        <Table className='mb-4'>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Parameter Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parametersData?.map((parameter, index) => (
              <TableRow key={parameter._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{parameter.param_name}</TableCell>
                <TableCell>{parameter.param_value}</TableCell>
                <TableCell>{dayjs(parameter.created_at).format(CONSTANTS.FORMAT.DATE_TIME)}</TableCell>
                <TableCell>{dayjs(parameter.updated_at).format(CONSTANTS.FORMAT.DATE_TIME)}</TableCell>
                <TableCell>{parameter.param_type}</TableCell>
                <TableCell>{parameter.description}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm'>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedParam(parameter)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedDeleteParam(parameter)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedParam && (
        <EditParamDialog
          parameter={selectedParam}
          onClose={() => {
            setSelectedParam(null)
            fetchParameters()
          }}
        />
      )}
      {selectedDeleteParam && (
        <DeleteParamDialog
          parameter={selectedDeleteParam}
          onClose={() => {
            setSelectedDeleteParam(null)
            fetchParameters()
          }}
        />
      )}
      {selectedDeadline && (
        <EditDeadlineDialog
          deadline={selectedDeadline}
          onClose={() => {
            setSelectedDeadline(null)
            fetchDeadlines()
          }}
        />
      )}
    </div>
  )
}

export default ManageDeadlines
