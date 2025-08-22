import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Cart } from '@/types/entities/cart'
import { addCartItemApi, deleteCartItemApi, getCartApi, updateCartItemQuantityApi } from '@/apis/cart.api'

// -----------------------------
// Types
// -----------------------------

interface CartState {
  currentCart: Cart | undefined
}

export type AddCartItemPayload = {
  cart_id: number
  product_variant_id: number
  quantity: number
}

// -----------------------------
// Async Thunks
// -----------------------------
export const fetchCurrentCartAPI = createAsyncThunk<Cart | undefined>(
  'cart/fetchCurrentCartAPI',
  async () => {
    return await getCartApi()
  }
)

export const addToCartAPI = createAsyncThunk<
  Cart | undefined,
  AddCartItemPayload
>('cart/addToCartAPI', async (data) => {
  return await addCartItemApi(data)
})

export const updateCartQuantityAPI = createAsyncThunk<
  void,
  AddCartItemPayload
>('cart/updateCartQuantityAPI', async (data) => {
  await updateCartItemQuantityApi(data)
})

export const deleteItemAPI = createAsyncThunk<
  void,
  AddCartItemPayload
>('cart/deleteItemAPI', async (data) => {
  await deleteCartItemApi(data)
})

// -----------------------------
// Slice
// -----------------------------
const initialState: CartState = {
  currentCart: undefined
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.currentCart = action.payload
    },
    clearCart: (state) => {
      state.currentCart = undefined
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentCartAPI.fulfilled, (state, action) => {
      state.currentCart = action.payload
    })
    builder.addCase(updateCartQuantityAPI.fulfilled, () => {})
    builder.addCase(deleteItemAPI.fulfilled, () => {})
  }
})

export const { setCart, clearCart } = cartSlice.actions

export const selectCurrentCart = (state: RootState) => {
  return state.cart.currentCart
}

export const cartReducer = cartSlice.reducer
