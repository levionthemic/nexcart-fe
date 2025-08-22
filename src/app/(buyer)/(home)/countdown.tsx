'use client'

import React, { useEffect, useState } from 'react'

export default function CountDown() {
  const targetDate = new Date('2025-12-31T23:59:00').getTime()
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now
      setTimeLeft(difference)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor((milliseconds / 1000) % 60)
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60)
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
    return { days, hours, minutes, seconds }
  }

  const { days, hours, minutes, seconds } = formatTime(timeLeft)
  return (
    <ul className='flex items-center gap-8'>
      <li className='flex flex-col items-start font-semibold'>
        <span className='text-xs'>Ngày</span>
        <span className='text-3xl'>{days < 10 ? `0${days}` : days}</span>
      </li>
      <li className='text-2xl text-red-500 text-bold'>:</li>
      <li className='flex flex-col items-start font-semibold'>
        <span className='text-xs'>Giờ</span>
        <span className='text-3xl'>{hours < 10 ? `0${hours}` : hours}</span>
      </li>
      <li className='text-2xl text-red-500 text-bold'>:</li>
      <li className='flex flex-col items-start font-semibold'>
        <span className='text-xs'>Phút</span>
        <span className='text-3xl'>
          {minutes < 10 ? `0${minutes}` : minutes}
        </span>
      </li>
      <li className='text-2xl text-red-500 text-bold'>:</li>
      <li className='flex flex-col items-start font-semibold'>
        <span className='text-xs'>Giây</span>
        <span className='text-3xl'>
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      </li>
    </ul>
  )
}
