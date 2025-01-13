// 简化数字中的0
import BigNumber from 'bignumber.js'
// ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀", "₂₁", "₂₂", "₂₃", "₂₄", "₂₅", "₂₆", "₂₇", "₂₈", "₂₉", "₃₀", "₃₁"]
function shorten0(num: any): string {
  const bignum = new BigNumber(num).toString(10)
  if (Number(bignum) && Number(bignum) < 1e-2) {
    const t = Math.ceil(Math.log10(0.1 / Number(bignum)))
    if (Number.isNaN(t)) {
      return ''
    }
    return (
      `0.0{${t}}` +
      bignum
        .toString()
        .replace(new RegExp(`^0\\.0{${t}}`), '')
        .substring(0, 3)
    )
  }
  if (num > 0 && Number(bignum) == 0) {
    const t = Math.ceil(Math.log10(0.1 / Number(num)))
    if (Number.isNaN(t)) {
      return ''
    }
    return (
      `0.0{${t}}` +
      num
        .toString()
        .replace(new RegExp(`^0\\.0{${t}}`), '')
        .substring(0, 3)
    )
  }
  if (countDecimalPlaces(bignum) >= 4) {
    return Number(bignum).toFixed(3)
  }
  return parseFloat(num) ? parseFloat(num).toFixed(3) : num
}

/**
 * 判断小数有几位
 * @param num
 * @returns
 */
function countDecimalPlaces(num: number | string) {
  // 将数字转换为字符串
  const numStr = typeof num == 'number' ? num.toString() : num
  // 查找小数点
  const decimalIndex = numStr.indexOf('.')
  // 如果小数点不存在，返回0
  if (decimalIndex === -1) {
    return 0
  }
  // 返回小数位数
  return numStr.length - decimalIndex - 1
}

// 示例
console.log(countDecimalPlaces(123.456)) // 输出: 3
console.log(countDecimalPlaces(123)) // 输出: 0

//将数字小数点后花为三位(不留0)
function shortenNum(num: String): String {
  const numMactch: any = num.match(/^0.[0-9]{3}/)
  return numMactch[0].replace(/\.?0+$/, '')
}
//将指定数字划分为指定位数的小数(小数点前移)
function makeDecimal(num: any, dec: number): String {
  const intDecimal = num.valueOf() / Math.pow(10, dec)
  return intDecimal.toString() // Number.toString()
}
// 将指定数字划分为指定位数的整数(小数点后移)
function makeInt(num: any, dec: number): String {
  const intData = num.valueOf() * Math.pow(10, dec)
  return intData.toString() // Number.toString() 方法ts报错
}

export { shorten0, shortenNum, makeDecimal, makeInt }
