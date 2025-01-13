<template>
  <div class="holdingCoinsTab-tab-content display-flex align-items-fs justify-content-sp">
    <div class="display-flex flex-direction-col holdingCoinsTab">
      <span class="holdingCoinsTab-label">{{ i18n.t('kChart.HolderDist') }}</span>
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
      <span class="holdingCoinsTab-label">{{ i18n.t('kChart.TopHolders') }}</span>
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
            <el-table-column prop="walletAddress" :label="i18n.t('kChart.Address')">
              <template #default="scope">
                <div class="display-flex align-items-center text-color">
                  {{ shortifyAddress(scope.row.walletAddress) }}
                </div>
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
      top: '20%',
      left: '0',
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
        center: ['60%', '50%'],
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
  .holdingCoinsTab-label {
    font-size: 14px;
    color: var(--font-color-default);
    margin-bottom: 12px;

    font-style: normal;
  }
  #holdingCoins-echarts {
    width: 450px;
    height: 175px;
  }
  .holdingCoinsTab-tabel {
    width: 60%;
  }
  .holdingCoinsTab {
    position: relative;
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
}
</style>
