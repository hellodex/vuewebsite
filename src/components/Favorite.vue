<template>
  <div class="favorite-box">
    <WalletConnect v-if="!isConnected">
      <svg-icon name="star-o" class="star-o-icon"></svg-icon>
    </WalletConnect>
    <template v-else>
      <svg-icon
        name="star"
        class="star-icon"
        :class="{ 'star-animation': isAnimating }"
        @click.stop="handelDeleteFavorite"
        v-if="favoriteData.find((item: any) => item.baseToken?.address === (props.coinInfo?.baseTokenAddress || props.coinInfo?.pairAddress) && item.chainCode === props.coinInfo?.chainCode)"
      ></svg-icon>
      <svg-icon 
        name="star-o" 
        class="star-o-icon" 
        :class="{ 'star-animation': isAnimating }"
        @click.stop="handelAddFavorite" 
        v-else
      ></svg-icon>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'

import { APIlistFavorite, APIaddFavorite, APIdeleteFavorite } from '@/api/coinWalletDetails'
import { customMessage } from '@/utils/message'

const props = defineProps({
  coinInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const globalStore = useGlobalStore()

const isConnected = computed(() => globalStore.walletInfo.isConnected)
const favoriteData = computed(() => globalStore.favoriteData)
const accountInfo = computed(() => globalStore.accountInfo)

const chainId = computed(() => globalStore.walletInfo.chainId)
const customWalletInfo = computed(() => globalStore.customWalletInfo)
const address = computed(() => globalStore.walletInfo.address)
const walletType = computed(() => globalStore.walletInfo.walletType)

const chainConfigs = useChainConfigsStore().chainConfigs

const isAnimating = ref(false)

const handelAddFavorite = async () => {
  isAnimating.value = true
  const res = await APIaddFavorite({
    baseTokenAddress: props.coinInfo.baseTokenAddress || props.coinInfo.pairAddress || props.coinInfo.baseToken?.address,
    chainCode: props.coinInfo.chainCode
  })
  if (res) {
    customMessage({
      type: 'success',
      title: '收藏成功'
    })
    getListFavorite()
  }
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

const handelDeleteFavorite = async () => {
  isAnimating.value = true
  const res = await APIdeleteFavorite({
    baseTokenAddress: props.coinInfo.baseTokenAddress || props.coinInfo.pairAddress || props.coinInfo.baseToken?.address,
    chainCode: props.coinInfo.chainCode
  })

  if (res) {
    customMessage({
      type: 'success',
      title: '已删除收藏'
    })
    getListFavorite()
  }
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

const getListFavorite = async () => {
  // 检查是否已登录（钱包连接或账户登录）
  if (!isConnected.value && !accountInfo.value) {
    return
  }
  
  const res = await APIlistFavorite({})
  globalStore.setFavoriteData(res || [])
}
</script>

<style scoped lang="scss">
.favorite-box {
  :deep(.connect-wallet-btn) {
    padding: 0;
    background-color: transparent;
    min-width: auto;
  }
}

.star-o-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  color: var(--dex-color-4);
  cursor: pointer;
  display: block;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e89f13;
  }
}

.star-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  color: #e89f13;
  display: block;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    filter: brightness(1.2);
  }
}

// 点击动画 - 简洁的缩放效果
.star-animation {
  animation: starPulse 0.4s ease-out;
}

@keyframes starPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

</style>
