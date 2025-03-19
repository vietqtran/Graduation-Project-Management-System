import { LogOut, User } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector, useAuth } from '@/hooks'

import Image from 'next/image'
import { RootState } from '@/types/store.type'

const Header = () => {
  const { logOut } = useAuth()
  const { user } = useAppSelector((state: RootState) => state.auth)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logOut()
    setIsDropdownOpen(false)
  }

  return (
    <header className='z-[99] box-content bg-background fixed top-0 inset-x-0 w-full h-16 border-b'>
      <div className='size-full gap-2 flex items-center justify-end py-2 px-4'>
        <div className='relative' ref={dropdownRef}>
          <div
            className='cursor-pointer size-10 min-w-10 rounded-full border overflow-hidden'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Image
              src={user?.avatar || 'https://i.pravatar.cc/300'}
              width={100}
              height={100}
              alt='avatar'
              className='size-full'
            />
          </div>

          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border'>
              <button
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2'
                onClick={() => setIsDropdownOpen(false)}
              >
                <User size={16} />
                Profile
              </button>
              <button
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2'
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
