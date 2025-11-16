/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Label } from '@/components/ui/label'
import { FaStar } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Review } from '@/types/entities/review'

export default function ReviewRate({ reviews }: { reviews: Review[] }) {
  const [stats, setStats] = useState([0, 0, 0, 0, 0])
  useEffect(() => {
    const newStats = [0, 0, 0, 0, 0]
    reviews.forEach((review) => {
      newStats[review.rating - 1]++
    })
    setStats(newStats)
  }, [reviews.length])

  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-center gap-2'>
        <Label className='inline-flex items-center gap-1'>
          <span
            className='inline-flex items-center text-[#FBCA04]'
            aria-hidden='true'
          >
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} />
          </span>
          <span className='sr-only'>5 stars</span>{' '}
          <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
            ({stats[4]})
          </span>
        </Label>
      </div>
      <div className='flex items-center gap-2'>
        <Label className='inline-flex items-center gap-1'>
          <span
            className='inline-flex items-center text-[#FBCA04]'
            aria-hidden='true'
          >
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} className='opacity-30' />
          </span>
          <span className='sr-only'>4 stars</span>{' '}
          <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
            ({stats[3]})
          </span>
        </Label>
      </div>
      <div className='flex items-center gap-2'>
        <Label className='inline-flex items-center gap-1'>
          <span
            className='inline-flex items-center text-[#FBCA04]'
            aria-hidden='true'
          >
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} className='opacity-30' />
            <FaStar size={16} className='opacity-30' />
          </span>
          <span className='sr-only'>3 stars</span>{' '}
          <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
            ({stats[2]})
          </span>
        </Label>
      </div>
      <div className='flex items-center gap-2'>
        <Label className='inline-flex items-center gap-1'>
          <span
            className='inline-flex items-center text-[#FBCA04]'
            aria-hidden='true'
          >
            <FaStar size={16} />
            <FaStar size={16} />
            <FaStar size={16} className='opacity-30' />
            <FaStar size={16} className='opacity-30' />
            <FaStar size={16} className='opacity-30' />
          </span>
          <span className='sr-only'>2 stars</span>{' '}
          <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
            ({stats[1]})
          </span>
        </Label>
      </div>
      <div className='flex items-center gap-2'>
        <Label className='inline-flex items-center gap-1'>
          <span
            className='inline-flex items-center text-[#FBCA04]'
            aria-hidden='true'
          >
            <FaStar size={16} />
            <FaStar size={16} className='opacity-30' />
            <FaStar size={16} className='opacity-30' />
            <FaStar size={16} className='opacity-30' />
            <FaStar size={16} className='opacity-30' />
          </span>
          <span className='sr-only'>1 star</span>{' '}
          <span className='text-muted-foreground text-xs leading-[inherit] font-normal'>
            ({stats[0]})
          </span>
        </Label>
      </div>
    </div>
  )
}
