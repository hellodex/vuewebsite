import http from './http'

// web端 api
const WEB_URL = import.meta.env.VITE_API_URL

// app端 api
const APP_URL = import.meta.env.VITE_APP_API_URL

/**
 * @description 发送邮件验证码
 * @param data
 * @returns
 */
export function APIsendMessage(data: object) {
  return http({
    url: WEB_URL + '/api/auth/sendMessage',
    method: 'POST',
    data
  })
}

/**
 * @description 登陆/注册
 * @param data
 * @returns
 */
export function APIdologin(data: object) {
  return http({
    url: WEB_URL + '/api/auth/dologin',
    method: 'POST',
    data
  })
}

/**
 * @description 登出/退出登陆
 * @returns
 */
export function APIlogout() {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/logout',
    method: 'GET',
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 修改密码/忘记密码
 * @param data
 * @returns
 */
export function APImodifyPwd(data: object) {
  return http({
    url: WEB_URL + '/api/auth/modifyPwd',
    method: 'POST',
    data
  })
}

/**
 * @description 获取用户信息
 * @returns
 */
export function APIuserInfo() {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/userInfo',
    method: 'POST',
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}
