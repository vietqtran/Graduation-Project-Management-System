'use client'

import React, { useState } from 'react'
import MemberProfileModal from './MemberProfileModal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import * as Progress from '@radix-ui/react-progress'
import { SelectContent } from '@radix-ui/react-select'

interface Member {
  id: number
  name: string
  role: string
  progress: number
  tasksCompleted: number
  status: string
}

interface Group {
  id: number
  name: string
  status: string
  progress: number
  members: Member[]
}

const groups: Group[] = [
  {
    id: 1,
    name: 'Group A',
    status: 'Active',
    progress: 80,
    members: [
      { id: 1, name: 'Alice', role: 'Leader', progress: 90, tasksCompleted: 10, status: 'Active' },
      { id: 2, name: 'Bob', role: 'Member', progress: 70, tasksCompleted: 7, status: 'Active' }
    ]
  },
  {
    id: 2,
    name: 'Group B',
    status: 'Pending',
    progress: 60,
    members: [
      { id: 3, name: 'Charlie', role: 'Leader', progress: 75, tasksCompleted: 8, status: 'Pending' },
      { id: 4, name: 'David', role: 'Member', progress: 50, tasksCompleted: 5, status: 'Pending' }
    ]
  }
]

const ProgressBar = ({ progress }: { progress: number }) => (
  <Progress.Root className='relative w-full h-2 bg-gray-200 rounded overflow-hidden'>
    <Progress.Indicator className='h-full bg-blue-500 transition-all' style={{ width: `${progress}%` }} />
  </Progress.Root>
)

const GroupRow: React.FC = () => {
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const toggleGroup = (groupId: number) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId)
  }

  const filteredGroups = groups.filter((group) => {
    return (
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === 'All' || group.status === statusFilter)
    )
  })

  return (
    <Card className='p-4 space-y-4'>
      {/* Search & Filter Controls */}
      <div className='flex space-x-4'>
        <Input placeholder='Search groups...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
          <SelectContent>
            <SelectItem value='All'>All Statuses</SelectItem>
            <SelectItem value='Active'>Active</SelectItem>
            <SelectItem value='Pending'>Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Group Name</TableCell>
            <TableCell>Members</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGroups.map((group) => (
            <React.Fragment key={group.id}>
              <TableRow>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.members.length}</TableCell>
                <TableCell>{group.status}</TableCell>
                <TableCell>
                  <ProgressBar progress={group.progress} />
                </TableCell>
                <TableCell>
                  <Button onClick={() => toggleGroup(group.id)}>
                    {expandedGroupId === group.id ? 'Hide Details' : 'View Details'}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedGroupId === group.id && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Member Name</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Progress</TableCell>
                          <TableCell>Tasks Completed</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>
                              <ProgressBar progress={member.progress} />
                            </TableCell>
                            <TableCell>{member.tasksCompleted}</TableCell>
                            <TableCell>{member.status}</TableCell>
                            <TableCell>
                              <Button onClick={() => setSelectedMember(member)}>View Profile</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {selectedMember && <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </Card>
  )
}

export default GroupRow
