'use client'

import LogoutComponent from '@/components/logout/logout'
import UploadAvatar from '@/components/upload-avatar'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'
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
      <UploadAvatar avatar={currentUser?.avatar || DEFAULT_IMAGE_URL} />
      <div className='mt-6 text-xl font-medium text-mainColor2-800'>
        {currentUser?.buyer?.name || 'Ẩn danh'}
      </div>
      <div className='text-xs text-mainColor2-800/90'>{currentUser?.email}</div>
    </div>
  )
}
