<template>
  <div class="ai-signals">
    <div class="ai-signals-item" v-for="(item, index) in signalDataList" :key="index">
      <div class="coin-info">
        <div class="coin-type display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <svg-icon name="pin" class="ai-icon"></svg-icon>
            <svg-icon name="ai" class="ai-icon"></svg-icon>
            <svg-icon name="share" class="ai-icon"></svg-icon>
          </div>
          <div class="display-flex align-items-center">
            <div class="coin-type-item display-flex align-items-center">
              <span>Mint权限</span>
              <el-icon class="check-mark" v-if="item.mintable == 2"><Check /></el-icon>
              <el-icon class="close-mark" v-else><Close /></el-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>黑名单</span>
              <el-icon class="check-mark" v-if="item.blacklist == 2"><Check /></el-icon>
              <el-icon class="close-mark" v-else><Close /></el-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>烧池子</span>
              <el-icon class="check-mark" v-if="item.burn == 2"><Check /></el-icon>
              <el-icon class="close-mark" v-else><Close /></el-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>Top10</span>
              <strong>{{ item.top10Percent ? item.top10Percent.toFixed(2) : 0 }}%</strong>
            </div>
          </div>
        </div>
        <div class="coin-text display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <el-image :src="item.baseToken?.logo" alt="" class="logo">
              <template #error>
                <svg-icon name="logo1" class="logo"></svg-icon>
              </template>
            </el-image>
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center">
                <span class="symbol-txt">{{ item.baseToken?.symbol }}</span>
                <div class="display-flex align-items-center">
                  <svg-icon name="time" class="time-icon"></svg-icon>
                  <span class="time-label">创建时间</span>
                  <span class="time-value">{{ timeago(item.startTime * 1000) }}</span>
                </div>
              </div>
              <div class="address-txt display-flex align-items-center">
                <span>{{ shortifyAddress(item.baseToken?.address) }}</span>
                <svg-icon name="copy" class="copy" v-copy="item.baseToken?.address"></svg-icon>
              </div>
              <div class="display-flex align-items-center">
                <div class="price-txt display-flex align-items-center" style="margin-right: 24px">
                  <span>池子</span>
                  <strong>${{ numberFormat(item.tvl) }}</strong>
                </div>
                <div class="price-txt display-flex align-items-center">
                  <span>24h交易额</span>
                  <strong>${{ numberFormat(item.volume1d) }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="signal-box display-flex flex-direction-col justify-content-sp">
            <div class="signal-txt display-flex align-items-center justify-content-fd">
              <span>信号强度</span>
              <strong class="display-flex align-items-fd">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </strong>
            </div>
            <div class="num">{{ item.times }}X</div>
          </div>
        </div>
        <div class="kline-chart">
          <KlineChart :lineData="item.kcharts" />
        </div>
      </div>
      <div class="push-box display-flex align-items-center justify-content-sp">
        <div class="push-txt">
          <i></i>
          <span>推送次数</span>
          <strong>{{ item.pushCount }}</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入金额</span>
          <strong>${{ numberFormat(item.buyAmount) }}</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入地址</span>
          <strong>{{ item.buyAddressCount }}</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入次数</span>
          <strong>{{ item.buyCount }}</strong>
        </div>
      </div>
      <div class="table-box">
        <div class="table-tr display-flex align-items-center">
          <span>时间</span>
          <span>价格</span>
          <span>市值</span>
          <span>持币地址</span>
          <span>前排聪明钱</span>
        </div>
        <div class="table-tr display-flex align-items-center">
          <span>第一次推送</span>
          <span>${{ numberFormat(item.firstPrice) }}</span>
          <span>{{ numberFormat(item.firstMarketCap) }}</span>
          <span>{{ item.firstTvl }}</span>
          <span>{{ item.firstHolder }}</span>
        </div>
        <div
          class="table-tr display-flex align-items-center"
          v-for="item1 in item.pushRecords"
          :key="item1.id"
        >
          <span>当前</span>
          <span>${{ numberFormat(item1.price) }}</span>
          <span>{{ numberFormat(item1.marketCap) }}</span>
          <span>{{ item1.tvl }}</span>
          <span>{{ item.holders }}</span>
        </div>
      </div>
      <div class="buy-sell-box">
        <div class="buy-box">
          <span v-for="item in buyList" :key="item.value">{{ item.label }}</span>
          <span>买入{{ numberFormat(amount) }}</span>
        </div>
        <div class="sell-box">
          <span v-for="item in sellList" :key="item.value">{{ item.label }}</span>
        </div>
      </div>
    </div>
    <AiSignalsShareDialog :aiSignalsShareVisible="aiSignalsShareVisible" @close="handleClose" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { shortifyAddress, numberFormat, timeago } from '@/utils'
import { APIgetSmartKchart } from '@/api'
import KlineChart from '@/components/Charts/KlineChart.vue'
import AiSignalsShareDialog from '@/components/Dialogs/AiSignalsShareDialog.vue'

const aiSignalsShareVisible = ref<boolean>(false)

const signalDataList = ref<any>([])

defineProps({
  amount: {
    required: true,
    type: String
  }
})

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

const buyList = [
  {
    label: '0.1',
    value: 0.1
  },
  {
    label: '0.5',
    value: 0.5
  },
  {
    label: '1',
    value: 1
  }
]

const sellList = [
  {
    label: '25%',
    value: 0.25
  },
  {
    label: '50%',
    value: 0.5
  },
  {
    label: '75%',
    value: 0.75
  },
  {
    label: '100%',
    value: 1
  }
]
const handleClose = (val: boolean) => {
  aiSignalsShareVisible.value = val
}

const initData = async () => {
  const res = await APIgetSmartKchart()

  console.log('APIgetSmartKchart', res)

  signalDataList.value = res || []
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
.ai-signals {
  padding: 10px 0 20px;
  width: 100%;
  background-color: var(--bg-color);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  .ai-signals-item {
    min-width: 0;
    border-radius: 24px;
    background: rgba(23, 24, 27, 0.3);
    padding: 24px 18px;
    line-height: 1.2;
  }
  .coin-info {
    height: 540px;
    border-radius: 18px;
    background: #101114;
  }
  .coin-type {
    padding: 18px;
    color: #f5f5f5;
    font-size: 14px;
    .ai-icon {
      width: 24px;
      height: 24px;
      color: #fff;
      margin-right: 8px;
    }
    strong {
      color: var(--down-color);
      margin-left: 6px;
    }
    .check-mark {
      font-size: 18px;
      margin-left: 2px;
      color: var(--up-color);
    }
    .close-mark {
      font-size: 18px;
      margin-left: 2px;
      color: var(--down-color);
    }
    .coin-type-item {
      margin-left: 9px;
      span {
        white-space: nowrap;
      }
    }
  }
  .coin-text {
    padding: 38px 24px;
    border-top: 1px solid #1f2225;
    border-bottom: 1px solid #1f2225;
    .logo {
      width: 72px;
      height: 72px;
      margin-right: 12px;
      border-radius: 50%;
    }
    .symbol-txt {
      color: #fff;
      font-size: 22px;
      margin-right: 16px;
    }
    .time-icon {
      width: 18px;
      height: 18px;
      color: #71777a;
      margin-right: 2px;
    }
    .time-label {
      color: #71777a;
      font-size: 15px;
    }
    .time-value {
      font-size: 15px;
      color: var(--up-color);
      margin-left: 4px;
    }
    .address-txt {
      color: #e8e8e8;
      font-size: 15px;
      margin: 6px 0;
      .copy {
        width: 13px;
        height: 13px;
        margin-left: 3px;
      }
    }
    .price-txt {
      color: #71777a;
      font-family: 'PingFang SC';
      font-size: 15px;
      white-space: nowrap;
      strong {
        color: #b4b4b4;
        margin-left: 4px;
      }
    }
    .signal-box {
      .signal-txt {
        padding: 8px 4px;
      }
      span {
        color: #f5f5f5;
        font-size: 14px;
        margin-right: 6px;
      }
      i {
        display: block;
        width: 3px;
        background-color: #d9d9d9;
        margin-right: 1.5px;
        border-radius: 1.5px;
      }

      i:nth-child(1) {
        height: 5px;
      }
      i:nth-child(2) {
        height: 8px;
      }
      i:nth-child(3) {
        height: 10px;
      }
      i:nth-child(4) {
        height: 13px;
        margin-right: 0;
      }

      .num {
        display: flex;
        width: 86px;
        height: 36px;
        padding: 2px 4px;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background: rgba(239, 88, 88, 0.16);
        color: var(--down-color);
        font-size: 20px;
        font-weight: 600;
        margin-top: 6px;
      }
    }
  }
  .kline-chart {
    height: 330px;
    padding: 15px 24px;
  }
  .push-box {
    margin: 16px 0;
    font-size: 16px;
    .push-txt {
      display: flex;
      align-items: center;
      i {
        width: 6px;
        height: 6px;
        display: block;
        background-color: var(--up-color);
        border-radius: 50%;
      }
      span {
        color: #71777a;
        margin: 0 4px;
        white-space: nowrap;
      }
      strong {
        color: #b4b4b4;
      }
    }
  }
  .table-box {
    .table-tr {
      background: #1b1b1b;
      border-bottom: 1px solid rgba(23, 24, 27, 0.3);
      padding: 15px 12px;
      font-size: 14px;
      span {
        flex: 1;
        color: #828282;
      }
    }
    .table-tr:first-child {
      background-color: transparent;
    }

    .table-tr:nth-child(2) {
      border-radius: 6px 6px 0 0;
    }
    .table-tr:nth-child(3) {
      border-radius: 0 0 6px 6px;
    }
  }
  .buy-sell-box {
    margin-top: 16px;
    font-size: 18px;
    font-family: 'PingFangSC-Medium';
    .buy-box {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 12px;
      margin-bottom: 12px;
      span {
        min-width: 0;
        height: 44px;
        border-radius: 8px;
        background: rgba(9, 182, 120, 0.16);
        cursor: pointer;
        color: var(--up-color);

        text-align: center;
        line-height: 44px;
      }
    }
    .sell-box {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 12px;
      span {
        min-width: 0;
        height: 44px;
        border-radius: 8px;
        background: rgba(239, 88, 88, 0.16);
        cursor: pointer;
        color: var(--down-color);
        text-align: center;
        line-height: 44px;
      }
    }
  }
}
</style>
