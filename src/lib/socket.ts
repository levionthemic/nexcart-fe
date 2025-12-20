import { io, Socket } from 'socket.io-client'

import envConfig from '@/config'

let socket: Socket | null = null

export const getNotificationSocket = (): Socket => {
  if (!socket) {
    socket = io(
      `${envConfig.NEXT_PUBLIC_SOCKET_URL}/notifications` ||
        'http://localhost:4000/notifications',
      {
        withCredentials: true,
        transports: ['websocket']
      }
    )
  }
  return socket
}
