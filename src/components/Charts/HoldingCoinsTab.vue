<template>
  <div class="holdingCoinsTab-tab-content display-flex align-items-fs justify-content-sp">
    <div class="display-flex flex-direction-col holdingCoinsTab">
      <span class="holdingCoinsTab-label">{{ i18n.t('kChart.HolderDist') }}</span>
      <div id="holdingCoins-echarts" ref="echartContainer"></div>
    </div>
    <div class="display-flex flex-direction-col holdingCoinsTab-tabel">
      <div class="display-flex align-items-center justify-content-sp" style="margin-bottom: 12px">
        <span class="holdingCoinsTab-label">{{ i18n.t('kChart.TopHolders') }}</span>
        <div class="holdingCoinsTab-items display-flex align-items-center">
          <div
            :class="topIndex == item.topNum ? 'item item-active' : 'item'"
            v-for="item in topData"
            :key="item.id"
            @click="handelTopSelect(item)"
          >
            {{ item.topName }}
          </div>
        </div>
      </div>
      <el-skeleton style="width: 100%" :loading="props.holdingCoinsTabInfo.loading" animated>
        <template #template>
          <el-skeleton-item
            variant="text"
            style="height: 30px; margin: 4.4px 0"
            v-for="item in 15"
            :key="item"
          />
        </template>
        <template #default>
          <el-table
            :data="props.holdingCoinsTabInfo?.topHolders?.tableData || []"
            :header-cell-style="{ background: '#f9f9f9' }"
            max-height="890px"
          >
            <el-table-column :label="i18n.t('kChart.Rank')" width="80">
              <template #default="scope">
                <div class="display-flex align-items-center text-color">
                  {{ scope.$index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="per" :label="i18n.t('kChart.Ratio')">
              <template #default="scope">
                <span class="text-color">{{ numberFormat(scope.row.per) }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" :label="i18n.t('kChart.Position')">
              <template #default="scope">
                <span class="text-color">{{ numberFormat(scope.row.amount) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="walletAddress" :label="i18n.t('kChart.Address')" width="150">
              <template #default="scope">
                <div class="display-flex align-items-center text-color" style="margin-bottom: 4px">
                  {{ shortifyAddress(scope.row.walletAddress) }}
                  <svg-icon name="copy" class="copy" v-copy="scope.row.walletAddress"></svg-icon>
                </div>
                <el-progress :percentage="parseFloat(scope.row.per)" color="#D9D9D9"></el-progress>
              </template>
            </el-table-column>
            <template #empty>
              <empty-data></empty-data>
            </template>
          </el-table>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, inject, onMounted, watch, nextTick, computed, onUnmounted } from 'vue'
import { numberFormat, shortifyAddress } from '@/utils'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const emit = defineEmits(['topSelect'])

const topData = [
  {
    topName: 'Top 10',
    topNum: 10,
    id: 1
  },
  {
    topName: 'Top 20',
    topNum: 20,
    id: 2
  },
  {
    topName: 'Top 50',
    topNum: 50,
    id: 3
  },
  {
    topName: 'Top 100',
    topNum: 100,
    id: 4
  }
]

const topIndex = ref(10)

const handelTopSelect = (item: { topNum: number; topName: string }) => {
  topIndex.value = item.topNum
  emit('topSelect', item)
}

const props = defineProps({
  holdingCoinsTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

// 获取 echart 挂载的DOM节点
const echartContainer = ref()
const holdingCoinsChart = ref<any>(null)
// 通过 inject 接收 Echarts
const Echarts = inject('$echarts')

const lineData = computed(() => {
  return props.holdingCoinsTabInfo?.topHolders?.vos?.map((item: any) => item.per) || []
})
// echarts初始化
const initEcharts = () => {
  holdingCoinsChart.value = (Echarts as any).init(echartContainer.value)
  const option = {
    color: ['#8979FF', '#FF928A', '#3CC3DF', '#FFAE4C'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Top10', 'Top20', 'Top50', 'Top100'],
      bottom: '0',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '1%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: 'Top10',
        type: 'line',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(137, 121, 255, 0.9)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(137, 121, 255, 0.1)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: lineData.value?.filter((item: any, index: number) => index < 10)
      },
      {
        name: 'Top20',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 146, 138, 0.9)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(255, 146, 138, 0.1)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: lineData.value?.filter((item: any, index: number) => index < 20)
      },
      {
        name: 'Top50',
        type: 'line',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(60, 195, 223, 0.9)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(60, 195, 223, 0.1)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: lineData.value?.filter((item: any, index: number) => index < 50)
      },
      {
        name: 'Top100',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 174, 76, 0.9)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(255, 174, 76, 0.1)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: lineData.value?.filter((item: any, index: number) => index < 100)
      }
    ]
  }
  holdingCoinsChart.value.setOption(option)
}

const resizeChart = () => {
  if (holdingCoinsChart.value) {
    holdingCoinsChart.value.resize()
  }
}

watch(
  () => props.holdingCoinsTabInfo,
  (value) => {
    holdingCoinsChart.value.dispose()
    initEcharts()
  },
  { deep: true }
)
onMounted(() => {
  nextTick(() => {
    initEcharts()
  })
})

window.addEventListener('resize', resizeChart)

onUnmounted(() => {
  window.removeEventListener('resize', initEcharts)
})
</script>
<style lang="scss" scoped>
.holdingCoinsTab-tab-content {
  .holdingCoinsTab-items {
    padding: 2px;
    background: var(--bg-color);
    border-radius: 4px;
    border: 1px solid rgba(38, 40, 44, 0.3);
    .item {
      padding: 4px 8px;
      border-radius: 4px;
      background-color: transparent;
      color: #848e9c;
      font-size: 12px;
      cursor: pointer;
    }

    .item-active {
      color: var(--font-color-default);
      background: var(--tab-bg-color);
    }
  }
  .holdingCoinsTab-label {
    font-size: 14px;
    color: var(--font-color-default);
    font-style: normal;
    line-height: 32px;
  }
  #holdingCoins-echarts {
    width: 100%;
    height: 545.5px;
    border-radius: 8px;
    background: rgba(23, 24, 27, 0.3);
    padding: 32px 16px 16px 16px;
    margin-top: 12px;
    margin-right: 12px;
  }
  .holdingCoinsTab-tabel {
    width: 60%;
  }
  .holdingCoinsTab {
    position: relative;
    width: 38%;
  }
  .holdingCoins-info {
    position: absolute;
    left: 5px;
    top: 30px;
    color: var(--dex-color-4);
    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #e89f13;
      margin-right: 8px;
    }
  }
  .copy {
    width: 12px;
    min-width: 12px;
    height: 12px;
    margin-left: 6px;
    cursor: pointer;
  }

  :deep(.el-progress__text) {
    display: none;
  }
  :deep(.el-progress-bar__outer) {
    background-color: rgba(58, 60, 64, 0.4);
  }
}
</style>
