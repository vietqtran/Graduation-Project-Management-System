import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarIcon, Users } from 'lucide-react'
import { Comment, Task } from '@/types/task.type'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import CommentEditor from '@/components/editor/CommentEditor'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User } from '@/types/user.type'
import { format } from 'date-fns'
import instance from '@/utils/axios'
import { toast } from 'sonner'
import useClickOutside from '@/hooks/useClickOutside'
import { useProject } from '@/hooks'

interface TaskDrawerProps {
  task: Task
  onClose: () => void
  onUpdate: () => void
  isViewOnly?: boolean
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ task, onClose, onUpdate, isViewOnly }) => {
  const { project } = useProject()
  const [loading, setLoading] = useState(false)
  const [projectMembers, setProjectMembers] = useState<User[]>([])
  const [taskData, setTaskData] = useState<{
    _id: string
    name: string
    description: string
    is_completed: boolean
    labels: Array<{ text: string; color: string }>
    start_date: Date | null
    due_date: Date | null
    priority: string
    assignees: string[] // Change to store only IDs
    type: string
    comments: Comment[]
  }>({
    _id: task?._id ?? '',
    name: task?.name ?? '',
    description: task?.description ?? '',
    is_completed: task?.is_completed ?? false,
    labels: task?.labels ?? [],
    start_date: task?.start_date ? new Date(task.start_date) : null,
    due_date: task?.due_date ? new Date(task.due_date) : null,
    priority: task?.priority ?? 'medium',
    assignees: task?.assignees?.map((a) => a._id ?? '') ?? [],
    type: task?.type ?? 'task',
    comments: task?.comments ?? []
  })

  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(task?.assignees?.map((a) => a._id) ?? [])

  const [newLabel, setNewLabel] = useState<{ text: string; color: string }>({
    text: '',
    color: '#3498db'
  })

  useEffect(() => {
    if (project?._id) {
      fetchProjectMembers()
    }
  }, [project?._id])

  const fetchProjectMembers = async () => {
    if (!project?._id) return
    try {
      const response = await instance.get(`/project/${project._id}/members`, { withCredentials: true })
      setProjectMembers(response.data.data)
    } catch (error) {
      console.error('Failed to fetch project members:', error)
    }
  }

  const handleChange = (field: string, value: unknown) => {
    setTaskData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (isViewOnly) {
      toast.error('You just have view permission')
      return
    }
    if (!task?._id) return

    try {
      setLoading(true)
      const dataToUpdate = {
        ...taskData,
        start_date: taskData.start_date?.toISOString(),
        due_date: taskData.due_date?.toISOString(),
        assignees: selectedAssignees.filter((a) => !!a)
      }

      await instance.patch(`/board/tasks/${task._id}`, dataToUpdate, { withCredentials: true })
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setLoading(false)
    }
  }

  const addLabel = async () => {
    if (isViewOnly) {
      toast.error('You just have view permission')
      return
    }
    if (!newLabel.text || !task?._id) return

    try {
      const updatedLabels = [...taskData.labels, newLabel]
      await instance.patch(`/board/tasks/${task._id}`, { labels: updatedLabels }, { withCredentials: true })
      handleChange('labels', updatedLabels)
      setNewLabel({ text: '', color: '#3498db' })
    } catch (error) {
      console.error('Failed to add label:', error)
    }
  }

  const removeLabel = async (index: number) => {
    if (isViewOnly) {
      toast.error('You just have view permission')
      return
    }
    if (!task?._id) return

    try {
      const updatedLabels = taskData.labels.filter((_, i) => i !== index)
      await instance.patch(`/board/tasks/${task._id}`, { labels: updatedLabels }, { withCredentials: true })
      handleChange('labels', updatedLabels)
    } catch (error) {
      console.error('Failed to remove label:', error)
    }
  }

  const addComment = async (content: string) => {
    if (!task?._id) return

    try {
      const response = await instance.post(
        `/board/tasks/${task._id}/comments`,
        { taskId: task._id, text: content },
        { withCredentials: true }
      )
      handleChange('comments', [...response.data.data.comments])
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  // Update assignee selection handler
  const handleAssigneeToggle = (memberId: string) => {
    setSelectedAssignees((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId)
      }
      return [...prev, memberId]
    })
  }

  const ref = useClickOutside<HTMLDivElement>(() => onClose())

  return (
    <div
      ref={ref}
      className='fixed z-[120] right-0 max-h-screen min-h-screen top-0 overflow-y-auto bg-background border-l shadow-lg overflow-hidden flex flex-col'
    >
      <div className='p-4 border-b flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Task Details</h2>
        <Button variant='ghost' size='icon' onClick={onClose} aria-label='Close'>
          ×
        </Button>
      </div>

      <div className='flex-1 p-4'>
        <div className='space-y-6'>
          {/* Task Name */}
          <Input
            value={taskData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder='Task Name'
            className='text-lg font-medium'
            readOnly={isViewOnly}
          />

          {/* Task Type and Priority */}
          <div className='flex items-center gap-2'>
            <Select value={taskData.type} onValueChange={(value) => handleChange('type', value)} disabled={isViewOnly}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue>{taskData.type === 'milestone' ? 'Milestone' : 'Task'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='task'>Task</SelectItem>
                <SelectItem value='milestone'>Milestone</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={taskData.priority}
              onValueChange={(value) => handleChange('priority', value)}
              disabled={isViewOnly}
            >
              <SelectTrigger className='w-[150px]'>
                <SelectValue>{taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='low'>Low</SelectItem>
                <SelectItem value='medium'>Medium</SelectItem>
                <SelectItem value='high'>High</SelectItem>
                <SelectItem value='urgent'>Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className='flex items-center gap-4'>
            <div className='space-y-2 flex-1'>
              <label className='text-sm font-medium'>Start Date</label>
              <Popover>
                <PopoverTrigger asChild disabled={isViewOnly}>
                  <Button variant='outline' className='w-full justify-start text-left font-normal'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {taskData.start_date ? format(taskData.start_date, 'PPP') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                {!isViewOnly && (
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={taskData.start_date || undefined}
                      onSelect={(date) => handleChange('start_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>

            <div className='space-y-2 flex-1'>
              <label className='text-sm font-medium'>Due Date</label>
              <Popover>
                <PopoverTrigger asChild disabled={isViewOnly}>
                  <Button variant='outline' className='w-full justify-start text-left font-normal'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {taskData.due_date ? format(taskData.due_date, 'PPP') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                {!isViewOnly && (
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={taskData.due_date || undefined}
                      onSelect={(date) => handleChange('due_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>

          {/* Assignees */}
          <div className='space-y-2'>
            <label className='text-sm font-medium flex items-center gap-2'>
              <Users className='h-4 w-4' />
              Assignees
            </label>
            <div className='flex flex-wrap flex-col gap-2'>
              {projectMembers.map((member) => (
                <div
                  key={member._id}
                  className={`flex items-center gap-2 p-2 rounded border ${
                    selectedAssignees.includes(member._id) ? 'bg-primary/10 border-primary' : ''
                  } ${isViewOnly ? '' : 'cursor-pointer'}`}
                  onClick={() => !isViewOnly && handleAssigneeToggle(member._id)}
                  role={isViewOnly ? undefined : 'button'}
                  tabIndex={isViewOnly ? undefined : 0}
                  aria-pressed={selectedAssignees.includes(member._id)}
                >
                  <Avatar className='h-6 w-6'>
                    <AvatarImage src={member.avatar} alt={member.username} />
                    <AvatarFallback>{member.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className='text-sm'>{member.username}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Labels */}
          <div className='space-y-2'>
            <h3 className='font-semibold mb-2'>Labels</h3>
            <div className='flex flex-wrap gap-2 mb-2'>
              {taskData.labels.map((label, idx) => (
                <div
                  key={idx}
                  className='flex items-center gap-1 px-2 py-1 rounded text-white'
                  style={{ backgroundColor: label.color }}
                >
                  <span>{label.text}</span>
                  {!isViewOnly && (
                    <button
                      onClick={() => removeLabel(idx)}
                      className='text-xs hover:text-gray-200'
                      aria-label={`Remove label ${label.text}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {!isViewOnly && (
              <div className='flex gap-2'>
                <Input
                  value={newLabel.text}
                  onChange={(e) => setNewLabel({ ...newLabel, text: e.target.value })}
                  placeholder='New Label'
                  className='flex-1'
                  onKeyDown={(e) => handleKeyDown(e, addLabel)}
                />
                <Input
                  type='color'
                  value={newLabel.color}
                  onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                  className='w-12'
                  aria-label='Label color'
                />
                <Button onClick={addLabel} variant='secondary'>
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Description</label>
            <Textarea
              value={taskData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder='Add a detailed description...'
              rows={6}
              readOnly={isViewOnly}
            />
          </div>

          {/* Comments */}
          <div className='space-y-2'>
            <h3 className='font-semibold mb-2'>Comments</h3>
            <div className='space-y-2 mb-2'>
              {taskData.comments.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No comments yet</p>
              ) : (
                taskData.comments.map((comment) => (
                  <div key={comment._id} className='bg-muted py-2 px-3 flex items-start justify-start rounded'>
                    <Image
                      src={comment.created_by?.avatar ?? ''}
                      alt={comment.created_by?.username || 'Unknown'}
                      className='w-8 h-8 object-cover rounded-full mr-2'
                      width={32}
                      height={32}
                    />
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold'>{comment.created_by?.email || 'Unknown'}</span>
                        <span className='text-xs text-muted-foreground'>
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                    </div>
                  </div>
                ))
              )}
            </div>
            <CommentEditor onSubmit={addComment} />
          </div>
        </div>
      </div>

      <div className='p-4 border-t flex justify-end gap-2'>
        <Button variant='outline' onClick={onClose}>
          Close
        </Button>
        {!isViewOnly && (
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default TaskDrawer
