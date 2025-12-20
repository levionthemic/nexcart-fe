'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import NProgress from '@/components/feedback/n-progress/progress'
import { useLoading } from '@/contexts/loading-context'

export default function ClientSellerLayout({
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
    <>
      <NProgress isAnimating={apiLoadingCount > 0} key={navKey} />
      {children}
    </>
  )
}
