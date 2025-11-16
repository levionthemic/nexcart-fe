'use client'

import { useEffect, useState } from 'react'
import Loader from '@/components/loader/loader'
import { RoleValue } from '@/types/enums/role'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyUserApi } from '@/apis/auth.api'

function AccountVerification() {
  const [isVerified, setVerified] = useState(false)

  const searchParams = useSearchParams()
  const { email, token, role } = Object.fromEntries([...searchParams])

  const roleValue: RoleValue = role as RoleValue

  const router = useRouter()

  useEffect(() => {
    if (!email || !token) {
      router.replace('/404')
      return
    }

    if (email && token && roleValue) {
      verifyUserApi({ email, token, role: roleValue }).then(() => {
        setVerified(true)
        router.replace(`/login?verifiedEmail=${email}`)
      })
    }
  }, [email, token, roleValue, router])

  if (!isVerified) {
    return <Loader />
  }

  return
}

export default AccountVerification
