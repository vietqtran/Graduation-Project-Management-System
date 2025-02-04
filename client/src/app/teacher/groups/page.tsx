'use client'
import { useState } from "react";
const page = () => {
  if (typeof window === 'undefined') {
    throw new Error('This page requires client-side rendering')
  }
  const [selectedIter, setSelectedIter] = useState(1);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý nhóm đồ án</h1>
      
      <div className="flex gap-4 mb-8">
        {[1, 2, 3, 4].map((iter) => (
          <button
            key={iter}
            onClick={() => setSelectedIter(iter)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors
              ${selectedIter === iter 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            Iter {iter}
          </button>
        ))}
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Mã nhóm</th>
              <th className="border p-3 text-left">Tên nhóm</th>
              <th className="border p-3 text-left">Thành viên</th>
              <th className="border p-3 text-left">Đề tài</th>
              <th className="border p-3 text-left">Trạng thái</th>
              <th className="border p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-3">G001</td>
              <td className="border p-3">Nhóm 1</td>
              <td className="border p-3">5 thành viên</td>
              <td className="border p-3">Hệ thống quản lý đồ án</td>
              <td className="border p-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Hoàn thành
                </span>
              </td>
              <td className="border p-3">
                <button className="text-blue-500 hover:text-blue-700">
                  Chi tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page
