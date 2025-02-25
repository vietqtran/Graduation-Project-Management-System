import AvatarGroup from '@/components/ui/avatar-group'
import FilterVerticalIcon from '@/components/icons/FilterVerticalIcon'
import React from 'react'

const BoardHeader = () => {
  return (
    <div className='h-12 px-4 flex items-center gap-4 border-b justify-between'>
      <div className='flex items-center gap-2'>
        <h3 className='font-semibold'>Graduation Project Management System</h3>
      </div>
      <div className='flex items-center gap-3'>
        <div tabIndex={0} className='flex px-3 py-2 cursor-pointer bg-neutral-200 rounded-md items-center gap-2'>
          <FilterVerticalIcon />
          <span className='text-sm'>Filters</span>
        </div>
        <AvatarGroup
          avatars={[
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' },
            { src: 'https://i.pravatar.cc/300', alt: 'avatar' }
          ]}
        />
      </div>
    </div>
  )
}

export default BoardHeader
