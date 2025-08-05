'use client'

import { useLoading } from '@/contexts/LoadingContext'
import React, { useEffect, useState } from 'react'
import NProgress from '@/components/n-progress/progress'
import { usePathname } from 'next/navigation'

export default function ClientUserLayout({
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
