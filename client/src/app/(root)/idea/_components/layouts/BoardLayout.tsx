import React from 'react'

type Props = {
  children: React.ReactNode
}

const BoardLayout = ({ children }: Props) => {
  return <div className='relative size-full'>{children}</div>
}

export default BoardLayout
