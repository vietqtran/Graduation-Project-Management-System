import BoardPage from '../_components/ui/Board'
import React from 'react'

export default async function Page({
  params
}: Readonly<{
  params: Promise<{ project_id: string }>
}>) {
  const { project_id } = await params
  return <BoardPage project_id={project_id} />
}
