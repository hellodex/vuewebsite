import axios from 'axios'
import CryptoJS from 'crypto-js'
import { useGlobalStore } from '@/stores/global'
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { isMobile } from '@/utils'

const version = '1.0'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 50000
})

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么

    const telegram__initParams = sessionStorage.getItem('__telegram__initParams')
    const tgWebAppData =
      (telegram__initParams && JSON.parse(telegram__initParams)?.tgWebAppData) || ''

    let channel = ''
    let key = ''

    if (tgWebAppData) {
      if (isMobile()) {
        channel = import.meta.env.VITE_TG_MOBILE_CHANNEL
        key = import.meta.env.VITE_TG_MOBILE_KEY
      } else {
        channel = import.meta.env.VITE_TG_PC_CHANNEL
        key = import.meta.env.VITE_TG_PC_KEY
      }
    } else {
      channel = import.meta.env.VITE_NOT_TG_CHANNEL
      key = import.meta.env.VITE_NOT_TG_KEY
    }

    const ts = String(new Date().getTime())

    config.headers['Channel'] = channel
    config.headers['Version'] = version
    config.headers['Ts'] = ts
    config.headers['Sign'] = CryptoJS.SHA256(channel + ts + version + key).toString()
    return config
  },
  (error: any) => {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    // 对响应数据做点什么
    if (response.data.code == 200) {
      return response.data.data || response.data.msg
    } else if (response.data.code == 1 && response.data.message.toLocaleLowerCase() == 'ok') {
      // sol goplus
      return response.data.result
    } else if (response.data.code == 4011) {
      ElMessage({
        type: 'error',
        message: '账户已退出'
      })
      const router = useRouter()
      const globalStore = useGlobalStore()
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
      if (window.location.href.indexOf('/Account/') !== -1) {
        window.location.href = '/'
      }
    } else if (
      response.data.code == 404 ||
      response.config.url?.indexOf('https://api.gopluslabs.io/') !== -1
    ) {
      console.info({
        type: 'error',
        message: `${response.data.code} ${response.data.msg}  ${JSON.stringify(response.config.url)}`
      })
    } else if (response.config.url?.indexOf('/api/auth/tgToWebDologin') !== -1) {
      ElMessage({
        type: 'error',
        message: response.data.msg
      })
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } else {
      ElMessage({
        type: 'error',
        message: response.data.msg
      })
    }
  },
  (error: any) => {
    //
    //失败回调:处理http网络错误
    //定义一个变量:存储网络错误信息
    let message = ''
    //http状态码
    const status = error?.response?.status
    switch (status) {
      case 400:
        message = '请求错误(400)'
        break
      case 401:
        message = '未授权，请重新登录(401)'
        break
      case 403:
        message = '拒绝访问(403)'
        break
      case 404:
        message = '请求出错(404)'
        break
      case 408:
        message = '请求超时(408)'
        break
      case 500:
        message = '服务器错误(500)'
        break
      case 501:
        message = '服务未实现(501)'
        break
      case 502:
        message = '网络错误(502)'
        break
      case 503:
        message = '服务不可用(503)'
        break
      case 504:
        message = '网络超时(504)'
        break
      case 505:
        message = 'HTTP版本不受支持(505)'
        break
      case 1001:
        message = '验证失败'
        break
      default:
        message = `连接出错(${status})!`
    }
    //提示错误信息
    ElMessage({
      type: 'error',
      message
    })
    return Promise.reject(error)
  }
)

export default axiosInstance
