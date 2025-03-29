<template>
  <section class="currency-dashboard display-flex align-items-center">
    <div class="tabs display-flex align-items-center" id="tab-items">
      <vue-draggable-next
        v-model="currencyDashboard"
        @end="onEnd"
        :sort="true"
        :animation="100"
        force-fallback="true"
        class="display-flex align-items-center"
        id="drag-box"
      >
        <div
          class="display-flex align-items-center tab-item"
          :class="item.pairAddress == chainInfo.pairAddress ? 'tab-item-cur' : ''"
          v-for="(item, index) in currencyDashboard"
          :key="index"
          @click="handelJump(item)"
        >
          <el-icon
            v-if="item.pairAddress == chainInfo.pairAddress"
            size="18"
            style="margin-right: 12px"
            ><Fold
          /></el-icon>
          <div class="display-flex align-items-center">
            <span class="logo">
              <el-image :src="item.logo" alt="" class="baseInfo-img">
                <template #error>
                  <svg-icon name="logo1" class="baseInfo-img"></svg-icon>
                </template>
              </el-image>
              <svg-icon :name="'coin' + item.chainCode" class="chainCode"></svg-icon>
            </span>
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center coin-text font-family-Heavy">
                <span>{{ MAIN_COIN[item.baseSymbol] || item.baseSymbol || '-' }}</span>
                <span class="coin-sub-txt">/{{ item.quoteSymbol || '-' }}</span>
              </div>
              <div class="display-flex align-items-center font-family-Heavy">
                <span
                  :class="item.increase[0] === '-' ? 'price-txt down-color' : 'price-txt up-color'"
                  >${{
                    MAIN_COIN[item.baseSymbol]
                      ? numFormat(item.price || 0)
                      : numberFormat(item.price || 0)
                  }}</span
                >
                <PercentageNotbg :value="item.increase" />
              </div>
            </div>
          </div>
          <el-icon
            size="18"
            style="margin-left: 18px"
            v-if="item.pairAddress == chainInfo.pairAddress && currencyDashboard.length > 1"
            @click.stop="handelRemove(item, index)"
            ><Close
          /></el-icon>
        </div>
      </vue-draggable-next>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { MAIN_COIN } from '@/types'
import { numberFormat, numFormat } from '@/utils'
import { useRouter } from 'vue-router'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useGlobalStore } from '@/stores/global'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import { VueDraggableNext } from 'vue-draggable-next'

const router = useRouter()
const useChainInfo = useChainInfoStore()
const globalStore = useGlobalStore()
const chainInfo = computed(() => useChainInfo.chainInfo)
const currencyDashboard = computed(() => globalStore.currencyDashboard)

const handelJump = (item: any) => {
  router.push(`/k/${item.pairAddress}?chainCode=${item.chainCode}`)
}

const handelRemove = (params: any, index: number) => {
  const info = index == 0 ? currencyDashboard.value[1] : currencyDashboard.value[index - 1]
  const arr = currencyDashboard.value.filter((item: any) => item.pairAddress !== params.pairAddress)
  globalStore.delCurrencyDashboard(arr)
  handelJump(info)
}

const onEnd = (evt: any) => {
  const { newIndex, oldIndex } = evt
  const arr = JSON.parse(JSON.stringify(currencyDashboard.value))
  const movedItem = arr.splice(oldIndex, 1)[0]
  arr.splice(newIndex, 0, movedItem)
  globalStore.delCurrencyDashboard(arr)
}

const currencyDashboardOperate = () => {
  const tabItems = document.getElementById('tab-items')
  if (tabItems) {
    const tabWidth = tabItems.clientWidth - 260
    const itemWidth = 200
    const itemCount = Math.floor(tabWidth / itemWidth)
    if (itemCount + 1 <= currencyDashboard.value.length) {
      globalStore.delCurrencyDashboard(currencyDashboard.value.slice(-(itemCount + 1)))
    }
  }
}

// 创建一个ResizeObserver实例，并定义回调函数
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // 处理元素大小变化
    const { width } = entry.contentRect
    if (width) {
      currencyDashboardOperate()
    }
  }
})

// 检查 dragBox 是否为 null
onMounted(() => {
  // 监听元素大小变化
  // 选择需要监听的元素
  const dragBox = document.getElementById('drag-box')
  if (dragBox) {
    resizeObserver.observe(dragBox)
  }

  window.addEventListener('resize', currencyDashboardOperate)
})

onUnmounted(() => {
  // 停止监听元素大小变化
  const dragBox = document.getElementById('drag-box')
  if (dragBox) {
    resizeObserver.unobserve(dragBox)
  }
  window.removeEventListener('resize', currencyDashboardOperate)
})
</script>

<style scoped lang="scss">
.currency-dashboard {
  width: calc(100vw - 300px);
  height: 56px;
  border-bottom: 1px solid rgba(38, 40, 44, 0.3);
  .tabs {
    width: 100%;
    overflow: hidden;
    overflow-x: scroll;
    scroll-behavior: smooth; /* 添加平滑滚动 */
  }
  .tab-item {
    padding: 8px 10px;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    justify-content: space-between;
    width: 200px;
  }
  .tab-item:active {
    cursor: grabbing;
  }
  .tab-item-cur {
    width: 260px;
    background-color: rgba(58, 60, 64, 0.4);
  }
  .logo {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    position: relative;
    .chainCode {
      width: 18px;
      height: 18px;
      position: absolute;
      right: -2px;
      bottom: -2px;
    }
  }
  .baseInfo-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .price-txt {
    margin-right: 8px;
  }
  .coin-text {
    white-space: nowrap;
  }
}
</style>
