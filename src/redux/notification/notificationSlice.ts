import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Notification } from '@/types/entities/notification'
import { getNotificationListApi } from '@/apis/notification.api'

// -----------------------------
// Types
// -----------------------------

interface NotificationState {
  currentNotificationList: Notification[] | undefined
  hasNewNotification: boolean
}

// -----------------------------
// Async Thunks
// -----------------------------
export const fetchCurrentNotificationListAPI = createAsyncThunk<
  Notification[] | undefined
>('notification/fetchCurrentNotificationListAPI', async () => {
  return await getNotificationListApi()
})

// -----------------------------
// Slice
// -----------------------------
const initialState: NotificationState = {
  currentNotificationList: undefined,
  hasNewNotification: false
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationList: (state, action: PayloadAction<Notification[]>) => {
      state.currentNotificationList = action.payload
    },
    setHasNewNotification: (state, action: PayloadAction<boolean>) => {
      state.hasNewNotification = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentNotificationListAPI.fulfilled, (state, action) => {
      state.currentNotificationList = action.payload
    })
  }
})

export const { setNotificationList, setHasNewNotification } = notificationSlice.actions

export const selectCurrentNotificationList = (state: RootState) => {
  return state.notification.currentNotificationList
}

export const selectHasNewNotification = (state: RootState) => {
  return state.notification.hasNewNotification
}

export const notificationReducer = notificationSlice.reducer
