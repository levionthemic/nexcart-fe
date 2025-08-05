'use client'

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { Socket } from 'socket.io-client'
import { getNotificationSocket } from '@/lib/socket'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/user/userSlice'

type SocketContextType = {
  notificationSocket: Socket | null
  setNotificationSocket: Dispatch<SetStateAction<Socket | null>>
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [notificationSocket, setNotificationSocket] = useState<Socket | null>(
    null
  )
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    if (!currentUser) return

    const s = getNotificationSocket()

    s.on('connect', () => {
      s.emit('join-room')
    })

    setNotificationSocket(s)

    return () => {
      s.off('connect')
      if (s.connected) s.disconnect()
    }
  }, [currentUser])

  return (
    <SocketContext.Provider
      value={{ notificationSocket, setNotificationSocket }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider')
  }
  return context
}
