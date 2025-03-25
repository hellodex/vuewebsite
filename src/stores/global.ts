/**
 * ref() 就是 state属性
 * computed() 就是 getters
 * function() 就是 actions
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  // 主题
  const theme = ref<string>('dark')

  // 当前系统语言
  const language = ref<string | null>(null)

  // 弹幕
  const danmaku = ref<number>(
    localStorage.getItem('danmaku') == undefined || localStorage.getItem('danmaku') == null
      ? 1
      : Number(localStorage.getItem('danmaku'))
  )

  // 全局注册登录弹框控制
  const dialogVisible = ref<any>({
    registerDialogVisible: false,
    logOnDialogVisible: false,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: false
  })

  // 邀请
  const invite = ref<any>(null)

  // 主网货币列表
  const chainLogoObj = ref<any>(null)
  const chainList = ref<any>([])

  // 钱包信息
  const walletInfo = ref<any>({
    address: '',
    isConnected: false,
    chainId: '',
    walletType: ''
  })

  const customWalletInfo = ref<any>({})

  // 账户信息
  const account = localStorage.getItem('accountInfo')
  const accountInfo = ref<any>(account ? JSON.parse(account) : null)

  // 修改主题
  function setTheme(val: any): void {
    theme.value = val
  }

  // 代币收藏数据
  const favoriteData = ref<any>([])

  // k线 socket 连接状态
  const socketKchartConnectType = ref<string | null>(null)

  const Dashboard = localStorage.getItem('currencyDashboard')
  const currencyDashboard = ref<any>(Dashboard ? JSON.parse(Dashboard) : [])

  /** 处置操作 */

  // 修改语言
  function setLanguage(val: any): void {
    language.value = val
    sessionStorage.setItem('language', val)
  }

  // 弹幕开关
  function setDanmaku(val: any): void {
    danmaku.value = val
    localStorage.setItem('danmaku', val)
  }

  // 修改邀请
  function setInvite(val: any): void {
    invite.value = val
  }

  // 修改全局弹框状态
  function setDialogVisible(val: any): void {
    dialogVisible.value = val
  }

  // 修改主网货币及数据处理
  function setChain(val: any): void {
    chainList.value = val

    const obj: any = {}
    chainList.value.forEach((item: any) => {
      obj[item.chainCode] = item.logo
    })
    chainLogoObj.value = obj
  }

  // 修改钱包信息
  function setWalletInfo(val: any): void {
    walletInfo.value = val
  }

  function setCustomWalletInfo(val: any): void {
    customWalletInfo.value = val
    localStorage.setItem('customWalletIndex', val.index)
    localStorage.setItem('customWalletIndex1', val.index1)
  }

  function setAccountInfo(val: any): void {
    accountInfo.value = val
  }

  // 塞入代币收藏数据
  function setFavoriteData(val: any): void {
    favoriteData.value = val
  }

  function SetSocketKchartConnectType(val: string | null): void {
    socketKchartConnectType.value = val
  }

  function setCurrencyDashboard(val: any) {
    if (currencyDashboard.value.find((item: any) => item.pairAddress == val.pairAddress)) {
      currencyDashboard.value.forEach((item: any) => {
        if (item.pairAddress == val.pairAddress) {
          item = val
        }
      })
    } else {
      currencyDashboard.value.push(val)
    }
    localStorage.setItem('currencyDashboard', JSON.stringify(currencyDashboard.value))
  }

  function delCurrencyDashboard(val: any) {
    currencyDashboard.value = val
    localStorage.setItem('currencyDashboard', JSON.stringify(currencyDashboard.value))
  }

  return {
    theme,
    language,
    danmaku,
    dialogVisible,
    invite,
    chainList,
    chainLogoObj,
    walletInfo,
    accountInfo,
    customWalletInfo,
    favoriteData,
    socketKchartConnectType,
    currencyDashboard,
    setDanmaku,
    setTheme,
    setLanguage,
    setDialogVisible,
    setInvite,
    setChain,
    setWalletInfo,
    setAccountInfo,
    setCustomWalletInfo,
    setFavoriteData,
    SetSocketKchartConnectType,
    setCurrencyDashboard,
    delCurrencyDashboard
  }
})
