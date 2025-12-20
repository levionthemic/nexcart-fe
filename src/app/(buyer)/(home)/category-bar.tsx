'use client'

import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { Category } from '@/types/entities/category'

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
      className={`custom-scrollbar sticky top-5 left-0 h-96 max-h-96 flex-1 scroll-pr-1 overflow-y-auto scroll-smooth ${className}`}
    >
      <div className='text-mainColor1-600 text-xl font-semibold'>Danh mục:</div>
      <SidebarMenu className='mt-2 flex flex-col items-start gap-2'>
        {categories?.map((item) => (
          <Collapsible key={item.id} className='group/collapsible w-full'>
            {/* <SidebarMenuItem> */}
            <CollapsibleTrigger className='w-full'>
              <SidebarMenuButton asChild>
                <div className='flex w-full items-center justify-between'>
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
                    className='text-muted-foreground hover:text-mainColor1-600 cursor-pointer text-xs'
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
