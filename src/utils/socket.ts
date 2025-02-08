import { useChainInfoStore } from '@/stores/chainInfo'
import { useGlobalStore } from '@/stores/global'
import { io } from 'socket.io-client'

const URL = 'https://wss.apihellodex.lol'

export const socket: any = io(URL)

export const socketOnMonitor = (uuid: string) => {
  socket.off('price')
  socket.off('chg')
  socket.off('buy')
  socket.off('sell')
  // 价格
  socket.emit(
    'price-on',
    JSON.stringify({
      uuid
    })
  )

  socket.on('price', (message: string) => {
    const data = JSON.parse(message)
    console.info(`price-danmaku:`, data)
  })

  // 订阅1d价格变化率
  socket.emit(
    'chg-on',
    JSON.stringify({
      uuid
    })
  )

  socket.on('chg', (message: string) => {
    const data = JSON.parse(message)
    console.info(`chg-danmaku:`, data)
  })

  // 大额买单
  socket.emit(
    'buy-on',
    JSON.stringify({
      uuid
    })
  )

  socket.on('buy', (message: string) => {
    const data = JSON.parse(message)
    console.info(`buy-danmaku:`, data)
  })

  // 大额卖单
  socket.emit(
    'sell-on',
    JSON.stringify({
      uuid
    })
  )

  socket.on('sell', (message: string) => {
    const data = JSON.parse(message)
    console.info(`sell-danmaku:`, data)
  })
}

export const socketOffMonitor = (uuid: string) => {
  socket.emit(
    'price-off',
    JSON.stringify({
      uuid
    })
  )

  socket.emit(
    'chg-off',
    JSON.stringify({
      uuid
    })
  )

  socket.emit(
    'buy-off',
    JSON.stringify({
      uuid
    })
  )

  socket.emit(
    'sell-off',
    JSON.stringify({
      uuid
    })
  )
}

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
