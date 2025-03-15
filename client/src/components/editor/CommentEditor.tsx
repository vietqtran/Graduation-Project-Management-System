import { EditorContent, useEditor } from '@tiptap/react'
import { ImageIcon, Link2, Send } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { Toggle } from '@/components/ui/toggle'
import { useUpload } from '@/hooks/useUpload'

interface CommentEditorProps {
  onSubmit: (content: string) => Promise<void>
  placeholder?: string
}

const CommentEditor = ({ onSubmit, placeholder = 'Write a comment...' }: CommentEditorProps) => {
  const { upload } = useUpload()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-[500px] h-auto'
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline decoration-primary cursor-pointer'
        }
      }),
      Placeholder.configure({
        placeholder: () => {
          return placeholder
        }
      })
    ],
    editorProps: {
      attributes: {
        class:
          'min-h-[100px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
      }
    },
    content: ''
  })

  const addImage = useCallback(
    async (file: File) => {
      if (!editor) return

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      const fileList = dataTransfer.files

      const uploadResponse = await upload(fileList)

      if (!uploadResponse?.success || !uploadResponse.results) {
        throw new Error('Upload failed')
      }

      const fileResult = uploadResponse.results[0]
      if (!fileResult) {
        throw new Error('Invalid upload response')
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_PREFIX}${fileResult.key}?w=500&h=500&fit=crop&auto=format`
      editor.chain().focus().setImage({ src: imageUrl }).run()
    },
    [editor]
  )

  const handleSubmit = async () => {
    if (!editor) return

    try {
      setIsSubmitting(true)
      await onSubmit(editor.getHTML())
      editor.commands.clearContent()
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const file = event.clipboardData?.files[0]
      if (file && file.type.startsWith('image/')) {
        event.preventDefault()
        addImage(file)
      }
    },
    [addImage]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const file = event.dataTransfer?.files[0]
      if (file && file.type.startsWith('image/')) {
        event.preventDefault()
        addImage(file)
      }
    },
    [addImage]
  )

  const handleImageButtonClick = () => {
    // Directly trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  if (!editor) return null

  return (
    <div className='space-y-2'>
      <div className='border rounded-md'>
        <EditorContent editor={editor} onPaste={handlePaste} onDrop={handleDrop} />
        <div className='p-2 border-t flex items-center gap-2'>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            id='image-upload'
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) addImage(file)
            }}
          />
          <Toggle size='sm' aria-label='Add image' onClick={handleImageButtonClick}>
            <ImageIcon className='h-4 w-4' />
          </Toggle>
          <Toggle
            size='sm'
            pressed={editor.isActive('link')}
            onPressedChange={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run()
              } else {
                const url = window.prompt('URL:')
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }
            }}
            aria-label='Add link'
          >
            <Link2 className='h-4 w-4' />
          </Toggle>
        </div>
      </div>
      <div className='flex justify-end'>
        <Button size='sm' onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send'}
          <Send className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default CommentEditor
