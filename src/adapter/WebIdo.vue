<template>
  <el-scrollbar height="calc(100vh - 120px)">
    <div class="web-ido-content">
      <div class="ido-title display-flex align-items-center justify-content-sp">
        <div class="ido-text display-flex align-items-center">
          <span>平台币IDO预售中🔥 利润80%分给用户</span>
          <strong>链上交易工具</strong>
        </div>
        <a
          href="https://hellodex.gitbook.io/hellodex"
          target="_blank"
          class="ido-white-paper display-flex align-items-center"
        >
          <span>详情查看白皮书</span>
          <i class="display-flex align-items-center justify-content-center">
            <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
          </i>
        </a>
      </div>
      <div class="ido-wallet-area">
        <div class="display-flex justify-content-sp">
          <div class="ido-wallet-operate display-flex flex-direction-col">
            <div class="display-flex align-items-center">
              <el-input
                v-model="amount"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                placeholder="最低100U"
                size="large"
              >
                <template #suffix>
                  <div class="suffix-btn display-flex align-items-center justify-content-center">
                    <img
                      :src="chain_Stablecoins.logo"
                      alt=""
                      class="icon-coin"
                      v-if="chain_Stablecoins.logo"
                    />
                    <img
                      src="https://img.apihellodex.lol/quoteToken/usdt.png"
                      alt=""
                      class="icon-coin"
                      v-else
                    />
                    <span>{{ chain_Stablecoins.stablecoinsName || 'USDT' }}</span>
                    <svg-icon name="chevron-down" class="chevron-down"></svg-icon>
                  </div>
                </template>
              </el-input>
              <WalletConnect v-if="!isConnected" class="ido-login" />
              <div v-else class="price-btn">
                <el-icon :size="22"><Coin /></el-icon>
                <span>
                  余额:
                  {{ numberFormat(decimalsFormat(deductionInfo.balance, deductionInfo.decimals)) }}
                  {{ chain_Stablecoins.stablecoinsName }}
                </span>
              </div>
            </div>
            <div class="ido-wallet-box">
              <div class="display-flex align-items-center justify-content-sp">
                <div class="display-flex flex-direction-col">
                  <span>代币：{{ idoInfo.symbol }}</span>
                  <span>价格：{{ numberFormat(idoInfo.price) }}U</span>
                </div>
                <div class="display-flex flex-direction-col">
                  <span>总量：{{ numberFormat(idoInfo.totalSupply) }}</span>
                  <span>总金额：{{ numberFormat(idoInfo.totalAmount) }}U</span>
                </div>
                <div class="display-flex flex-direction-col">
                  <span>剩余金额：{{ numberFormat(idoInfo.remainingAmount) }}</span>
                  <span>已获得：{{ numberFormat(idoInfo.nowAmount) }}U</span>
                </div>
                <div class="display-flex flex-direction-col">
                  <span>持有平台币分80%收益</span>
                  <a
                    href="https://hellodex.gitbook.io/hellodex/hellodex_cn/whitepaper"
                    target="_blank"
                    >更多详情请看白皮书</a
                  >
                </div>
              </div>
              <div class="progress-main">
                <span>进度</span>
                <el-progress :stroke-width="20" :percentage="idoInfo.percentage" />
              </div>
              <div class="ido-btn">
                <div class="ido-num">
                  <!-- <img src="@/assets/img/tips.png" alt="" /> -->
                  <!-- <strong>恭喜，已累计参与6800U</strong> -->
                </div>
                <div class="display-flex align-items-center">
                  <WalletConnect v-if="!isConnected" class="presale">参与预售</WalletConnect>
                  <span @click="handelPresale" class="presale" v-else>参与预售</span>
                  <!-- <span class="presale" @click="handelBindAccount">绑定冲狗基金</span> -->
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <svg-icon name="icon-ido-bg" class="icon-ido-bg"></svg-icon>
        </div>
      </div>
      <div class="ido-img-box">
        <h1>里程碑事件</h1>
        <img src="@/assets/icons/ido-img.svg" alt="" class="ido-img" />
      </div>
      <van-popup v-model:show="dialogIdoVisible" round class="ido-dialog">
        <div class="ido-dialog-content">
          <h5>查询ido额度</h5>
          <div class="ido-progress-box">
            <img src="../assets/img/ido-progress.png" alt="" />
            <div class="ido-progress-content">
              <div class="first-step">
                <div class="first-step-num">1</div>
                <div class="first-step-content display-flex align-items-center">
                  <img src="../assets/img/0xSun.png" alt="" class="nick-img" />
                  <div class="first-step-info display-flex flex-direction-col">
                    <span>{{ accountInfo.nickname }}</span>
                    <span>UUID：{{ customWalletInfo?.walletInfo?.uuid }}</span>
                  </div>
                </div>
              </div>
              <div class="second-step">
                <div
                  class="second-step-content display-flex align-items-center"
                  @click="web3AccountInfo?.isConnected ? null : connectWeb3Wallet()"
                >
                  <img src="../assets/img/wallet.png" alt="" class="wallet-img" />
                  <div
                    class="second-step-info display-flex flex-direction-col"
                    v-if="web3AccountInfo?.isConnected"
                  >
                    <span>钱包</span>
                    <span>{{ shortifyAddress(web3AccountInfo?.address) }}</span>
                  </div>
                  <div class="second-step-wallet" v-else>Connect Wallet</div>
                </div>
                <div class="second-step-num">2</div>
              </div>
              <div class="third-step">
                <div class="third-step-num">3</div>
                <div class="third-step-content display-flex align-items-center">
                  <img src="https://img.apihellodex.lol/quoteToken/usdt.png" alt="" class="img" />
                  <div class="third-step-info">参与金额：5000</div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-box display-flex flex-direction-col align-items-center">
            <p>绑定冲狗基金后无法修改，和接收平台币无关。</p>
            <div class="display-flex align-items-center">
              <span class="cancel-btn" @click="dialogIdoVisible = false">取消</span>
              <span class="confirm-btn" v-if="isSignature">确认绑定</span>
              <span class="confirm-btn-disabled" v-else>确认绑定</span>
            </div>
          </div>
        </div>
      </van-popup>

      <van-popup
        v-model:show="dialogIdoListVisible"
        closeable
        round
        class="ido-list-dialog"
        @click-close-icon="dialogIdoListVisible = false"
      >
        <div class="ido-list-content">
          <h5>交易额兑换冲狗基金活动排行榜</h5>
          <p class="txt">参与IDO自动加入冲狗基金</p>
          <el-table :data="list" style="width: 100%" height="320px">
            <el-table-column label="排行"></el-table-column>
            <el-table-column label="账户"></el-table-column>
            <el-table-column label="交易额"></el-table-column>
            <el-table-column label="进度"></el-table-column>
            <el-table-column></el-table-column>
            <template #empty>
              <empty-data></empty-data>
            </template>
          </el-table>
        </div>
      </van-popup>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { USDT_CONFIG } from '@/types'
import { isAllSpaces, shortifyAddress } from '@/utils'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { numberFormat } from '@/utils'
import {
  decimalsFormat,
  evmTransfer,
  solanaTransfer,
  evmSignature,
  solanaSignature,
  evmSignatureVerify,
  solanaSignatureVerify
} from '@/utils/transition'

import { notificationInfo, notificationSuccessful, notificationFailed } from '@/utils/notification'

import { customMessage } from '@/utils/message'

import { APItransferTo, APIgetidoInfo } from '@/api'

import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import { useAppKitAccount, useAppKit } from '@reown/appkit/vue'

const modal = useAppKit()
const web3Account = useAppKitAccount()
const web3AccountInfo = ref<any>({
  isConnected: false,
  address: '',
  walletType: ''
})
const dialogIdoVisible = ref<boolean>(false)
const isSignature = ref<boolean>(false)
const dialogIdoListVisible = ref<boolean>(false)
const list = ref([])

const i18n = useI18n()
const globalStore = useGlobalStore()
const chain = useChainConfigsStore()

const chainConfigs = computed(() => chain.chainConfigs)

const chainId = computed(() => globalStore.walletInfo.chainId)
const walletType = computed(() => globalStore.walletInfo.walletType)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const address = computed(() => globalStore.walletInfo.address)
const tokenList = computed(() => globalStore.tokenList)
const accountInfo = computed(() => globalStore.accountInfo)
const customWalletInfo = computed(() => globalStore.customWalletInfo)

const chain_Stablecoins = computed(() => {
  if (walletType.value == 'Email') {
    return {
      logo: customWalletInfo.value.logo,
      chainCode: customWalletInfo.value.chainCode,
      stablecoinsAddress: USDT_CONFIG[customWalletInfo.value.chainCode].address,
      stablecoinsName: USDT_CONFIG[customWalletInfo.value.chainCode].symbol,
      walletAddress: customWalletInfo.value.walletInfo.wallet
    }
  } else {
    const chainConfig = chainConfigs.value?.find((item: any) => item.chainId == chainId.value) || {}
    return {
      logo: chainConfig.logo,
      chainCode: chainConfig.chainCode,
      stablecoinsAddress: USDT_CONFIG[chainConfig.chainCode]?.address,
      stablecoinsName: USDT_CONFIG[chainConfig.chainCode]?.symbol,
      walletAddress: address.value
    }
  }
})

const connectWeb3Wallet = () => {
  globalStore.setClickLocation('clickIdo')
  modal.open()
}

const amount = ref('')
const deductionInfo = ref<any>({})
const idoInfo = ref<any>({})
const timer = ref<any>(null)

const handelPresale = () => {
  if (isAllSpaces(amount.value)) {
    customMessage({
      type: 'error',
      title: '请输入参与预售数量'
    })
    return false
  }

  if (deductionInfo.value.balance == 0) {
    customMessage({
      type: 'error',
      title: '账户余额为0，请先充值'
    })
    return false
  }

  if (
    parseFloat(amount.value) >
    parseFloat(decimalsFormat(deductionInfo.value.balance, deductionInfo.value.decimals))
  ) {
    customMessage({
      type: 'error',
      title: '输入金额不能大于钱包账户余额'
    })
    return false
  }

  if (parseFloat(amount.value) < 100) {
    customMessage({
      type: 'error',
      title: '参与预售最低 100U'
    })
    return false
  }

  if (walletType.value == 'Email') {
    customAccountTrade()
  } else if (walletType.value == 'Evm') {
    decentralizationEvmTrade()
  } else if (walletType.value == 'Solana') {
    decentralizationSolanaTrade()
  }
}

const handelBindAccount = () => {
  if (!isConnected.value) {
    customMessage({
      type: 'error',
      title: '请先登录账户'
    })
    return false
  }

  if (isConnected.value && walletType.value !== 'Email') {
    customMessage({
      type: 'error',
      title: '请断开web3链接，登录账户'
    })
    return false
  }

  dialogIdoVisible.value = true
}

watch(tokenList, () => {
  tokensByWalletAddr()
})

watch(
  [
    () => web3Account.value.address,
    () => web3Account.value.isConnected,
    () => web3Account.value.caipAddress
  ],
  () => {
    console.log('account updated:', web3Account.value.address)
    console.log('account updated:', web3Account.value.isConnected)
    console.log('account updated:', web3Account.value.caipAddress)

    web3AccountInfo.value.address = web3Account.value.address
    web3AccountInfo.value.isConnected = web3Account.value.isConnected
    web3AccountInfo.value.walletType =
      web3Account.value.caipAddress?.split(':')[0].toLocaleLowerCase() == 'solana'
        ? 'Solana'
        : 'Evm'
  }
)

watch(web3AccountInfo.value, async (newValue, oldValue) => {
  const signature = localStorage.getItem('signature')
  const isvalid = signature ? await signatureVerifyFun(signature) : false
  isSignature.value = isvalid
  if (!isvalid) {
    localStorage.removeItem('signature')
    signatureFun()
  }
})

const signatureFun = async () => {
  if (web3AccountInfo.value.isConnected) {
    if (web3AccountInfo.value.walletType == 'Evm') {
      const signature = await evmSignature()
      console.log('signature', signature)
      localStorage.setItem('signature', signature)
      isSignature.value = true
    } else if (web3AccountInfo.value.walletType == 'Solana') {
      const signature = await solanaSignature()
      console.log('signature', signature)
      localStorage.setItem('signature', signature)
      isSignature.value = true
    }
  }
}

const signatureVerifyFun = async (signature: string) => {
  if (web3AccountInfo.value.isConnected) {
    if (web3AccountInfo.value.walletType == 'Evm') {
      const res = await evmSignatureVerify(web3AccountInfo.value.address, signature)
      return res
    } else if (web3AccountInfo.value.walletType == 'Solana') {
      const res = await solanaSignatureVerify(web3AccountInfo.value.address, signature)
      return res
    }
    return false
  }
  return false
}

const tokensByWalletAddr = () => {
  const res: any = tokenList.value
  const obj = res?.find((item: any) => {
    const address = item.chainCode == 'SOLANA' ? item.address : item.address.toLowerCase()
    const rpc =
      chain_Stablecoins.value.chainCode == 'SOLANA'
        ? USDT_CONFIG[chain_Stablecoins.value.chainCode].address
        : USDT_CONFIG[chain_Stablecoins.value.chainCode].address.toLowerCase()
    return address === rpc
  })
  console.log(obj)
  deductionInfo.value = {
    balance: obj?.amount || 0,
    decimals: obj?.decimals || 18,
    token: obj?.address
  }
}

const customAccountTrade = async () => {
  notificationInfo({
    title: `HelloDex：参与平台币`,
    message: `<div class="display-flex align-items-center">
              <p class="notification_loader"></p>
              <span>确认中</span>
            </div>
            <div class='notification-step-line-up'></div>
            `
  })
  const num = 10 ** Number(deductionInfo.value.decimals)
  const spendAmount = new BigNumber(amount.value).times(num).integerValue(BigNumber.ROUND_DOWN)
  const chainConfig = chainConfigs.value.find(
    (item: any) => item.chainCode == chain_Stablecoins.value.chainCode
  )
  const res: any = await APItransferTo({
    amount: spendAmount,
    to: chain_Stablecoins.value.chainCode === 'SOLANA' ? idoInfo.value.SOLANA : idoInfo.value.EVM, //  // 转账转的是钱包地址
    token: deductionInfo.value.token, // 转出地址
    walletId: customWalletInfo.value.walletInfo.walletId,
    walletKey: customWalletInfo.value.walletInfo?.walletKey
  })
  amount.value = ''

  if (res.code == 200) {
    notificationSuccessful({
      title: `HelloDex：参与平台币`,
      message: `已确认`
    })
    tokensByWalletAddr()
  } else {
    notificationFailed({
      title: `HelloDex：参与平台币`,
      message: res.msg
    })
  }
}

const decentralizationEvmTrade = async () => {
  notificationInfo({
    title: `HelloDex：参与平台币`,
    message: `<div class="display-flex align-items-center">
              <p class="notification_loader"></p>
              <span>确认中</span>
            </div>
            <div class='notification-step-line-up'></div>
            `
  })
  const result = await evmTransfer(
    idoInfo.value.EVM,
    deductionInfo.value.token,
    amount.value,
    deductionInfo.value.decimals
  )

  amount.value = ''
  if (result) {
    notificationSuccessful({
      title: `HelloDex：参与平台币`,
      message: `已确认`
    })
    tokensByWalletAddr()
  } else {
    notificationFailed({
      title: `HelloDex：参与平台币`,
      message: `确认失败`
    })
  }
  console.log(result)
}

const decentralizationSolanaTrade = async () => {
  notificationInfo({
    title: `HelloDex：参与平台币`,
    message: `<div class="display-flex align-items-center">
              <p class="notification_loader"></p>
              <span>确认中</span>
            </div>
            <div class='notification-step-line-up'></div>
            `
  })
  const chainConfig = chainConfigs.value.find(
    (item: any) => item.chainCode == chain_Stablecoins.value.chainCode
  )
  const result = await solanaTransfer(
    idoInfo.value.SOLANA,
    deductionInfo.value.token,
    amount.value,
    deductionInfo.value.decimals,
    chainConfig.rpc
  )

  amount.value = ''
  if (result) {
    notificationSuccessful({
      title: `HelloDex：参与平台币`,
      message: `已确认`
    })
    tokensByWalletAddr()
  } else {
    notificationFailed({
      title: `HelloDex：参与平台币`,
      message: `确认失败`
    })
  }
  console.log(result)
}

const getIdoInfo = async () => {
  const res = await APIgetidoInfo()
  idoInfo.value = res || {}
}

onMounted(() => {
  tokensByWalletAddr()
  getIdoInfo()
  timer.value = setInterval(() => {
    getIdoInfo()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.web-ido-content {
  width: 92%;
  padding: 30px;
  margin: 24px auto 0;
  border-radius: 12px;
  background: var(--card-bg-color);
  .ido-title {
    margin-bottom: 16px;
    .ido-text {
      color: var(--font-color-default);
      font-size: 26px;
      font-weight: 400;
      strong {
        padding: 3px 16px;
        background: var(--font-color-default);
        color: var(--bg-color);
        font-size: 18px;
        border-radius: 12px;
        margin-left: 15px;
        font-weight: 400;
      }
    }
    .ido-white-paper {
      font-size: 16px;
      color: var(--font-color-default);
      cursor: pointer;
      font-weight: 400;
      i {
        width: 18px;
        height: 18px;
        background-color: var(--font-color-default);
        border-radius: 50%;
        margin-left: 12px;
      }
      .chevron-right {
        width: 14px;
        height: 14px;
        color: var(--bg-color);
      }
    }
  }
  .ido-wallet-operate {
    width: 68%;
    margin-right: 30px;
  }
  .icon-ido-bg {
    width: 516px;
    height: 302px;
  }
  :deep(.el-input--large .el-input__wrapper) {
    padding: 6px 6px 6px 12px;
    background-color: var(--hover-bg-color);
    box-shadow: none;
    border-radius: 10px;
    .el-input__inner {
      height: 30px;
    }
  }

  .suffix-btn {
    width: 95px;
    height: 30px;
    border-radius: 10px;
    background-color: var(--bg-color);
    border: 1px solid #393939;
    color: var(--font-color-default);
    font-size: 14px;
    cursor: pointer;
    margin: 0;
    span {
      margin: 0 10px 0 5px;
      line-height: 1;
    }
    .icon-coin,
    .chevron-down {
      width: 16px;
      height: 16px;
    }
  }
  :deep(.ido-login),
  .price-btn {
    padding: 9px 43px;
    border-radius: 12px;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 400;
    margin-left: 12px;
    line-height: 1.2;
  }

  .price-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 240px;
    width: 240px;
    padding: 9px 30px;
    background: var(--font-color-default);
    color: var(--bg-color);
    span {
      margin-left: 6px;
    }
  }
  .ido-wallet-box {
    padding: 18px 30px;
    border-radius: 12px;
    background-color: var(--hover-bg-color);
    margin-top: 14px;
    span,
    a {
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      color: var(--dex-color-4);
    }
  }
  .progress-main {
    margin: 18px 0;
    position: relative;
    span {
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      color: var(--font-color-default);
      position: absolute;
      top: -4px;
    }
    :deep(.el-progress--line) {
      max-width: 95%;
      margin-left: 6%;
      .el-progress-bar__outer {
        background-color: transparent;
        border: 1px solid var(--font-color-default);
      }
      .el-progress-bar__inner {
        background-color: var(--font-color-default);
      }
      .el-progress__text {
        font-size: 18px !important;
        color: var(--font-color-default);
        margin-left: 17px;
      }
    }
  }
  .ido-btn {
    display: flex;
    justify-content: space-between;
    .ido-num {
      display: flex;
      align-items: center;
      color: var(--font-color-default) !important;
      font-size: 16px;
      img {
        width: 30px;
      }
    }
    :deep(.presale) {
      background-color: var(--font-color-default);
      color: var(--bg-color);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      padding: 5px 29px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
      border-radius: 12px;
      margin-left: 20px;
    }
  }
  .ido-img-box {
    padding: 45px 95px 50px 0;
    h1 {
      font-size: 26px;
    }
  }
  .ido-img {
    width: 100%;
    height: auto;
    display: block;
  }

  .ido-dialog,
  .ido-list-dialog {
    border-radius: 12px;
    background: #181818;
  }
  .ido-dialog-content {
    width: 1000px;
    height: 450px;
    padding: 18px;
    h5 {
      text-align: center;
      color: #fff;
      font-size: 16px;
      line-height: 1.2;
      font-weight: 400;
    }
    .ido-progress-box {
      position: relative;
      margin-top: 35px;
      margin-left: 56px;
      margin-right: 110px;
      .ido-progress-content {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .first-step {
        position: absolute;
        left: 29px;
        top: 88px;
        .first-step-num {
          width: 24px;
          height: 24px;
          background: #7a5af8;
          border: 2px solid #fff;
          border-radius: 50%;
          font-size: 14px;
          color: #fff;
          font-weight: 600;
          text-align: center;
          line-height: 20px;
          margin-left: 80px;
        }
        .first-step-content {
          height: 80px;
          border-radius: 8px;
          background: rgba(42, 42, 42, 0.5);
          padding: 12px;
          margin-top: 19px;
          .nick-img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 8px;
          }
          .first-step-info {
            span:first-child {
              color: #fff;
              font-size: 16px;
              font-weight: 600;
            }
            span:last-child {
              color: #fff;
              font-size: 12px;
              font-weight: 400;
            }
          }
        }
      }
      .second-step {
        position: absolute;
        left: 307px;
        top: 20px;
        .second-step-content {
          width: 208px;
          height: 88px;
          border-radius: 8px;
          background: rgba(42, 42, 42, 0.5);
          padding: 24px 18px;
          margin-bottom: 21px;
          cursor: pointer;
          .wallet-img {
            width: 40px;
            height: 40px;
            border-radius: 9px;
            margin-right: 8px;
          }
          .second-step-wallet {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
          }
          .second-step-info {
            span:first-child {
              color: #fff;
              font-size: 16px;
              font-weight: 400;
            }
            span:last-child {
              color: #fff;
              font-size: 12px;
            }
          }
        }
        .second-step-num {
          width: 24px;
          height: 24px;
          background: #2e90fa;
          border: 2px solid #fff;
          border-radius: 50%;
          font-size: 14px;
          color: #fff;
          font-weight: 600;
          text-align: center;
          line-height: 20px;
          margin-left: 50px;
        }
      }
      .third-step {
        position: absolute;
        right: -71px;
        top: 74px;
        .third-step-num {
          width: 24px;
          height: 24px;
          background: #19fb9b;
          border: 2px solid #fff;
          border-radius: 50%;
          font-size: 14px;
          color: #fff;
          font-weight: 600;
          text-align: center;
          line-height: 20px;
          margin-left: 6px;
        }
        .third-step-content {
          width: 226px;
          height: 88px;
          border-radius: 8px;
          background: rgba(42, 42, 42, 0.5);
          padding: 24px 18px;
          margin-top: 21px;
          .img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 8px;
          }
          .third-step-info {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
    }
    .btn-box {
      margin-top: 110px;
      p {
        color: #fff;
        font-size: 14px;
        line-height: 33px;
        margin-bottom: 10px;
      }
      .cancel-btn {
        display: flex;
        width: 92px;
        height: 32px;
        padding: 10px 12px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: #5f6368;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        margin-right: 38px;
      }
      .confirm-btn-disabled {
        display: flex;
        width: 92px;
        height: 32px;
        padding: 10px 12px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: #333;
        color: #8c8c8c;
        font-size: 14px;
        font-weight: 400;
        cursor: not-allowed;
      }
      .confirm-btn {
        display: flex;
        width: 92px;
        height: 32px;
        padding: 10px 12px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: #0aa76f;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
      }
    }
  }
  .ido-list-content {
    width: 646px;
    height: 440px;
    padding: 18px 39px 38px;
    h5 {
      text-align: center;
      color: #fff;
      font-size: 16px;
      line-height: 1.2;
      font-weight: 400;
    }
    p.txt {
      color: #828282;
      font-size: 12px;
      font-weight: 400;
      margin: 5px 0 15px;
      text-align: center;
    }
    :deep(.el-table) {
      border-radius: 12px;
      background: #242424 !important;
      .el-table__cell {
        background: #242424 !important;
        padding: 15px 0 !important;
      }
    }
  }
  :deep(.van-popup__close-icon) {
    font-size: 14px;
  }
}
</style>
