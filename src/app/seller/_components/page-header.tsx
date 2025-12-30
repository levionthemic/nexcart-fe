import Link from 'next/link'
import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import Timer from './timer'

interface PageHeaderProps {
  links: {
    link: string
    label: string
  }[]
  title: string
}
export default function PageHeader({ links, title }: PageHeaderProps) {
  return (
    <div className='mb-4 flex items-center justify-between gap-8'>
      <div className='flex-1'>
        <div className='mb-2 text-xl font-bold'>{title}</div>
        <Breadcrumb>
          <BreadcrumbList className='text-sm'>
            {links.map(({ link, label }, index) => (
              <div key={index} className='flex items-center gap-2'>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={link}>{label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </div>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Timer />
    </div>
  )
}
