import { reactive } from 'vue'
import { io } from 'socket.io-client'
import { useChainInfoStore } from '@/stores/chainInfo'

interface stateT {
  connected: boolean
}

export const state = reactive<stateT>({
  connected: false
})

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  'http://109.123.230.51:8600?pair=8QPqDLwDqjHvSAzHXcCG5GQZWS6YD91Y2M9bQUTCJ5Ph&chainCode=SOLANA'

export const socket: any = io(URL)

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('kchart', (...args: any) => {
  console.log('server-message', JSON.parse(args))
})
