import { useChainConfigsStore } from '@/stores/chainConfigs'
import { shorten0 } from './numberUtil'
import BigNumber from 'bignumber.js'
import { useGlobalStore } from '@/stores/global'

/**
 * @description 币地址脱敏
 * @param address 币原地址
 * @returns  币脱敏地址
 */
export function shortifyAddress(address: string | any): string {
  if (!address) {
    return address
  }
  return `${address.slice(0, 4)}....${address.slice(address.length - 4)}`
}

/**
 *
 * @description 数字千分位格式化
 * @param money 价格/钱
 * @returns 数字千分位 例 123,456.2345
 */
export function numFormat(num: number | string = 0): string {
  const numString = typeof num === 'number' ? num.toString() : num
  const res = numString.replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ','
    })
  })
  return res
}

function repair(i: number) {
  if (i >= 0 && i <= 9) {
    return '0' + i
  } else {
    return i
  }
}

/**
 * @description 时间格式化
 * @param time
 * @returns
 */
export function formatDate(time: any) {
  if (!time) {
    return time
  }
  const date = new Date(parseFloat(time))
  const year = date.getFullYear(),
    month = repair(date.getMonth() + 1), //月份是从0开始的
    day = repair(date.getDate()),
    hour = repair(date.getHours()),
    min = repair(date.getMinutes()),
    sec = repair(date.getSeconds())

  const formatedDate = `${year}/${month}/${day} ${hour}:${min}:${sec}`
  return formatedDate
}

/**
 * @description 时间格式化
 * @param time 时间戳
 * @returns
 */
export function timeago(time: any): string | undefined {
  const globalStore = useGlobalStore()
  if (!time) {
    return time
  }
  const now = new Date().getTime()

  // 返回值
  let result
  // 一分钟 1000 毫秒 乘以 60
  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365
  // 现在时间 减去 传入时间 得到差距时间
  const diffValue = now - time
  // 小于 0 直接返回
  if (diffValue < 0) {
    return 0 + (globalStore.language == 'zh' ? '秒前' : `second ago`)
  }
  const yearC: any = diffValue / year
  const monthC: any = diffValue / month
  const weekC: any = diffValue / week
  const dayC: any = diffValue / day
  const hourC: any = diffValue / hour
  const minC: any = diffValue / minute
  const sedC: any = diffValue / second
  switch (true) {
    case yearC >= 1:
      // 如果大于一年就显示具体日期
      result = globalStore.language == 'zh' ? '一年以前' : ' year ago'
      break
    case monthC >= 1:
      result =
        '' +
        parseInt(monthC) +
        (globalStore.language == 'zh'
          ? '月前'
          : ` ${parseInt(monthC) > 1 ? 'months' : 'month'}  ago`)
      break
    case weekC >= 1:
      result =
        '' +
        parseInt(weekC) +
        (globalStore.language == 'zh' ? '周前' : ` ${parseInt(weekC) > 1 ? 'weeks' : 'week'}  ago`)
      break
    case dayC >= 1:
      result =
        '' +
        parseInt(dayC) +
        (globalStore.language == 'zh' ? '天前' : ` ${parseInt(dayC) > 1 ? 'days' : 'day'}  ago`)
      break
    case hourC >= 1:
      result =
        '' +
        parseInt(hourC) +
        (globalStore.language == 'zh'
          ? '小时前'
          : ` ${parseInt(hourC) > 1 ? 'hours' : 'hour'}  ago`)
      break
    case minC >= 1:
      result =
        '' +
        parseInt(minC) +
        (globalStore.language == 'zh'
          ? '分钟前'
          : ` ${parseInt(minC) > 1 ? 'minutes' : 'minute'}  ago`)
      break
    case sedC >= 0:
      result =
        '' +
        parseInt(sedC) +
        (globalStore.language == 'zh'
          ? '秒前'
          : ` ${parseInt(sedC) > 1 ? 'seconds' : 'second'}  ago`)
      break
    default:
      console.log('其他')
  }
  return result
}

function integerNum(num: any) {
  return parseFloat(num) % 1 === 0
    ? truncateDecimal(parseFloat(num))
    : truncateDecimal(parseFloat(num), 2)
}

function truncateDecimal(num: number, decimalPlaces = 1) {
  const factor = Math.pow(10, decimalPlaces)
  return Math.floor(num * factor) / factor
}

/**
 * @description 中文数字格式化
 * @param number 数字
 * @returns 简化后数字
 */

export function simplifyNumZh(number: any): string {
  if (!Number(number)) {
    return number
  }
  let str_num: any
  if (number >= 1e4 && number < 1e8) {
    str_num = number / 1e4
    return numFormat(truncateDecimal(parseFloat(str_num))) + '万'
  } else if (number >= 1e8 && number < 1e12) {
    str_num = number / 1e8
    return numFormat(truncateDecimal(parseFloat(str_num))) + '亿'
  } else if (number >= 1e12) {
    str_num = number / 1e12
    return numFormat(truncateDecimal(parseFloat(str_num))) + '万亿'
  } else if (number <= 1e2) {
    return integerNum(number).toString()
  } else {
    // 一千以下
    return numFormat(truncateDecimal(parseFloat(number)))
  }
}

/**
 * @description 英文数字格式化
 * @param number 数字
 * @returns 简化后数字
 */

export function simplifyNumEn(number: any): string {
  if (!Number(number)) {
    return number
  }
  let str_num: any
  if (number >= 1e3 && number < 1e6) {
    str_num = number / 1e3
    return numFormat(truncateDecimal(parseFloat(str_num))) + 'K'
  } else if (number >= 1e6 && number < 1e9) {
    str_num = number / 1e6
    return numFormat(truncateDecimal(parseFloat(str_num))) + 'M'
  } else if (number >= 1e9 && number < 1e12) {
    str_num = number / 1e9
    return numFormat(truncateDecimal(parseFloat(str_num))) + 'B'
  } else if (number >= 1e12) {
    str_num = number / 1e12
    return numFormat(truncateDecimal(parseFloat(str_num))) + 'T'
  } else if (number <= 1e2) {
    return integerNum(number).toString()
  } else {
    // 一千以下
    return numFormat(truncateDecimal(parseFloat(number)))
  }
}

/**
 * @description 英文数字单位转换成数字
 * @param num 英文数字单位 数字简写 如 40K
 * @returns 把英文数字单位转成数字
 */
export function quantityUnitFormatEn(number: string): any {
  const num = number.toString().replace(/,/g, '')
  if (num.includes('K')) {
    return parseFloat(num.replace(/K/, '')) * 1e3
  }

  if (num.includes('M')) {
    return parseFloat(num.replace(/M/, '')) * 1e6
  }

  if (num.includes('B')) {
    return parseFloat(num.replace(/B/, '')) * 1e9
  }

  if (num.includes('T')) {
    return parseFloat(num.replace(/T/, '')) * 1e12
  }

  return parseFloat(num)
}

/**
 * @description 中文数字单位转换成数字
 * @param num 汉字数字单位 数字简写 如 40万
 * @returns 把汉字数字单位转成数字
 */
export function quantityUnitFormatZh(number: string): any {
  const num = number.toString().replace(/,/g, '')
  if (num.includes('万') && !num.includes('亿')) {
    return parseFloat(num.replace(/万/, '')) * 1e4
  }

  if (num.includes('亿') && !num.includes('万')) {
    return parseFloat(num.replace(/万/, '')) * 1e8
  }

  if (num.includes('万亿')) {
    return parseFloat(num.replace(/万亿/, '')) * 1e12
  }

  return parseFloat(num)
}

/**
 * @description 时间格式化
 * @param time
 * @returns
 */
export function formatDateHM(time: any) {
  if (!time) {
    return time
  }
  const date = new Date(time)
  const hour = repair(date.getHours()),
    min = repair(date.getMinutes())

  const formatedDate = `${hour}:${min}`
  return formatedDate
}

/**
 * @description 防抖
 */
export const debounce = (() => {
  let timer: any = null
  return (callback: any, wait = 800) => {
    timer && clearTimeout(timer)
    timer = setTimeout(callback, wait)
  }
})()

/**
 * @description 检测输入的字符串是否全部由空格组成
 * @param input
 * @returns
 */
export function isAllSpaces(input: any): Boolean {
  return /^ *$/.test(input)
}

/**
 * @description
 * @param e 价格
 * @param t
 * @returns
 */
export function formatDecimals(e: any, t = 3) {
  let a = Number(e) || 0,
    o = 0
  while (a < 0.1 && 0 !== a) (a *= 10), o++
  let r = o + t
  return (
    a < 1 && (r += 1),
    (r = 11 === r ? 10 : r > 20 ? 20 : r),
    {
      precision: r,
      minMove: Number('0.' + '0'.repeat(r - 1) + '1')
    }
  )
}

/**
 * @description 根据 chainCode 查询主网币信息
 *
 * @param chainCode
 * @returns
 */
export function mainNetworkCurrency(chainCode: string) {
  const chainConfigs = useChainConfigsStore()
  const chainObj: any = chainConfigs.chainConfigs?.find(
    (item: { chainCode: string }) => item.chainCode == chainCode
  )

  return chainObj
}

/**
 * @description 检测是否是手机端
 * @returns
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * @description 币列表与币实时价格 数据组装
 * @param arr1 第一个接口数据
 * @param arr2 第二接口数据
 *
 * @returns arr 组装成新数据
 */
export function dataAssembly(arr1: any[] = [], arr2: any[] = []): any[] {
  const arr: any[] = [] // 组装的新数据
  arr1.forEach((item: any) => {
    arr2.map((itm: any) => {
      if (itm.pairAddress == item.pairAddress) {
        arr.push({
          ...item,
          priceByPairAddress: {
            ...itm
          }
        })
      }
    })
  })

  return arr
}

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function browserLang() {
  const sessionLanguage = sessionStorage.getItem('language')
  const browserLang = sessionLanguage || navigator.language || 'en'
  let defaultBrowserLang = ''
  if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = 'zh'
  } else {
    defaultBrowserLang = 'en'
  }
  return defaultBrowserLang
}

/**
 * @description 数字格式化 集成
 */

export function numberFormat(num: number | string = 0) {
  const globalStore = useGlobalStore()
  const bignum = new BigNumber(num).toString(10)
  const minus = bignum[0] == '-' ? '-' : '' // 检测是否为负数
  const positiveNum = minus ? bignum.replace(/-/, '') : bignum // 转换成正数

  if (Number(positiveNum) < 1) {
    return minus + shorten0(positiveNum)
  } else {
    return (
      minus +
      (globalStore.language == 'zh' ? simplifyNumZh(positiveNum) : simplifyNumEn(positiveNum))
    )
  }
}

/**
 * @description 数字单位转换
 * @param num
 * @returns
 */
export function quantityUnitFormat(num: string): any {
  const globalStore = useGlobalStore()

  return globalStore.language == 'zh' ? quantityUnitFormatZh(num) : quantityUnitFormatEn(num)
}

export function handleCoinPairInfo(tokenInfo: any) {
  let buyCoin: any = null
  let sellCoin: any = null

  const isBasePackCurrency =
    tokenInfo.baseAddress.toLowerCase() ==
    mainNetworkCurrency(tokenInfo.chainCode).wrapped.toLowerCase()
  const isQuotePackCurrency =
    tokenInfo.quoteAddress.toLowerCase() ==
    mainNetworkCurrency(tokenInfo.chainCode).wrapped.toLowerCase()

  if (isBasePackCurrency) {
    buyCoin = {
      baseAddress: tokenInfo?.quoteAddress,
      balance: 0,
      totalAmount: 0,
      baseTokenDecimals: tokenInfo?.quoteDecimal,
      baseSymbol: tokenInfo?.quoteSymbol,
      chainCode: tokenInfo?.chainCode
    }

    sellCoin = {
      baseAddress: mainNetworkCurrency(tokenInfo.chainCode)?.symbolAddress,
      balance: 0,
      totalAmount: 0,
      baseTokenDecimals: mainNetworkCurrency(tokenInfo.chainCode)?.decimals,
      baseSymbol: mainNetworkCurrency(tokenInfo.chainCode)?.symbol,
      chainCode: mainNetworkCurrency(tokenInfo.chainCode)?.chainCode,
      logo: tokenInfo?.logo
    }

    return {
      buyCoin,
      sellCoin
    }
  }
  if (isQuotePackCurrency) {
    buyCoin = {
      baseAddress: mainNetworkCurrency(tokenInfo.chainCode)?.symbolAddress,
      balance: 0,
      baseTokenDecimals: mainNetworkCurrency(tokenInfo.chainCode)?.decimals,
      baseSymbol: mainNetworkCurrency(tokenInfo.chainCode)?.symbol,
      chainCode: mainNetworkCurrency(tokenInfo.chainCode)?.chainCode
    }

    sellCoin = {
      baseAddress: tokenInfo?.baseAddress,
      balance: 0,
      baseTokenDecimals: tokenInfo?.baseDecimal,
      baseSymbol: tokenInfo?.baseSymbol,
      chainCode: tokenInfo?.chainCode,
      logo: tokenInfo?.logo
    }

    return {
      buyCoin,
      sellCoin
    }
  }

  buyCoin = {
    baseAddress: tokenInfo?.quoteAddress,
    balance: 0,
    baseTokenDecimals: tokenInfo?.quoteDecimal,
    baseSymbol: tokenInfo?.quoteSymbol,
    chainCode: tokenInfo?.chainCode
  }

  sellCoin = {
    baseAddress: tokenInfo?.baseAddress,
    balance: 0,
    baseTokenDecimals: tokenInfo?.baseDecimal,
    baseSymbol: tokenInfo?.baseSymbol,
    chainCode: tokenInfo?.chainCode,
    logo: tokenInfo?.logo
  }

  return {
    buyCoin,
    sellCoin
  }
}

/**
 * @description 获取url ？后参数
 * @param url
 * @returns
 */

export function getQueryParams(url: string) {
  const queryString = url.split('?')[1]
  const params: any = {}

  if (queryString) {
    const pairs = queryString.split('&')
    pairs.forEach((pair) => {
      const [key, value] = pair.split('=')
      params[decodeURIComponent(key)] = decodeURIComponent(value || '')
    })
  }

  return params
}

export function priceNumFormat(txt: number | string): string {
  const txtString = typeof txt === 'number' ? txt.toString() : txt

  return (txtString[0] === '-' ? '-$' : '$') + numberFormat(txtString.replace(/-/g, ''))
}
