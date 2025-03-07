<template>
  <div class="web3-mode">
    <van-sticky>
      <div class="wallet-head display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center" @click="router.push('/WalletOperation')">
          <svg-icon name="coinDEX" class="wallet-logo"></svg-icon>
          <div class="wallet-head-name display-flex flex-direction-col">
            <span>
              {{ i18n.t('h5.MyWallet') }}
              <van-icon name="arrow-down" />
            </span>
            <span>{{ isConnected ? shortifyAddress(address) : '--' }} </span>
          </div>
        </div>
        <div class="display-flex align-items-center">
          <svg-icon name="icon-copy" class="icon"></svg-icon>
          <svg-icon name="scan" class="icon"></svg-icon>
          <div class="wallet-head-setting display-flex align-items-center">
            <span>{{ i18n.t('h5.Manage') }}</span>
            <van-icon name="arrow" :size="16" color="#3f3f3f" />
          </div>
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
          <strong v-if="maskDigit"
            >${{ isConnected ? numberFormat(overviewOfFunds || 0) : 0 }}</strong
          >
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
        <div class="display-flex flex-direction-col align-items-center">
          <span>
            <svg-icon name="arrow-up" class="operate-icon"></svg-icon>
          </span>
          <strong>{{ i18n.t('h5.Send') }}</strong>
        </div>
        <div class="display-flex flex-direction-col align-items-center">
          <span>
            <svg-icon name="arrow-down" class="operate-icon"></svg-icon>
          </span>
          <strong>{{ i18n.t('h5.Receive') }}</strong>
        </div>
        <div class="display-flex flex-direction-col align-items-center">
          <span>
            <svg-icon name="switch-horizontal" class="operate-icon"></svg-icon>
          </span>
          <strong>{{ i18n.t('home.swap') }}</strong>
        </div>
        <div class="display-flex flex-direction-col align-items-center">
          <span>
            <svg-icon name="clock-rewind" class="operate-icon"></svg-icon>
          </span>
          <strong>{{ i18n.t('h5.History') }}</strong>
        </div>
        <div class="display-flex flex-direction-col align-items-center">
          <span>
            <svg-icon name="auth-check" class="operate-icon"></svg-icon>
          </span>
          <strong>{{ i18n.t('h5.Audit') }}</strong>
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
          <p class="warning" v-if="isConnected">
            <van-checkbox v-model="checked" checked-color="#F6465D">
              <strong>{{ i18n.t('h5.HideSmallAssets') }}</strong>
              <van-icon name="warning-o" />
            </van-checkbox>
          </p>
        </van-sticky>
        <template v-if="isConnected">
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
                v-for="(item, index) in list"
                :key="index"
                @click="handelJump(item)"
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
                    </p>
                  </div>
                </div>
                <div class="list-item-right display-flex flex-direction-col align-items-fd">
                  <span>{{ numberFormat(item.totalAmount || 0) }}</span>
                  <span>{{ numberFormat(decimalsFormat(item.amount, item.decimals)) }}</span>
                </div>
              </div>
            </van-skeleton>
          </div>
        </template>
        <div class="wallet-btn" v-show="!isConnected">
          <H5WalletConnect />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import H5WalletConnect from '@/components/Wallet/H5WalletConnect.vue'

import { APIgetTokensByWalletAddress } from '@/api'

import { useChainConfigsStore } from '@/stores/chainConfigs'
import { numberFormat, shortifyAddress } from '@/utils'

import { useGlobalStore } from '@/stores/global'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { decimalsFormat } from '@/utils/transition'

const i18n = useI18n()
const router = useRouter()

const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore

const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const chainId = computed(() => globalStore.walletInfo.chainId)

const chainConfigs = useChainConfigsStore().chainConfigs
const maskDigit = ref(true)
const checked = ref(false)
const listSkeletonLoading = ref(false)

const tabList = [
  {
    id: 1,
    name: i18n.t('h5.Assets')
  }
  // {
  //   id: 2,
  //   name: 'NFT'
  // },
  // {
  //   id: 3,
  //   name: '铭文'
  // }
]
const tabIndex = ref<number>(1)

const handelTabChange = (item: { id: number }) => {
  tabIndex.value = item.id
}

const list = ref<any>([])
const overviewOfFunds = ref<number>(0)
const timer = ref<any>(null)

const getTokensByWalletAddr = async () => {
  const res: any = await APIgetTokensByWalletAddress({
    walletAddress: address.value,
    chainCode: chainConfigs.find((item: { chainId: any }) => item.chainId == chainId.value)
      .chainCode
  })

  console.log(res)
  listSkeletonLoading.value = false
  list.value = res
  overviewOfFunds.value = 0
  res.forEach((item: { totalAmount: any }) => {
    overviewOfFunds.value += parseFloat(item.totalAmount)
  })
}

const handelJump = (item: any) => {
  router.push(`/k/${item.pairAddress}?chainCode=${item.chainCode}`)
}

watch(address, () => {
  isConnected.value && intervalFun()
})

const intervalFun = () => {
  if (isConnected.value) {
    clearInterval(timer.value)
    listSkeletonLoading.value = true
    getTokensByWalletAddr()
    timer.value = setInterval(() => {
      getTokensByWalletAddr()
    }, 5000)
  }
}
onMounted(() => {
  intervalFun()
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.web3-mode {
  padding: 0 0.32rem;
  :deep(.email-wallet) {
    display: none;
  }
}
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
      background-color: #2ebd85;
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
    margin: 0.4267rem 0 0.32rem;
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
.wallet-btn {
  margin: 1.5rem auto 0;
  :deep(.transaction-btn) {
    width: 100%;
    height: 1.0667rem;
    font-size: 0.3733rem;
  }
}
</style>
