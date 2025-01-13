<template>
  <div class="wallet-box">
    <van-sticky>
      <div class="mode-tab" v-if="!isConnected">
        <div class="mode-box display-flex align-items-center">
          <span
            v-for="item in modeTabList"
            :key="item.value"
            :class="modeTabIndex == item.value ? 'active' : ''"
            @click="handelModeTab(item)"
            >{{ item.label }}</span
          >
        </div>
      </div>
    </van-sticky>
    <template v-if="modeTabIndex == 1">
      <div class="accout-box" v-if="!isConnected">
        <img
          src="@/assets/icons/account_login.svg"
          class="account_login"
          @click="router.push('/h5/signIn')"
        />
        <a href="https://hellodex.gitbook.io/hellodex/hellodex_cn/whitepaper" target="_blank">
          <img src="@/assets/icons/account_ad.svg" class="account_ad" alt="" />
        </a>
      </div>
      <AccountWallet v-else />
    </template>

    <Web3Wallet v-if="modeTabIndex == 2" />
  </div>
  <Tabbar :active="4" />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import AccountWallet from './components/WalletInfo/AccountWallet.vue'
import Web3Wallet from './components/WalletInfo/Web3Wallet.vue'
import Tabbar from '@/components/SideBar/Tabbar.vue'

import { useGlobalStore } from '@/stores/global'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const router = useRouter()

const globalStore = useGlobalStore()

const isConnected = computed(() => globalStore.walletInfo.isConnected)
const walletType = computed(() => globalStore.walletInfo.walletType)

const modeTabList = [
  {
    label: '账户模式',
    value: 1
  },
  {
    label: 'Web3钱包',
    value: 2
  }
]

const modeTabIndex = ref(isConnected.value && walletType.value !== 'Email' ? 2 : 1)

const handelModeTab = (item: any) => {
  modeTabIndex.value = item.value
}
</script>

<style lang="scss" scoped>
.wallet-box {
  font-size: 0.32rem;
  padding: 0 0 var(--van-tabbar-height);
}
.mode-tab {
  background-color: var(--font-color-default);
  padding: 0.24rem 0;
}
.mode-box {
  padding: 0.08rem;
  width: 50%;
  height: 0.8rem;
  margin: 0 auto;
  background-color: #f2f2f2;
  border-radius: 0.5333rem;
  color: #202020;
  span {
    display: flex;
    width: 50%;
    height: 100%;
    border-radius: 0.5333rem;
    align-items: center;
    justify-content: center;
    font-size: 0.32rem;
    background-color: transparent;
    cursor: pointer;
  }
  .active {
    background-color: var(--font-color-default);
  }
}
.accout-box {
  .account_login,
  .account_ad {
    width: 100%;
    display: block;
  }
}
</style>
