import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useGlobalStore } from '@/stores/global'
import { io } from 'socket.io-client'
import { ElNotification } from 'element-plus'
import CryptoJS from 'crypto-js'
import { customMessage } from './message'
import BuyImg from '@/assets/img/buy-img.png'
import SellImg from '@/assets/img/sell-img.png'
import SuccessImg from '@/assets/img/success-img.png'
import ErrorImg from '@/assets/img/error-img.png'
import { numberFormat } from '@/utils/index'
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
    duration: 2000,
    position: 'bottom-right',
    customClass:
      data.payload.flag == 0
        ? 'socket-elMessage socket-elMessage_success'
        : 'socket-elMessage socket-elMessage_error',
    message: `<div class='display-flex flex-direction-col'>
                <div class='display-flex align-items-center'>
                  ${(() => {
      if (data.payload.flag == 0) {
        return `<img src='${BuyImg}'/>`
      } else {
        return `<img src='${SellImg}'/>`
      }
    })()}
                  <strong class='title'>${data.title}</strong>
                </div>
                <div class='sun-title display-flex align-items-center'>
                  ${(() => {
      if (title == '涨跌幅监控') {
        return `<div>
                                <span>涨跌幅已到:</span>
                                <strong>${data.payload.chg + '%'}</strong>
                              </div>
                              <div style='margin:0 14px;'>
                                <span>价格:</span>
                                <strong>${'$' + data.payload.price}</strong>
                              </div>`
      } else {
        return `<div>
                                <span>价格已到:</span>
                                <strong>${'$' + data.payload.price}</strong>
                              </div>
                              <div style='margin:0 14px;'>
                                <span>交易额:</span>
                                <strong>${'$' + data.payload.volume}</strong>
                              </div>`
      }
    })()}
                  <div>
                    <span>方向:</span>
                    <strong class='${data.payload.flag == 0 ? 'up-color' : 'down-color'}'>${data.payload.flag == 0 ? '买入' : '卖出'}</strong>
                  </div>
                </div>
              </div>`,
    showClose: true,
    onClick: () => {
      notification.close()
      if (
        window.location.href.indexOf('/k/') >= 0 &&
        data.payload.baseAddress == tokenInfo?.baseAddress
      ) {
        return false
      }
      window.open(`/k/${data.payload.pairAddress}?chainCode=${data.payload.chainCode}`)
    }
  })
}

function sendOrderMessage(data: any) {
  const tokenInfo = useTokenInfoStore().tokenInfo
  const notification = ElNotification({
    dangerouslyUseHTMLString: true,
    duration: 2000,
    position: 'bottom-right',
    customClass:
      data.payload.flag == 0
        ? 'socket-elMessage socket-elMessage_success'
        : 'socket-elMessage socket-elMessage_error',
    message: `<div class='display-flex flex-direction-col'>
                <div class='display-flex align-items-center'>
                  ${(() => {
      if (data.payload.flag == 0) {
        return `<img src='${SuccessImg}'/>`
      } else {
        return `<img src='${ErrorImg}'/>`
      }
    })()}
                  <strong class='title'>${data.title}</strong>
                </div>
                <div class='sun-title display-flex align-items-center'>
                  <div>
                    <span>挂单价：</span>
                    <strong>${'$' + data.payload.targetPrice}</strong>
                  </div>
                  <div style='margin:0 14px;'>
                    <span>现价：</span>
                    <strong>${'$' + data.payload.price}</strong>
                  </div>
                  <div>
                    <span>结果：</span>
                    <strong class='${data.payload.flag == 0 ? 'up-color' : 'down-color'}'>${data.payload.msg}</strong>
                  </div>
                </div>
              </div>`,
    showClose: true,
    onClick: () => {
      notification.close()
      if (
        window.location.href.indexOf('/k/') >= 0 &&
        data.payload.baseAddress == tokenInfo?.baseAddress
      ) {
        return false
      }
      window.open(`/k/${data.payload.pairAddress}?chainCode=${data.payload.chainCode}`)
    }
  })
}

function sendWalletMessage(data: any) {
  const tokenInfo = useTokenInfoStore().tokenInfo
  const notification = ElNotification({
    dangerouslyUseHTMLString: true,
    duration: 3000,
    position: 'bottom-right',
    customClass:
      data.payload.flag == 0
        ? 'socket-elMessage socket-elMessage_success'
        : 'socket-elMessage socket-elMessage_error',
    message: `<div class='display-flex flex-direction-col' style='min-width: 320px;'>
                <div class='display-flex align-items-center' style='margin-bottom: 8px;'>
                  ${(() => {
      if (data.payload.flag == 0) {
        return `<img src='${BuyImg}'/>`
      } else {
        return `<img src='${SellImg}'/>`
      }
    })()}
                  <strong class='title'>${data.title}</strong>
                </div>
                <div class='sun-title' style='display: flex; flex-direction: column; gap: 4px; font-size: 12px;'>
                  <div style='display: flex; justify-content: space-between;'>
                    <span>钱包: <strong>${data.payload.walletName || (data.payload.walletAddress?.slice(0, 6) + '...' + data.payload.walletAddress?.slice(-4))}</strong></span>
                    <strong class='${data.payload.flag == 0 ? 'up-color' : 'down-color'}'>${data.payload.flag == 0 ? '买入' : '卖出'}</strong>
                  </div>
                  <div style='display: flex; justify-content: space-between;'>
                    <span>代币: <strong>${data.payload.symbol || 'Unknown'}</strong></span>
                    <span>价格: <strong>${data.payload.price ? '$' + data.payload.price : 'N/A'}</strong></span>
                  </div>
                  <div style='display: flex; justify-content: space-between;'>
                    <span>交易额: <strong>${'$' + (numberFormat(data.payload.volume) || '0')}</strong></span>
                    <span>数量: <strong>${data.payload.amount || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>`,
    showClose: true,
    onClick: () => {
      notification.close()
      if (
        window.location.href.indexOf('/k/') >= 0 &&
        data.payload.baseAddress == tokenInfo?.baseAddress
      ) {
        return false
      }
      if (data.payload.pairAddress && data.payload.chainCode) {
        window.open(`/k/${data.payload.pairAddress}?chainCode=${data.payload.chainCode}`)
      }
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
  socket.off('order')
  socket.off('walletWatch')
  socket.off('logOut')
  // 价格
  socket.emit(
    'logOut-on',
    JSON.stringify({
      uuid,
      token
    })
  )
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
    // console.log(`price-monitor:`, data)
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
    // console.log(`chg-monitor:`, data)
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
    // console.log(`buy-monitor:`, data)
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
    // console.log(`sell-monitor:`, data)
    sendMessage('大单卖出监控', data)
  })

  socket.emit(
    'order-on',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.on('order', (message: string) => {
    const data = JSON.parse(message)
    // console.log(`order-monitor:`, data)
    sendOrderMessage(data)
  })

  // 多钱包监控
  socket.emit(
    'walletWatch-on',
    JSON.stringify({
      uuid,
      token
    })
  )
  socket.on('walletWatch', (message: string) => {
    // console.log('开启walletWatch')
    const data = JSON.parse(message)
    // console.log(`walletWatch-monitor:`, data)
    sendWalletMessage(data)
  })
}

export const socketOffMonitor = (uuid: string, token: string) => {
  socket.emit(
    'logOut-off',
    JSON.stringify({
      uuid,
      token
    })
  )
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

  socket.emit(
    'order-off',
    JSON.stringify({
      uuid,
      token
    })
  )

  socket.emit(
    'walletWatch-off',
    JSON.stringify({
      uuid,
      token
    })
  )
}

export function socketLogout() {
  socket.off('logOut')
  socket.on('logOut', (message: string) => {
    const data = JSON.parse(message)
    // console.log(data)
    if (data.uuid) {
      const globalStore = useGlobalStore()
      customMessage({
        type: 'error',
        title: '此账户已在新电脑网页登录，如有问题请尽快联系客服',
        duration: 3000
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
      
      // Delay reload to allow message to be visible
      setTimeout(() => {
        location.reload()
      }, 3000)
    }
  })
}

socket.on('connect', () => {
  // console.log('🔥🔥🔥🔥🔥🔥 socket_ID：', socket.id)
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
    // console.warn('🔥🔥🔥🔥🔥🔥 socket_connect：', 'connection successful!')
    socket.emit('pumpRanking-off', '{}')
    socket.emit('pumpRanking-on', '{}')
    socketLogout()
    if (globalStore.accountInfo) {
      socketOffMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
      socketOnMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)

    }
    globalStore.setSocketConnectType('socket_connect')
  }, 3000)

  // console.log('socket connect 🔥🔥🔥🔥🔥🔥')
})

socket.on('disconnect', () => {
  const globalStore = useGlobalStore()
  globalStore.setSocketConnectType('socket_disconnect')
  if (globalStore.socketKchartConnectType) {
    globalStore.SetSocketKchartConnectType('kChart_disconnect')
  }
  // console.log('socket disconnect 🔥🔥🔥🔥🔥🔥')
})

socket.on('connect_error', (err: any) => {
  const ts = String(new Date().getTime())
  // console.log('connect_error', ts)
  socket.io.opts.query.ts = ts
  socket.io.opts.query.sign = CryptoJS.SHA256(channel + ts + version + key).toString()
})
