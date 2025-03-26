import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/types/field.type'
import { Major } from '@/types/major.type'
import { Project } from '@/types/project.type'
import { User } from '@/types/user.type'

interface ProjectDetailsDialogProps {
  project: Project | null
  onOpenChange: (open: boolean) => void
}

const ProjectDetailsDialog = ({ project, onOpenChange }: ProjectDetailsDialogProps) => {
  return (
    <Dialog open={!!project} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{project?.name}</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <h4 className='font-semibold mb-2'>Description</h4>
              <p className='text-muted-foreground'>{project?.description}</p>
            </div>
            <div>
              <h4 className='font-semibold mb-2'>Campus</h4>
              <p className='text-muted-foreground'>{project?.campus?.name}</p>
            </div>
            <div>
              <h4 className='font-semibold mb-2'>Fields</h4>
              <div className='flex flex-wrap gap-2'>
                {project?.field?.map((f: Field) => (
                  <Badge key={f._id} variant='secondary'>
                    {f.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <div>
              <h4 className='font-semibold mb-2'>Majors</h4>
              <div className='flex flex-wrap gap-2'>
                {project?.major?.map((m: Major) => (
                  <Badge key={m._id} variant='secondary'>
                    {m.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className='font-semibold mb-2'>Members ({project?.members?.length})</h4>
              <div className='space-y-3'>
                {project?.members.map((member: User) => (
                  <div key={member?._id} className='flex items-center gap-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={member?.avatar} alt={member?.display_name} />
                      <AvatarFallback>
                        {member?.first_name?.[0]}
                        {member?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium'>{member?.display_name}</p>
                      <p className='text-xs text-muted-foreground'>{member?.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectDetailsDialog
