'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CiUser } from 'react-icons/ci'
import { FaArrowRight } from 'react-icons/fa'
import { IoMdHeartEmpty } from 'react-icons/io'
import { IoSettingsOutline } from 'react-icons/io5'
import { LuTruck } from 'react-icons/lu'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

export default function UserSidebar() {
  const router = useRouter()

  const items = [
    {
      title: 'Hồ sơ',
      url: '/user/profile',
      icon: <CiUser />
    },
    {
      title: 'Đơn hàng',
      url: '/user/orders',
      icon: <LuTruck />
    },
    {
      title: 'Yêu thích',
      url: '#',
      icon: <IoMdHeartEmpty />
    },
    {
      title: 'Cài đặt',
      url: '#',
      icon: <IoSettingsOutline />
    }
  ]
  return (
    <Sidebar className='bg-sidebar border-none px-4 pb-4'>
      <SidebarHeader className='bg-transparent p-0'>
        <div
          className='my-4 flex cursor-pointer items-center justify-center'
          onClick={() => router.push('/')}
        >
          <Image
            src='/mainlogo.png'
            alt='NexCart'
            width={120}
            height={40}
            className='aspect-video w-32 object-cover'
          />
        </div>
      </SidebarHeader>

      <SidebarContent className='bg-transparent'>
        <SidebarGroup className='p-0'>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className='text-md bg-mainColor1-800 hover:bg-mainColor1-800/90 mb-4 h-fit cursor-pointer rounded-lg py-2 text-white hover:text-white'
                    asChild
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='bg-sidebar p-0'>
        <div className='bg-mainColor1-100/30 rounded-xl p-4'>
          <div className='text-primary-foreground mb-4 text-lg font-medium'>
            Có Sản phẩm trong giỏ hàng của bạn
          </div>
          <div className='flex items-center justify-end gap-4'>
            <p className='text-sm'>Kiểm tra ngay</p>
            <div className='rounded-full bg-white p-2'>
              <FaArrowRight
                className='text-mainColor1-600 cursor-pointer'
                onClick={() => router.push('/buyer/cart')}
              />
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
