import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      transports: ['websocket'],
    })
  }
  return socket
}

export function destroySocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
