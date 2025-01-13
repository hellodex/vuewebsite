<template>
  <section class="tool-box">
    <swiper
      :modules="modules"
      :slides-per-view="5"
      :space-between="0"
      :centeredSlides="true"
      :loop="true"
      navigation
      @slideChangeTransitionEnd="onSlideChangeTransitionEnd"
      class="tool-navigation-swiper"
    >
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="coins-stacked-03" class="icon" style="color: #f5841f"></svg-icon>
          <span>{{ i18n.t('tool.TokenBatchingSending') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="credit-card-download" class="icon" style="color: #14c784"></svg-icon>
          <span>{{ i18n.t('tool.TokenBatchCollection') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="stars-01" class="icon" style="color: #c157d2"></svg-icon>
          <span>{{ i18n.t('tool.RareAddressGenerator') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="piggy-bank-02" class="icon" style="color: #627eea"></svg-icon>
          <span>{{ i18n.t('tool.BatchBalanceQuery') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="coins-swap-01" class="icon" style="color: #2ae6f2"></svg-icon>
          <span>{{ i18n.t('tool.WalletManyToManyTransfer') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="coins-stacked-03" class="icon" style="color: #f5841f"></svg-icon>
          <span>{{ i18n.t('tool.TokenBatchingSending') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="credit-card-download" class="icon" style="color: #14c784"></svg-icon>
          <span>{{ i18n.t('tool.TokenBatchCollection') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="stars-01" class="icon" style="color: #c157d2"></svg-icon>
          <span>{{ i18n.t('tool.RareAddressGenerator') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="piggy-bank-02" class="icon" style="color: #627eea"></svg-icon>
          <span>{{ i18n.t('tool.BatchBalanceQuery') }}</span>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="slide-content display-flex align-items-center flex-direction-col justify-content-center"
        >
          <svg-icon name="coins-swap-01" class="icon" style="color: #2ae6f2"></svg-icon>
          <span>{{ i18n.t('tool.WalletManyToManyTransfer') }}</span>
        </div>
      </swiper-slide>
    </swiper>

    <div class="tool-content-box display-flex align-items-center flex-direction-col">
      <el-icon color="#343434" :size="24"><CaretBottom /></el-icon>
      <div class="tool-content display-flex align-items-center flex-direction-col">
        <BatchTokenSend v-if="[0, 5].includes(activeIndex)" />
        <BatchTokenImputation v-else-if="[1, 6].includes(activeIndex)" />
        <WalletBeautifulNumber v-else-if="[2, 7].includes(activeIndex)" />
        <BatchCheckTokenBalance v-else-if="[3, 8].includes(activeIndex)" />
        <WalletManyToManyTransfer v-else-if="[4, 9].includes(activeIndex)" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import BatchTokenSend from '@/components/Tools/BatchTokenSend.vue'
import BatchTokenImputation from '@/components/Tools/BatchTokenImputation.vue'
import WalletBeautifulNumber from '@/components/Tools/WalletBeautifulNumber.vue'
import BatchCheckTokenBalance from '@/components/Tools/BatchCheckTokenBalance.vue'
import WalletManyToManyTransfer from '@/components/Tools/WalletManyToManyTransfer.vue'

import { Navigation, Controller } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'

const modules = [Navigation, Controller]
const activeIndex = ref<number>(0)
const onSlideChangeTransitionEnd = (swiper: any) => {
  console.log(swiper.realIndex)
  activeIndex.value = swiper.realIndex
}

const i18n = useI18n()
</script>

<style lang="scss" scoped>
.tool-box {
  width: 1280px;
  margin: 33px auto;

  :deep(.tool-navigation-swiper) {
    padding: 0 40px;
    .swiper-slide {
      height: 98px;
      padding: 10px 12px;
      border-radius: 12px;
      background: var(--card-bg-color);
      transition: 300ms;
      transform: scale(0.9);
      .slide-content {
        width: 100%;
        height: 100%;
      }
      .icon {
        width: 18px;
        height: 18px;
        margin-bottom: 2px;
      }
      span {
        color: var(--font-color-default);
        font-size: 16px;
        white-space: nowrap;
      }
    }
    .swiper-slide-active,
    .swiper-slide-duplicate-active {
      transform: scale(1);
      background-color: #1e1e1e;
    }

    .swiper-button-prev,
    .swiper-button-next {
      width: 45px;
      height: 100%;
      background-color: var(--bg-color);
    }
    .swiper-button-prev {
      top: calc(50% - 28px);
      left: 0;
    }
    .swiper-button-next {
      top: calc(50% - 28px);
      right: 0;
    }
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 18px;
      width: 40px;
      height: 40px;
      padding: 8px;
      background: var(--card-bg-color);
      border-radius: 99px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .tool-content-box {
    width: 480px;
    margin: 20px auto 0;
    .tool-content {
      margin-top: 16px;
    }
  }
}
</style>
