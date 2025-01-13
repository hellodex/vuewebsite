<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <van-tabbar route fixed :z-index="9" active-color="#202020" inactive-color="#9C9C9C">
    <van-tabbar-item replace to="/">
      <span class="text">{{ i18n.t('h5.Home') }}</span>
      <template #icon>
        <svg-icon
          :name="props.active == 0 ? 'h5-home-cur' : 'h5-home'"
          class="tabbar-icon"
        ></svg-icon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/Market">
      <span class="text">{{ i18n.t('h5.Market') }}</span>
      <template #icon>
        <svg-icon
          :name="props.active == 1 ? 'h5-market-cur' : 'h5-market'"
          class="tabbar-icon"
        ></svg-icon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/trade/0x46cf1cf8c69595804ba91dfdd8d6b960c9b0a7c4?chainCode=BSC">
      <span class="text">{{ i18n.t('home.swap') }}</span>
      <template #icon>
        <svg-icon
          :name="props.active == 2 ? 'h5-transaction-cur' : 'h5-transaction'"
          class="tabbar-icon"
        ></svg-icon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/Inscription">
      <span class="text">Pump</span>
      <template #icon>
        <svg-icon
          :name="props.active == 3 ? 'h5-inscription-cur' : 'h5-inscription'"
          class="tabbar-icon"
        ></svg-icon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/Wallet">
      <span class="text">{{ i18n.t('h5.Wallet') }}</span>
      <template #icon>
        <svg-icon
          :name="props.active == 4 ? 'h5-wallet-cur' : 'h5-wallet'"
          class="tabbar-icon"
        ></svg-icon>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const props = defineProps({
  active: {
    type: Number,
    default: 0
  }
})
</script>
<style lang="scss" scoped>
.tabbar-icon {
  width: 0.48rem;
  height: 0.48rem;
}
.color {
  color: #202020;
}
</style>
