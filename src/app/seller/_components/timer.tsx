'use client'

import React from 'react'

import { useTimeCount } from '@/hooks/use-time-count'

export default function Timer() {
  const { date, time } = useTimeCount()
  return (
    <span className='text-right text-sm text-gray-500 italic'>
      {time}
      <br />
      {date}
    </span>
  )
}
