'use client'

import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { Category } from '@/types/entities/category'

export default function CategoryBar({
  categories = [],
  onClickCategory
}: {
  categories: Category[]
  onClickCategory: (categoryId: string) => void
}) {
  return (
    <div className='sticky left-0 flex-1 overflow-y-scroll h-96 max-h-96 top-5 scroll-smooth scroll-pr-1'>
      <div className='text-xl font-semibold text-mainColor1-600'>Danh mục:</div>
      <SidebarMenu className='flex flex-col items-start gap-2 mt-2'>
        {categories?.map((item) => (
          <Collapsible key={item._id} className='w-full group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger className='w-full'>
                <SidebarMenuButton className='flex items-center justify-between w-full'>
                  {item.name}
                  <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>SubMenuItem</SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </div>
  )
}
