'use client'

import LogoutComponent from '@/components/logout/logout'
import UploadAvatar from '@/components/UploadAvatar'
import { selectCurrentUser } from '@/redux/user/userSlice'
import React from 'react'
import { IoIosLogOut } from 'react-icons/io'
import { useSelector } from 'react-redux'

export default function UserInfo() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <div className='relative flex flex-col items-center justify-center text-center'>
      <LogoutComponent
        icon={
          <IoIosLogOut className='absolute top-0 text-xl cursor-pointer right-3 text-mainColor1-800' />
        }
      />
      <UploadAvatar avatar={String(currentUser?.avatar)} />
      <div className='mt-6 text-xl font-medium text-mainColor2-800'>
        {currentUser?.name}
      </div>
      <div className='text-xs text-mainColor2-800/90'>{currentUser?.email}</div>
    </div>
  )
}
