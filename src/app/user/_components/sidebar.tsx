'use client'

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
import { FaArrowRight } from 'react-icons/fa'
import { CiUser } from 'react-icons/ci'
import { LuTruck } from 'react-icons/lu'
import { IoMdHeartEmpty } from 'react-icons/io'
import { IoSettingsOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <Sidebar className='px-4 pb-4 bg-sidebar border-none'>
      <SidebarHeader className='p-0 bg-sidebar'>
        <span
          className='my-10 text-4xl font-medium transition-transform cursor-pointer text-primary-foreground hover:scale-105 hover:duration-500'
          onClick={() => router.push('/')}
        >
          LEVI
        </span>
      </SidebarHeader>

      <SidebarContent className='bg-sidebar'>
        <SidebarGroup className='p-0'>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className='py-2 mb-4 text-white rounded-lg cursor-pointer h-fit text-md bg-mainColor1-800 hover:bg-mainColor1-800/90 hover:text-white'
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

      <SidebarFooter className='p-0 bg-sidebar'>
        <div className='p-4 bg-mainColor1-100/30 rounded-xl'>
          <div className='mb-4 text-lg font-medium text-primary-foreground'>
            Có Sản phẩm trong giỏ hàng của bạn
          </div>
          <div className='flex items-center justify-end gap-4'>
            <p className='text-sm'>Kiểm tra ngay</p>
            <div className='p-2 bg-white rounded-full'>
              <FaArrowRight
                className='cursor-pointer text-mainColor1-600'
                onClick={() => router.push('/buyer/cart')}
              />
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
