<template>
  <el-popover :width="235" trigger="click" :teleported="false" popper-class="address-popper-box">
    <template #reference>
      <div class="address-poper-btn display-flex align-items-center">
        <svg-icon name="logo1" class="user-icon"></svg-icon>
        <span class="address-txt">{{ shortifyAddress(address) }}</span>
        <svg-icon name="copy" class="copy" v-copy="address"></svg-icon>
        <img
          :src="chainConfigs?.find((item: any) => item.chainId == chainId).logo"
          alt=""
          class="chain-icon"
        />
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
                <span class="address-txt">{{ shortifyAddress(address) }}</span>
                <div class="display-flex align-items-center">
                  <img
                    :src="chainConfigs?.find((item: any) => item.chainId == chainId).logo"
                    alt=""
                    class="chain-icon"
                  />
                  <span class="price-txt">${{ numberFormat(total || 0) }}</span>
                </div>
              </div>
            </div>
            <svg-icon name="copy" class="copy" v-copy="address"></svg-icon>
          </div>
          <!-- <div class="tg-btn-box display-flex align-items-center justify-content-sp">
            <div class="display-flex align-items-center">
              <img src="@/assets/img/img-tg.png" alt="" class="icon-tg" />
              <span class="change-txt">切换TG登录</span>
            </div>
            <span class="link-txt">连接</span>
          </div> -->
        </div>
        <div
          class="logout-btn display-flex align-items-center justify-content-sp"
          @click="handelDisconnect"
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
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { shortifyAddress, numberFormat } from '@/utils'
import { getTokenList } from '@/utils/transition'

import { useConnectWallet } from '@/hooks/useConnectWallet'

const chain = useChainConfigsStore()
const globalStore = useGlobalStore()
const i18n = useI18n()
const total = ref<number>(0)

const chainConfigs = computed(() => chain.chainConfigs)
const address = computed(() => globalStore.walletInfo.address)
const chainId = computed(() => globalStore.walletInfo.chainId)
const walletType = computed(() => globalStore.walletInfo.walletType)

const { disconnectWallet } = useConnectWallet()

const handelDisconnect = () => {
  disconnectWallet()
}

const getProperty = async (chainCode: any, walletAddress: any) => {
  const res = await getTokenList(chainCode, walletAddress)
  console.log(res)
  total.value = 0
  let propertyData: any = res || []
  propertyData?.forEach((item: any) => {
    total.value += parseFloat(item.totalAmount)
  })
}

watch([address, chainId], () => {
  getProperty(
    chainConfigs.value?.find((item: { chainId: any }) => item.chainId == chainId.value).chainCode,
    address.value
  )
})

if (address.value) {
  getProperty(
    chainConfigs.value?.find((item: { chainId: any }) => item.chainId == chainId.value).chainCode,
    address.value
  )
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
    .tg-btn-box {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #26282c;
      margin: 10px 0 4px;
      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
      .change-txt {
        color: #9aa0aa;
        font-family: 'PingFangSC-Heavy';
        font-size: 12px;
      }
      .link-txt {
        color: #f5f5f5;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .operate-box {
      height: 160px;
    }
  }
  .logout-btn {
    border-top: 1px solid #26282c;
    height: 40px;
    padding: 0 15px;
    color: #f5f5f5;
    font-size: 12px;
    cursor: pointer;
    .icon-user-item {
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
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
