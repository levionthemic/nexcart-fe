'use client'

import OtpFillIn from '@/components/otp-fill-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

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
              className="placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-full focus:outline-none focus:border-[2px] border-[1px]"
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
        <p className='mt-1 text-sm text-muted-foreground'>
          Mỗi tài khoản chỉ có duy nhất 1 email.
        </p>
      </div>

      <div className='my-4'>
        <Label className='text-base'>Mật khẩu</Label>
        <div>
          <div>
            <Input
              type='password'
              className={`placeholder:text-green-50 placeholder:text-sm placeholder:text-opacity-50 rounded-full focus:outline-none focus:border-[2px] border-[1px] ${showPasswordInput && 'hidden'}`}
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
