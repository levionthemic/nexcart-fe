'use client'

import { SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react'
import { TbBellRinging2 } from 'react-icons/tb'
import { useSelector } from 'react-redux'

import { ModeToggle } from '@/components/shared/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { selectCurrentUser } from '@/redux/user/userSlice'

export default function SellerHeader() {
  const currentUser = useSelector(selectCurrentUser)

  const { open, toggleSidebar } = useSidebar()

  return (
    <div className='bg-background shadow-mainColor1-100 grid grid-cols-5 gap-4 px-4 py-2 shadow-lg'>
      <div className='col-span-4 flex items-center'>
        <Button variant='outline' size='icon' onClick={toggleSidebar}>
          {open ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
        </Button>
      </div>
      <div className='col-span-1 flex items-center justify-between'>
        <div className='rounded-lg bg-[#ECEEF6] p-2'>
          <TbBellRinging2 className='text-xl text-gray-500' />
        </div>
        <ModeToggle />
        <div className='flex cursor-pointer items-center gap-2'>
          <Avatar>
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback>LV</AvatarFallback>
          </Avatar>
          <div>
            <div className='text-sm font-semibold'>
              {currentUser?.seller?.name || 'Chưa có tên'}
            </div>
            <div className='text-xs text-gray-400'>Người bán</div>
          </div>
        </div>
      </div>
    </div>
  )
}
