'use client'

import React, { useEffect, useState } from 'react'
import { Select, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import MemberProfileModal from './MemberProfileModal'
import { SelectContent } from '@radix-ui/react-select'
import instance from '@/utils/axios'

// Interface cho thành viên
interface Member {
  _id: number
  username: string
  roles: Array<string>
  progress: number
  tasksCompleted: number
  status: string
}

// Interface cho nhóm (dự án)
interface Group {
  _id: string // Sửa từ "id" thành "_id" và dùng string
  name: string
  status: number // Dữ liệu thực tế là số (17, 21, v.v.)
  members: Member[]
}

const GroupRow: React.FC = () => {
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null) // Sửa thành string
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await instance.get('/project/get-projects-by-supervisor', { withCredentials: true })
        const groupInfo = response.data.data.filter((group: Group) => group.status !== null)
        setGroups(groupInfo)
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching groups:', error)
      }
    }
    fetchGroups()
  }, [])

  const toggleGroup = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId)
  }

  const filteredGroups = groups.filter((group) => {
    return (
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === 'All' || group.status.toString() === statusFilter)
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
            <SelectItem value='17'>Active</SelectItem> {/* Giả sử 17 là Active */}
            <SelectItem value='21'>Completed</SelectItem> {/* Giả sử 21 là Completed */}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Group Name</TableCell>
            <TableCell>Members</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGroups.map((group, idx) => (
            <React.Fragment key={group?._id + '' + idx}>
              <TableRow>
                <TableCell>{group?.name}</TableCell>
                <TableCell>{group?.members.length}</TableCell>
                <TableCell>{group?.status}</TableCell>
                <TableCell>
                  <Button onClick={() => toggleGroup(group?._id)}>
                    {expandedGroupId === group?._id ? 'Hide Details' : 'View Details'}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedGroupId === group?._id && group?.members.length > 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Member Name</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group?.members.map((member) => (
                          <TableRow key={member?._id}>
                            <TableCell>{member?.username}</TableCell>
                            <TableCell>{member?.roles[0]}</TableCell> {/* Hiển thị mảng roles */}
                            <TableCell>{member?.status}</TableCell>
                            <TableCell>
                              <Button onClick={() => setSelectedMember(member)}>View Profile</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              ) : expandedGroupId === group?._id ? (
                <TableRow>
                  <TableCell colSpan={4}>No members available for this group</TableCell>
                </TableRow>
              ) : null}
            </React.Fragment>
          )) || (
            <TableRow>
              <TableCell colSpan={4}>No groups found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedMember && <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </Card>
  )
}

export default GroupRow
