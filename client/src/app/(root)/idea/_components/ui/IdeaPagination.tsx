'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}

const IdeaPagination = ({ currentPage, totalPages, setCurrentPage }: PaginationProps) => {
  return (
    <div className='flex justify-center gap-2'>
      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
        Previous
      </button>
      <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
        Next
      </button>
    </div>
  )
}

export default IdeaPagination
