export interface ReviewData {
  content?: string
  rating: number
  buyerName: string
  buyerAvatar: string
  medias?: string[]
  createdAt: Date
  updatedAt?: Date
  isDeleted?: boolean
}

export interface Review {
  id?: string
  productId: string

  comments: ReviewData[]

  createdAt?: Date
  updatedAt?: Date
  _deleted?: boolean
}
