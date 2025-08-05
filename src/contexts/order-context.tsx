'use client'

import { InformationType } from '@/app/(buyer)/checkout/[step]/information'
import { GhnFee } from '@/types/entities/ghn'
import { Order, OrderItem } from '@/types/entities/order'
import { Shop } from '@/types/entities/shop'
import { Seller } from '@/types/entities/user'
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
  seller: Seller
  shop: Shop
  originalPrice: number
  orderItems: OrderItem[]
}

export interface ShippingDataType {
  type: ShippingMethod
  detail: Record<string, unknown> | GhnFee
}
export type CheckoutInfoType = {
  information?: InformationType
  shipping?: ShippingDataType[]
  discountCode?: string[]
  note?: string[]

  payment?: {
    type: PaymentMethod
    detail: Record<string, unknown>
  }[]
}
type OrderContextType = {
  orderItems: OrderItem[]
  setOrderItems: Dispatch<SetStateAction<OrderItem[]>>
  checkoutInfo: CheckoutInfoType | null
  setCheckoutInfo: Dispatch<SetStateAction<CheckoutInfoType | null>>
  clusterOrders: ClusterOrderListItem[]
  setClusterOrders: Dispatch<SetStateAction<ClusterOrderListItem[]>>
  buyNow: boolean
  setBuyNow: Dispatch<SetStateAction<boolean>>
  checkoutData: Order[]
  setCheckoutData: Dispatch<SetStateAction<Order[]>>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

type OrderProviderProps = {
  children: ReactNode
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    JSON.parse(String(sessionStorage.getItem('orderItems'))) || []
  )
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfoType | null>(
    null
  )
  const [clusterOrders, setClusterOrders] = useState<ClusterOrderListItem[]>([])
  const [buyNow, setBuyNow] = useState(
    Boolean(JSON.parse(String(sessionStorage.getItem('buyNow'))))
  )
  const [checkoutData, setCheckoutData] = useState<Order[]>([])

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        setOrderItems,
        checkoutInfo,
        setCheckoutInfo,
        clusterOrders,
        setClusterOrders,
        buyNow,
        setBuyNow,
        checkoutData,
        setCheckoutData
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
