<template>
  <div class="fund-tab-content">
    <div class="display-flex flex-direction-col">
      <span class="fund-label">{{ i18n.t('kChart.InflowHistory') }}</span>
      <div id="fund-echarts" ref="fundechartContainer"></div>
    </div>

    <div class="display-flex align-items-fs justify-content-sp buying-selling-box">
      <div class="buying-selling-ratio">
        <el-table :data="props.flowGroupInfo.flowGroup">
          <el-table-column prop="rowno" :label="i18n.t('kChart.Type')" width="60px">
            <template #default="scope">
              <div class="display-flex align-items-center text-color">
                {{ customerType[scope.row.rowno] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="amountIn" :label="i18n.t('kChart.Buy')">
            <template #default="scope">
              <span class="up-color">{{ numberFormat(scope.row.amountIn) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inPer" :label="i18n.t('kChart.Proportion')" width="100px">
            <template #default="scope">
              <span class="text-color">{{ scope.row.inPer }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="amountOut" :label="i18n.t('kChart.Sell')">
            <template #default="scope">
              <span class="down-color">{{ numberFormat(scope.row.amountOut) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="outPer" :label="i18n.t('kChart.Proportion')" width="100px">
            <template #default="scope">
              <span class="text-color">{{ scope.row.outPer }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="net" :label="i18n.t('kChart.NetInflow') + '($)'" width="120px">
            <template #default="scope">
              <span class="down-color" v-if="scope.row.net < 0 || scope.row.net == '-'"
                >-{{ numberFormat(Math.abs(Number(scope.row.net))) }}</span
              >
              <span class="up-color" v-else>{{ numberFormat(scope.row.net) }}</span>
            </template>
          </el-table-column>
          <template #empty>
            <empty-data></empty-data>
          </template>
        </el-table>
        <div
          class="buying-selling—contrast display-flex align-items-center"
          v-if="inflow != 0 && outflow != 0"
        >
          <div
            class="contrast——inflow display-flex flex-direction-col"
            :style="{ width: (inflow / (inflow + outflow)) * 100 + '%' }"
          >
            <strong></strong>
            <span>{{ i18n.t('kChart.Inflow') }} ${{ numberFormat(inflow) }}</span>
          </div>
          <div
            class="contrast——outflow display-flex flex-direction-col"
            :style="{ width: (outflow / (inflow + outflow)) * 100 + '%' }"
          >
            <strong></strong>
            <span>{{ i18n.t('kChart.Outflow') }} -${{ numberFormat(outflow) }}</span>
          </div>
        </div>
      </div>
      <!-- <div class="buying-selling-top">
        <div class="buying-selling-items display-flex align-items-center">
          <div
            :class="
              buyingSellingTopIndex == item.id
                ? 'buying-selling-item buying-selling-item-active'
                : 'buying-selling-item'
            "
            v-for="item in buyingSellingTopData"
            :key="item.id"
            @click="handelBuyingSellingTopSelect(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <el-skeleton style="width: 100%" :loading="props.topNetInfo.loading" animated>
          <template #template>
            <el-skeleton-item
              variant="text"
              style="height: 30px; margin: 4.4px 0"
              v-for="item in 10"
              :key="item"
            />
          </template>
          <template #default>
            <el-table
              :data="props.topNetInfo.TopNet"
              v-if="buyingSellingTopIndex == 0"
              max-height="650px"
            >
              <el-table-column prop="net" :label="i18n.t('kChart.NetBuy')">
                <template #default="scope">
                  <span>{{ numberFormat(scope.row.net) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" :label="i18n.t('kChart.BuyPrice')">
                <template #default="scope">
                  <span class="up-color">{{ numberFormat(scope.row.amount || 0) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="walletAddress" :label="i18n.t('kChart.Holder')" width="120">
                <template #default="scope">
                  <span>{{ shortifyAddress(scope.row.walletAddress) }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="props.topNetInfo.TopNet"
              v-if="buyingSellingTopIndex == 1"
              max-height="650px"
            >
              <el-table-column prop="net" :label="i18n.t('kChart.NetSell')">
                <template #default="scope">
                  <span>{{ numberFormat(scope.row.net) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" :label="i18n.t('kChart.SellPrice')">
                <template #default="scope">
                  <span class="down-color">{{ numberFormat(scope.row.amount || 0) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="walletAddress" :label="i18n.t('kChart.Holder')" width="120">
                <template #default="scope">
                  <span>{{ shortifyAddress(scope.row.walletAddress) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-skeleton>
        <el-skeleton style="width: 100%" :loading="props.topProfitInfo.loading" animated>
          <template #template>
            <el-skeleton-item
              variant="text"
              style="height: 30px; margin: 4.4px 0"
              v-for="item in 10"
              :key="item"
            />
          </template>
          <template #default>
            <el-table
              :data="props.topProfitInfo.TopProfit"
              v-if="buyingSellingTopIndex == 2"
              max-height="650px"
            >
              <el-table-column prop="in" :label="i18n.t('kChart.NetProfit')">
                <template #default="scope">
                  <span>{{ numberFormat(scope.row.in) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="profit" :label="i18n.t('kChart.ProfitPrice')">
                <template #default="scope">
                  <span class="up-color">{{ numberFormat(scope.row.profit) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="walletAddress" :label="i18n.t('kChart.Holder')" width="120">
                <template #default="scope">
                  <span>{{ shortifyAddress(scope.row.walletAddress) }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="props.topProfitInfo.TopProfit"
              v-if="buyingSellingTopIndex == 3"
              max-height="650px"
            >
              <el-table-column prop="out" :label="i18n.t('kChart.NetLose')">
                <template #default="scope">
                  <span>{{ numberFormat(scope.row.out) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="profit" :label="i18n.t('kChart.LosePrice')">
                <template #default="scope">
                  <span class="down-color">{{ numberFormat(scope.row.profit) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="walletAddress" :label="i18n.t('kChart.Holder')" width="120">
                <template #default="scope">
                  <span>{{ shortifyAddress(scope.row.walletAddress) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-skeleton>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, inject, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { numberFormat, shortifyAddress } from '@/utils'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const customerType: any = {
  3: i18n.t('kChart.Whale'),
  2: i18n.t('kChart.Normal'),
  1: i18n.t('kChart.other')
}

const props = defineProps({
  flowGroupInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  listPeriodInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  topNetInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  topProfitInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const inflow = computed(() => {
  let num = 0
  props.flowGroupInfo?.flowGroup?.forEach((item: any) => {
    num += parseFloat(item.amountIn)
  })
  return num
})

const outflow = computed(() => {
  let num = 0
  props.flowGroupInfo?.flowGroup?.forEach((item: any) => {
    num += parseFloat(item.amountOut)
  })
  return num
})

// 获取 echart 挂载的DOM节点
const fundechartContainer = ref()
const fundChart = ref<any>(null)
// 通过 inject 接收 Echarts
const Echarts = inject('$echarts')

// echarts初始化
const initEcharts = () => {
  fundChart.value = (Echarts as any).init(fundechartContainer.value)
  const option = {
    // 自定义echarts图标相关配置
    color: ['#34A853', '#EA3943'],
    grid: {
      left: '2%', // 距离左侧的距离
      right: '2%', // 距离右侧的距离
      top: '10%', // 距离顶部的距离
      bottom: '2%', // 距离底部的距离
      containLabel: true // 包含坐标轴的标签
    },
    xAxis: {
      type: 'category',
      data: props.listPeriodInfo.chartx,
      boundaryGap: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value: any, index: any) {
          return numberFormat(value)
        }
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        data: props.listPeriodInfo.chartIn,
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.05
        }
      },
      {
        type: 'line',
        data: props.listPeriodInfo.chartOut,
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.05
        }
      }
    ]
  }

  fundChart.value.setOption(option)
  // fundChart.resize()
}
const buyingSellingTopData = [
  {
    name: i18n.t('kChart.Buyer'),
    id: 0
  },
  {
    name: i18n.t('kChart.Seller'),
    id: 1
  },
  {
    name: i18n.t('kChart.Gainer'),
    topNum: 50,
    id: 2
  },
  {
    name: i18n.t('kChart.Loser'),
    id: 3
  }
]
const buyingSellingTopIndex = ref(0)
const emit = defineEmits(['buyingSellingTopSelect'])
const handelBuyingSellingTopSelect = async (item: { id: number }) => {
  buyingSellingTopIndex.value = item.id
  emit('buyingSellingTopSelect', item.id)
}

watch(
  () => props.listPeriodInfo,
  (value) => {
    fundChart.value.dispose()
    initEcharts()
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    initEcharts()
    window.addEventListener('resize', initEcharts)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', initEcharts)
})
</script>
<style lang="scss" scoped>
.fund-tab-content {
  width: 100%;
  .fund-label {
    font-size: 14px;
    color: var(--font-color-default);
    margin-bottom: 12px;

    font-style: normal;
  }
  #fund-echarts {
    width: 100%;
    height: 200px;
  }
  .buying-selling-box {
    margin-top: 10px;
  }
  .buying-selling-ratio {
    width: 100%;
    padding: 8px 4px;
    border-radius: 8px;
    .buying-selling—contrast {
      margin-top: 16px;
      padding: 0 12px;
      font-size: 12px;
      .contrast——inflow {
        color: #34a853;
        min-width: 5%;
        margin-right: 8px;
        strong {
          display: block;
          width: 100%;
          height: 8px;
          border-radius: 4px 0px 0px 4px;
          background: #34a853;
          font-weight: normal;
        }
      }
      .contrast——outflow {
        text-align: right;
        color: #ea3943;
        min-width: 5%;
        strong {
          display: block;
          width: 100%;
          height: 8px;
          border-radius: 0px 4px 4px 0px;
          background: #ea3943;
          font-weight: normal;
        }
      }
    }
  }
  .buying-selling-top {
    width: 39%;
    .buying-selling-items {
      padding: 2px;
      border-radius: 6px;
      margin-bottom: 4px;
      background-color: var(--bg-color);
      .buying-selling-item {
        flex: 1;
        padding: 4px 8px;
        border-radius: 4px;
        color: var(--dex-color-4);
        font-size: 12px;
        cursor: pointer;
        text-align: center;
        white-space: nowrap;
      }
      .buying-selling-item-active {
        color: var(--font-color-default);
        background: var(--tab-bg-color);
      }
    }
  }
}
</style>
