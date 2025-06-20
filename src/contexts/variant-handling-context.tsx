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
  typeId: string,
  setTypeId: Dispatch<SetStateAction<string>>,
  productEndPrice: number,
  setProductEndPrice: Dispatch<SetStateAction<number>>,
  discount: number,
  setDiscount: Dispatch<SetStateAction<number>>
}

const VariantHandlingContext = createContext<VariantHandlingContextType | undefined>(undefined)

type TypeIdProviderProps = {
  children: ReactNode,
  initialProductEndPrice: number
}

export const TypeIdProvider = ({ children, initialProductEndPrice = 0 }: TypeIdProviderProps) => {
  const [typeId, setTypeId] = useState<string>('')
  const [productEndPrice, setProductEndPrice] = useState<number>(initialProductEndPrice)
  const [discount, setDiscount] = useState<number>(0)

  return (
    <VariantHandlingContext.Provider
      value={{
        typeId,
        setTypeId,
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
    throw new Error('useTypeId must be used within a TypeIdProvider')
  }
  return context
}
