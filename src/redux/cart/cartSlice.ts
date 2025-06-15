import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '@/utils/authorizedAxios'
import { RootState } from '../store'
import { Cart } from '@/types/entities/cart'

// -----------------------------
// Types
// -----------------------------

interface CartState {
  currentCart: Cart | null
}

// -----------------------------
// Async Thunks
// -----------------------------
export const fetchCurrentCartAPI = createAsyncThunk<Cart>(
  'cart/fetchCurrentCartAPI',
  async () => {
    const response = await authorizedAxiosInstance.get('/cart')
    return response.data
  }
)

export const addToCartAPI = createAsyncThunk<
  Cart,
  { productId: string; quantity: number }
>('cart/addToCartAPI', async (data) => {
  const response = await authorizedAxiosInstance.post('/cart/add`', data)
  return response.data
})

export const updateCartQuantityAPI = createAsyncThunk<
  void,
  { productId: string; quantity: number }
>('cart/updateCartQuantityAPI', async (data) => {
  const response = await authorizedAxiosInstance.put('/cart/update', data)
  return response.data
})

export const deleteItemAPI = createAsyncThunk<
  void,
  { productId: string; typeId: string }
>('cart/deleteItemAPI', async (data) => {
  const response = await authorizedAxiosInstance.put('/cart/delete', data)
  return response.data
})

// -----------------------------
// Slice
// -----------------------------
const initialState: CartState = {
  currentCart: null
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.currentCart = action.payload
    },
    clearCart: (state) => {
      state.currentCart = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentCartAPI.fulfilled, (state, action) => {
      state.currentCart = action.payload
    })
    builder.addCase(addToCartAPI.fulfilled, (state, action) => {
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
