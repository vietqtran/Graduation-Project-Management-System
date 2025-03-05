'use client'

import React, { useState, ChangeEvent } from 'react'

// Định nghĩa kiểu dữ liệu cho thành viên trong nhóm
interface Member {
  id: number
  name: string
  role: string
  progress: number // từ 0 đến 100
  tasksCompleted: number
  status: string
}

// Định nghĩa kiểu dữ liệu cho nhóm
interface Group {
  id: number
  name: string
  status: string
  progress: number // tiến độ trung bình của nhóm
  members: Member[]
}

// Dữ liệu mẫu: 5 nhóm, mỗi nhóm có 5 thành viên
const dummyGroups: Group[] = [
  {
    id: 1,
    name: 'Group A',
    status: 'Active',
    progress: 60,
    members: [
      { id: 1, name: 'Alice', role: 'Leader', progress: 80, tasksCompleted: 4, status: 'Active' },
      { id: 2, name: 'Bob', role: 'Member', progress: 50, tasksCompleted: 2, status: 'Active' },
      { id: 3, name: 'Charlie', role: 'Member', progress: 60, tasksCompleted: 3, status: 'Active' },
      { id: 4, name: 'David', role: 'Member', progress: 70, tasksCompleted: 3, status: 'Active' },
      { id: 5, name: 'Eve', role: 'Member', progress: 50, tasksCompleted: 2, status: 'Active' }
    ]
  },
  {
    id: 2,
    name: 'Group B',
    status: 'Pending',
    progress: 40,
    members: [
      { id: 1, name: 'Frank', role: 'Leader', progress: 60, tasksCompleted: 3, status: 'Pending' },
      { id: 2, name: 'Grace', role: 'Member', progress: 40, tasksCompleted: 2, status: 'Pending' },
      { id: 3, name: 'Heidi', role: 'Member', progress: 30, tasksCompleted: 1, status: 'Pending' },
      { id: 4, name: 'Ivan', role: 'Member', progress: 50, tasksCompleted: 2, status: 'Pending' },
      { id: 5, name: 'Judy', role: 'Member', progress: 40, tasksCompleted: 2, status: 'Pending' }
    ]
  },
  {
    id: 3,
    name: 'Group C',
    status: 'Completed',
    progress: 90,
    members: [
      { id: 1, name: 'Kevin', role: 'Leader', progress: 95, tasksCompleted: 5, status: 'Completed' },
      { id: 2, name: 'Laura', role: 'Member', progress: 90, tasksCompleted: 5, status: 'Completed' },
      { id: 3, name: 'Mallory', role: 'Member', progress: 85, tasksCompleted: 4, status: 'Completed' },
      { id: 4, name: 'Niaj', role: 'Member', progress: 90, tasksCompleted: 5, status: 'Completed' },
      { id: 5, name: 'Olivia', role: 'Member', progress: 90, tasksCompleted: 5, status: 'Completed' }
    ]
  },
  {
    id: 4,
    name: 'Group D',
    status: 'Active',
    progress: 55,
    members: [
      { id: 1, name: 'Peggy', role: 'Leader', progress: 60, tasksCompleted: 3, status: 'Active' },
      { id: 2, name: 'Quentin', role: 'Member', progress: 50, tasksCompleted: 2, status: 'Active' },
      { id: 3, name: 'Rupert', role: 'Member', progress: 55, tasksCompleted: 3, status: 'Active' },
      { id: 4, name: 'Sybil', role: 'Member', progress: 60, tasksCompleted: 3, status: 'Active' },
      { id: 5, name: 'Trent', role: 'Member', progress: 55, tasksCompleted: 3, status: 'Active' }
    ]
  },
  {
    id: 5,
    name: 'Group E',
    status: 'Pending',
    progress: 35,
    members: [
      { id: 1, name: 'Uma', role: 'Leader', progress: 40, tasksCompleted: 2, status: 'Pending' },
      { id: 2, name: 'Victor', role: 'Member', progress: 30, tasksCompleted: 1, status: 'Pending' },
      { id: 3, name: 'Wendy', role: 'Member', progress: 35, tasksCompleted: 2, status: 'Pending' },
      { id: 4, name: 'Xander', role: 'Member', progress: 35, tasksCompleted: 2, status: 'Pending' },
      { id: 5, name: 'Yvonne', role: 'Member', progress: 35, tasksCompleted: 2, status: 'Pending' }
    ]
  }
]

// Component modal hiển thị thông tin chi tiết của từng thành viên
interface MemberProfileModalProps {
  member: Member
  onClose: () => void
}

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ member, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '300px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        <h2>{member.name}s Profile</h2>
        <p>
          <strong>Role:</strong> {member.role}
        </p>
        <p>
          <strong>Progress:</strong> {member.progress}%
        </p>
        <p>
          <strong>Tasks Completed:</strong> {member.tasksCompleted}
        </p>
        <p>
          <strong>Status:</strong> {member.status}
        </p>
        <button onClick={onClose} style={{ marginTop: '10px', padding: '6px 12px' }}>
          Close
        </button>
      </div>
    </div>
  )
}

const TeacherManageGroupStatus: React.FC = () => {
  const [expandedGroups, setExpandedGroups] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // Hàm xử lý mở/đóng chi tiết nhóm
  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  // Hàm render thanh tiến độ
  const renderProgressBar = (progress: number) => (
    <div style={{ width: '100%', background: '#e0e0e0', borderRadius: '4px' }}>
      <div
        style={{
          width: `${progress}%`,
          background: progress >= 80 ? 'green' : progress >= 50 ? 'orange' : 'red',
          height: '8px',
          borderRadius: '4px'
        }}
      />
    </div>
  )

  // Lọc nhóm theo tên dựa trên searchQuery
  const filteredGroups = dummyGroups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Hàm xử lý khi thay đổi input search
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teacher Manage Group Status</h1>

      {/* Thanh tìm kiếm */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type='text'
          placeholder='Tìm kiếm nhóm...'
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ padding: '8px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Group Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Members</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Progress</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.map((group) => (
            <React.Fragment key={group.id}>
              <tr style={{ border: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{group.name}</td>
                <td style={{ padding: '10px' }}>{group.members.length}</td>
                <td style={{ padding: '10px' }}>{group.status}</td>
                <td style={{ padding: '10px', minWidth: '150px' }}>{renderProgressBar(group.progress)}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => toggleGroup(group.id)} style={{ padding: '6px 12px', marginRight: '8px' }}>
                    {expandedGroups.includes(group.id) ? 'Hide Details' : 'View Details'}
                  </button>
                </td>
              </tr>
              {expandedGroups.includes(group.id) && (
                <tr>
                  <td colSpan={5} style={{ padding: '10px', backgroundColor: '#fafafa' }}>
                    {/* Bảng chi tiết thành viên của nhóm */}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Member Name</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Role</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Progress</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tasks Completed</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.members.map((member) => (
                          <tr key={member.id} style={{ border: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{member.name}</td>
                            <td style={{ padding: '8px' }}>{member.role}</td>
                            <td style={{ padding: '8px', minWidth: '120px' }}>{renderProgressBar(member.progress)}</td>
                            <td style={{ padding: '8px' }}>{member.tasksCompleted}</td>
                            <td style={{ padding: '8px' }}>{member.status}</td>
                            <td style={{ padding: '8px' }}>
                              <button onClick={() => setSelectedMember(member)} style={{ padding: '4px 8px' }}>
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal hiển thị thông tin chi tiết của thành viên */}
      {selectedMember && <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </div>
  )
}

export default TeacherManageGroupStatus
