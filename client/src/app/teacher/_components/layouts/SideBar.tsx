'use client'

import { TEACHER_SIDEBAR_LINKS } from '@/constants/sidebar'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import CommunityIcon from '@/components/icons/CommunityIcon'

const SideBar = () => {
  const [isExpanse, setIsExpanse] = useState(true)
  const pathName = usePathname()

  return (
    <aside
      className={`w-full z-[9999] box-content transition-all ease-linear duration-100 shadow-md bg-background border-r h-screen sticky left-0 top-0 ${isExpanse ? 'max-w-80' : 'max-w-16'}`}
    >
      <div className='size-full relative'>
        <div className='absolute top-12 -right-3'>
          <button
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
          </button>
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
          <div className={`flex flex-col flex-1 justify-between ${isExpanse ? 'pt-10' : 'pt-0'}`}>
            <div className='p-2 w-full flex gap-1 flex-col'>
              {TEACHER_SIDEBAR_LINKS.map((s) => {
                return (
                  <TooltipProvider key={`${s.label}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={s.href}
                          className={`p-2 w-full gap-2 rounded-md duration-100 ease-linear cursor-pointer flex h-12 items-center ${isExpanse ? '' : 'justify-center'} ${pathName === s.href ? 'bg-blue-500 text-white' : 'bg-background hover:bg-neutral-300'}`}
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

            <div className='p-2 w-full flex flex-col'>
              <Link
                href={'/community'}
                className={`p-2 w-full rounded-md gap-2 duration-100 ease-linear cursor-pointer flex h-12 items-center ${isExpanse ? '' : 'justify-center'} ${pathName === '/community' ? 'bg-blue-500 text-white' : 'bg-background hover:bg-neutral-300'}`}
              >
                <CommunityIcon />
                {isExpanse && <span className='font-medium'>Community</span>}
              </Link>

              <div
                className={`${isExpanse ? 'px-2 flex gap-2 items-center justify-start' : 'px-0 grid place-items-center '} py-2`}
              >
                <div className='size-10 min-w-10 rounded-full border overflow-hidden'>
                  <Image src={'https://i.pravatar.cc/300'} width={100} height={100} alt='' className='size-full' />
                </div>
                {isExpanse && (
                  <div className='flex flex-col flex-1'>
                    <p className='line-clamp-1 font-medium'>Trần Quốc Việt</p>
                    <p className='line-clamp-1 text-secondary'>viettqhe170367@fpt.edu.vn</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SideBar
