<template>
  <el-drawer
    v-model="drawVisible"
    :before-close="handleClose"
    title="挂单交易"
    direction="rtl"
    size="360"
    class="draw-box"
  >
    <div class="draw-content">
      <div class="trading-tab display-flex align-items-center">
        <div
          v-for="item in tradeTabList"
          :key="item.id"
          :class="
            tradeTabIndex == item.id ? `active trading-tab-item cur${item.id}` : 'trading-tab-item'
          "
          @click="handelTradeTab(item)"
        >
          <span>{{ item.name }}</span>
          <strong style="line"></strong>
        </div>
      </div>
      <OneClickTrading
        v-if="tradeTabIndex == 1"
        :coinInfo="props.coinInfo"
        :pairInfo="props.pairInfo"
      />
      <BuyLimit v-if="tradeTabIndex == 3" :coinInfo="props.coinInfo" :pairInfo="props.pairInfo" />
      <SellLimit v-if="tradeTabIndex == 4" :coinInfo="props.coinInfo" :pairInfo="props.pairInfo" />
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import OneClickTrading from '@/components/SideBar/components/OneClickTrading.vue'
import BuyLimit from '@/components/SideBar/components/BuyLimit.vue'
import SellLimit from '@/components/SideBar/components/SellLimit.vue'
import { useGlobalStore } from '@/stores/global'
const globalStore = useGlobalStore()

const walletType = computed(() => globalStore.walletInfo.walletType)

const emit = defineEmits(['close'])

const props: any = defineProps({
  tradeDrawVisible: {
    required: true,
    type: [Boolean],
    default: false
  },
  coinInfo: {
    required: true,
    type: Object
  },
  pairInfo: {
    required: true,
    type: Object
  }
})

const drawVisible: any = computed({
  // getter
  get() {
    return props.tradeDrawVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})

const tradeTabList = computed(() => {
  return walletType.value == 'Email'
    ? [
        {
          name: '一键交易',
          id: 1
        },
        {
          name: '买入',
          id: 3
        },
        {
          name: '卖出',
          id: 4
        }
      ]
    : [
        {
          name: '一键交易',
          id: 1
        }
      ]
})

const tradeTabIndex = ref(1)

const handelTradeTab = (item: any) => {
  tradeTabIndex.value = item.id
}

const handleClose = () => {
  emit('close', false)
}
</script>
<style lang="scss">
.draw-box {
  background-color: var(--card-bg-color);
  .draw-content {
    .trading-tab {
      border-radius: 8px;
      justify-content: center;
      margin-bottom: 20px;
      padding: 2px;
      background-color: var(--bg-color);
      .trading-tab-item {
        height: 35px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: var(--dex-color-4);
        cursor: pointer;
        border-radius: 6px;
      }
      .active {
        color: var(--font-color-default);
        background-color: var(--hover-bg-color);
      }
      .cur3 {
        background-color: var(--up-color);
      }
      .cur4 {
        background-color: var(--down-color);
      }
    }
  }
}
</style>
