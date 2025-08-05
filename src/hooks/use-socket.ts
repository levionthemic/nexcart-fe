import { useSocketContext } from '@/components/providers/SocketProvider'

export const useSocket = () => {
  const { notificationSocket } = useSocketContext()

  if (!notificationSocket) {
    console.error('Notification Socket not connected yet')
  }

  return notificationSocket
}
