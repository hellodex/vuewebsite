<template>
  <el-popover :width="240" :visible="popperVisible" popper-class="wallet-popper" ref="popoverRef">
    <template #reference>
      <div
        class="wallet-select-text display-flex align-items-center justify-content-sp"
        @click="popperVisible = !popperVisible"
      >
        <div class="display-flex align-items-center">
          <img :src="customWalletInfo.logo" alt="" class="icon-svg" v-if="customWalletInfo.logo" />
          <span>{{ customWalletInfo?.chain }}</span>
        </div>
        <el-icon color="#f5f5f5"><ArrowDownBold /></el-icon>
        <!-- <el-icon color="#828282" v-else><ArrowUpBold /></el-icon> -->
      </div>
    </template>
    <el-collapse accordion @change="handelCollapse" v-model="activeCollapse">
      <el-collapse-item
        v-for="(item, index) in chainConfigs"
        :key="index"
        :name="index"
        v-click-outside="onClickOutside"
      >
        <template #title>
          <div class="wallet-item display-flex align-items-center">
            <div class="display-flex align-items-center">
              <img :src="item.logo" alt="" class="icon-wallet" />
              <span>{{ item.chain }}</span>
            </div>
            <!-- <span class="price-num">$0.00</span> -->
          </div>
        </template>
        <template #icon="{ isActive }">
          <div class="icon-ele display-flex align-items-center">
            <!-- <el-icon :size="16"><Delete /></el-icon> -->
            <svg-icon name="chevron-down" class="icon-chevron" v-if="isActive"></svg-icon>
            <svg-icon name="chevron-right" class="icon-chevron" v-else></svg-icon>
          </div>
        </template>
        <div
          class="wallet-address display-flex align-items-center justify-content-sp"
          v-for="(item1, index1) in accountInfo?.wallets[item.chainCode]"
          :key="index1"
          @click="handelWalletAddress(item, index, item1, index1)"
        >
          <div class="display-flex flex-direction-col">
            <span class="wallet-text">{{ item1.groupName }}</span>
            <div class="display-flex align-items-center">
              <span class="address-txt">{{ shortifyAddress(item1.wallet) }}</span>
              <svg-icon name="copy" class="copy" v-copy="item1.wallet"></svg-icon>
            </div>
          </div>
          <div
            v-if="item1.walletId == customWalletInfo.walletInfo?.walletId"
            class="cur-txt display-flex align-items-center"
          >
            <svg-icon
              name="icon-cur-watllet"
              class="icon-cur-watllet"
              v-copy="item1.wallet"
            ></svg-icon>
            <span>当前钱包 </span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-popover>
</template>
<script setup lang="ts">
import { ref, computed, unref, watch } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'

import { shortifyAddress, getQueryParams } from '@/utils'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'
const globalStore = useGlobalStore()
const chain = useChainConfigsStore()

const popoverRef = ref()
const popperVisible = ref(false)

/**点击空白处隐藏 */
const onClickOutside = (e: any) => {
  if (popperVisible.value && !unref(popoverRef).popperRef.contentRef.contains(e.target)) {
    popperVisible.value = false
  }
}

const chainConfigs = computed(() => chain.chainConfigs)

const accountInfo = computed(() => globalStore.accountInfo)

const customWalletInfo = computed(() => globalStore.customWalletInfo)

const activeCollapse = ref<any>(Number(localStorage.getItem('customWalletIndex')) || 0)

watch(chainConfigs, (newValue) => {
  const queryParams = getQueryParams(window.location.href)
  const customWalletIndex = queryParams.chainCode
    ? newValue?.findIndex((item: any) => item.chainCode == queryParams.chainCode)
    : localStorage.getItem('customWalletIndex') || 0
  const customWalletIndex1 = localStorage.getItem('customWalletIndex1') || 0
  accountInfo.value &&
    globalStore.setCustomWalletInfo({
      ...newValue[customWalletIndex],
      index: customWalletIndex,
      index1: customWalletIndex1,
      walletInfo: {
        ...accountInfo.value.wallets[newValue[customWalletIndex].chainCode][customWalletIndex1]
      }
    })
})

watch(accountInfo, (newValue) => {
  const queryParams = getQueryParams(window.location.href)
  const customWalletIndex = queryParams.chainCode
    ? chainConfigs.value?.findIndex((item: any) => item.chainCode == queryParams.chainCode)
    : localStorage.getItem('customWalletIndex') || 0
  const customWalletIndex1 = localStorage.getItem('customWalletIndex1') || 0
  newValue &&
    globalStore.setCustomWalletInfo({
      ...chainConfigs.value?.[customWalletIndex],
      index: customWalletIndex,
      index1: customWalletIndex1,
      walletInfo: {
        ...newValue.wallets[chainConfigs.value?.[customWalletIndex].chainCode]?.[customWalletIndex1]
      }
    })
})

const handelWalletAddress = (item: any, index: any, item1: any, index1: any) => {
  globalStore.setCustomWalletInfo({
    ...item,
    index,
    index1,
    walletInfo: item1
  })
}

const handelCollapse = (val: any) => {
  console.log(val)
  // globalStore.setCustomWalletInfo({
  //   ...chainConfigs.value[val],
  //   index: val,
  //   walletInfo: {
  //     ...accountInfo.value.wallets[chainConfigs.value[val].chainCode][0]
  //   }
  // })
}
</script>
<style lang="scss">
.wallet-select-text {
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  height: 34px;
  background: rgba(58, 60, 64, 0.4);
  font-size: 14px;
  color: #f5f5f5;
  .icon-svg {
    width: 20px;
    height: 20px;
  }
  span {
    margin: 0 4px;
  }
}
.wallet-popper {
  border-radius: 8px !important;
  background-color: #17181b !important;
  color: #f5f5f5 !important;
  border: 1px solid #17181b !important;
  .el-popper__arrow:before {
    top: 0;
    background-color: #17181b !important;
    border: 1px solid #17181b !important;
  }
  .wallet-address {
    padding: 10px 15px;
    cursor: pointer;
    border-top: 1px solid #26282c;
    .wallet-text {
      font-family: 'PingFangSC-Heavy';
      font-size: 12px;
      color: #f5f5f5;
    }
    .address-txt {
      font-family: 'PingFangSC-Medium';
      font-size: 12px;
      color: #848e9c;
    }
    .copy {
      margin-left: 6px;
      width: 12px;
      height: 12px;
      cursor: pointer;
    }
    .cur-txt {
      font-size: 10px;
      color: #aaa;
    }
    .icon-cur-watllet {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
  }
  .wallet-address:last-child {
    border: none;
  }

  .wallet-item {
    font-family: 'PingFangSC-Heavy';
    font-size: 12px;
    color: #9aa0aa;
    .price-num {
      margin-left: 40px;
    }
  }
  .icon-chevron {
    width: 18px;
    height: 18px;
  }
  .icon-ele {
    margin: 0 0 0 auto;
  }
  .icon-wallet {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }

  .el-collapse,
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border: none !important;
  }
  .el-collapse-item__header {
    padding: 10px 15px;
  }

  .el-collapse-item {
    border-radius: 8px;
    background-color: rgba(33, 33, 33, 0.3);
    margin-bottom: 8px;
  }
  .el-collapse-item__content {
    padding: 0;
  }
}
</style>
