'use client'

import { useEffect, useState } from 'react'
import { verifyUserAPI } from '@/apis/authApis'
import Loader from '@/components/loader/loader'
import { RoleValue } from '@/types/enums/role'
import { useRouter, useSearchParams } from 'next/navigation'

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
      verifyUserAPI({ email, token, role: roleValue }).then(() => {
        setVerified(true)
        router.replace(`/login?verifiedEmail=${email}`)
      })
    }
  }, [email, token, roleValue])

  if (!isVerified) {
    return <Loader caption={'Đang xác thực...'} />
  }

  return
}

export default AccountVerification
