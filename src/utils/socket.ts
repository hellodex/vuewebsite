import { reactive } from 'vue'
import { io } from 'socket.io-client'

interface stateT {
  connected: boolean
  fooEvents: any
  barEvents: any
}

export const state = reactive<stateT>({
  connected: false,
  fooEvents: [],
  barEvents: []
})

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'

export const socket: any = io(URL)

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('foo', (...args: any) => {
  state.fooEvents.push(args)
})

socket.on('bar', (...args: any) => {
  state.barEvents.push(args)
})
