<template>
  <div class="favorite-box">
    <WalletConnect v-if="!isConnected">
      <svg-icon name="star-o" class="star-o-icon"></svg-icon>
    </WalletConnect>
    <template v-else>
      <svg-icon
        name="star"
        class="star-icon"
        @click.stop="handelDeleteFavorite"
        v-if="favoriteData.find((item: any) => item.pairAddress == props.coinInfo?.pairAddress)"
      ></svg-icon>
      <svg-icon name="star-o" class="star-o-icon" @click.stop="handelAddFavorite" v-else></svg-icon>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'

import { APIlistFavorite, APIaddFavorite, APIdeleteFavorite } from '@/api/coinWalletDetails'

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

const chainId = computed(() => globalStore.walletInfo.chainId)
const customWalletInfo = computed(() => globalStore.customWalletInfo)
const address = computed(() => globalStore.walletInfo.address)
const walletType = computed(() => globalStore.walletInfo.walletType)

const chainConfigs = useChainConfigsStore().chainConfigs

const handelAddFavorite = async () => {
  const res = await APIaddFavorite({
    chainCode: props.coinInfo.chainCode,
    pairAddress: props.coinInfo.pairAddress,
    walletAddress:
      walletType.value == 'Email' ? customWalletInfo.value.walletInfo?.wallet : address.value
  })
  res && getListFavorite()
}

const handelDeleteFavorite = async () => {
  const res = await APIdeleteFavorite({
    chainCode: props.coinInfo.chainCode,
    pairAddress: props.coinInfo.pairAddress,
    walletAddress:
      walletType.value == 'Email' ? customWalletInfo.value.walletInfo?.wallet : address.value
  })

  res && getListFavorite()
}

const getListFavorite = async () => {
  const res = await APIlistFavorite({
    chainCode:
      walletType.value == 'Email'
        ? customWalletInfo.value.chainCode
        : chainConfigs.find((item: any) => item.chainId == chainId.value)?.chainCode,
    walletAddress:
      walletType.value == 'Email' ? customWalletInfo.value.walletInfo?.wallet : address.value
  })
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
}
.star-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  color: #e89f13;
  display: block;
}
</style>
