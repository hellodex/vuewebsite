import { useChainInfoStore } from '@/stores/chainInfo'
import { useGlobalStore } from '@/stores/global'
import { io } from 'socket.io-client'

const URL = 'https://wss.apihellodex.lol'

export const socket: any = io(URL)

socket.on('connect', () => {
  const globalStore = useGlobalStore()
  const chainInfo = useChainInfoStore().chainInfo
  if (globalStore.socketKchartConnectType == 'kChart_disconnect') {
    setTimeout(() => {
      socket.emit(
        'kchart-on',
        JSON.stringify({
          pair: chainInfo?.pairAddress,
          chainCode: chainInfo?.chainCode
        })
      )
    }, 2500)
    globalStore.SetSocketKchartConnectType('kChart_connect')
  }
  console.info('🔥🔥🔥🔥🔥🔥 socket connect 🔥🔥🔥🔥🔥🔥')
})

socket.on('disconnect', () => {
  const globalStore = useGlobalStore()
  console.log('🔥🔥🔥🔥🔥🔥', globalStore.socketKchartConnectType)
  if (globalStore.socketKchartConnectType) {
    globalStore.SetSocketKchartConnectType('kChart_disconnect')
  }
  console.info('🔥🔥🔥🔥🔥🔥 socket disconnect 🔥🔥🔥🔥🔥🔥')
})
