<template>
  <div class="account-mode">
    <van-sticky>
      <div class="wallet-head display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center" @click="handelSwitchWallet">
          <el-image :src="customWalletInfo.logo" alt="" class="wallet-logo">
            <template #error>
              <svg-icon name="coinDEX" class="wallet-logo"></svg-icon>
            </template>
          </el-image>
          <div class="wallet-head-name display-flex flex-direction-col">
            <span>
              {{ customWalletInfo.walletInfo?.groupName }}
              <van-icon name="arrow-down" />
            </span>

            <span>{{ shortifyAddress(customWalletInfo.walletInfo?.wallet) }} </span>
          </div>
        </div>
        <div class="display-flex align-items-center">
          <svg-icon
            name="icon-copy"
            class="icon"
            v-copy="customWalletInfo.walletInfo?.wallet"
          ></svg-icon>
        </div>
      </div>
    </van-sticky>
    <div class="wallet-content">
      <div class="wallet-price display-flex align-items-center justify-content-sp">
        <div class="wallet-price-txt display-flex flex-direction-col">
          <span>
            {{ i18n.t('h5.Overview') }}
            <van-icon name="eye-o" @click="maskDigit = false" v-if="maskDigit" />
            <van-icon name="closed-eye" @click="maskDigit = true" v-if="!maskDigit" />
          </span>
          <strong v-if="maskDigit">${{ numberFormat(overviewOfFunds || 0) }}</strong>
          <strong v-if="!maskDigit">***</strong>
        </div>
        <div class="display-flex flex-direction-col wallet-price-gwei">
          <div class="display-flex align-items-center">
            <i></i>
            <span>123 ms</span>
          </div>
          <div class="display-flex align-items-center">
            <svg-icon name="cheer-on" class="cheer-on"></svg-icon>
            <span>5 Gwei</span>
          </div>
        </div>
      </div>
      <div class="wallet-operate display-flex align-items-center justify-content-sp">
        <div
          class="display-flex flex-direction-col align-items-center"
          @click="handelSend(listModel[0])"
        >
          <span>
            <svg-icon name="arrow-up" class="operate-icon"></svg-icon>
          </span>
          <strong>{{ i18n.t('h5.Send') }}</strong>
        </div>
        <div
          class="display-flex flex-direction-col align-items-center"
          @click="handelAccept(listModel[0])"
        >
          <span>
            <svg-icon name="arrow-down" class="operate-icon"></svg-icon>
          </span>
          <strong>{{ i18n.t('h5.Receive') }}</strong>
        </div>
        <div
          class="display-flex flex-direction-col align-items-center"
          @click="router.push('/trade/0x46cf1cf8c69595804ba91dfdd8d6b960c9b0a7c4?chainCode=BSC')"
        >
          <span>
            <svg-icon name="switch-horizontal" class="operate-icon"></svg-icon>
          </span>
          <strong>{{ i18n.t('home.swap') }}</strong>
        </div>
      </div>
      <div class="wallet-list">
        <van-sticky>
          <div class="wallet-tab-items display-flex align-items-center">
            <span
              :class="tabIndex == item.id ? 'active' : ''"
              v-for="item in tabList"
              :key="item.id"
              @click="handelTabChange(item)"
              >{{ item.name }}</span
            >
          </div>
          <p class="warning">
            <van-checkbox v-model="checked" checked-color="#14C784">
              <strong>{{ i18n.t('h5.HideSmallAssets') }}</strong>
              <van-icon name="warning-o" size="12" />
            </van-checkbox>
          </p>
        </van-sticky>
        <div class="list-items" v-if="tabIndex == 1">
          <van-skeleton style="padding: 0" :loading="listSkeletonLoading">
            <template #template>
              <div style="width: 100%">
                <div
                  :style="{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }"
                  v-for="item in 6"
                  :key="item"
                >
                  <div :style="{ flex: 1, display: 'flex', width: '100%', alignItems: 'center' }">
                    <van-skeleton-avatar
                      style="
                        width: 1.2rem;
                        height: 1.2rem;
                        border-radius: 50%;
                        margin-right: 0.2133rem;
                      "
                    />
                    <div :style="{ flex: 1 }">
                      <van-skeleton-paragraph row-width="50%" />
                      <van-skeleton-paragraph row-width="100%" />
                    </div>
                  </div>
                  <div
                    :style="{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end'
                    }"
                  >
                    <van-skeleton-paragraph row-width="25%" />
                    <van-skeleton-paragraph row-width="45%" />
                  </div>
                </div>
              </div>
            </template>
            <div
              class="list-item display-flex align-items-center justify-content-sp"
              v-for="(item, index) in listModel"
              :key="index"
              @click="handelSend(item)"
            >
              <div class="list-item-left display-flex align-items-center">
                <div class="logo">
                  <el-image :src="item.logo" alt="" class="logo">
                    <template #error>
                      <svg-icon name="logo1" class="logo"></svg-icon>
                    </template>
                  </el-image>
                  <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
                </div>
                <div class="display-flex flex-direction-col">
                  <span class="name">{{ item.symbol }}</span>
                  <p class="display-flex align-items-center">
                    <span class="price">${{ numberFormat(item.price || 0) }}</span>
                    <PercentageNotbg :value="item.chg1d || 0" />
                  </p>
                </div>
              </div>
              <div class="list-item-right display-flex flex-direction-col align-items-fd">
                <span>{{ numberFormat(decimalsFormat(item.amount, item.decimals)) }}</span>
                <span>${{ numberFormat(item.totalAmount || 0) }}</span>
              </div>
            </div>
          </van-skeleton>
        </div>
      </div>
    </div>
  </div>
  <WalletListPopup :showPopupBottom="showPopupBottom" @close="handleWalletListPopupClose" />
  <van-popup
    v-model:show="sendPopupRight"
    position="right"
    :style="{ width: '100%', height: '100%' }"
    :overlay="false"
  >
    <div class="send-nav display-flex align-items-center">
      <svg-icon name="chevron-left" class="chevron-left" @click="sendPopupRight = false"></svg-icon>
      <div class="send-nav-text display-flex align-items-center">
        <el-image :src="coinInfo.logo" alt="" class="logo">
          <template #error>
            <svg-icon name="logo1" class="logo"></svg-icon>
          </template>
        </el-image>
        <span>{{ coinInfo.symbol }}</span>
        <span class="address">({{ shortifyAddress(coinInfo.address) }})</span>
        <svg-icon name="copy" class="copy" v-copy="coinInfo.address"></svg-icon>
      </div>
    </div>
    <div class="send-coin-info">
      <div class="send-coin-content">
        <div class="coin-operate display-flex align-items-center justify-content-sp">
          <div class="coin-price display-flex flex-direction-col">
            <span class="txt">当前余额</span>
            <strong>{{ numberFormat(decimalsFormat(coinInfo.amount, coinInfo.decimals)) }}</strong>
            <span>≈${{ numberFormat(coinInfo.totalAmount || 0) }}</span>
          </div>
          <div class="coin-trade-btn display-flex align-items-center">
            <div
              class="display-flex flex-direction-col align-items-center"
              style="margin-right: 0.5333rem"
              @click="handelSendOut"
            >
              <span>
                <svg-icon name="arrow-up" class="operate-icon"></svg-icon>
              </span>
              <strong>{{ i18n.t('h5.Send') }}</strong>
            </div>
            <div
              class="display-flex flex-direction-col align-items-center"
              @click="handelAccept(coinInfo)"
            >
              <span>
                <svg-icon name="arrow-down" class="operate-icon"></svg-icon>
              </span>
              <strong>{{ i18n.t('h5.Receive') }}</strong>
            </div>
          </div>
        </div>
        <div class="send-show">
          <div class="display-flex flex-direction-col">
            <span>当前价格</span>
            <strong>${{ numberFormat(coinInfo.price || 0) }}</strong>
          </div>
          <div class="display-flex flex-direction-col">
            <span>收益率</span>
            <strong>0.00%</strong>
          </div>
          <div class="display-flex flex-direction-col">
            <span>平均成本</span>
            <strong>$0</strong>
          </div>
          <div class="display-flex flex-direction-col">
            <span>总收益</span>
            <strong>$0</strong>
          </div>
        </div>
      </div>
      <div class="transfer-box">
        <p class="transfer-title">转账记录</p>
        <div class="transfer-list">
          <van-skeleton style="padding: 0" :loading="listTransferHistorySkeleton">
            <template #template>
              <div style="width: 100%">
                <div
                  :style="{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }"
                  v-for="item in 5"
                  :key="item"
                >
                  <div :style="{ flex: 1, display: 'flex', width: '100%', alignItems: 'center' }">
                    <van-skeleton-avatar
                      style="
                        width: 1.2rem;
                        height: 1.2rem;
                        border-radius: 50%;
                        margin-right: 0.2133rem;
                      "
                    />
                    <div :style="{ flex: 1 }">
                      <van-skeleton-paragraph row-width="50%" />
                      <van-skeleton-paragraph row-width="100%" />
                    </div>
                  </div>
                  <div
                    :style="{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end'
                    }"
                  >
                    <van-skeleton-paragraph row-width="25%" />
                    <van-skeleton-paragraph row-width="45%" />
                  </div>
                </div>
              </div>
            </template>
            <div
              class="transfer-item display-flex align-items-center justify-content-sp"
              v-for="(item, index) in listTransferHistory"
              :key="index"
            >
              <div class="display-flex align-items-center">
                <span class="icon-bg">
                  <svg-icon name="h5-arrow-up-right" class="transfer-icon"></svg-icon>
                </span>
                <div class="display-flex flex-direction-col">
                  <p class="display-flex align-items-center">
                    <span>{{ shortifyAddress(item.toAddress) }}</span>
                    <svg-icon name="copy" class="copy" v-copy="coinInfo.address"></svg-icon>
                  </p>
                  <span class="time">{{ formatDate(item.timestamp) }}</span>
                </div>
              </div>
              <div class="display-flex flex-direction-col align-items-fd">
                <span :class="item.status == 200 ? 'up-color' : 'down-color'">{{
                  item.orderStatusUI
                }}</span>
                <span>{{ numberFormat(item.amount) }}</span>
              </div>
            </div>
            <empty-data :imageSize="80" v-if="listTransferHistory.length == 0"></empty-data>
          </van-skeleton>
        </div>
      </div>
    </div>
    <div class="btn-content">
      <div class="btn btn-plain" @click="handelJump(coinInfo)">
        看K线：<PercentageNotbg :value="coinInfo.chg1d || 0" />
      </div>
      <div class="btn btn-fill" @click="handelTrade(coinInfo)">去交易</div>
    </div>
  </van-popup>

  <van-popup
    v-model:show="sendOutPopupRight"
    position="right"
    :style="{ width: '100%', height: '100%' }"
    :overlay="false"
  >
    <div class="send-nav display-flex align-items-center">
      <svg-icon
        name="chevron-left"
        class="chevron-left"
        @click="sendOutPopupRight = false"
      ></svg-icon>
      <div class="send-nav-text display-flex align-items-center">
        <span>发送</span>
      </div>
    </div>
    <div class="send-out-form">
      <van-field
        v-model="sendOutForm.to"
        label-align="top"
        rows="5"
        label="发送给"
        type="textarea"
        autocomplete="off"
        placeholder="输入或者粘贴收款地址"
      />

      <van-field
        v-model="sendOutForm.amount"
        label-align="top"
        type="number"
        label="转账数量"
        autocomplete="off"
        placeholder="输入转账数量"
      />

      <div class="balance-text display-flex align-items-center justify-content-sp">
        <span>余额</span>
        <span
          >{{ numberFormat(decimalsFormat(coinInfo.amount, coinInfo.decimals)) }}
          {{ coinInfo.symbol }}</span
        >
      </div>

      <div class="send-out-btn" @click="handelConfirm">确认</div>
    </div>
  </van-popup>

  <van-popup
    v-model:show="acceptPopupRight"
    position="right"
    :style="{ width: '100%', height: '100%' }"
    :overlay="false"
  >
    <div class="accept-nav display-flex align-items-center">
      <svg-icon
        name="chevron-left"
        class="chevron-left"
        @click="acceptPopupRight = false"
      ></svg-icon>
    </div>
    <div class="accept-box display-flex flex-direction-col align-items-center">
      <el-image :src="acceptInfo.logo" alt="" class="logo">
        <template #error>
          <svg-icon name="logo1" class="logo"></svg-icon>
        </template>
      </el-image>
      <p class="accept-p">{{ acceptInfo.symbol }} 收款</p>
      <span class="accept-span">收款网络 {{ acceptInfo.chainCode }} 链</span>
      <img :src="acceptInfo.qrcodeUrl" alt="" class="qrcode-img" />
      <div class="display-flex align-items-center">
        <van-icon name="warning" size="14" />
        <span style="margin-left: 0.1067rem"
          >仅向该地址转入 {{ acceptInfo.chainCode }} 网络相关地址</span
        >
      </div>

      <div class="wallet-address display-flex align-items-center justify-content-sp">
        <span>{{ customWalletInfo.walletInfo?.wallet }}</span>
        <svg-icon name="copy" class="copy" v-copy="customWalletInfo.walletInfo?.wallet"></svg-icon>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import QRCode from 'qrcode'
import BigNumber from 'bignumber.js'
import { ref, onMounted, onUnmounted, computed, watch, reactive } from 'vue'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { numberFormat, shortifyAddress, isAllSpaces, formatDate } from '@/utils'

import { useGlobalStore } from '@/stores/global'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import {
  decimalsFormat,
  getTokenList,
  evmTransactionReceipt,
  solanaTransactionReceipt,
  isEvmAddress,
  isSolanaAddress
} from '@/utils/transition'

import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import WalletListPopup from '@/components/Dialogs/WalletListPopup.vue'
import { APIlistTransferHistory, APItransferTo } from '@/api'
import { showToast } from 'vant'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'

const i18n = useI18n()
const router = useRouter()

const globalStore = useGlobalStore()
const chain = useChainConfigsStore()

const { chainLogoObj } = globalStore

const customWalletInfo = computed(() => globalStore.customWalletInfo)

const chainConfigs = computed(() => chain.chainConfigs)

/**************** 账户 信息 start ****************/
const maskDigit = ref(true)
const checked = ref(false)

const tabList = [
  {
    id: 1,
    name: i18n.t('h5.Assets')
  }
]
const tabIndex = ref<number>(1)

const handelTabChange = (item: { id: number }) => {
  tabIndex.value = item.id
}

const list = ref<any>([])
const overviewOfFunds = ref<number>(0)
const timer = ref<any>(null)
const listSkeletonLoading = ref(false)

const listModel = computed(() => {
  return checked.value
    ? list.value.filter((item: any) => parseFloat(item.totalAmount) >= 1)
    : list.value
})

const getTokensByWalletAddr = async (chainCode: any, walletAddress: any) => {
  const res: any = await getTokenList(chainCode, walletAddress)

  console.log(res)
  listSkeletonLoading.value = false
  list.value = res
  overviewOfFunds.value = 0
  res?.forEach((item: { totalAmount: any }) => {
    overviewOfFunds.value += parseFloat(item.totalAmount)
  })
}
/**************** 账户 信息 end ***************/

/**************** 钱包地址选择 start ****************/
const showPopupBottom = ref(false)

const handelSwitchWallet = () => {
  showPopupBottom.value = true
}

const handleWalletListPopupClose = (val: boolean) => {
  showPopupBottom.value = false
}
/**************** 钱包地址选择 end ****************/

/**************** 发送/转出  start ****************/
const coinInfo = ref<any>({})
const sendPopupRight = ref(false)
const listTransferHistory = ref<any>([])
const listTransferHistorySkeleton = ref(false)

const handelSend = (item: any) => {
  sendPopupRight.value = true
  coinInfo.value = item
  getListTransferHistory(coinInfo.value.chainCode, coinInfo.value.address)
}

const handelJump = (item: any) => {
  router.push(`/k/${item.pairAddress}?chainCode=${item.chainCode}&timeType=15m`)
  sendPopupRight.value = false
}

const handelTrade = (params: any) => {
  router.push(`/trade/${params.pairAddress}?chainCode=${params.chainCode}`)
  sendPopupRight.value = false
}
const getListTransferHistory = async (chainCode: string, baseAddress: string) => {
  listTransferHistorySkeleton.value = true
  const res = await APIlistTransferHistory({
    chainCode,
    baseAddress
  })
  console.log(res)
  listTransferHistorySkeleton.value = false
  listTransferHistory.value = res || []
}

const sendOutPopupRight = ref(false)
const sendOutForm = reactive<any>({
  to: '',
  amount: ''
})
const handelSendOut = () => {
  sendOutPopupRight.value = true
}

const handelConfirm = async () => {
  if (isAllSpaces(sendOutForm.to)) {
    showToast('请输入收款地址')
    return
  }
  if (customWalletInfo.value.chainCode == 'SOLANA' && !isSolanaAddress(sendOutForm.to)) {
    showToast(`请输入 ${customWalletInfo.value.chainCode} 合约地址`)
    return
  }
  if (customWalletInfo.value.chainCode != 'SOLANA' && !isEvmAddress(sendOutForm.to)) {
    showToast(`请输入 ${customWalletInfo.value.chainCode} 合约地址`)
    return
  }

  if (parseFloat(sendOutForm.amount || 0) === 0) {
    showToast('请输入转账数量')
    return
  }

  notificationInfo({
    title: `${coinInfo.value.symbol}`,
    customClass: 'notification-h5',
    message: `<div class="display-flex align-items-center">
                <p class="notification_loader"></p>
                <span>发送中</span>
              </div>
              <div class='notification-step-line-up'></div>
              `
  })

  const chainConfig = chainConfigs.value.find(
    (item: any) => item.chainCode == customWalletInfo.value.chainCode
  )
  const num = 10 ** Number(coinInfo.value.decimals)
  const spendAmount = new BigNumber(sendOutForm.amount)
    .times(num)
    .integerValue(BigNumber.ROUND_DOWN)
  const res: any = await APItransferTo({
    to: sendOutForm.to,
    amount: spendAmount,
    token: coinInfo.value.address, // 转出地址
    walletId: customWalletInfo.value.walletInfo.walletId,
    walletKey: customWalletInfo.value.walletInfo?.walletKey
  })

  if (res) {
    const result =
      customWalletInfo.value.chainCode == 'SOLANA'
        ? await solanaTransactionReceipt(res.tx, chainConfig.rpc)
        : await evmTransactionReceipt(res.tx, chainConfig.rpc)
    if (result === true) {
      notificationSuccessful({
        title: `${coinInfo.value.symbol}`,
        customClass: 'notification-h5',
        message: `发送成功`
      })
    } else if (result === false) {
      notificationFailed({
        title: `${coinInfo.value.symbol}`,
        customClass: 'notification-h5',
        message: `发送失败`
      })
    } else {
      notificationWarn({
        title: `${coinInfo.value.symbol}`,
        customClass: 'notification-h5',
        message: `${result}`
      })
    }
  } else {
    notificationFailed({
      title: `${coinInfo.value.symbol}`,
      customClass: 'notification-h5',
      message: `发送失败`
    })
  }
}

/**************** 发送/转出  end ****************/

/**************** 收款/转入 start ****************/
const acceptPopupRight = ref(false)
const acceptInfo = ref<any>(null)

const handelAccept = async (params: any) => {
  acceptPopupRight.value = true
  acceptInfo.value = params
  acceptInfo.value.qrcodeUrl = await QRCode.toDataURL(customWalletInfo.value.walletInfo?.wallet, {
    errorCorrectionLevel: 'H'
  })
}
/**************** 收款/转入 end ****************/

const intervalFun = () => {
  clearInterval(timer.value)
  getTokensByWalletAddr(customWalletInfo.value.chainCode, customWalletInfo.value.walletInfo?.wallet)
  timer.value = setInterval(() => {
    getTokensByWalletAddr(
      customWalletInfo.value.chainCode,
      customWalletInfo.value.walletInfo?.wallet
    )
  }, 5000)
}

watch(customWalletInfo, () => {
  intervalFun()
})

onMounted(() => {
  listSkeletonLoading.value = true
  intervalFun()
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.account-mode {
  padding: 0 0.32rem;
  .wallet-head {
    padding: 0.32rem 0;
    background-color: #fff;
    .wallet-logo {
      width: 1.18rem;
      height: 1.2rem;
      margin-right: 0.2133rem;
      border-radius: 50%;
    }
    .wallet-head-name {
      span:first-child {
        font-size: 0.4267rem;
        color: #000;
        margin-bottom: 0.0533rem;
      }
      span:last-child {
        font-size: 0.32rem;
        color: #9c9c9c;
      }
    }
    .icon {
      width: 0.5333rem;
      height: 0.5333rem;
      margin-right: 0.2133rem;
      color: #3f3f3f;
    }
    .wallet-head-setting {
      span {
        font-size: 0.32rem;
        color: #9c9c9c;
      }
    }
  }
  .wallet-content {
    padding: 0.4267rem 0;
    .wallet-price-txt {
      span {
        font-size: 0.4267rem;
        color: #9c9c9c;
      }
      strong {
        font-size: 0.96rem;
        color: #000;
        font-weight: normal;
      }
    }
    .wallet-price-gwei {
      position: relative;
      top: 0.2667rem;
      i {
        width: 0.2667rem;
        height: 0.2667rem;
        border-radius: 50%;
        background-color: #14c784;
        margin-right: 0.24rem;
      }
      span {
        font-size: 0.32rem;
        color: #9c9c9c;
      }
      .cheer-on {
        width: 0.32rem;
        height: 0.32rem;
        margin-right: 0.2133rem;
      }
    }
  }
  .wallet-operate {
    margin: 0.64rem 0;
    span {
      display: block;
      width: 1.1733rem;
      height: 1.1733rem;
      padding: 0.2667rem;
      border-radius: 50%;
      background-color: #f2f2f2;
      margin-bottom: 0.2133rem;
    }
    .operate-icon {
      width: 0.64rem;
      height: 0.64rem;
      color: #202020;
    }
    strong {
      font-size: 0.32rem;
      color: #9c9c9c;
      font-weight: normal;
    }
  }
  .wallet-list {
    .wallet-tab-items {
      background-color: var(--font-color-default);
      span {
        font-size: 0.4267rem;
        color: #9c9c9c;

        line-height: 2;
        border-bottom: 0.0533rem solid #fff;
        margin-right: 1.0667rem;
      }
      .active {
        color: #202020;
        border-bottom: 0.0533rem solid #202020;
      }
    }
    .warning {
      padding: 0.4267rem 0 0.32rem;
      background-color: var(--font-color-default);
      strong {
        color: #9c9c9c;
        margin-right: 0.2133rem;
        font-weight: normal;
      }
    }
    .list-items {
      .list-item {
        padding: 0.2133rem 0;
      }
      .list-item-left {
        .logo {
          width: 1.0667rem;
          height: 1.0667rem;
          position: relative;
          margin-right: 0.2133rem;
          border-radius: 50%;
        }
        .chainCode {
          width: 0.3733rem;
          height: 0.3733rem;
          position: absolute;
          right: -0.0267rem;
          bottom: -0.0267rem;
        }
        .name {
          font-size: 0.4267rem;
          color: #111928;
        }
        .price {
          color: #6b7280;
          font-size: 0.32rem;
          margin-right: 0.1067rem;
        }
        .up {
          color: #17b26a;
          font-size: 0.32rem;
        }
        .down {
          color: #f52727;
          font-size: 0.32rem;
        }
      }
      .list-item-right {
        span:first-child {
          font-size: 0.4267rem;
          color: #111928;
        }
        span:last-child {
          color: #6b7280;
          font-size: 0.32rem;
        }
      }
    }
  }
}

.send-nav {
  padding: 0.32rem;
  justify-content: center;
  position: relative;
  color: #020202;
  font-size: 0.4rem;
  background-color: #fff;
  .chevron-left {
    width: 0.5333rem;
    height: 0.8rem;
    color: #020202;
    position: absolute;
    top: 0.24rem;
    left: 0.2667rem;
  }
  .logo {
    width: 0.64rem;
    height: 0.64rem;
    border-radius: 50%;
    margin-right: 0.1067rem;
  }
  .copy {
    width: 0.4267rem;
    height: 0.4267rem;
    color: #9c9c9c;
    margin-left: 0.1067rem;
  }
  .address {
    color: #9c9c9c;
  }
}
.send-coin-info {
  color: #020202;
  padding-bottom: 0.48rem;
  height: calc(100% - 2.72rem);
  overflow: hidden;
  overflow-y: scroll;
  .send-coin-content {
    border-bottom: 0.0267rem solid #e5e5e5;
    padding: 0.48rem 0.32rem;
  }
  .coin-price {
    span {
      color: #9c9c9c;
      font-size: 0.3733rem;
    }
    .txt {
      color: #020202;
    }
    strong {
      font-size: 0.64rem;
    }
  }
  .coin-trade-btn {
    span {
      display: block;
      width: 1.1733rem;
      height: 1.1733rem;
      padding: 0.2667rem;
      border-radius: 50%;
      background-color: #f2f2f2;
      margin-bottom: 0.2667rem;
    }
    .operate-icon {
      width: 0.64rem;
      height: 0.64rem;
      color: #202020;
    }
    strong {
      font-size: 0.32rem;
      color: #9c9c9c;
      font-weight: normal;
    }
  }
  .send-show {
    display: grid;
    gap: 0.32rem;
    grid-template-columns: 1fr 1fr;
    color: #020202;
    margin-top: 0.32rem;
    span:first-child {
      color: #9c9c9c;
    }
    strong {
      font-weight: normal;
    }
  }
  .transfer-box {
    padding: 0.8rem 0.32rem 0;
    .transfer-title {
      font-size: 0.4267rem;
      margin-bottom: 0.32rem;
    }
    .transfer-item {
      padding-bottom: 0.64rem;
    }
    .icon-bg {
      padding: 0.16rem;
      border-radius: 50%;
      background-color: #020202;
      color: var(--font-color-default);
      margin-right: 0.16rem;
    }
    .transfer-icon {
      width: 0.5333rem;
      height: 0.5333rem;
      display: block;
    }
    .copy {
      width: 0.3467rem;
      height: 0.3467rem;
      margin-left: 0.1067rem;
    }
    .time {
      color: #9c9c9c;
    }
  }
}
.btn-content {
  padding: 0.32rem;
  display: grid;
  gap: 0.32rem;
  grid-template-columns: 1fr 1fr;
  border-top: 0.0267rem solid #e5e5e5;
  .btn {
    height: 0.8rem;
    border-radius: 0.2133rem;
    text-align: center;
    line-height: 0.8rem;
    border: 0.0267rem solid #020202;
  }
  .btn-plain {
    color: #020202;
  }
  .btn-fill {
    background-color: #020202;
    color: var(--font-color-default);
  }
}
.send-out-form {
  padding: 0.32rem;
  :deep(.van-cell) {
    padding: 0;
    margin-bottom: 0.32rem;
  }
  :deep(.van-field__control) {
    background-color: #f5f5f5;
    padding: 0.32rem;
    border-radius: 0.2133rem;
  }
  .balance-text {
    color: #020202;
    span:first-child {
      font-size: 0.3733rem;
    }
  }
  .send-out-btn {
    padding: 0.2667rem 0.4267rem;
    border-radius: 0.2133rem;
    background: #1f2a37;
    color: #fff;
    font-size: 0.4rem;
    font-style: normal;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.64rem;
  }
}

.accept-nav {
  padding: 0.32rem;
  color: #020202;
  .chevron-left {
    width: 0.5333rem;
    height: 0.8rem;
  }
}
.accept-box {
  padding: 0.32rem;
  color: #020202;
  .logo {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    margin-bottom: 0.32rem;
  }
  .accept-p {
    font-size: 0.48rem;
  }
  .accept-span {
    margin: 0.32rem 0 0.1067rem;
  }
  .qrcode-img {
    width: 2.6667rem;
    height: 2.6667rem;
    margin-bottom: 0.8rem;
  }
  .wallet-address {
    width: 100%;
    padding: 0.32rem;
    border-radius: 0.16rem;
    border: 0.0267rem solid #e5e5e5;
    font-size: 0.3733rem;
    margin-top: 0.32rem;
    .copy {
      width: 0.48rem;
      height: 0.48rem;
    }
    span {
      display: block;
      width: 85%;
      word-wrap: break-word;
    }
  }
}
</style>
