'use client'

import { useTimeCount } from '@/hooks/use-time-count'
import React from 'react'

export default function Timer() {
  const { date, time } = useTimeCount()
  return (
    <span className='italic text-sm text-gray-500 text-right'>
      {time}
      <br />
      {date}
    </span>
  )
}
