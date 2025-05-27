<template>
  <nav class="nav-box">
    <div class="layout-nav display-flex align-items-center justify-content-sp">
      <div class="display-flex align-items-center justify-content-sp">
        <!-- LOGO!!! -->
        <RouterLink to="/">
          <div class="home-logo display-flex align-items-center" id="leftSideBarLogo">
            <svg-icon name="logo" class="logo"></svg-icon>
            <span>HelloDex</span>
          </div>
        </RouterLink>
        <div class="link-block">
          <!-- <a href="javascript:;" class="platform-revenue">
            <span>平台收入：</span>
            <span>${{ numberFormat(feeVolume) }}</span>
          </a> -->
          <a href="https://hellodex.gitbook.io/hellodex" target="_blank" class="link">
            <span class="link">白皮书</span>
          </a>

          <RouterLink :to="item.to" v-for="item in navList" :key="item.name">
            <span class="link">{{ item.name }}</span>
          </RouterLink>
        </div>
      </div>
      <div class="seach-block" ref="SearchBlockRef">
        <el-input
          v-model="search"
          @input="handleSearchInput"
          @focus="handelSearchFocus"
          :placeholder="i18n.t('enterTokenNameContract')"
        >
          <template #prefix>
            <el-icon class="is-loading" :size="14" v-if="searchLoading">
              <Loading />
            </el-icon>
            <Search class="search-prefix" v-else />
          </template>
          <template #suffix>
            <svg-icon name="search-suffix" class="search-suffix"></svg-icon>
          </template>
        </el-input>
        <SearchDialog
          class="SearchDialog-box"
          v-if="searchDialogVisible"
          :tokenList="tokenList"
          @close="handelSearchClose"
        />
      </div>
      <div class="display-flex align-items-center">
        <div v-show="isConnected && walletType === 'Email'">
          <CustomWalletConfig />
        </div>
        <AccountOperation v-if="isConnected && walletType === 'Email'" />
        <WalletDisconnected v-if="isConnected && walletType !== 'Email'" />
        <div v-if="!isConnected" class="login-regiter">
          <WalletConnect />
        </div>
        <div
          class="invite-btn display-flex align-items-center"
          @click="router.push('/Account/Rebate')"
          v-if="isConnected"
        >
          <img src="@/assets/img/invite.gif" alt="" class="icon-invite" />
          <span>邀请返佣</span>
        </div>
        <el-popover
          :width="350"
          popper-class="invite-popper-box"
          trigger="click"
          placement="bottom-end"
          :teleported="false"
          v-else
        >
          <template #reference>
            <div class="invite-btn display-flex align-items-center">
              <img src="@/assets/img/invite.gif" alt="" class="icon-invite" />
              <span>邀请返佣</span>
            </div>
          </template>
          <div class="invite-box display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/invite-txt.png" alt="" class="invite-txt" />
            <WalletConnect>
              <div class="link-btn">请先连接</div>
            </WalletConnect>
            <div class="rake-back">
              <h3>如何获得返佣？</h3>
              <p>当您的好友完成以下步骤，您即可获得返佣奖励!</p>
            </div>
            <div class="operate-box display-flex justify-content-sp">
              <div class="operate-item display-flex flex-direction-col align-items-center">
                <svg-icon name="image-user-right" class="icon"></svg-icon>
                <span>注册</span>
                <p>使用您的邀请码或链接注册</p>
              </div>
              <div class="operate-item display-flex flex-direction-col align-items-center">
                <svg-icon name="coins-swap" class="icon"></svg-icon>
                <span>交易</span>
                <p>使用HelloDex进行交易，交易金额不低于10 USDT</p>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="download-btn display-flex align-items-center" @click="router.push('/Download')">
          <svg-icon name="download-01" class="download-01"></svg-icon>
        </div>
        <LanguageOperation />
      </div>
    </div>
  </nav>
  <RegisterDialog v-if="globalStore.dialogVisible.registerDialogVisible" />
  <div v-show="globalStore.dialogVisible.logOnDialogVisible">
    <LogOnDialog />
  </div>

  <ForgotPasswordDialog v-if="globalStore.dialogVisible.forgotPasswordDialogVisible" />
  <NotReceivedCodeDialog v-if="globalStore.dialogVisible.notReceivedCodeDialogVisible" />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/stores/global'
import CustomWalletConfig from './components/CustomWalletConfig.vue'
import AccountOperation from './components/AccountOperation.vue'
import LanguageOperation from './components/LanguageOperation.vue'
import SearchDialog from '@/components/Dialogs/SearchDialog.vue'
import RegisterDialog from '@/components/Dialogs/RegisterDialog.vue'
import LogOnDialog from '@/components/Dialogs/LogOnDialog.vue'
import ForgotPasswordDialog from '@/components/Dialogs/ForgotPasswordDialog.vue'
import NotReceivedCodeDialog from '@/components/Dialogs/NotReceivedCodeDialog.vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import WalletDisconnected from './components/WalletDisconnected.vue'

import { isAllSpaces, debounce, numberFormat } from '@/utils'
import { APISearchToken, APIgetFeeVolume } from '@/api'

const router = useRouter()
const route = useRoute()
const i18n = useI18n()

const searchDialogVisible = ref<boolean>(false)
const search = ref<string>('')
const tokenList = ref<any>([])
const searchLoading = ref<boolean>(false)
const SearchBlockRef = ref()
const feeVolume = ref<number>(0)

const handelSearchFocus = () => {
  searchDialogVisible.value = true
}
const handelSearchClose = (val: boolean = false) => {
  searchDialogVisible.value = val
  search.value = ''
}

function handleSearchInput() {
  if (isAllSpaces(search.value)) {
    return false
  }
  debounce(() => {
    searchLoading.value = true
    getTokenList()
  }, 500)
}

const getTokenList = async () => {
  const tokens = await APISearchToken({
    query: search.value.trim()
  })
  tokenList.value = tokens || []
  searchLoading.value = false
}

const globalStore = useGlobalStore()
const accountInfo = computed(() => globalStore.accountInfo)
// 菜单
const navList = computed(() => {
  return [
    { name: '送U-冲狗基金', to: '/ChongDogVentures' },
    { name: 'AI监控', to: '/Monitor/Strategy' }
    // { name: '关注', to: '/Follow' }
    // { name: i18n.t('tabbar.smart'), to: '/Smartmoney' },
    // { name: i18n.t('tabbar.tools'), to: '/Tools' },
    // { name: '质押', to: '/Staking' }
  ]
})

// 主题切换
const theme = ref(true)
const { switchDark } = useTheme()

watch(
  () => theme.value,
  (newVal, oldVal) => {
    globalStore.setTheme(newVal ? 'dark' : 'dark')
    switchDark()
    // console.log(newVal)
  }
)

const isConnected = computed(() => globalStore.walletInfo.isConnected)
const walletType = computed(() => globalStore.walletInfo.walletType)

const onClickOutSearch = (e: any) => {
  if (!SearchBlockRef.value.contains(e.target)) {
    handelSearchClose()
  }
}

onMounted(async () => {
  theme.value = globalStore.theme === 'dark' ? true : false

  document.addEventListener('click', onClickOutSearch)
  // const res: any = await APIgetFeeVolume()
  // console.log(res)
  // feeVolume.value = res?.fee || 0
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutSearch)
})
</script>

<style lang="scss">
.nav-box {
  position: sticky;
  z-index: 10;
}

.layout-nav {
  padding: 10px 20px;
  background-color: var(--bg-color);
  border-bottom: 1px solid rgba(38, 40, 44, 0.3);
  position: sticky;
  top: 0;
  z-index: 3;
  .login-btn {
    color: #101114;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    border-radius: 0px 3px 3px 0px;
    background: #f5f5f5;
  }
  .login-regiter {
    border-radius: 4px;
    height: 30px;
    display: flex;
    margin-left: 10px;
    .connect-wallet-btn {
      min-width: auto;
      width: 85px;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 14px;
      background: #f5f5f5;
      margin: 0;
    }
  }
  .home-logo {
    color: var(--font-color-default);
    font-size: 20px;
    font-style: normal;
    font-family: 'PingFangSC-Heavy';
  }
  .logo {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
  .line {
    width: 1px;
    height: 18px;
    background: var(--dex-color-4);
    margin: 0 24px;
  }
  .link-block {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    a .link {
      margin-left: 15px;
      color: #aaa;
      font-size: 14px;
      font-style: normal;
      font-family: 'PingFangSC-Medium';
      white-space: nowrap;
    }
    .router-link-active.router-link-exact-active .link {
      color: var(--font-color-default);
    }
    .platform-revenue {
      padding: 5px 10px;
      border-radius: 4px;
      background: rgba(58, 60, 64, 0.4);
      font-size: 14px;
      color: #f5f5f5;
      margin-left: 20px;
      white-space: nowrap;
    }
  }
  .seach-block {
    width: 300px;
    border-radius: 4px;
    background: #17181b;
    color: #5c6068;
    position: absolute;
    top: 9px;
    left: calc(50% - 175px);
    .search-suffix,
    .search-prefix {
      width: 14px;
      height: 14px;
      color: #5c6068;
    }
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #17181b !important;
    }
  }
  .seach-block:hover {
    background: #17181b;
  }
  .SearchDialog-box {
    width: 650px;
    position: absolute;
    left: -170px;
  }
  .theme-switch {
    cursor: pointer;
  }

  .link-Wallet {
    padding: 4px 16px;
    border-radius: 8px;
    background: var(--font-color-default);
    color: var(--bg-color);
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    cursor: pointer;
    transition: all 0.1s;
  }
  .link-Wallet:hover {
    background: #a9a9a9;
  }
  .invite-btn {
    padding: 5px 10px;
    border-radius: 4px;
    height: 30px;
    background: rgba(58, 60, 64, 0.4);
    color: #f5f5f5;
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    cursor: pointer;
    margin-left: 10px;
    white-space: nowrap;
    .icon-invite {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }
  .download-btn {
    margin-left: 10px;
    cursor: pointer;
    .download-01 {
      width: 24px;
      height: 24px;
      color: #f5f5f5;
    }
  }
  .connect-wallet-btn {
    margin-left: 16px;
  }
}

.el-dropdown {
  line-height: 0;
}
.el-dropdown-menu__item:not(.is-disabled):focus {
  background-color: #333 !important;
  color: #fff !important;
}

.invite-popper-box {
  padding: 0 !important;
  .invite-box {
    padding: 25px 12px;
    .invite-txt {
      width: 200px;
      height: auto;
    }
    .connect-wallet-btn {
      width: 100%;
      background-color: transparent;
      padding: 0;
      margin: 0;
    }
    .link-btn {
      width: 100%;
      margin-top: 20px;
      border-radius: 4px;
      background: linear-gradient(270deg, #cf0 0%, #70f6ff 100%);
      display: flex;
      padding: 6px 12px;
      justify-content: center;
      align-items: center;
      color: #101114;
      font-style: normal;
      font-family: 'PingFangSC-Heavy';
      font-size: 12px;
    }
    .rake-back {
      text-align: center;
      margin-top: 30px;
      h3 {
        color: #fff;
        font-family: 'PingFangSC-Heavy';
        font-size: 16px;
      }
      p {
        color: #9aa0aa;
        font-size: 12px;
        margin-top: 12px;
      }
    }
    .operate-box {
      margin-top: 50px;
      .operate-item {
        width: 45%;
        text-align: center;
      }
      .icon {
        width: 30px;
        height: 30px;
        color: #f5f5f5;
      }
      span {
        color: #f5f5f5;
        font-family: 'PingFangSC-Heavy';
        font-size: 12px;
        margin: 12px 0;
      }
      p {
        color: #aaa;
        font-size: 10px;
      }
    }
  }
}
.invite-popper-box.is-light,
.invite-popper-box.is-light > .el-popper__arrow:before {
  background: #17181b;
  border: 1px solid #17181b;
}
</style>
