import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import React from 'react'
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
    <div className='flex items-center justify-between mb-4 gap-8'>
      <div className='flex-1'>
        <div className='font-bold text-xl mb-2'>{title}</div>
        <Breadcrumb>
          <BreadcrumbList className='text-sm'>
            {links.map(({ link, label }, index) => (
              <div key={index}>
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
