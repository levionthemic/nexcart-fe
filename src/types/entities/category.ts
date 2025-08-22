export interface Category {
  id: number
  name: string
  is_leaf: boolean
  slug: string
  thumbnail_url: string | null
  description: string
  parent_id: string | null
}