'use client' 

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react'

type VariantHandlingContextType = {
  productVariantId: number | undefined,
  setProductVariantId: Dispatch<SetStateAction<number | undefined>>,
  productEndPrice: number,
  setProductEndPrice: Dispatch<SetStateAction<number>>,
  discount: number,
  setDiscount: Dispatch<SetStateAction<number>>
}

const VariantHandlingContext = createContext<VariantHandlingContextType | undefined>(undefined)

type VariantHandlingProviderProps = {
  children: ReactNode,
  initialProductEndPrice: number
}

export const VariantHandlingProvider = ({ children, initialProductEndPrice = 0 }: VariantHandlingProviderProps) => {
  const [productVariantId, setProductVariantId] = useState<number | undefined>()
  const [productEndPrice, setProductEndPrice] = useState<number>(initialProductEndPrice)
  const [discount, setDiscount] = useState<number>(0)

  return (
    <VariantHandlingContext.Provider
      value={{
        productVariantId,
        setProductVariantId,
        productEndPrice,
        setProductEndPrice,
        discount,
        setDiscount
      }}
    >
      {children}
    </VariantHandlingContext.Provider>
  )
}

export const useVariantHandling = (): VariantHandlingContextType => {
  const context = useContext(VariantHandlingContext)
  if (!context) {
    throw new Error('useVariantHandling must be used within a VariantHandlingProvider')
  }
  return context
}
