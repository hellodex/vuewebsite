import { io } from 'socket.io-client'

const URL = 'https://wss.apihellodex.lol'

export const socket: any = io(URL)

socket.on('connect', () => {
  console.info('🔥🔥🔥🔥🔥🔥 socket connect 🔥🔥🔥🔥🔥🔥')
})

socket.on('disconnect', () => {
  console.info('🔥🔥🔥🔥🔥🔥 socket disconnect 🔥🔥🔥🔥🔥🔥')
})
