'use client'

import { SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { TbBellRinging2 } from 'react-icons/tb'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '../mode-toggle'

export default function SellerHeader() {
  const currentUser = useSelector(selectCurrentUser)

  const { open, toggleSidebar } = useSidebar()

  return (
    <div className='grid grid-cols-5 px-4 py-2 gap-4 bg-background shadow-lg shadow-mainColor1-100'>
      <div className='col-span-4 flex items-center'>
        <Button variant='outline' size='icon' onClick={toggleSidebar}>
          {open ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
        </Button>
      </div>
      <div className='col-span-1 flex items-center justify-between'>
        <div className='bg-[#ECEEF6] p-2 rounded-lg'>
          <TbBellRinging2 className='text-xl text-gray-500' />
        </div>
        <ModeToggle />
        <div className='flex items-center gap-2 cursor-pointer'>
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
