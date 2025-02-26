// StatusTable.tsx
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';  // Nhập các components từ thư mục ui
import { FaComment } from 'react-icons/fa';   
interface Task {
  title: string;
  due: string;
  status: string;
  description: string;  // Mô tả phụ cho mỗi task
  commentCount: number;  // Số lượng bình luận
}

interface StatusTableProps {
  tasks: Task[];
}

// Hàm để trả về màu sắc tương ứng với mỗi trạng thái
const getStatusLabelClass = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-200 text-green-900';
    case 'In Progress':
      return 'bg-yellow-200 text-yellow-900';
    case 'Overdue':
      return 'bg-red-200 text-red-900';
      case 'Submitted':
      return 'bg-blue-200 text-blue-900';
      case 'Following':
      return 'bg-green-200 text-green-900';
    default:
      return 'bg-gray-200 text-white';
  }
};

const StatusTable: React.FC<StatusTableProps> = ({ tasks }) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <Table className="min-w-full text-sm text-left text-gray-500">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3">Title</TableHead>
            <TableHead className="px-6 py-3">Due</TableHead>
            <TableHead className="px-6 py-3">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={index} className="bg-white border-b hover:bg-gray-50">
              <TableCell className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{task.title}</span>
                  <div className="flex items-center space-x-1">
                    <FaComment className="text-gray-500 text-sm" />
                    <span className="text-xs text-gray-500">{task.commentCount}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{task.description}</p>
              </TableCell>
              <TableCell className="px-6 py-4">{task.due}</TableCell>
              <TableCell className="px-6 py-4">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusLabelClass(task.status)}`}>
                  {task.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatusTable;
