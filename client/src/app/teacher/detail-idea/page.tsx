import React from 'react'

const DetailIdeaPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Tên đề tài */}
        <div>
          <h1 className="text-2xl font-bold">Hệ thống quản lý đề tài khóa luận tốt nghiệp</h1>
          <p className="text-gray-500">Ngày gửi: 15/03/2024</p>
        </div>

        {/* Chuyên ngành hẹp */}
        <div>
          <h2 className="text-lg font-semibold">Chuyên ngành</h2>
          <p>Công nghệ phần mềm</p>
        </div>

        {/* Danh sách nhóm */}
        <div>
          <h2 className="text-lg font-semibold">Thành viên nhóm</h2>
          <ul className="list-disc list-inside">
            <li>Nguyễn Văn A - SE170001</li>
            <li>Trần Thị B - SE170002</li>
            <li>Lê Văn C - SE170003</li>
          </ul>
        </div>

        {/* Mô tả */}
        <div>
          <h2 className="text-lg font-semibold">Mô tả đề tài</h2>
          <p className="text-gray-700">
            Hệ thống giúp quản lý quy trình đăng ký và thực hiện đề tài khóa luận tốt nghiệp. 
            Bao gồm các chức năng như đăng ký đề tài, phân công giảng viên hướng dẫn, 
            theo dõi tiến độ và đánh giá kết quả.
          </p>
        </div>

        {/* Sơ đồ nghiệp vụ */}
        <div>
          <h2 className="text-lg font-semibold">Sơ đồ nghiệp vụ</h2>
          <div className="mt-2 border rounded p-4">
            {/* Placeholder cho sơ đồ nghiệp vụ */}
            <div className="bg-gray-100 h-64 flex items-center justify-center">
              <p className="text-gray-500">Sơ đồ nghiệp vụ sẽ được hiển thị tại đây</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailIdeaPage
