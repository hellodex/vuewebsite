<template>
  <div class="telegram_login">
    <div class="loader"></div>
    <p>正在通过TG Bot 登录中，请稍后</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { useRouter, useRoute } from 'vue-router'
import { APItgToWebDologin, APIuserInfo } from '@/api/login'
import { ElMessage } from 'element-plus'
import { socketOffMonitor, socketOnMonitor } from '@/utils/socket'

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
    ElMessage.success('tg账户登陆成功')
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background-color: rgba(16, 17, 20, 0.8);
  font-family: 'PingFangSC-Heavy';
  .loader {
    width: 100px;
    aspect-ratio: 1;
    padding: 10px;
    box-sizing: border-box;
    display: grid;
    background-color: transparent;
    filter: blur(1px) contrast(10);
    // mix-blend-mode: darken;
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
