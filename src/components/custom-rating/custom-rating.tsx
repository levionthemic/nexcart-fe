'use client'

import React from 'react'
import { IoMdStar, IoMdStarOutline } from 'react-icons/io'
import Rating from 'react-rating'

export default function CustomRating({ rating }: { rating: number }) {
  return (
    <Rating
      emptySymbol={<IoMdStarOutline />}
      fullSymbol={<IoMdStar />}
      initialRating={rating}
      readonly
      className='text-[#FBCA04] text-xl leading-none'
    />
  )
}
