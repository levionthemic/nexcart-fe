'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import NProgress from '@/components/n-progress/progress'
import { useLoading } from '@/contexts/loading-context'

export default function ClientBuyerLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { apiLoadingCount } = useLoading()

  const pathname = usePathname()
  const [navKey, setNavKey] = useState(() => crypto.randomUUID())

  useEffect(() => {
    setNavKey(crypto.randomUUID())
  }, [pathname])

  return (
    <div className='dark:bg-background bg-[#F5F5FA] pt-[120px]'>
      <NProgress isAnimating={apiLoadingCount > 0} key={navKey} />
      {children}
    </div>
  )
}
