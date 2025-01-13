<template>
  <div class="holdingCoinsTab-tab-content display-flex flex-direction-col">
    <div class="display-flex flex-direction-col holdingCoinsTab">
      <div id="holdingCoins-echarts" ref="echartContainer"></div>
      <div class="holdingCoins-info">
        <p class="display-flex align-items-center">
          <i></i>
          <span
            >币总数：{{ numberFormat(props.holdingCoinsTabInfo?.topHolders?.totalSupply) }}</span
          >
        </p>
        <p class="display-flex align-items-center">
          <i></i>
          <span
            >{{ props.holdingCoinsTabInfo?.name }}：{{
              parseFloat(props.holdingCoinsTabInfo?.topHolders?.topProPortion || 0).toFixed(2)
            }}%</span
          >
        </p>
      </div>
    </div>
    <div class="display-flex flex-direction-col holdingCoinsTab-tabel">
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
            :data="props.holdingCoinsTabInfo?.topHolders?.vos || []"
            :header-cell-style="{ background: '#f9f9f9' }"
            max-height="64vh"
            style="width: 100%"
          >
            <el-table-column label="#" width="30" align="center">
              <template #default="scope">
                <div class="display-flex align-items-center text-color">
                  {{ scope.$index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="渠道" width="50" align="center">
              <template #default="scope">
                <span class="text-color">{{ scope.row.per1 || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="余额" align="center">
              <template #default="scope">
                <span class="text-color">{{ numberFormat(scope.row.amount) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="per" label="占比" align="center">
              <template #default="scope">
                <span class="text-color">{{ numberFormat(scope.row.per) }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="walletAddress" label="用户" align="right">
              <template #default="scope">
                <span class="text-color">{{ shortifyAddress(scope.row.walletAddress) }} </span>
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
import { ref, inject, onMounted, watch, nextTick, computed } from 'vue'
import { numberFormat, shortifyAddress } from '@/utils'
import { useI18n } from 'vue-i18n'
import { formatter } from 'element-plus'

const i18n = useI18n()

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

const data = computed(() => {
  return [
    {
      value: parseFloat(props.holdingCoinsTabInfo?.topHolders?.topHold),
      name: props.holdingCoinsTabInfo.name + '总数'
    },
    {
      value:
        parseFloat(props.holdingCoinsTabInfo?.topHolders?.totalSupply) -
        parseFloat(props.holdingCoinsTabInfo?.topHolders?.topHold),
      name: i18n.t('kChart.other')
    }
  ]
})
// echarts初始化
const initEcharts = () => {
  holdingCoinsChart.value = (Echarts as any).init(echartContainer.value)
  const option = {
    // 自定义echarts图标相关配置
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        return `
          <div>
            <p>${params.seriesName}</p>
            <p>
              ${params.marker}
              <span>${params.name} ${numberFormat(params.value || 0)}</span>
            </p>
          </div>
        `
      }
    },
    color: ['#14C784', '#EFEFEF'],
    legend: {
      itemWidth: 8,
      itemHeight: 8,
      icon: 'circle',
      align: 'left',
      top: 'center',
      right: 'center',
      orient: 'vertical',
      textStyle: {
        color: '#828282'
      },
      formatter(name: string) {
        const target = data.value.find((item) => item.name === name)
        return `${name} ${numberFormat(target?.value || 0)}`
      }
    },
    series: [
      {
        name: i18n.t('kChart.HolderDist'),
        type: 'pie',
        radius: ['50%', '90%'],
        center: ['15%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: data.value
      }
    ]
  }
  holdingCoinsChart.value.setOption(option)
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
</script>
<style lang="scss" scoped>
.holdingCoinsTab-tab-content {
  :deep(.el-table) {
    font-size: 12px !important;
    tr,
    th.el-table__cell {
      background-color: #000 !important;
    }
    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border-bottom: 1px solid #000 !important;
    }
  }

  .holdingCoinsTab-label {
    font-size: 14px;
    color: var(--font-color-default);
    margin-bottom: 12px;

    font-style: normal;
  }
  #holdingCoins-echarts {
    width: 100%;
    height: 2.6667rem;
  }
  .holdingCoinsTab-tabel {
    width: 100%;
  }
  .holdingCoinsTab {
    position: relative;
    padding: 0.32rem;
  }
  .holdingCoins-info {
    position: absolute;
    right: 12px;
    top: calc(50% - 18px);
    color: var(--dex-color-4);
    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #e89f13;
      margin-right: 8px;
    }
  }
}
</style>
