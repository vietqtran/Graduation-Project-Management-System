'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import instance from '@/utils/axios'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import IdeaDetail from './IdeaDetail'
import { STATUS_MASTER } from '@/constants/status'

interface ProjectIdea {
  _id: string
  name: string
  field: Array<{ _id: string; name: string; description: string }>
  major: Array<{ _id: string; name: string; description: string }>
  campus: { _id: string; name: string; description: string }
  description: string
  created_at: string
  updated_at: string
  status: number
  leader: { username: string; _id: string }  // Modify to match the structure of the leader object
  username: string
}


interface IdeaTableProps {
  ideas: ProjectIdea[]
  startIndex: number
  setFilteredIdeas: React.Dispatch<React.SetStateAction<ProjectIdea[]>>
}

const IdeaTable: React.FC<IdeaTableProps> = ({ ideas, startIndex, setFilteredIdeas }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (idea: ProjectIdea) => {
    setSelectedIdea(idea)
    setIsModalOpen(true)
  }

 const handleAccept = useCallback(
  async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!id || loadingId) return;

    setLoadingId(id);

    try {
      // Gọi API với URL chứa projectId và status trong body
      const response = await instance.patch(
        `/project/approve-idea/${id}`,  // Dùng projectId từ URL
        { status: STATUS_MASTER.APPROVED },  // Truyền status trong body
        { withCredentials: true }  // Đảm bảo gửi cookies chứa thông tin xác thực
      );

      if (response.status === 200) {
        toast.success('Idea accepted successfully');

        // Cập nhật trạng thái trong filteredIdeas
        setFilteredIdeas((prevIdeas) => {
          return prevIdeas.map((idea) => 
            idea._id === id ? { ...idea, status: STATUS_MASTER.APPROVED } : idea
          );
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to accept idea');
    } finally {
      setLoadingId(null);
    }
  },
  [loadingId, setFilteredIdeas]
);



const handleReject = useCallback(
  async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!id || loadingId) return;

    setLoadingId(id);

    try {
      const response = await instance.patch(
        `/project/approve-idea/${id}`,   
        { projectId:id, status: STATUS_MASTER.REJECTED },   
        { withCredentials: true }  
      );

      if (response.status === 200) {
        toast.success('Idea accepted successfully');

        setFilteredIdeas((prevIdeas) => {
          return prevIdeas.map((idea) => 
            idea._id === id ? { ...idea, status: STATUS_MASTER.REJECTED } : idea
          );
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to reject idea');
    } finally {
      setLoadingId(null);
    }
  },
  [loadingId, setFilteredIdeas]
);




  return (
    <div className='w-full overflow-auto rounded-md border shadow-md'>
      <Table className='min-w-full bg-white'>
        <TableHeader>
          <TableRow className='bg-gray-100'>
            <TableHead className='w-12 text-center'>#</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Created day</TableHead>
            <TableHead>Major - Campus - Field</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead className='text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea, index) => (
            <TableRow key={idea._id} onClick={() => handleRowClick(idea)} className='hover:bg-gray-50 cursor-pointer'>
              <TableCell className='text-center'>{startIndex + index + 1}</TableCell>
              <TableCell>{idea.name}</TableCell>
              <TableCell>{new Date(idea.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{idea.major[0]?.name}, {idea.campus?.name}, {idea.field[0]?.name}</TableCell>
              <TableCell>{idea.leader?.username}</TableCell>
              <TableCell className='flex justify-center gap-2 py-2'>
                {STATUS_MASTER[idea.status] === 'PENDING' ? (
                  <>
                    <Button variant='default' onClick={(event) => handleAccept(idea._id, event)}>
                      Accept
                    </Button>
                    <Button variant='destructive' onClick={(event) => handleReject(idea._id, event)}>
                      Reject
                    </Button>
                  </>
                ) : (
                  <span className='text-gray-500 italic'>
                    {STATUS_MASTER[idea.status] === 'APPROVED' ? (
                      <div className='text-green-700 font-semibold'>APPROVED</div>
                    ) : STATUS_MASTER[idea.status] === 'REJECTED' ? (
                      <div className='text-red-500 font-semibold'>REJECTED</div>
                    ) : (
                      <div className='text-gray-500 italic'>No action available</div>
                    )}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <IdeaDetail idea={selectedIdea} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default IdeaTable
