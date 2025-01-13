<template>
  <div class="tabs-item">
    <div class="pond-box">
      <div class="pond-tab">
        <div
          v-for="(item, index) in props.pondTabInfo.poolList"
          :key="index"
          @click="handelTab(item, index)"
          :class="index == tabIndex ? 'pond-tab-item pond-tab-active' : 'pond-tab-item'"
        >
          <div class="display-flex align-items-center">
            <div class="display-flex align-items-center flex-direction-col pond-centent-txt">
              <span>{{
                item.coinName1.length >= 44 ? shortifyAddress(item.coinName1) : item.coinName1
              }}</span>
              <span class="pond-tab-item-txt">{{ numberFormat(parseFloat(item.num1)) }}</span>
            </div>
            <div class="pond-coin-border"></div>
            <div class="display-flex align-items-center flex-direction-col pond-centent-txt">
              <span>{{ item.coinName2 }}</span>
              <span class="pond-tab-item-txt">{{ numberFormat(parseFloat(item.num2)) }}</span>
            </div>
          </div>
          <div class="display-flex align-items-fd flex-direction-col">
            <svg-icon
              name="ic_lock"
              class="ic_lock"
              v-if="index == tabIndex && isLocked"
            ></svg-icon>
            <span class="display-flex align-items-center">
              <i></i>
              <span class="pond-tab-item-txt">${{ numberFormat(item.price) }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="chart-box">
        <div class="display-flex align-items-center justify-content-sp">
          <span class="left">流动性（$）</span>
          <span class="right">检测</span>
        </div>
        <LineChart :chartData="chartData" />
      </div>
      <div class="pond-table">
        <div class="pond-table-head">
          <span>时间</span>
          <span>类型</span>
          <span>数量</span>
          <span>金额</span>
          <span>用户</span>
        </div>
        <div class="pond-table-body">
          <div
            class="pond-table-row"
            v-for="(item, index) in props.pondTabInfo.mobilityList"
            :key="index"
          >
            <span>{{ timeago(item.txTime * 1000) }}</span>
            <span>
              <span
                :class="item.type == 'MINT' ? 'up-color type-up-btn' : 'down-color type-down-btn'"
                >{{ item.type == 'MINT' ? '添加' : '移出' }}</span
              >
            </span>
            <span>
              <p class="percent-p">
                <span :class="item.type == 'MINT' ? 'up-color' : 'down-color'">{{
                  numberFormat(item.baseTokenAmount)
                }}</span
                ><span>{{ item.baseTokenSymbol }}</span>
              </p>
              <p class="percent-p">
                <span :class="item.type == 'MINT' ? 'up-color' : 'down-color'">{{
                  numberFormat(item.quoteTokenAmount)
                }}</span
                ><span>{{ item.quoteTokenSymbol }}</span>
              </p>
            </span>
            <span>{{ numberFormat(item.baseTokenAmount) }}</span>
            <span>{{ shortifyAddress(item.addLiquidityAddress) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { shortifyAddress, numberFormat, timeago } from '@/utils'
import moment from 'moment'
import LineChart from '@/components/Charts/LineChart.vue'

const props = defineProps({
  pondTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const isLocked = computed(() => {
  const isLocked = props.pondTabInfo.lpList?.some(
    (item: { is_locked: number | string }) => item.is_locked == 1
  )
  return isLocked || 0
})

const chartData: any = computed(() => {
  return {
    xAxisData:
      props.pondTabInfo?.poolChainInfo?.tvlChart.map((item: any) =>
        moment(item.period).format('MM/DD')
      ) || [],
    series: [
      {
        data:
          props.pondTabInfo?.poolChainInfo?.tvlChart.map((item: any) => item.totalIncoming) || [],
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.05
        }
      },
      {
        type: 'line',
        data:
          props.pondTabInfo?.poolChainInfo?.tvlChart.map((item: any) => item.totalOutgoing) || [],
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.05
        }
      }
    ]
  }
})
// 流动性池
const tabIndex = ref(0)
const handelTab = (item: any, index: number) => {
  tabIndex.value = index
}
</script>

<style lang="scss" scoped>
.tabs-item {
  padding: 0.4267rem 0.4267rem 0.2133rem 0.4267rem;
}
.pond-head {
  color: #fff;
  margin-bottom: 0.4267rem;
  .btn {
    padding: 0.1067rem 0.2133rem;
    border-radius: 0.1067rem;
    background-color: rgba(224, 224, 224, 0.2);
    color: #fff;
    font-size: 0.32rem;
  }
  .left span,
  .right {
    color: #9c9c9c;
  }
  .left span {
    margin: 0 0.2133rem;
  }
}
.pond-tab-item {
  padding: 0.2133rem 0.32rem 0.2133rem 0;
  border-radius: 0.1067rem;
  border: 1px solid rgba(224, 224, 224, 0.1);
  background: #212121;
  display: flex;
  display: -webkit-flex;
  align-items: flex-end;
  justify-content: space-between;
  font-size: 0.32rem;
  margin-bottom: 0.2133rem;
  color: #9c9c9c;
  .pond-centent-txt {
    width: 2.4rem;
  }
  .pond-tab-item-txt {
    color: #fff;
  }
  .pond-coin-border {
    width: 1px;
    height: 0.8rem;
    background: rgba(224, 224, 224, 0.1);
  }
  .ic_lock {
    width: 0.3733rem;
    height: 0.3733rem;
  }
}
.pond-tab-active {
  background-color: rgba(224, 224, 224, 0.1);
  border: 1px solid rgba(224, 224, 224, 0.1);
}
.chart-box {
  margin: 0.64rem 0;
  .left {
    font-size: 0.3733rem;
    color: #fff;
  }
  .right {
    font-size: 0.32rem;
    color: #9c9c9c;
  }
}
.pond-table-head,
.pond-table-row {
  color: #fff;
  font-size: 0.32rem;
  padding: 0.2667rem 0;
  display: grid;
  grid-template-columns: 1fr 0.96rem 1fr 1fr 1fr;
  align-items: center;
  column-gap: 0.1333rem;
  span {
    flex: 1;
    text-align: left;
  }
  span:nth-child(3) {
    text-align: center;
  }
  span:last-child {
    text-align: right;
  }
}
.pond-table-row {
  font-size: 0.2933rem;
}
.pond-table-body {
  margin-top: 0.2133rem;
  .percent-p {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 6px;
    justify-content: center;
    span {
      text-align: right;
    }
    span:last-child {
      text-align: left;
    }
  }
}
</style>
