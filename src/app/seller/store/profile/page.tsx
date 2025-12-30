'use client'

import Image from 'next/image'
import { useSelector } from 'react-redux'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { selectCurrentUser } from '@/redux/user/userSlice'

import ContactTab from './_components/contact-tab'
import GeneralTab from './_components/general-tab'

export default function StoreProfile() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <div className=''>
      <div className='relative h-32 w-full xl:h-52'>
        <Image
          src={'/assets/unknown-cover.jpeg'}
          alt=''
          width={208}
          height={208}
          className='h-full w-full border object-cover'
        />

        <Avatar className='absolute -bottom-[50%] left-16 h-24 w-24 border-[5px] border-[#F3F3F3] xl:h-32 xl:w-32'>
          <AvatarImage
            src={
              currentUser?.avatar ||
              'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg'
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className='absolute -bottom-[40%] left-44 xl:-bottom-[34%] xl:left-52'>
          <div className='mb-1 text-xl font-semibold xl:text-2xl'>
            {currentUser?.seller?.name || 'Tên cửa hàng'}
          </div>
          <div className='text-muted-foreground line-clamp-1 text-xs xl:text-sm'>
            Mô tả ngắn của cửa hàng
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='mt-14 h-full p-4 xl:mt-24'>
        <Tabs defaultValue='1' className='w-full'>
          <TabsList className='bg-mainColor1-100/20 dark:bg-muted/50 grid h-fit w-full grid-cols-4 text-white'>
            <TabsTrigger value='1' className='text-md px-2'>
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value='2' className='text-md px-2'>
              Liên hệ
            </TabsTrigger>
            <TabsTrigger value='3' className='text-md px-2'>
              Chính sách
            </TabsTrigger>
            <TabsTrigger value='4' className='text-md px-2'>
              Đánh giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value='1'>
            <GeneralTab />
          </TabsContent>

          <TabsContent value='2'>
            <ContactTab />
          </TabsContent>

          <TabsContent value='3'>Change your password here.</TabsContent>

          <TabsContent value='4'>Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
