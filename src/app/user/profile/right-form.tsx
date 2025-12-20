'use client'

import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import OtpFillIn from '@/components/otp-fill-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { selectCurrentUser } from '@/redux/user/userSlice'

export default function ProfileRightForm() {
  const currentUser = useSelector(selectCurrentUser)

  const [disableEmail, setDisableEmail] = useState<boolean>(true)
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(true)
  const handleChangeEmail = () => {
    //
  }

  return (
    <div className=''>
      <div className='my-4'>
        <Label className='text-base'>Email</Label>
        <div>
          <div className='flex items-center gap-4'>
            <Input
              disabled={disableEmail}
              defaultValue={currentUser?.email || ''}
              className='placeholder:text-opacity-50 rounded-full border-[1px] placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none'
            />
            <OtpFillIn
              trigger={
                <Button
                  variant='outline'
                  type='button'
                  onClick={handleChangeEmail}
                >
                  <Pencil />
                  Thay đổi
                </Button>
              }
              setOpen={setDisableEmail}
            />
          </div>
        </div>
        <p className='text-muted-foreground mt-1 text-sm'>
          Mỗi tài khoản chỉ có duy nhất 1 email.
        </p>
      </div>

      <div className='my-4'>
        <Label className='text-base'>Mật khẩu</Label>
        <div>
          <div>
            <Input
              type='password'
              className={`placeholder:text-opacity-50 rounded-full border-[1px] placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${showPasswordInput && 'hidden'}`}
            />
            <OtpFillIn
              trigger={
                <Button
                  variant='outline'
                  type='button'
                  className={`${!showPasswordInput && 'hidden'}`}
                >
                  <Pencil />
                  Thay đổi mật khẩu
                </Button>
              }
              setOpen={setShowPasswordInput}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
