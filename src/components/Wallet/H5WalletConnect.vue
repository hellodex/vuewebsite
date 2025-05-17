<template>
  <div class="h5-connect-wallet-btn" v-bind="$attrs" @click="handelConnect">
    <slot>登录</slot>
  </div>
  <!-- <wallet-multi-button></wallet-multi-button> -->
  <van-popup v-model:show="dialogVisible" round position="bottom" closeable>
    <div class="h5-connect-wallet-title">{{ i18n.t('connect') }}</div>
    <div class="connect-wallet-box display-flex flex-direction-col">
      <div
        class="email-wallet h5-connect-wallet-item display-flex align-items-center justify-content-sp"
        @click="handelConnectEmail"
      >
        <div class="display-flex align-items-center">
          <svg-icon name="icon-email" class="icon-logo"></svg-icon>
          <div class="display-flex flex-direction-col">
            <span>Email - 邮箱登录</span>
            <span>点击使用邮箱登录</span>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>
      <div
        class="h5-connect-wallet-item display-flex align-items-center justify-content-sp"
        @click="handelWalletConnect"
      >
        <div class="display-flex align-items-center">
          <svg-icon name="walletconnect" class="icon-logo"></svg-icon>
          <div class="display-flex flex-direction-col">
            <span>WalletConnect (MetaMask)</span>
            <span>使用 WalletConnect 连接</span>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>
      <div
        class="h5-connect-wallet-item display-flex align-items-center justify-content-sp"
        @click="handelWalletConnect"
      >
        <div class="display-flex align-items-center">
          <svg-icon name="OKX" class="icon-logo"></svg-icon>
          <div class="display-flex flex-direction-col">
            <span>OKX Wallet (EVM) </span>
            <span>使用 WalletConnect 连接</span>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>
      <div
        class="h5-connect-wallet-item display-flex align-items-center justify-content-sp"
        @click="handelWalletConnect"
      >
        <div class="display-flex align-items-center">
          <svg-icon name="coinSOLANA" class="icon-logo"></svg-icon>
          <div class="display-flex flex-direction-col">
            <span>Solana Wallet</span>
            <span>使用 WalletConnect 连接</span>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>
    </div>
  </van-popup>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConnectWallet } from '@/hooks/useConnectWallet'

const dialogVisible = ref(false)

const i18n = useI18n()

const router = useRouter()

const { connectWallet } = useConnectWallet()

const handelConnect = () => {
  dialogVisible.value = true
}

const handelWalletConnect = () => {
  connectWallet()
}

const handelConnectEmail = () => {
  router.push('/h5/signIn')
}
</script>
<style lang="scss">
.h5-connect-wallet-btn {
  padding: 0.2667rem 0.4267rem;
  border-radius: 0.2133rem;
  background: #1f2a37;
  color: #fff;
  font-size: 0.4rem;
  font-style: normal;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.h5-connect-wallet-title {
  color: #414141;
  font-size: 0.4267rem;
  padding-bottom: 0.8rem;
  padding: 0.32rem;
}
.connect-wallet-box {
  padding-bottom: 0.2667rem;
}

.h5-connect-wallet-item {
  color: #828282;
  border-radius: 0.2667rem;
  text-decoration: none;
  cursor: pointer;
  padding: 0.2667rem;
  transition: all 0.1s;
  span:first-child {
    color: #414141;
    font-size: 0.3733rem;
    font-weight: normal;
  }
  .icon-logo {
    width: 1.0667rem;
    height: 1.0667rem;
    margin-right: 0.3467rem;
    border-radius: 50%;
    display: block;
  }
  .chevron-right {
    width: 0.5333rem;
    height: 0.5333rem;
    color: #828282;
  }
  strong {
    font-weight: normal;
  }
}
</style>
