'use client'

import { SearchIcon, SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { TbBellRinging2 } from 'react-icons/tb'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

export default function SellerHeader() {
  const { handleSubmit, register } = useForm()

  const currentUser = useSelector(selectCurrentUser)

  // eslint-disable-next-line no-unused-vars
  const handleSearch = (data) => {
    //
  }

  const { open, toggleSidebar } = useSidebar()

  return (
    <div className='grid grid-cols-5 px-4 py-2 gap-4 bg-white'>
      <div className='col-span-1 flex items-center'>
        <Button variant='outline' size='icon' onClick={toggleSidebar}>
          {open ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
        </Button>
      </div>
      <div className='col-span-3 flex items-center justify-between'>
        <form
          action='#'
          onSubmit={handleSubmit(handleSearch)}
          className='relative w-[35%]'
        >
          <Input
            className='peer ps-9 w-full placeholder:text-sm placeholder:text-gray-300 bg-[#ECEEF6] rounded-xl border-none shadow-none hover:border-none focus:border-none'
            placeholder='Tìm kiếm...'
            {...register('searchValue')}
          />
          <div className='text-gray-300 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
            <SearchIcon size={16} />
          </div>
        </form>
      </div>
      <div className='col-span-1 flex items-center justify-between'>
        <div className='bg-[#ECEEF6] p-2 rounded-lg'>
          <TbBellRinging2 className='text-xl text-gray-500' />
        </div>
        <div className='flex items-center gap-2 cursor-pointer'>
          <Avatar>
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback>LV</AvatarFallback>
          </Avatar>
          <div>
            <div className='text-sm font-semibold'>
              {currentUser?.name || 'Chưa có tên'}
            </div>
            <div className='text-xs text-gray-400'>Người bán</div>
          </div>
        </div>
      </div>
    </div>
  )
}
