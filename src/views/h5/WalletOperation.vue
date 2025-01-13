<template>
  <section class="app-walletOperation">
    <van-sticky>
      <div class="walletOperation-head display-flex align-items-center justify-content-sp">
        <svg-icon name="chevron-left" class="icon-arrow" @click="handelRouter"></svg-icon>
        <span class="walletOperation-head-title">{{ i18n.t('h5.MyWallet') }}</span>
        <span></span>
      </div>
    </van-sticky>

    <div class="walletOperation-main display-flex flex-direction-col align-items-center">
      <svg-icon name="coinDEX" class="wallet-logo"></svg-icon>
      <span class="name">{{ i18n.t('h5.MyWallet') }}</span>
      <span class="address">{{ shortifyAddress(address) }} </span>
    </div>

    <div class="wallet-operation" v-if="address">
      <div class="btn" @click="handelDisconnect">{{ i18n.t('Disconnect') }}</div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { shortifyAddress } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'

import { useConnectWallet } from '@/hooks/useConnectWallet'

const i18n = useI18n()
const globalStore = useGlobalStore()
const router = useRouter()

const address = computed(() => globalStore.walletInfo.address)
const walletType = computed(() => globalStore.walletInfo.walletType)

const { disconnectWallet } = useConnectWallet()

const handelDisconnect = async () => {
  disconnectWallet()
}
const handelRouter = () => {
  router.push('/Wallet')
}
</script>

<style lang="scss" scoped>
.app-walletOperation {
  .walletOperation-head {
    padding: 0 0.4267rem 0 0.24rem;
    height: 1.4933rem;
    .icon-arrow {
      width: 0.64rem;
      height: 0.64rem;
      color: #202020;
    }
    .walletOperation-head-title {
      font-size: 0.4267rem;
      font-style: normal;
      font-weight: normal;
      color: #000;
    }
  }
  .walletOperation-main {
    padding: 0.8533rem 0 1.2rem;
    .wallet-logo {
      width: 2.1333rem;
      height: 2.1333rem;
      margin-bottom: 0.4267rem;
    }
    .name {
      color: #000;
      font-size: 0.4267rem;
      font-style: normal;
      font-weight: normal;
      line-height: normal;
    }
    .address {
      color: #9c9c9c;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
  .wallet-operation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    width: 100%;
    padding: 0.4267rem;
    box-sizing: border-box;
    border-top: 1px solid #f2f2f2;
    .btn {
      width: 100%;
      height: 1.28rem;
      padding: 0.32rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.2133rem;
      border: 1px solid #ef485c;
      color: #ef485c;
      font-size: 0.3733rem;
      font-style: normal;
      font-weight: normal;
    }
  }
}
</style>
