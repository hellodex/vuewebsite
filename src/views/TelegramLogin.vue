<template>
  <div class="telegram_login">正在登录...</div>
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
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background-color: rgba(16, 17, 20, 0.8);
}
</style>
