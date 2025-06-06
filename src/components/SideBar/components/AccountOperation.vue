<template>
  <el-popover :width="235" popper-class="address-popper-box" trigger="click" :teleported="false">
    <template #reference>
      <div class="address-poper-btn display-flex align-items-center">
        <svg-icon name="logo1" class="user-icon"></svg-icon>
        <span class="address-txt">{{ customWalletInfo.walletInfo?.groupName }}</span>
        <svg-icon name="copy" class="copy" v-copy="customWalletInfo.walletInfo?.wallet"></svg-icon>
        <img :src="customWalletInfo.logo" alt="" class="chain-icon" v-if="customWalletInfo.logo" />
        <span class="price-txt">${{ numberFormat(total || 0) }}</span>
        <svg-icon name="chevron-down" class="chevron-down"></svg-icon>
      </div>
    </template>
    <template #default>
      <div class="address-box">
        <div class="wallet-info display-flex flex-direction-col">
          <div class="display-flex align-items-center justify-content-sp">
            <div class="display-flex align-items-center">
              <svg-icon name="logo1" class="user-icon"></svg-icon>
              <div class="display-flex flex-direction-col">
                <span class="address-txt">{{ customWalletInfo.walletInfo?.groupName }}</span>
                <div class="display-flex align-items-center">
                  <img
                    :src="customWalletInfo.logo"
                    alt=""
                    class="chain-icon"
                    v-if="customWalletInfo.logo"
                  />
                  <span class="price-txt">${{ numberFormat(total || 0) }}</span>
                </div>
              </div>
            </div>
            <svg-icon
              name="copy"
              class="copy"
              v-copy="customWalletInfo.walletInfo?.wallet"
            ></svg-icon>
          </div>
          <div class="operate-box">
            <div
              class="user-item display-flex align-items-center justify-content-sp"
              @click="handelJump('/Account/Property')"
            >
              <div class="display-flex align-items-center">
                <svg-icon name="icon-property" class="icon-user-item"></svg-icon>
                <span>我的资产</span>
              </div>
              <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
            </div>
            <div
              class="user-item display-flex align-items-center justify-content-sp"
              @click="handelJump('/Account/WalletConfig')"
            >
              <div class="display-flex align-items-center">
                <svg-icon name="icon-wallet" class="icon-user-item"></svg-icon>
                <span>钱包配置</span>
              </div>
              <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
            </div>
            <div
              class="user-item display-flex align-items-center justify-content-sp"
              @click="handelJump('/Account/Rebate')"
            >
              <div class="display-flex align-items-center">
                <svg-icon name="icon-rebate" class="icon-user-item"></svg-icon>
                <span>我的返佣</span>
              </div>
              <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
            </div>
            <div
              class="user-item display-flex align-items-center justify-content-sp"
              @click="handelJump('/Account/Secure')"
            >
              <div class="display-flex align-items-center">
                <svg-icon name="icon-secure" class="icon-user-item"></svg-icon>
                <span>安全中心</span>
              </div>
              <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
            </div>
          </div>
        </div>
        <div
          class="logout-btn display-flex align-items-center justify-content-sp"
          @click="handelLogon"
        >
          <div class="display-flex align-items-center">
            <svg-icon name="icon-shutdown" class="icon-user-item"></svg-icon>
            <span>退出登录</span>
          </div>
          <span></span>
        </div>
      </div>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import { APIlogout } from '@/api/login'
import { useI18n } from 'vue-i18n'
import { shortifyAddress, numberFormat } from '@/utils'
import { socketOffMonitor } from '@/utils/socket'
import { customMessage } from '@/utils/message'

const router = useRouter()
const route = useRoute()
// console.log(route)

const i18n = useI18n()
const globalStore = useGlobalStore()
const total = ref(0)

const tokenList = computed(() => globalStore.tokenList)

const customWalletInfo = computed(() => globalStore.customWalletInfo)

const getProperty = () => {
  total.value = 0
  tokenList.value.forEach((item: any) => {
    total.value += parseFloat(item.totalAmount)
  })
}

watch(tokenList, (newValue) => {
  getProperty()
})

const handelJump = (url: string) => {
  router.push(url)
}

const handelLogon = async () => {
  ElMessageBox.confirm('是否退出登录？', i18n.t('Tips'), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    type: 'info'
  })
    .then(async () => {
      const res = await APIlogout()
      // console.log(res)
      if (res) {
        customMessage({
          type: 'success',
          title: '账号退出成功'
        })
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
        if (route.fullPath.indexOf('/Account/') !== -1) {
          router.replace('/')
        }
      }
    })
    .catch(() => {})
}
</script>
<style lang="scss">
.address-popper-box {
  padding: 8px 0px !important;
  border-radius: 8px !important;
  background-color: #121316 !important;
  border: 1px solid #26282c !important;
  .el-popper__arrow:before {
    top: 0;
    background-color: #121316 !important;
    border: 1px solid #26282c !important;
  }
  .wallet-info {
    padding: 0 15px 8px;

    .user-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .address-txt {
      color: #f5f5f5;
      font-size: 14px;
      font-family: 'PingFangSC-Heavy';
      white-space: nowrap;
    }
    .chain-icon {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 4px;
    }
    .price-txt {
      font-size: 12px;
      color: #848e9c;
    }
    .copy {
      width: 12px;
      height: 12px;
    }
    .operate-box {
      height: 160px;
      .user-item {
        height: 40px;
        color: #f5f5f5;
        font-size: 12px;
        cursor: pointer;
      }
      .chevron-right {
        width: 20px;
        height: 20px;
        color: #aaa;
      }
    }
  }
  .logout-btn {
    border-top: 1px solid #26282c;
    height: 40px;
    padding: 0 15px;
    color: #f5f5f5;
    font-size: 12px;
    cursor: pointer;
  }
  .icon-user-item {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }
}
.address-poper-btn {
  padding: 5px 10px;
  height: 34px;
  border-radius: 4px;
  background: rgba(58, 60, 64, 0.4);
  color: #f5f5f5;
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  cursor: pointer;
  margin-left: 10px;

  .user-icon {
    width: 20px;
    height: 20px;
    margin-right: 6px;
    border-radius: 50%;
  }
  .copy {
    width: 14px;
    height: 14px;
    margin: 0 6px;
  }

  .chain-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
    border-radius: 50%;
  }
  .chevron-down {
    width: 16px;
    height: 16px;
    color: #f5f5f5;
    margin-left: 6px;
  }
  .address-txt {
    font-size: 14px;
  }
  .price-txt {
    font-size: 14px;
  }
}
</style>
