'use client'

import { Button } from '@/components/ui/button'
import { Moon } from '@/components/icons/Moon'
import React from 'react'
import { Sun } from '@/components/icons/Sun'
import { useTheme } from 'next-themes'

const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const handleThemeChange = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }
  return (
    <Button
      type='button'
      className='p-0 rounded-full shadow-none hover:bg-neutral-300/50 text-black dark:text-white bg-transparent aspect-square'
      onClick={handleThemeChange}
    >
      {resolvedTheme === 'dark' ? <Sun className='size-6' /> : <Moon className='size-6' />}
    </Button>
  )
}

export default ThemeSwitcher
