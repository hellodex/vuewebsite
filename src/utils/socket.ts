import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useGlobalStore } from '@/stores/global'
import { io } from 'socket.io-client'
import { ElNotification } from 'element-plus'
import { numberFormat } from '@/utils'
import CryptoJS from 'crypto-js'
import { customMessage } from './message'
import BuyImg from '@/assets/img/buy-img.png'
import SellImg from '@/assets/img/sell-img.png'

// const data = {
//   baseAddress: '6LjccmR327LvnfbabH44xnKUBpDbErzMnbMovL8Kpump',
//   chainCode: 'SOLANA',
//   pairAddress: 'Drya4jMXfmGjh3LPg7JnkxAqiSpaPUDzyPWA85s7xhEg',
//   symbol: 'TRUMP',
//   price: '0.000447070755860641864914488145',
//   volume: '32.911237090021688249023105436791365885',
//   chg: '44.6531'
// }

// sendMessage('价格监控', data)

function sendMessage(title: string, data: any) {
  const tokenInfo = useTokenInfoStore().tokenInfo
  const notification = ElNotification({
    dangerouslyUseHTMLString: true,
    duration: 3000,
    position: 'bottom-right',
    customClass:
      data.flag == 0
        ? 'socket-elMessage socket-elMessage_success'
        : 'socket-elMessage socket-elMessage_error',
    message: `<div class='display-flex flex-direction-col'>
                <div class='display-flex align-items-center'>
                  ${(() => {
                    if (data.flag == 0) {
                      return `<img src='${BuyImg}'/>`
                    } else {
                      return `<img src='${SellImg}'/>`
                    }
                  })()}
                  <strong class='title'>AI${title}：${data.symbol}</strong>
                </div>
                <div class='sun-title display-flex align-items-center'>
                  <div>
                    <span>价格已到:</span>
                    <strong>${'$' + numberFormat(data.price)}</strong>
                  </div>
                  <div style='margin:0 14px;'>
                    <span>交易额:</span>
                    <strong>${'$' + numberFormat(data.volume)}</strong>
                  </div>
                  <div>
                    <span>方向:</span>
                    <strong class='${data.flag == 0 ? 'up-color' : 'down-color'}'>${data.flag == 0 ? '买入' : '卖出'}</strong>
                  </div>
                </div>
              </div>`,
    showClose: true,
    onClick: () => {
      notification.close()
      if (window.location.href.indexOf('/k/') >= 0 && data.baseAddress == tokenInfo?.baseAddress) {
        return false
      }
      window.open(`/k/${data.pairAddress}?chainCode=${data.chainCode}`)
    }
  })
}

const version = '1.0'
const channel = import.meta.env.VITE_NOT_TG_CHANNEL
const key = import.meta.env.VITE_NOT_TG_KEY
const ts = String(new Date().getTime())
const sign = CryptoJS.SHA256(channel + ts + version + key).toString()

const URL = `https://wss.apihellodex.lol`

export const socket: any = io(URL, {
  query: {
    channel,
    ts,
    version,
    sign,
    test: '222222'
  }
})

export const socketOnMonitor = (uuid: string, token: string) => {
  socket.off('price')
  socket.off('chg')
  socket.off('buy')
  socket.off('sell')
  // 价格
  socket.emit(
    'price-on',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.on('price', (message: string) => {
    const data = JSON.parse(message)
    console.info(`price-monitor:`, data)
    sendMessage('价格监控', data)
  })

  // 订阅1d价格变化率
  socket.emit(
    'chg-on',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.on('chg', (message: string) => {
    const data = JSON.parse(message)
    console.info(`chg-monitor:`, data)
    sendMessage('涨跌幅监控', data)
  })

  // 大额买单
  socket.emit(
    'buy-on',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.on('buy', (message: string) => {
    const data = JSON.parse(message)
    console.info(`buy-monitor:`, data)
    sendMessage('大单买入监控', data)
  })

  // 大额卖单
  socket.emit(
    'sell-on',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.on('sell', (message: string) => {
    const data = JSON.parse(message)
    console.info(`sell-monitor:`, data)
    sendMessage('大单卖出监控', data)
  })
}

export const socketOffMonitor = (uuid: string, token: string) => {
  socket.emit(
    'price-off',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.emit(
    'chg-off',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.emit(
    'buy-off',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.emit(
    'sell-off',
    JSON.stringify({
      uuid,
      token
    })
  )
}

export function socketLogout() {
  socket.off('logout')
  socket.on('logout', (message: string) => {
    const data = JSON.parse(message)
    if (data) {
      const globalStore = useGlobalStore()
      customMessage({
        type: 'error',
        title: '此账户已在新设备登录，如有问题请尽快联系客服'
      })
      socketOffMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
      localStorage.removeItem('accountInfo')
      localStorage.removeItem('customWalletIndex')
      localStorage.removeItem('customWalletIndex1')
      globalStore.setAccountInfo(null)
      globalStore.setWalletInfo({
        address: null,
        isConnected: false,
        chainId: null,
        walletType: null
      })
      location.reload()
    }
  })
}

socket.on('connect', () => {
  console.info('🔥🔥🔥🔥🔥🔥 socket_ID：', socket.id)
  const globalStore = useGlobalStore()
  const chainInfo = useChainInfoStore().chainInfo
  setTimeout(() => {
    if (globalStore.socketKchartConnectType == 'kChart_disconnect') {
      socket.emit(
        'kchart-on',
        JSON.stringify({
          pair: chainInfo?.pairAddress,
          chainCode: chainInfo?.chainCode
        })
      )
      globalStore.SetSocketKchartConnectType('kChart_connect')
    }
    socketLogout()
    if (globalStore.accountInfo) {
      socketOffMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
      socketOnMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
    }
  }, 3000)

  console.log('socket connect 🔥🔥🔥🔥🔥🔥')
})

socket.on('disconnect', () => {
  const globalStore = useGlobalStore()
  if (globalStore.socketKchartConnectType) {
    globalStore.SetSocketKchartConnectType('kChart_disconnect')
  }
  console.log('socket disconnect 🔥🔥🔥🔥🔥🔥')
})

socket.on('connect_error', (err: any) => {
  const ts = String(new Date().getTime())
  console.info('connect_error', ts)
  socket.io.opts.query.ts = ts
  socket.io.opts.query.sign = CryptoJS.SHA256(channel + ts + version + key).toString()
})
