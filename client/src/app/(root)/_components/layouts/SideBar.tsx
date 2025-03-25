'use client'

import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { SIDEBAR_LINKS } from '@/constants/sidebar'
import { useAppSelector, usePathname } from '@/hooks'

const SideBar = () => {
  const user = useAppSelector((state) => state.auth.user)
  console.log(user)
  const [isExpanse, setIsExpanse] = useState(true)
  const pathName = usePathname()

  return (
    <aside
      className={`w-full z-[100] box-content transition-all ease-linear duration-100 shadow-md bg-background border-r h-screen sticky left-0 top-0 ${isExpanse ? 'max-w-80' : 'max-w-16'}`}
    >
      <div className='size-full relative'>
        <div className='absolute top-12 -right-3'>
          <Button
            onClick={() => setIsExpanse(!isExpanse)}
            className='p-0.5 bg-background aspect-square rounded-full border'
          >
            <Image
              className={!isExpanse ? '' : 'rotate-180'}
              src={'/icons/arrow-right.svg'}
              width={18}
              height={18}
              alt=''
            />
          </Button>
        </div>
        <div className='size-full max-h-screen flex flex-col'>
          <div className={`h-16 aspect-square px-1 ${isExpanse ? 'grid place-items-center' : ''}`}>
            <Image
              className={`h-full object-contain ${!isExpanse ? 'block' : 'hidden'}`}
              width={200}
              height={200}
              alt='logo'
              src={'/images/logo.svg'}
            />
            <Image
              className={`h-full ${isExpanse ? 'block' : 'hidden'}`}
              width={200}
              height={200}
              alt='logo'
              src={'/images/fpt-uni.png'}
            />
          </div>
          <div className={`flex flex-col flex-1 overflow-y-auto max-h-screen ${isExpanse ? 'pt-10' : 'pt-0'}`}>
            <div className='p-2 w-full flex gap-1 flex-col'>
              {SIDEBAR_LINKS.filter((s) => s.roles?.some((role) => user?.roles?.includes(role))).map((s) => {
                return (
                  <TooltipProvider key={`${s.label}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={s.href}
                          className={`p-2 w-full gap-2 rounded-md  duration-100 ease-linear cursor-pointer flex h-12 items-center ${isExpanse ? '' : 'justify-center'} ${pathName === s.href ? 'bg-blue-500 text-white' : 'bg-background hover:bg-neutral-300'}`}
                        >
                          {s.icon}
                          {isExpanse && <span className='font-medium'>{s.label}</span>}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side='right'>
                        <p>{s.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SideBar
