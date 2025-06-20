declare module 'react-rating' {
  import * as React from 'react'

  interface RatingProps {
    initialRating?: number
    readonly?: boolean
    emptySymbol?: React.ReactNode
    fullSymbol?: React.ReactNode
    className?: string
  }
  
  const Rating: React.FC<RatingProps>

  export default Rating
}
