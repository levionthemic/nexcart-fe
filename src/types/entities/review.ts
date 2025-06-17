export interface ReviewData {
  content?: string
  rating: number
  buyerName: string
  buyerAvatar: string
  medias?: string[]
  createdAt: Date
  updatedAt?: Date
  _deleted?: boolean
}

export interface Review {
  _id?: string
  productId: string
  page: number
  count: number
  comments: ReviewData[]

  createdAt?: Date
  updatedAt?: Date
  _deleted?: boolean
}
