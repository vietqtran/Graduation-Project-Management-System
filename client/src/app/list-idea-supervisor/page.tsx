import React from 'react';
export default function ListIdeaOfSupervisor() {
  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300">
        {/* Tiêu đề */}
        <h2 className="text-xl font-semibold text-blue-700">
          View Ideas of Other Supervisors
        </h2>

        {/* Bảng danh sách ý tưởng */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="border p-3">Project English Name</th>
                <th className="border p-3">Project Vietnamese Name</th>
                <th className="border p-3">Abbreviation</th>
                <th className="border p-3">Mentor</th>
                <th className="border p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  nameEn: "Japanese",
                  nameVi: "Tiếng Nhật",
                  abbreviation: "TOD",
                  mentor: "anhns59@fpt.edu.vn",
                },
                {
                  nameEn: "Learning English App",
                  nameVi: "Ứng dụng học tiếng anh",
                  abbreviation: "LJA",
                  mentor: "devhead@fpt.edu.vn",
                },
              ].map((project, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="border p-3">{project.nameEn}</td>
                  <td className="border p-3">{project.nameVi}</td>
                  <td className="border p-3 text-center">{project.abbreviation}</td>
                  <td className="border p-3">{project.mentor}</td>
                  <td className="border p-3 text-center">
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600">
                      View
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