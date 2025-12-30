'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '@/redux/user/userSlice'
import { Address } from '@/types/entities/address'
import { getAddressString } from '@/utils/helpers'

export default function ShowAddress() {
  const [address, setAddress] = useState('123 đường ABC')

  const currentUser = useSelector(selectCurrentUser)
  useEffect(() => {
    if (currentUser?.buyer?.addresses) {
      const defaultAddress = currentUser?.buyer?.addresses.find(
        (address: Address) => address.is_default
      )

      if (defaultAddress)
        getAddressString(defaultAddress).then((result) => setAddress(result))
    }
  }, [currentUser?.buyer?.addresses])

  return <p className='text-sm'>Giao đến: {address}</p>
}
