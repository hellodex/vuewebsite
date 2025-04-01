<template>
  <el-drawer
    v-model="drawVisible"
    :before-close="handleClose"
    title="挂单交易"
    direction="rtl"
    size="300"
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
  color: #cacad5;
  .draw-content {
    .trading-tab {
      justify-content: center;
      margin-bottom: 12px;
      padding: 2px;
      border-radius: 4px;
      border: 1px solid #1c1c1c;
      .trading-tab-item {
        height: 29px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: #848e9c;
        cursor: pointer;
        border-radius: 4px;
        font-family: 'PingFangSC-Medium';
        background: rgba(34, 36, 41, 0.7);
        border: 1px solid rgba(34, 36, 41, 0.7);
      }
      .trading-tab-item:nth-child(2) {
        margin: 0 4px;
      }
      .active {
        color: #f5f5f5;
        background-color: rgba(58, 60, 64, 0.2);
        border: 1px solid rgba(58, 60, 64, 0.7);
      }
      .cur3 {
        color: var(--up-color);
        background-color: rgba(46, 189, 133, 0.2);
        border: 1px solid rgba(46, 189, 133, 0.7);
      }
      .cur4 {
        color: var(--down-color);
        background-color: rgba(246, 70, 93, 0.2);
        border: 1px solid rgba(246, 70, 93, 0.7);
      }
    }
  }
}
</style>
