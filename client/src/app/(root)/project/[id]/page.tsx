import ProjectPage from '../_components/ProjectPage'
import React from 'react'

export default async function Page({
  params
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params
  console.log('-----------------------', id)
  return <ProjectPage id={id} />
}
