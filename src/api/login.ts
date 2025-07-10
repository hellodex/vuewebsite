import http from './http'
import { md5 } from 'js-md5';

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
 * @description 登录/注册
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
 * @description 登录/注册
 * @param data
 * @returns
 */
export function APIdologinCheck(data: object) {
  return http({
    url: WEB_URL + '/api/auth/dologinCheck',
    method: 'POST',
    data
  })
}

/**
 * @description 登出/退出登录
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
export function APIuserInfo(data = {}) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/userInfo',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description TG to WEB 登录
 * @param data
 * @returns
 */
export function APItgToWebDologin(data: object) {
  return http({
    url: WEB_URL + '/api/auth/tgToWebDologin',
    method: 'POST',
    data
  })
}

/**
 * @description Loopspace 登录
 * @param data
 * @returns
 */
export function APIGetLoopAccessToken(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/user/getLoopKey',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

export async function GetLoopAccessToken(userId: string, userName: string, avatar: string) {
  const partnerId = Number(import.meta.env.VITE_LOOPSPACE_PARTNER_ID)
  const apiHost = import.meta.env.VITE_API_BASE_URL
  const sign = md5(`avatar=${avatar}&partner_id=${partnerId}&user_id=${userId}&user_name=${userName}&key=${import.meta.env.VITE_LOOPSPACE_PARTNER_SECRET_KEY}`);
  const requestData = {
    "avatar": avatar,
    "partner_id": partnerId,
    "user_id": userId,
    "user_name": userName,
    sign
  }

  try {
    const response = await fetch(`${apiHost}/api/partner/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = (await response.json()) as { code: number, msg: string, data: { access_token: string } };
    if (res.code === 0) {
      return res.data.access_token;
    } else {
      throw new Error(`Error from API:  ${res.msg} ${JSON.stringify(requestData)}`);
    }
  } catch (error) {
    console.error("Failed to fetch access token:", error);
    throw error;
  }
}
