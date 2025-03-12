<template>
  <div class="telegram_login">
    <div class="content">
      <div class="loader"></div>
      <p>正在通过 TG Bot 登录中，请稍后</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { useRouter, useRoute } from 'vue-router'
import { APItgToWebDologin, APIuserInfo } from '@/api/login'
import { socketOffMonitor, socketOnMonitor } from '@/utils/socket'
import { customMessage } from '@/utils/message'

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()

const { setAccountInfo, setWalletInfo } = globalStore

const login = async () => {
  const res: any = await APItgToWebDologin({
    token: route.query.key
  })
  if (res) {
    localStorage.setItem('accountInfo', JSON.stringify(res))
    const userInfo: any = await APIuserInfo()
    customMessage({
      type: 'success',
      title: 'TG BOT 账户登录成功'
    })
    const obj = Object.assign({}, res, userInfo)
    localStorage.setItem('accountInfo', JSON.stringify(obj))

    setAccountInfo(obj)
    setWalletInfo({
      address: null,
      isConnected: true,
      chainId: null,
      walletType: 'Email'
    })
    socketOffMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
    socketOnMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)

    router.replace('/')
    return
  }

  console.log(res)
}

onMounted(() => {
  route.query.key && login()
})
</script>
<style lang="scss" scoped>
.telegram_login {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  display: flex;

  align-items: center;
  justify-content: center;
  font-size: 20px;
  background-color: rgba(16, 17, 20, 0.9);
  font-family: 'PingFangSC-Heavy';
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(16, 17, 20);
    padding: 50px;
    border-radius: 10px;
  }
  .loader {
    width: 100px;
    aspect-ratio: 1;
    padding: 10px;
    box-sizing: border-box;
    display: grid;
    background-color: rgba(16, 17, 20);
    filter: blur(5px) contrast(10);
    mix-blend-mode: screen;
    margin-bottom: 12px;
  }
  .loader:before,
  .loader:after {
    content: '';
    grid-area: 1/1;
    background:
      linear-gradient(#fff 0 0) left,
      linear-gradient(#fff 0 0) right;
    background-size: 20px 40px;
    background-origin: content-box;
    background-repeat: no-repeat;
  }
  .loader:after {
    height: 20px;
    width: 20px;
    margin: auto 0;
    border-radius: 50%;
    background: #fff;
    animation: l10 1s infinite;
  }
  @keyframes l10 {
    90%,
    100% {
      transform: translate(300%);
    }
  }
}
</style>
