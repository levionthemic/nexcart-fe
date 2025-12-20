import React from 'react'

function NContainer({
  animationDuration,
  children,
  isFinished
}: {
  animationDuration: number
  children: React.ReactNode
  isFinished: boolean
}) {
  return (
    <div
      style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`
      }}
    >
      {children}
    </div>
  )
}

export default NContainer
