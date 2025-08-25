'use client'

import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { Category } from '@/types/entities/category'
import { useRouter } from 'next/navigation'

export default function CategoryBar({
  categories = [],
  className
}: {
  categories: Category[]
  className?: string
}) {
  const router = useRouter()
  return (
    <div
      className={`sticky left-0 flex-1 overflow-y-auto h-96 max-h-96 top-5 scroll-smooth scroll-pr-1 custom-scrollbar ${className}`}
    >
      <div className='text-xl font-semibold text-mainColor1-600'>Danh mục:</div>
      <SidebarMenu className='flex flex-col items-start gap-2 mt-2'>
        {categories?.map((item) => (
          <Collapsible key={item.id} className='w-full group/collapsible'>
            {/* <SidebarMenuItem> */}
            <CollapsibleTrigger className='w-full'>
              <SidebarMenuButton asChild>
                <div className='flex items-center justify-between w-full'>
                  {item.name}
                  <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                </div>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children?.map((sub) => (
                  <SidebarMenuSubItem
                    key={sub.id}
                    className='text-xs text-muted-foreground cursor-pointer hover:text-mainColor1-600'
                    onClick={() => {
                      router.push(`/category/${sub.slug}`)
                    }}
                  >
                    {sub.name}
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
            {/* </SidebarMenuItem> */}
          </Collapsible>
        ))}
      </SidebarMenu>
    </div>
  )
}
