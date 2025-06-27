'use client'

import { useLoading } from '@/contexts/LoadingContext'
import React, { useEffect, useState } from 'react'
import NProgress from '@/components/n-progress/progress'
import { usePathname } from 'next/navigation'

export default function ClientSellerLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { setPageLoading, apiLoadingCount } = useLoading()

  const pathname = usePathname()
  const [navKey, setNavKey] = useState(() => crypto.randomUUID())

  useEffect(() => {
    setNavKey(crypto.randomUUID())
  }, [pathname])

  useEffect(() => {
    setPageLoading(true)

    const timeout = setTimeout(() => {
      setPageLoading(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [pathname, setPageLoading])
  return (
    <>
      <NProgress isAnimating={apiLoadingCount > 0} key={navKey} />
      {children}
    </>
  )
}
