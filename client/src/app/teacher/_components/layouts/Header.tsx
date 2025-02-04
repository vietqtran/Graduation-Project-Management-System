import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <header className='z-[999] box-content bg-background fixed top-0 inset-x-0 w-full h-16 border-b'>
      <div className='size-full gap-2 flex items-center justify-end py-2 px-4'>
        <div className='cursor-pointer size-10 min-w-10 rounded-full border overflow-hidden'>
          <Image src={'https://i.pravatar.cc/300'} width={100} height={100} alt='' className='size-full' />
        </div>
        <div className='cursor-pointer size-10 min-w-10 rounded-full border overflow-hidden'>
          <Image src={'https://i.pravatar.cc/300'} width={100} height={100} alt='' className='size-full' />
        </div>
      </div>
    </header>
  )
}

export default Header
