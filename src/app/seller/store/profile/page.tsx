'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/user/userSlice'
import Image from 'next/image'
import GeneralTab from './_components/general-tab'
import ContactTab from './_components/contact-tab'

export default function StoreProfile() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <div className=''>
      <div className='h-32 xl:h-52 w-full relative'>
        <Image
          src={'/assets/unknown-cover.jpeg'}
          alt=''
          width={208}
          height={208}
          className='h-full w-full object-cover border'
        />

        <Avatar className='w-24 h-24 xl:w-32 xl:h-32 absolute -bottom-[50%] left-16 border-[5px] border-[#F3F3F3]'>
          <AvatarImage
            src={
              currentUser?.avatar ||
              'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg'
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className='absolute -bottom-[40%] xl:-bottom-[34%] left-44 xl:left-52'>
          <div className='text-xl xl:text-2xl font-semibold mb-1'>
            Tên cửa hàng
          </div>
          <div className='line-clamp-1 text-muted-foreground text-xs xl:text-sm'>
            Mô tả ngắn của cửa hàng
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 mt-14 xl:mt-24 h-full'>
        <Tabs defaultValue='1' className='w-full'>
          <TabsList className='w-full grid grid-cols-4 bg-mainColor1-100/20 dark:bg-muted/50 text-white h-fit'>
            <TabsTrigger value='1' className='px-2 text-md'>
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value='2' className='px-2 text-md'>
              Liên hệ
            </TabsTrigger>
            <TabsTrigger value='3' className='px-2 text-md'>
              Chính sách
            </TabsTrigger>
            <TabsTrigger value='4' className='px-2 text-md'>
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
