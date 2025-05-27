<template>
  <section class="app-setting display-flex flex-direction-col justify-content-sp">
    <div class="display-flex flex-direction-col">
      <van-sticky>
        <div class="setting-head display-flex align-items-center justify-content-sp">
          <svg-icon name="chevron-left" class="icon-arrow" @click="handelRouter"></svg-icon>
          <span class="setting-head-title">设置</span>
          <span></span>
        </div>
      </van-sticky>

      <div class="setting-main">
        <div class="user-info display-flex align-items-center" v-if="walletType == 'Email'">
          <img src="../../assets/img/0xSun.png" alt="" class="nick-img" />
          <div class="display-flex flex-direction-col">
            <span class="nickname">{{ accountInfo?.nickname }}</span>
            <span>{{ accountInfo?.account }}</span>
          </div>
        </div>
        <div class="application">
          <a
            href="https://lnk.bio/go?d=https%3A%2F%2Ftwitter.com%2FHelloDexCN&hash=f3d7fbce65a2531a29d1028b5ad52c44&id=7108163&ext=-1861636&timezone=America%2FNew_York&type=1"
            target="_blank"
            class="application-item display-flex align-items-center"
          >
            <span>Twitter</span>
          </a>
          <a
            href="https://lnk.bio/go?d=https%3A%2F%2Ft.me%2FHelloDex_cn&hash=8e2b8abee04f4dd77925055774555bb3&id=7108162&ext=-1861636&timezone=America%2FNew_York&type=1"
            target="_blank"
            class="application-item display-flex align-items-center"
          >
            <span>Telegram</span>
          </a>
        </div>
        <van-cell is-link title="语言" :value="lang" @click="show = true" :border="false" />
      </div>
    </div>

    <div class="logout-btn-box" v-if="walletType == 'Email'">
      <div
        class="logout-btn display-flex align-items-center justify-content-sp"
        @click="handelLogout"
      >
        退出登录
      </div>
    </div>
  </section>
  <van-action-sheet
    v-model:show="show"
    :actions="actions"
    cancel-text="取消"
    close-on-click-action
    @cancel="onCancel"
    @select="onSelect"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import { APIlogout } from '@/api/login'
import { showLoadingToast, showSuccessToast } from 'vant'
import { socketOffMonitor } from '@/utils/socket'

const { reload }: any = inject('reload')
const globalStore = useGlobalStore()
const router = useRouter()
const i18n = useI18n()
const show = ref(false)

const language = computed(() => globalStore.language)
const walletType = computed(() => globalStore.walletInfo.walletType)
const accountInfo = computed(() => globalStore.accountInfo)

const lang = computed(() => actions.find((item: any) => item.code == language.value)?.name)

const actions = [
  { name: '简体中文', code: 'zh' },
  { name: 'English', code: 'en' }
]
const onSelect = (item: any) => {
  // 默认情况下点击选项时不会自动收起
  // 可以通过 close-on-click-action 属性开启自动收起
  i18n.locale.value = item.code
  globalStore.setLanguage(item.code)
  reload()
  // console.log(item)
  show.value = false
}

const onCancel = () => console.log('取消')

const handelRouter = () => {
  router.push('/')
}

const handelLogout = async () => {
  showLoadingToast({
    message: `账户退出中...`,
    forbidClick: true
  })
  const res = await APIlogout()
  // console.log(res)
  if (res) {
    showSuccessToast(`账号退出成功`)
    await socketOffMonitor(
      globalStore.accountInfo.uuid,
      globalStore.accountInfo.tokenInfo.tokenValue
    )
    localStorage.removeItem('accountInfo')
    localStorage.removeItem('customWalletIndex')
    localStorage.removeItem('customWalletIndex1')
    globalStore.setAccountInfo(null)
    globalStore.setWalletInfo({
      address: null,
      isConnected: false,
      chainId: null,
      walletType: null
    })
    router.replace('/')
  }
}
</script>

<style lang="scss" scoped>
.app-setting {
  height: 100vh;
  background-color: #fff;
  .setting-head {
    padding: 0 0.4267rem 0 0.24rem;
    height: 1.4933rem;
    background-color: #fff;
    .icon-arrow {
      width: 0.64rem;
      height: 0.64rem;
      color: #202020;
    }
    .setting-head-title {
      font-size: 0.4267rem;
      font-style: normal;
      font-weight: normal;
      color: #000;
    }
  }
  .setting-main {
    padding: 0.32rem 0;
    .user-info {
      color: #9c9c9c;
      padding: 0 16px 10px;
      .nick-img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-right: 6px;
      }
      .nickname {
        font-size: 14px;
        color: #202020;
      }
    }
    .application {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.48rem;
      padding: 10px 16px;
      .application-item {
        width: 100%;
        height: 30px;
        justify-content: center;
        background-color: #e5e5e5;
        border-radius: 4px;
        color: #202020;
      }
    }
  }
  .logout-btn-box {
    padding: 0.4rem 0.32rem;
  }
  .logout-btn {
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid var(--down-color);
    color: #fff;
    font-size: 15px;
    font-style: normal;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--down-color);
  }
}
</style>
