import React from 'react';
export default function MyRequest() {
    return (
        <div className="w-full min-h-screen bg-gray-100 p-6">
          <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-purple-700">
                Show groups that are inviting you
              </h2>
              <button className="bg-purple-200 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-300">
                Group You're Invited
              </button>
            </div>
    
            {/* Bảng danh sách lời mời */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="border p-3">No.</th>
                    <th className="border p-3">Group</th>
                    <th className="border p-3">Description</th>
                    <th className="border p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: 1,
                      group: "FPT University Academic Portal",
                      description: "Cổng thông tin học thuật Đại học FPT",
                    },
                  ].map((group, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="border p-3">{group.id}</td>
                      <td className="border p-3 text-blue-600 hover:underline cursor-pointer">
                        {group.group}
                      </td>
                      <td className="border p-3">{group.description}</td>
                      <td className="border p-3 text-center">
                        <button className="bg-purple-500 text-white px-4 py-1 rounded-md hover:bg-purple-600 mr-2">
                          Accept
                        </button>
                        <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

}