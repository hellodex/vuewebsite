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
        <div class="display-flex flex-direction-col align-items-center">
          <div class="display-flex align-items-center">
            <svg-icon name="logo" class="logo"></svg-icon>
            <span class="title">HelloDex</span>
          </div>
          <p class="p-txt">开创和主导Web3变革，平台利润80%分给用户</p>
        </div>
        <img src="@/assets/icons/account_login.svg" class="account_login" />
        <div
          class="account-btn display-flex align-items-center justify-content-center"
          @click="router.push('/h5/signIn')"
        >
          <svg-icon name="icon-google" class="icon-google"></svg-icon>
          <span>注册/登录</span>
        </div>

        <a
          :href="`${tgUrl}?start=l_${new Date().getTime()}_P_Web`"
          target="_blank"
          class="tg-btn display-flex align-items-center justify-content-center"
        >
          <svg-icon name="telegram-pump" class="icon-tg" style=""></svg-icon>
          <span>TG BOT登录</span>
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

const tgUrl = ref(import.meta.env.VITE_TG_URL)

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
  background-color: #fff;
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
    background-color: #fff;
  }
}
.accout-box {
  padding-top: 0.8rem;
  .logo {
    width: 0.96rem;
    height: 0.96rem;
  }
  .title {
    color: #000;
    font-size: 0.6933rem;
    font-style: normal;
    font-weight: 600;
    margin-left: 0.24rem;
  }
  .p-txt {
    color: #333;
    text-align: center;
    font-size: 0.4rem;
    font-style: normal;
    font-weight: 400;
    margin-top: 0.2133rem;
    line-height: normal;
  }
  .account_login {
    width: 5.6rem;
    display: block;
    margin: 1.4933rem auto 1.92rem;
  }
  .account-btn {
    width: 9.3333rem;
    height: 1.28rem;
    margin: 0 auto 0.5333rem;
    color: #fff;
    font-size: 0.4267rem;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    border-radius: 100px;
    background: #000;
    .icon-google {
      width: 0.5333rem;
      height: 0.5333rem;
      margin-right: 0.1067rem;
    }
  }

  .tg-btn {
    width: 9.3333rem;
    height: 1.28rem;
    margin: 0 auto;
    color: #333;
    font-size: 0.4267rem;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    border-radius: 100px;
    border: 1px solid #e5e5e5;
    .icon-tg {
      width: 0.5333rem;
      height: 0.5333rem;
      margin-right: 0.1067rem;
      color: #29a0da;
    }
  }
}
</style>
