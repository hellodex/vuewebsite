<template>
  <section class="h5-ido-box">
    <van-sticky>
      <div class="ido-head display-flex align-items-center">
        <svg-icon name="chevron-left" class="icon-arrow" @click="router.back()"></svg-icon>
        <span class="ido-head-title">IDO预售</span>

        <div
          class="disconnect-box display-flex align-items-center"
          v-if="isConnected && walletType !== 'Email'"
          @click="handelDisconnect"
        >
          <el-image :src="chain_Stablecoins.logo" alt="" class="img">
            <template #error>
              <svg-icon name="logo1" class="img"></svg-icon>
            </template>
          </el-image>
          <span class="address">{{ shortifyAddress(chain_Stablecoins.walletAddress) }}</span>
          <svg-icon
            name="log-in-01"
            class="log-in"
            style="color: rgba(234, 57, 67, 0.5)"
          ></svg-icon>
        </div>
        <div
          class="disconnect-box display-flex align-items-center"
          v-else-if="isConnected && walletType == 'Email'"
          @click="handelSwitchWallet"
        >
          <el-image :src="chain_Stablecoins.logo" alt="" class="img">
            <template #error>
              <svg-icon name="logo1" class="img"></svg-icon>
            </template>
          </el-image>
          <span class="address">{{ shortifyAddress(chain_Stablecoins.walletAddress) }}</span>
          <svg-icon name="chevron-down" class="chevron-down"></svg-icon>
        </div>
        <H5WalletConnect v-else />
      </div>
    </van-sticky>
    <div class="ido-title">
      <div class="ido-title-content">
        <div class="logo-box display-flex align-items-center">
          <svg-icon name="logo" class="logo"></svg-icon>
          <span>HelloDex</span>
        </div>
        <h1>平台币IDO预售中🔥</h1>
        <div class="text display-flex align-items-center">
          <span>利润80%分给用户</span>
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
      <svg-icon name="icon-ido-bg" class="icon-ido-bg"></svg-icon>
    </div>
    <div class="ido-wallet-area">
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
      <div v-if="isConnected" class="price-btn">
        <el-icon class="is-loading" v-if="loading" :size="18">
          <Loading />
        </el-icon>
        <el-icon :size="18" v-else><Coin /></el-icon>
        <span>
          余额:
          {{ numberFormat(decimalsFormat(deductionInfo.balance, deductionInfo.decimals)) }}
          {{ chain_Stablecoins.stablecoinsName }}
        </span>
      </div>
      <div class="ido-wallet-box">
        <div class="ido-wallet-txt">
          <span>代币：{{ idoInfo.symbol }}</span>
          <span>价格：{{ numberFormat(idoInfo.price) }}U</span>
          <span>总量：{{ numberFormat(idoInfo.totalSupply) }}</span>
          <span>总金额：{{ numberFormat(idoInfo.totalAmount) }}U</span>
          <span>剩余金额：{{ numberFormat(idoInfo.remainingAmount) }}</span>
          <span>已获得：{{ numberFormat(idoInfo.nowAmount) }}U</span>
        </div>
        <div class="progress-main">
          <el-progress :stroke-width="10" :percentage="idoInfo.percentage" />
        </div>
        <div class="ido-btn" @click="handelPresale" v-if="isConnected">参与预售</div>
        <H5WalletConnect class="ido-btn" v-else>参与预售</H5WalletConnect>
        <div class="ido-h5-img-box">
          <img src="@/assets/icons/ido-h5-img.svg" alt="" />
        </div>
      </div>
    </div>
    <WalletListPopup :showPopupBottom="showPopupBottom" @close="handleWalletListPopupClose" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { shortifyAddress, isAllSpaces } from '@/utils'
import { USDT_CONFIG } from '@/types'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'

import { useConnectWallet } from '@/hooks/useConnectWallet'

import { numberFormat } from '@/utils'
import {
  decimalsFormat,
  evmTransfer,
  solanaTransfer,
  evmTransactionReceipt,
  solanaTransactionReceipt
} from '@/utils/transition'
import { APItransferTo, APIgetTokensByWalletAddr, APIgetidoInfo } from '@/api'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'
import WalletListPopup from '@/components/Dialogs/WalletListPopup.vue'
import H5WalletConnect from '@/components/Wallet/H5WalletConnect.vue'

const router = useRouter()
const i18n = useI18n()
const globalStore = useGlobalStore()
const chain = useChainConfigsStore()

const { disconnectWallet } = useConnectWallet()

const chainConfigs = computed(() => chain.chainConfigs)

const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const chainId = computed(() => globalStore.walletInfo.chainId)
const walletType = computed(() => globalStore.walletInfo.walletType)

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
    const chainConfig = chainConfigs.value.find((item: any) => item.chainId == chainId.value) || {}
    return {
      logo: chainConfig.logo,
      chainCode: chainConfig.chainCode,
      stablecoinsAddress: USDT_CONFIG[chainConfig.chainCode]?.address,
      stablecoinsName: USDT_CONFIG[chainConfig.chainCode]?.symbol,
      walletAddress: address.value
    }
  }
})

/**************** 钱包地址选择 start ****************/
const showPopupBottom = ref(false)

const handelSwitchWallet = () => {
  showPopupBottom.value = true
}

const handleWalletListPopupClose = (val: boolean) => {
  showPopupBottom.value = false
}
/**************** 钱包地址选择 end ****************/

/**************** ido操作 start ****************/
const amount = ref('')
const deductionInfo = ref<any>({})
const loading = ref<boolean>(false)
const idoInfo = ref<any>({})
const timer = ref<any>(null)

const handelPresale = () => {
  if (isAllSpaces(amount.value)) {
    showToast('请输入参与预售数量')
    return false
  }

  if (deductionInfo.value.balance == 0) {
    showToast('账户余额为0，请先充值')
    return false
  }

  if (
    parseFloat(amount.value) >
    parseFloat(decimalsFormat(deductionInfo.value.balance, deductionInfo.value.decimals))
  ) {
    showToast('输入金额不能大于钱包账户余额')
    return false
  }

  // if (parseFloat(amount.value) < 100) {
  //   showToast('参与预售最低 100U')
  //   return false
  // }

  if (walletType.value == 'Email') {
    customAccountTrade()
  } else if (walletType.value == 'Evm') {
    decentralizationEvmTrade()
  } else if (walletType.value == 'Solana') {
    decentralizationSolanaTrade()
  }
}

watch(chain_Stablecoins, () => {
  loading.value = true
  tokensByWalletAddr()
})

const tokensByWalletAddr = async () => {
  const res: any = await APIgetTokensByWalletAddr({
    chainCode: chain_Stablecoins.value.chainCode,
    walletAddress: chain_Stablecoins.value.walletAddress
  })
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
  loading.value = false
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

  if (res) {
    const result =
      chain_Stablecoins.value.chainCode == 'SOLANA'
        ? await solanaTransactionReceipt(res.tx, chainConfig.rpc)
        : await evmTransactionReceipt(res.tx, chainConfig.rpc)
    if (result === true) {
      notificationSuccessful({
        title: `HelloDex：参与平台币`,
        message: `已确认`
      })
      tokensByWalletAddr()
    } else if (result === false) {
      notificationFailed({
        title: `HelloDex：参与平台币`,
        message: `确认失败`
      })
    } else {
      notificationWarn({
        title: `HelloDex：参与平台币`,
        message: `${result}`
      })
    }
  } else {
    notificationFailed({
      title: `HelloDex：参与平台币`,
      message: `确认失败`
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

const handelDisconnect = () => {
  disconnectWallet()
}

/**************** ido操作 end ****************/

onMounted(() => {
  loading.value = true
  isConnected.value && tokensByWalletAddr()
  getIdoInfo()
  timer.value = setInterval(() => {
    getIdoInfo()
    isConnected.value && tokensByWalletAddr()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.h5-ido-box {
  width: 100%;

  background-color: #000;
  .ido-head {
    padding: 0 0.24rem;
    height: 1.4933rem;
    position: relative;
    background-color: #000;
    .icon-arrow {
      width: 0.32rem;
      height: 0.64rem;
      color: #fff;
      position: absolute;
      top: 0.4267rem;
      left: 0.24rem;
    }
    .ido-head-title {
      width: 100%;
      font-size: 0.4267rem;
      font-style: normal;
      font-weight: normal;
      color: #fff;
      text-align: center;
    }
    :deep(.h5-connect-wallet-btn) {
      padding: 0.16rem 0.4267rem;
      position: absolute;
      top: 0.4rem;
      right: 0.4267rem;
      background: #fff;
      color: #000;
      border-radius: 1.3333rem;
      line-height: 1;
    }
    .disconnect-box {
      position: absolute;
      top: 0.46rem;
      right: 0.24rem;
      color: #fff;
      font-size: 0.32rem;
      background-color: #414141;
      padding: 2px 6px;
      border-radius: 4px;
      .log-in,
      .chevron-down {
        width: 18px;
        height: 18px;
        margin-left: 4px;
      }
      .img {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 4px;
      }
    }
  }
  .ido-title {
    padding: 0.2667rem 0.24rem;
    position: relative;
    .logo-box {
      color: #fff;
      font-size: 0.48rem;
      font-style: normal;
      .logo {
        width: 1.0933rem;
        height: 1.0933rem;
        margin-right: 0.2933rem;
      }
    }
    .icon-ido-bg {
      width: 5.1467rem;
      height: 3.44rem;
      position: absolute;
      right: 0.24rem;
      top: 0;
    }
    .ido-title-content {
      h1 {
        color: #fff;
        font-size: 0.5333rem;
        font-style: normal;
        font-weight: 400;
        margin: 0.3733rem 0 0.2133rem 0;
      }
      .text {
        color: #fff;
        font-size: 0.3733rem;
        font-style: normal;
        font-weight: 400;
        strong {
          padding: 0.08rem 0.24rem;
          border-radius: 0.1067rem;
          background: #fff;
          color: #000;
          font-weight: 400;
          margin-left: 0.2667rem;
        }
      }
      .ido-white-paper {
        display: inline-flex;
        padding: 0.08rem 0.16rem;
        border: 1px solid #fff;
        border-radius: 0.1067rem;
        margin-top: 0.2133rem;
        color: #fff;
        i {
          width: 0.3067rem;
          height: 0.3067rem;
          background-color: var(--font-color-default);
          border-radius: 50%;
          margin-left: 0.08rem;
        }
        .chevron-right {
          width: 0.24rem;
          height: 0.24rem;
          color: var(--bg-color);
        }
      }
    }
  }
  .price-btn {
    display: flex;
    align-items: center;
    color: var(--font-color-default);
    margin-top: 0.24rem;
    font-size: 0.32rem;
    span {
      white-space: nowrap;
      margin-left: 6px;
    }
  }
  .ido-wallet-area {
    padding: 0 0.24rem 0.5333rem;
    :deep(.el-input--large .el-input__wrapper) {
      padding: 0.1067rem 0.2667rem;
      background: #171717;
      box-shadow: none;
      border-radius: 0.1333rem;
    }
    .suffix-btn {
      width: 2.4rem;
      height: 0.7rem;
      border-radius: 0.1333rem;
      background-color: #202124;
      border: 1px solid #393939;
      color: var(--font-color-default);
      cursor: pointer;
      line-height: 1;
      span {
        margin: 0 0.1333rem 0 0.16rem;
      }
      .icon-coin,
      .chevron-down {
        width: 0.48rem;
        height: 0.48rem;
      }
    }
  }

  .ido-wallet-box {
    padding: 0.2667rem 0.2133rem;
    border-radius: 0.2667rem;
    background: #171717;
    margin-top: 0.24rem;
    .ido-wallet-txt {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.24rem 0.48rem;
      span {
        border-radius: 0.16rem;
        background: #202124;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 0.2667rem;
        line-height: 0.5867rem;
        font-weight: 400;
      }
    }
    .progress-main {
      margin: 0.6133rem 0 0.32rem 0;
      :deep(.el-progress--line) {
        max-width: 100%;
        .el-progress-bar__outer {
          background-color: transparent;
          border: 1px solid var(--font-color-default);
        }
        .el-progress-bar__inner {
          background-color: var(--font-color-default);
        }
        .el-progress__text {
          font-size: 0.2667rem;
          color: var(--font-color-default);
          margin-left: 0.1867rem;
          min-width: auto;
        }
      }
    }
    :deep(.ido-btn) {
      background-color: var(--font-color-default);
      color: var(--bg-color);
      font-size: 0.3733rem;
      font-style: normal;
      font-weight: 400;
      width: 2.4267rem;
      height: 0.6133rem;
      text-align: center;
      line-height: 0.6133rem;
      cursor: pointer;
      border-radius: 0.16rem;
      margin: 0 auto;
    }
    .ido-h5-img-box {
      margin-top: 0.6667rem;
      padding: 0 0.3733rem;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }
}
</style>
