<template>
  <div class="ai-signals">
    <div class="ai-signals-item" v-for="item in 9" :key="item">
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
              <svg-icon name="check-mark" class="check-mark"></svg-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>黑名单</span>
              <svg-icon name="check-mark" class="check-mark"></svg-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>烧池子</span>
              <svg-icon name="check-mark" class="check-mark"></svg-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>Top10</span>
              <strong>86.7%</strong>
            </div>
          </div>
        </div>
        <div class="coin-text display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <img src="../assets/img/0xSun.png" alt="" class="logo" />
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center">
                <span class="symbol-txt">signal</span>
                <div class="display-flex align-items-center">
                  <svg-icon name="time" class="time-icon"></svg-icon>
                  <span class="time-label">创建时间</span>
                  <span class="time-value">24秒前</span>
                </div>
              </div>
              <div class="address-txt display-flex align-items-center">
                <span>pump....pnmp</span>
                <svg-icon name="copy" class="copy" v-copy="'pump'"></svg-icon>
              </div>
              <div class="display-flex align-items-center">
                <div class="price-txt display-flex align-items-center" style="margin-right: 24px">
                  <span>池子</span>
                  <strong>$4.7K</strong>
                </div>
                <div class="price-txt display-flex align-items-center">
                  <span>24h交易额</span>
                  <strong>$1.79m</strong>
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
            <div class="num">2.4X</div>
          </div>
        </div>
        <div class="kline-chart">
          <KlineChart />
        </div>
      </div>
      <div class="push-box display-flex align-items-center justify-content-sp">
        <div class="push-txt">
          <i></i>
          <span>推送次数</span>
          <strong>12</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入金额</span>
          <strong>76.98</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入地址</span>
          <strong>12</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入次数</span>
          <strong>12</strong>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="时间" />
        <el-table-column prop="name" label="价格" />
        <el-table-column prop="name" label="市值" />
        <el-table-column prop="name" label="持币地址" />
        <el-table-column prop="name" label="前排聪明钱" />
      </el-table>
      <div class="buy-sell-box">
        <div class="buy-box">
          <span>0.1</span>
          <span>0.1</span>
          <span>0.1</span>
          <span>0.1</span>
        </div>
        <div class="sell-box">
          <span>0.1</span>
          <span>0.1</span>
          <span>0.1</span>
          <span>0.1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import KlineChart from '@/components/Charts/KlineChart.vue'
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
</script>

<style lang="scss" scoped>
.ai-signals {
  padding: 20px;
  width: 100%;
  height: calc(100vh - 95px);
  overflow: hidden;
  overflow-y: scroll;
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
      width: 18px;
      height: 18px;
      margin-left: 2px;
      color: var(--up-color);
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
  :deep(.el-table) {
    background-color: transparent !important;
    tr {
      background-color: transparent !important;
    }
    td.el-table__cell {
      background: #1b1b1b;
      border-bottom: 1px solid rgba(23, 24, 27, 0.3) !important;
      padding: 15px 0 !important;
      font-size: 14px;
      .cell {
        color: #828282 !important;
      }
    }
    td.el-table__cell:first-child {
      border-radius: 6px 0 0 6px;
    }

    td.el-table__cell:last-child {
      border-radius: 0 6px 6px 0;
    }
    th.el-table__cell.is-leaf {
      background-color: transparent !important;
      border-bottom: 1px solid rgba(23, 24, 27, 0.3) !important;
      padding: 15px 0 !important;
      font-size: 14px;
      .cell {
        color: #828282 !important;
      }
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
