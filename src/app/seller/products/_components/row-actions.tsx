'use client'

import { Button } from "@/components/ui/button"
import { Row } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"

export default function RowActions<T>({ row, editModal }: { row: Row<T>, editModal: React.ReactNode }) {
  return (
    <div className='flex justify-end'>
      <Button
        size='icon'
        variant='ghost'
        className='shadow-none hover:bg-amber-100 hover:text-amber-500 size-7'
        aria-label='Edit item'
        title='Nhấn để chỉnh sửa'
      >
        <Pencil size={10} aria-hidden='true' />
      </Button>

      <Button
        size='icon'
        variant='ghost'
        className='shadow-none hover:bg-red-100 hover:text-red-500 size-7'
        aria-label='Delete item'
        title='Nhấn để xóa'
      >
        <Trash size={10} aria-hidden='true' />
      </Button>

      {editModal}
    </div>
  )
}