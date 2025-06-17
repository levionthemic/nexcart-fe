declare module 'react-rating' {
  import * as React from 'react'

  interface RatingProps {
    initialRating?: number
    readonly?: boolean
    emptySymbol?: React.ReactNode
    fullSymbol?: React.ReactNode
    className?: string
  }

  export default class Rating extends React.Component<RatingProps> {}
}
