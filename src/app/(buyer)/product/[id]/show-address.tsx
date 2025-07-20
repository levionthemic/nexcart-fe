'use client'

import { useLoading } from '@/contexts/LoadingContext'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { Address } from '@/types/entities/address'
import { getAddressString } from '@/utils/helpers'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function ShowAddress() {
  const [address, setAddress] = useState('123 đường ABC')

  const { startLoading, endLoading } = useLoading()

  const currentUser = useSelector(selectCurrentUser)
  useEffect(() => {
    startLoading()
    if (currentUser?.buyer?.addresses) {
      const defaultAddress = currentUser?.buyer?.addresses.find(
        (address: Address) => address.isDefault
      )
      if (defaultAddress)
        getAddressString(defaultAddress)
          .then((result) => setAddress(result))
          .finally(() => endLoading())
    } else endLoading()
  }, [currentUser?.buyer?.addresses])

  return <p className='text-sm'>Giao đến: {address}</p>
}
