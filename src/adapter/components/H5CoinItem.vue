<template>
  <div class="tabs-content">
    <div class="tabs-content-head display-flex align-items-center justify-content-sp">
      <span>{{ i18n.t('h5.CoinName') }}</span>
      <span>{{ i18n.t('h5.PoolVol') }}</span>
      <span>{{ i18n.t('h5.CurrentPrice') }}($)</span>
    </div>
    <div class="tabs-content-main display-flex flex-direction-col">
      <div
        class="tabs-content-item"
        v-for="(item, index) in props.list"
        :key="index"
        @click="handelItem(item)"
        :class="item.riseAndFall"
      >
        <div class="display-flex align-items-center tabs-first">
          <div class="logo">
            <el-image :src="item.logo" alt="" class="img">
              <template #error>
                <svg-icon name="logo1" class="img"></svg-icon>
              </template>
            </el-image>
            <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
          </div>
          <div>
            <p class="display-flex align-items-center symbol">
              <span>{{ item.baseTokenSymbol }}</span>
              <span>/{{ item.quoteTokenSymbol }}</span>
            </p>
            <span class="address">{{ shortifyAddress(item.pairAddress) }}</span>
          </div>
        </div>
        <div class="display-flex flex-direction-col tabs-center">
          <span>{{ numberFormat(item.tradeTvl) }}</span>
          <span>{{ numberFormat(item.tvl) }}</span>
        </div>
        <div class="display-flex flex-direction-col tabs-last">
          <span>{{ numberFormat(item.price) }}</span>
          <PercentageChange :value="item.chg || 0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { shortifyAddress, numberFormat } from '@/utils'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from 'vue-i18n'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'

const i18n = useI18n()
const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore

const emit = defineEmits(['handelItemClick'])

const props: any = defineProps({
  list: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const handelItem = (item: any) => {
  emit('handelItemClick', item)
}
</script>

<style lang="scss" scoped>
.tabs-content {
  padding: 0.4267rem;
}
.tabs-content-head {
  span {
    color: #9c9c9c;
    font-size: 0.3733rem;
    text-align: right;
    white-space: nowrap;
  }
  span:first-child {
    width: 4.3733rem;
    text-align: left;
  }
  span:last-child {
    width: 2.9467rem;
  }
}
.tabs-content-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2133rem 0;
  color: #202020;
  cursor: pointer;
  .logo {
    width: 0.8533rem;
    height: 0.8533rem;
    position: relative;
    margin-right: 0.2667rem;
  }
  .img {
    width: 0.8533rem;
    height: 0.8533rem;
    border-radius: 50%;
  }
  .chainCode {
    width: 0.32rem;
    height: 0.32rem;
    position: absolute;
    right: -1px;
    bottom: -1px;
  }
  .tabs-first {
    width: 4.3733rem;
    justify-content: flex-start;
  }
  .tabs-center,
  .tabs-last {
    justify-content: center;
    align-items: flex-end;
  }
  .tabs-last {
    width: 2.9467rem;
  }
  .symbol {
    font-size: 0.3733rem;
    span {
      white-space: nowrap;
    }
    span:last-child {
      color: #9c9c9c;
    }
  }
  .address {
    font-size: 0.32rem;
    color: #9c9c9c;
  }
  .tabs-center {
    font-size: 0.3733rem;
    span:last-child {
      font-size: 0.32rem;
      color: #9c9c9c;
    }
  }
  .tabs-last {
    span:first-child {
      font-size: 0.3733rem;
      word-break: break-all;
    }
    span:last-child {
      font-size: 0.32rem;
      padding: 0.0267rem 0.1333rem;
      border-radius: 0.1067rem;
    }
    .red {
      background-color: rgba(234, 57, 67, 0.16);
      color: var(--down-color);
    }
    .green {
      background-color: rgba(20, 199, 132, 0.16);
      color: var(--up-color);
    }
  }
}
</style>
