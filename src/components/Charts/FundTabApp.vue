<template>
  <div class="tabs-item">
    <div class="chart-box">
      <div class="tabs-head display-flex align-items-center justify-content-sp">
        <span class="left">资金流入</span>
        <div class="head-tab display-flex align-items-center">
          <span
            :class="timeIndex == item.id ? 'cur' : ''"
            v-for="item in timeTabList"
            :key="item.id"
            @click="handelChange(item)"
            >{{ item.timeLabel }}</span
          >
        </div>
      </div>
      <LineChart :chartData="chartData" />
    </div>
    <div class="flowGroup">
      <div class="flowGroup-table-head display-flex align-items-center">
        <span>类型</span>
        <span>买入</span>
        <span>占比</span>
        <span>卖出</span>
        <span>占比</span>
        <span>净流入</span>
      </div>
      <div class="flowGroup-table-body">
        <div class="display-flex align-items-center table-row">
          <span>巨鲸</span>
          <span class="up-color">
            {{ numberFormat(props.fundTabInfo?.fundsData?.flowGroup[2].amountIn) }}</span
          >
          <span> {{ props.fundTabInfo?.fundsData?.flowGroup[2].inPer }}%</span>
          <span class="down-color">
            {{ numberFormat(props.fundTabInfo?.fundsData?.flowGroup[2].amountOut) }}</span
          >
          <span> {{ props.fundTabInfo?.fundsData?.flowGroup[2].outPer }}%</span>
          <span
            class="down-color"
            v-if="
              props.fundTabInfo?.fundsData?.flowGroup[2].net < 0 ||
              props.fundTabInfo?.fundsData?.flowGroup[2].net == '-'
            "
            >-{{
              numberFormat(Math.abs(Number(props.fundTabInfo?.fundsData?.flowGroup[2].net)))
            }}</span
          >
          <span class="up-color" v-else>{{
            numberFormat(props.fundTabInfo?.fundsData?.flowGroup[2].net)
          }}</span>
        </div>
        <div class="display-flex align-items-center table-row">
          <span>中户</span>
          <span class="up-color">
            {{ numberFormat(props.fundTabInfo?.fundsData?.flowGroup[1].amountIn) }}</span
          >
          <span> {{ props.fundTabInfo?.fundsData?.flowGroup[1].inPer }}%</span>
          <span class="down-color">
            {{ numberFormat(props.fundTabInfo?.fundsData?.flowGroup[1].amountOut) }}</span
          >
          <span> {{ props.fundTabInfo?.fundsData?.flowGroup[1].outPer }}%</span>
          <span
            class="down-color"
            v-if="
              props.fundTabInfo?.fundsData?.flowGroup[1].net < 0 ||
              props.fundTabInfo?.fundsData?.flowGroup[1].net == '-'
            "
            >-{{
              numberFormat(Math.abs(Number(props.fundTabInfo?.fundsData?.flowGroup[1].net)))
            }}</span
          >
          <span class="up-color" v-else>{{
            numberFormat(props.fundTabInfo?.fundsData?.flowGroup[1].net)
          }}</span>
        </div>
        <div class="display-flex align-items-center table-row">
          <span>其他</span>
          <span> {{ numberFormat(props.fundTabInfo?.fundsData?.flowGroup[0].amountIn) }}</span>
          <span> {{ props.fundTabInfo?.fundsData?.flowGroup[0].inPer }}%</span>
          <span class="down-color">
            {{ numberFormat(props.fundTabInfo?.fundsData?.flowGroup[0].amountOut) }}</span
          >
          <span> {{ props.fundTabInfo?.fundsData?.flowGroup[0].outPer }}%</span>
          <span
            class="down-color"
            v-if="
              props.fundTabInfo?.fundsData?.flowGroup[0].net < 0 ||
              props.fundTabInfo?.fundsData?.flowGroup[0].net == '-'
            "
            >-{{
              numberFormat(Math.abs(Number(props.fundTabInfo?.fundsData?.flowGroup[0].net)))
            }}</span
          >
          <span class="up-color" v-else>{{
            numberFormat(props.fundTabInfo?.fundsData?.flowGroup[0].net)
          }}</span>
        </div>
      </div>
      <div class="buying-selling—contrast display-flex" v-if="inflow != 0 && outflow != 0">
        <div
          class="contrast——inflow display-flex flex-direction-col"
          :style="{ width: (inflow / (inflow + outflow)) * 100 + '%' }"
        >
          <strong></strong>
          <span>流入 ${{ numberFormat(inflow) }}</span>
        </div>
        <div
          class="contrast——outflow display-flex flex-direction-col"
          :style="{ width: (outflow / (inflow + outflow)) * 100 + '%' }"
        >
          <strong></strong>
          <span>流出 -${{ numberFormat(outflow) }}</span>
        </div>
      </div>
    </div>
    <div class="activeWalletCnt tabs-head display-flex align-items-center justify-content-sp">
      <span class="left">{{ activeWalletText }}活跃地址数</span>
      <div class="display-flex align-items-center">
        <strong class="up"></strong>
        <span>{{ props.fundTabInfo?.fundsData?.activeWalletCnt.buyCnt }}</span>
        <strong class="down"></strong>
        <span>{{ props.fundTabInfo?.fundsData?.activeWalletCnt.sellCnt }}</span>
      </div>
    </div>
    <div class="buying-selling">
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
      <div class="table-box" v-if="buyingSellingTopIndex == 0">
        <div class="table-head display-flex align-items-center">
          <span>净买入</span>
          <span>买入金额</span>
          <span>用户</span>
        </div>
        <div
          class="table-body display-flex align-items-center"
          v-for="(item, index) in props.fundTabInfo?.fundsData?.rankings.buyRanking"
          :key="index"
        >
          <span class="up-color">{{ numberFormat(item.net) }}</span>
          <span class="up-color">{{ numberFormat(item.totalPrice) }}</span>
          <span>{{ shortifyAddress(item.walletAddress) }}</span>
        </div>
      </div>
      <div class="table-box" v-if="buyingSellingTopIndex == 1">
        <div class="table-head display-flex align-items-center">
          <span>净卖出</span>
          <span>卖出金额</span>
          <span>用户</span>
        </div>
        <div
          class="table-body display-flex align-items-center"
          v-for="(item, index) in props.fundTabInfo?.fundsData?.rankings.sellRanking"
          :key="index"
        >
          <span class="down-color">{{ numberFormat(item.net) }}</span>
          <span class="down-color">{{ numberFormat(item.totalPrice) }}</span>
          <span>{{ shortifyAddress(item.walletAddress) }}</span>
        </div>
      </div>
      <div class="table-box" v-if="buyingSellingTopIndex == 2">
        <div class="display-flex align-items-center justify-content-sp">
          <span></span>
          <span class="up-color"
            >累计收益：{{ numberFormat(props.fundTabInfo?.fundsData?.rankings.totalEarn) }}</span
          >
        </div>
        <div class="table-head display-flex align-items-center">
          <span>钱包</span>
          <span>买入($)</span>
          <span>卖出($)</span>
          <span>浮盈($)</span>
          <span>余额($)</span>
        </div>
        <div
          class="table-body display-flex align-items-center"
          v-for="(item, index) in props.fundTabInfo?.fundsData?.rankings.earnRanking"
          :key="index"
        >
          <span>{{ shortifyAddress(item.walletAddress) }}</span>
          <span class="up-color">{{ numberFormat(item.in) }}</span>
          <span class="down-color">{{ numberFormat(item.out) }}</span>
          <span class="up-color">{{ numberFormat(item.profit) }}</span>
          <span>{{ numberFormat(item.balance) }}</span>
        </div>
      </div>
      <div class="table-box" v-if="buyingSellingTopIndex == 3">
        <div class="display-flex align-items-center justify-content-sp">
          <span></span>
          <span class="down-color"
            >累计亏损：-{{ numberFormat(props.fundTabInfo?.fundsData?.rankings.totalLoss) }}</span
          >
        </div>
        <div class="table-head display-flex align-items-center">
          <span>钱包</span>
          <span>买入($)</span>
          <span>卖出($)</span>
          <span>亏损($)</span>
          <span>余额($)</span>
        </div>
        <div
          class="table-body display-flex align-items-center"
          v-for="(item, index) in props.fundTabInfo?.fundsData?.rankings.lossRanking"
          :key="index"
        >
          <span>{{ shortifyAddress(item.walletAddress) }}</span>
          <span class="up-color">{{ numberFormat(item.in) }}</span>
          <span class="down-color">{{ numberFormat(item.out) }}</span>
          <span class="down-color">{{ numberFormat(item.profit) }}</span>
          <span>{{ numberFormat(item.balance) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { numberFormat, shortifyAddress } from '@/utils'
import moment from 'moment'
import LineChart from '@/components/Charts/LineChart.vue'
const timeTabList = [
  {
    timeLabel: '1时',
    timeNum: '1h',
    text: '1小时',
    id: 1
  },
  {
    timeLabel: '4时',
    timeNum: '4h',
    text: '4小时',
    id: 2
  },
  {
    timeLabel: '1天',
    timeNum: '1d',
    text: '24小时',
    id: 3
  },
  {
    timeLabel: '3天',
    timeNum: '3d',
    text: '3天',
    id: 4
  },
  {
    timeLabel: '1周',
    timeNum: '1w',
    text: '1周',
    id: 5
  },
  {
    timeLabel: '1月',
    timeNum: '1m',
    text: '1月',
    id: 6
  }
]

const timeIndex = ref<number>(1)
const activeWalletText = ref<string>('1小时')
const emit = defineEmits(['change'])
const handelChange = (item: any) => {
  timeIndex.value = item.id
  activeWalletText.value = item.text
  emit('change', item)
}

const buyingSellingTopData = [
  {
    name: 'Top买家',
    id: 0
  },
  {
    name: 'Top卖家',
    id: 1
  },
  {
    name: '赚钱榜',
    id: 2
  },
  {
    name: '亏钱榜',
    id: 3
  }
]
const buyingSellingTopIndex = ref(0)
const handelBuyingSellingTopSelect = async (item: { id: number }) => {
  buyingSellingTopIndex.value = item.id
}
const props = defineProps({
  fundTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const chartData: any = computed(() => {
  return {
    xAxisData:
      props.fundTabInfo?.fundsData?.period.map((item: any) =>
        moment(item.period).format('MM/DD')
      ) || [],
    series: [
      {
        data: props.fundTabInfo?.fundsData?.period.map((item: any) => item.in) || [],
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.05
        }
      },
      {
        type: 'line',
        data: props.fundTabInfo?.fundsData?.period.map((item: any) => item.out) || [],
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.05
        }
      }
    ]
  }
})

const inflow = computed(() => {
  return props.fundTabInfo?.fundsData?.period[props.fundTabInfo?.fundsData?.period.length - 1].in
})
const outflow = computed(() => {
  return props.fundTabInfo?.fundsData?.period[props.fundTabInfo?.fundsData?.period.length - 1].out
})
</script>

<style lang="scss" scoped>
.tabs-item {
  padding: 0.4267rem 0.4267rem 0.2133rem 0.4267rem;

  color: #fff;
  .head-tab {
    span {
      border-radius: 0.1067rem;
      font-size: 0.32rem;
      padding: 0.1067rem 0.2133rem;
      background-color: transparent;
    }
    .cur {
      background-color: #333;
    }
  }
  .chart-box {
    margin-top: 0.4267rem;
  }
  .tabs-head {
    margin-bottom: 0.4267rem;
    .left {
      font-size: 0.32rem;
      color: #fff;
    }
  }
  .flowGroup {
    margin-top: 0.4267rem;
    border-radius: 0.1067rem;
    background: #333;
    padding: 0.2133rem 0.4rem;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .flowGroup-table-head,
    .table-row {
      padding: 0.2133rem 0;
      span {
        flex: 2;
        text-align: right;
        overflow: hidden;
      }
      span:first-child {
        flex: 1;
        text-align: left;
      }
    }
    .flowGroup-table-head {
      border-bottom: 1px solid #3f3f3f;
    }
    .buying-selling—contrast {
      margin-top: 0.2133rem;
      .contrast——inflow {
        color: #34a853;
        min-width: 30%;
        margin-right: 0.1067rem;
        strong {
          font-size: 0.32rem;
          display: block;
          width: 100%;
          height: 0.2133rem;
          border-radius: 0.1067rem 0px 0px 0.1067rem;
          background: #34a853;
          font-weight: normal;
        }
      }
      .contrast——outflow {
        text-align: right;
        color: var(--down-color);
        min-width: 30%;
        strong {
          font-size: 0.32rem;
          display: block;
          width: 100%;
          height: 0.2133rem;
          border-radius: 0px 0.1067rem 0.1067rem 0px;
          background: var(--down-color);
          font-weight: normal;
        }
      }
    }
  }
  .activeWalletCnt {
    margin-top: 0.8533rem;
    padding: 0.2133rem 0;
    strong {
      display: block;
      width: 0.32rem;
      height: 0.32rem;
      margin: 0 0.1067rem 0 0.4267rem;
      font-weight: normal;
    }
    .up {
      background-color: #34a853;
    }
    .down {
      background-color: var(--down-color);
    }
  }
  .buying-selling {
    .buying-selling-items {
      padding: 0.0533rem;
      border-radius: 0.16rem;
      background: transparent;
      margin-bottom: 0.2133rem;
      border: 1px solid #333;
      justify-content: center;
      .buying-selling-item {
        flex: 1;
        padding: 0.1067rem 0.2133rem;
        border-radius: 0.1067rem;
        background: transparent;
        color: #9c9c9c;
        font-size: 0.32rem;
        text-align: center;
      }
      .buying-selling-item-active {
        color: var(--up-color);
        background: #333;
      }
    }
  }
  .table-head,
  .table-body {
    padding: 0.2133rem 0;
    span {
      flex: 1;
      text-align: right;
      overflow: hidden;
    }
    span:first-child {
      text-align: left;
    }
  }
}
</style>
