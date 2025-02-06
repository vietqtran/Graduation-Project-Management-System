import React from 'react'

const DetailIdeaPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Topic Name */}
        <div>
          <h1 className="text-2xl font-bold">Graduation Thesis Topic Management System</h1>
          <p className="text-gray-500">Submission Date: 15/03/2024</p>
        </div>

        {/* Specialization */}
        <div>
          <h2 className="text-lg font-semibold">Specialization</h2>
          <p>Software Engineering</p>
        </div>

        {/* Group Members */}
        <div>
          <h2 className="text-lg font-semibold">Group Members</h2>
          <ul className="list-disc list-inside">
            <li>Nguyen Van A - SE170001</li>
            <li>Tran Thi B - SE170002</li>
            <li>Le Van C - SE170003</li>
          </ul>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold">Topic Description</h2>
          <p className="text-gray-700">
            The system helps manage the process of registering and implementing graduation thesis topics. 
            It includes functions such as topic registration, assignment of supervising lecturers, 
            progress tracking, and result evaluation.
          </p>
        </div>

        {/* Business Process Diagram */}
        <div>
          <h2 className="text-lg font-semibold">Business Process Diagram</h2>
          <div className="mt-2 border rounded p-4">
            {/* Placeholder for business process diagram */}
            <div className="bg-gray-100 h-64 flex items-center justify-center">
              <p className="text-gray-500">The business process diagram will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailIdeaPage
