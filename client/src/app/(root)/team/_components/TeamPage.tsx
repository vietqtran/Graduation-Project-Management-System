"use client";
import React from "react";
import IdeaAndTeam from "./IdeaAndTeam";
import Image from 'next/image'
import { LineMdLoadingLoop } from '@/components/icons/Loading'
import { useProject } from '@/hooks'

export default function TeamPage() {
     const { project, isLoading } = useProject()
        if(project) {
            return <IdeaAndTeam  project={project}/>
        }
     return isLoading ? (
        <div className='size-full min-h-[80vh] grid place-items-center'>
          <LineMdLoadingLoop />
        </div>
      ) : (
        <div className='w-full flex items-center justify-center flex-col'>
          <Image width={500} height={500} src='/images/empty-box.png' alt='loading' />
          <p>You don&apos;t have any projects yet. Search for members and create together!</p>
        </div>
      )
    }