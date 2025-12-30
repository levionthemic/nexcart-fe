export interface Category {
  id: number
  name: string
  isLeaf: boolean
  slug: string
  thumbnailUrl: string | null
  description: string
  parentId: string | null
  children?: Category[]
}
