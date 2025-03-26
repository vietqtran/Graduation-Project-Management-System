import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import RequestForm from './RequestForm'

interface RequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    to_user: string
    type: string
    remark: string
    description: string
    document: string
    due_date: string
  }) => void
  onConfirm: () => void
}

const RequestDialog = ({ open, onOpenChange, onSubmit, onConfirm }: RequestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Add New Request</DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <RequestForm onClose={() => onOpenChange(false)} onSubmit={onSubmit} />
        </div>
        <div className='flex justify-end gap-4 mt-6'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RequestDialog
