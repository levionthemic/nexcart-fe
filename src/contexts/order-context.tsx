'use client'

import { InformationFormSchemaType } from '@/app/(buyer)/checkout/[step]/information'
import { Address } from '@/types/entities/address'
import { OrderItem } from '@/types/entities/order'
import { PaymentMethod, ShippingMethod } from '@/types/enums/checkout'
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react'

export interface ClusterOrderListItem {
  buyerId: string
  sellerId: string
  shopId: string
  orgPrice: number
  shopAddress: Address
  itemList: OrderItem[]
}

export interface ShippingDataType {
  type: ShippingMethod
  detail: Record<string, unknown>
}
export type CheckoutInfoType = {
  information?: InformationFormSchemaType & { shortAddress: string }
  shipping?: ShippingDataType[]
  discountCode?: string[]
  note?: string[]

  payment?: {
    type: PaymentMethod,
    detail: Record<string, unknown>
  }[]
}
type OrderContextType = {
  itemList: OrderItem[]
  setItemList: Dispatch<SetStateAction<OrderItem[]>>
  checkoutInfo: CheckoutInfoType | null
  setCheckoutInfo: Dispatch<SetStateAction<CheckoutInfoType | null>>
  clusterOrders: ClusterOrderListItem[]
  setClusterOrders: Dispatch<SetStateAction<ClusterOrderListItem[]>>
  buyNow: boolean
  setBuyNow: Dispatch<SetStateAction<boolean>>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

type OrderProviderProps = {
  children: ReactNode
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [itemList, setItemList] = useState<OrderItem[]>(
    JSON.parse(String(sessionStorage.getItem('itemList'))) || []
  )
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfoType | null>(
    null
  )
  const [clusterOrders, setClusterOrders] = useState<ClusterOrderListItem[]>([])
  const [buyNow, setBuyNow] = useState(
    Boolean(JSON.parse(String(sessionStorage.getItem('buyNow'))))
  )

  return (
    <OrderContext.Provider
      value={{
        itemList,
        setItemList,
        checkoutInfo,
        setCheckoutInfo,
        clusterOrders,
        setClusterOrders,
        buyNow,
        setBuyNow
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within a OrderProvider')
  }
  return context
}
