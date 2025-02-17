import React from 'react';
import { Button } from '@/components/ui/button';
export default function ListSupervisor() {
  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300">
        {/* Tiêu đề */}
        <h2 className="text-xl font-semibold text-blue-700">
          The list of Supervisor in this Semester
        </h2>

        {/* Thanh tìm kiếm */}
        <div className="mt-4 flex items-center space-x-2 w-full">
          <label className="text-gray-700 font-medium">FE Email Or Name:</label>
          <input
            type="text"
            className="border p-2 rounded-md flex-1"
            placeholder="FE Email or Name"
          />
          <Button className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500">
            Search
          </Button>
        </div>

        {/* Bảng danh sách Supervisor */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="border p-3">No.</th>
                <th className="border p-3">FullName</th>
                <th className="border p-3">Email</th>
                <th className="border p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: "Nguyễn Ngọc Anh", email: "anhns59@fe.edu.vn" },
                { id: 2, name: "Danh sang", email: "danhsang@fe.edu.vn" },
                { id: 3, name: "Tạ Văn Tiến", email: "devhead@fe.edu.vn" },
                { id: 4, name: "Danh sang", email: "ducdien@fe.edu.vn" },
                { id: 5, name: "Danh sang", email: "jimi@fe.edu.vn" },
              ].map((supervisor, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="border p-3">{supervisor.id}</td>
                  <td className="border p-3">{supervisor.name}</td>
                  <td className="border p-3">{supervisor.email}</td>
                  <td className="border p-3 text-center">
                    <Button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center space-x-2">
          <Button className="text-gray-500 border border-gray-300 px-4 py-2 rounded-md bg-transparent">
            First
          </Button>
          <Button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            1
          </Button>
          <Button className="border border-gray-300 px-4 py-2 rounded-md">
            2
          </Button>
          <Button className="text-gray-500 border border-gray-300 px-4 py-2 rounded-md bg-transparent">
            Last
          </Button>
        </div>
      </div>
    </div>
  );
  }