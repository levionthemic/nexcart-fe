import { PopoverClose } from '@radix-ui/react-popover'
import { Row } from '@tanstack/react-table'
import { CheckIcon, DeleteIcon, EllipsisIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Order } from '@/types/entities/order'
import { OrderStatus } from '@/types/enums/order-status'

export default function RowActions({
  row,
  handleConfirmOrder
}: {
  row: Row<Order>
  handleConfirmOrder: (row: Row<Order>) => void
}) {
  return (
    <div className='flex items-center justify-center gap-0.5'>
      {row.getValue('status') === OrderStatus.PENDING && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size='icon'
              variant='ghost'
              className='size-6 text-green-600 shadow-none hover:bg-green-100 hover:text-green-700'
              aria-label='Edit item'
            >
              <CheckIcon size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className='mb-4 text-sm'>Xác nhận đơn hàng?</div>
            <div className='flex items-center justify-end gap-2'>
              <PopoverClose asChild>
                <Button variant='outline'>Hủy</Button>
              </PopoverClose>
              <PopoverClose asChild>
                <Button onClick={() => handleConfirmOrder(row)}>
                  Xác nhận
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex justify-end'>
            <Button
              size='icon'
              variant='ghost'
              className='size-6 shadow-none'
              aria-label='Edit item'
            >
              <EllipsisIcon size={16} aria-hidden='true' />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Chi tiết</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem className='text-destructive focus:text-destructive'>
              <span>Hủy đơn hàng</span>
              <DropdownMenuShortcut>
                <DeleteIcon size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
