'use client'

import { Pencil, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function RowActions({
  editModal
}: {
  editModal: React.ReactNode
}) {
  return (
    <div className='flex justify-end'>
      <Button
        size='icon'
        variant='ghost'
        className='size-7 shadow-none hover:bg-amber-100 hover:text-amber-500'
        aria-label='Edit item'
        title='Nhấn để chỉnh sửa'
      >
        <Pencil size={10} aria-hidden='true' />
      </Button>

      <Button
        size='icon'
        variant='ghost'
        className='size-7 shadow-none hover:bg-red-100 hover:text-red-500'
        aria-label='Delete item'
        title='Nhấn để xóa'
      >
        <Trash size={10} aria-hidden='true' />
      </Button>

      {editModal}
    </div>
  )
}
