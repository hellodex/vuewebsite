<template>
  <van-popup
    v-model:show="popupVisible"
    round
    position="bottom"
    @close="handleClose"
    :style="{ height: '50%' }"
  >
    <div class="popup-title">钱包列表</div>
    <div class="popup-content display-flex align-items-center">
      <div class="popup-switch">
        <span
          v-for="(item, index) in chainConfigs"
          :key="index"
          @click="handelChainSwitch(index)"
          :class="walletCurrentIndex == index ? 'active' : ''"
        >
          <el-image :src="item.logo" alt="" class="chain-logo">
            <template #error>
              <svg-icon name="logo1" class="chain-logo"></svg-icon>
            </template>
          </el-image>
        </span>
      </div>
      <div class="popup-switch-content">
        <p class="chain-txt">{{ walletChain }}</p>
        <div class="chain-wallet">
          <div
            v-for="(item, index) in walletList"
            :key="index"
            class="wallet-card display-flex align-items-center justify-content-sp"
            @click="handelSwitchWalletAddress(item, index)"
          >
            <div>
              <p>{{ walletChain }}-{{ item.groupName }}</p>
              <p class="display-flex align-items-center wallet-card-address">
                <span>{{ shortifyAddress(item.wallet) }}</span>
                <svg-icon name="copy" class="copy" v-copy="item.wallet"></svg-icon>
              </p>
            </div>
            <van-icon
              name="success"
              v-if="
                walletChainSelectIndex == walletCurrentIndex && walletChainCurrentIndex == index
              "
            />
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { shortifyAddress } from '@/utils'

import { useGlobalStore } from '@/stores/global'

const props = defineProps({
  showPopupBottom: {
    type: [Boolean],
    default: false
  }
})

const emit = defineEmits(['close'])

const popupVisible: any = computed({
  // getter
  get() {
    return props.showPopupBottom
  },
  // setter
  set(newValue) {
    return newValue
  }
})

const globalStore = useGlobalStore()
const chain = useChainConfigsStore()

const chainConfigs = computed(() => chain.chainConfigs)
const accountInfo = computed(() => globalStore.accountInfo)

const walletList = ref<any>([])
const walletCurrentIndex = ref<any>('')
const walletChain = ref<string>('')
const walletChainCurrentIndex = ref<number>(
  parseFloat(localStorage.getItem('customWalletIndex1') || '0')
)

const walletChainSelectIndex = ref<number>(
  parseFloat(localStorage.getItem('customWalletIndex') || '0')
)

const handelChainSwitch = (index: number) => {
  walletCurrentIndex.value = index
}

const handelSwitchWalletAddress = (item: any, index: number) => {
  walletChainCurrentIndex.value = index
  walletChainSelectIndex.value = walletCurrentIndex.value
  globalStore.setCustomWalletInfo({
    ...chainConfigs.value?.[walletCurrentIndex.value],
    index: walletCurrentIndex.value,
    index1: walletChainCurrentIndex.value,
    walletInfo: {
      ...item
    }
  })
  handleClose()
}

const handleClose = () => {
  emit('close', false)
}

watch(walletCurrentIndex, (newValue) => {
  walletChain.value = chainConfigs.value[newValue].chain
  walletList.value = accountInfo.value?.wallets[chainConfigs.value[newValue].chainCode]
})

onMounted(() => {
  walletCurrentIndex.value = parseFloat(localStorage.getItem('customWalletIndex') || '0')
})
</script>
<style lang="scss" scoped>
.popup-title {
  height: 1.3333rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020202;
  font-size: 0.3733rem;
  border-bottom: 1px solid #e5e5e5;
}
.popup-content {
  height: calc(100% - 1.3333rem);
  .popup-switch {
    height: 100%;
    width: 1.3333rem;
    background-color: #e5e5e5;
    overflow: hidden;
    overflow-y: scroll;
    span {
      width: 1.3333rem;
      height: 1.3333rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
    }
    .active {
      background-color: var(--font-color-default);
    }
    .chain-logo {
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 50%;
    }
  }
  .popup-switch-content {
    padding: 0 12px;
    width: calc(100% - 1.3333rem);
    height: 100%;
    .chain-txt {
      padding: 0.32rem 0;
      color: #202020;
      font-size: 16px;
    }
    .wallet-card {
      padding: 12px;
      border-radius: 8px;
      background-color: #020202;
      color: var(--font-color-default);
      margin-bottom: 10px;
      font-size: 16px;
      .wallet-card-address {
        font-size: 12px;
        margin-top: 6px;
        .copy {
          width: 13px;
          height: 13px;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
