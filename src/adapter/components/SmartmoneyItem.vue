<template>
  <div class="smartMoney-item">
    <div class="smartMoney-item-box">
      <div class="coin-info margin-bottom display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center">
          <span class="logo">
            <img
              src="https://ipfs.io/ipfs/QmRWG8WxjkmRFcVY3kMuwbu6ufZhe3mYjUYNmDor3tNwsH"
              alt=""
              class="coin-icon"
            />
            <!-- <svg-icon name="logo1" class="coin-icon" v-else></svg-icon> -->
            <img src="https://file.dexx.ai/static/img/chain/sol.png" alt="" class="chainCode" />
          </span>
          <div class="display-flex flex-direction-col coin-text">
            <p class="display-flex align-items-center">
              <span class="base-symbol">Casper</span>
              <span class="tokens—after">/Sol</span>
            </p>
            <p class="display-flex align-items-center address">
              <span>{{ shortifyAddress('GrQfckDSm7Ty6M1MYHfmQN5xXvsd82D62cXzqzVW22A3') }}</span>
              <svg-icon
                name="copy"
                class="copy"
                v-copy="'GrQfckDSm7Ty6M1MYHfmQN5xXvsd82D62cXzqzVW22A3'"
              ></svg-icon>
            </p>
          </div>
        </div>
        <div class="trade-btn" style="background-color: var(--up-color)">去交易</div>
      </div>
      <div class="coin-status margin-bottom display-flex align-items-center justify-content-center">
        <div class="display-flex align-items-center">
          <el-icon :size="12" color="#14C784"><CircleCheck /></el-icon>
          <span>不可冻结</span>
        </div>
        <div class="display-flex align-items-center">
          <el-icon :size="12" color="#EA3943"><CircleClose /></el-icon>
          <span>黑名单丢弃</span>
        </div>
        <div class="display-flex align-items-center">
          <el-icon :size="12" color="#14C784"><CircleCheck /></el-icon>
          <span>烧池子</span>
        </div>
        <div class="display-flex align-items-center">
          <el-icon :size="12" color="#14C784"><CircleCheck /></el-icon>
          <span style="margin-right: 0">Top10持仓:63.31%</span>
        </div>
      </div>
      <div class="line margin-bottom"></div>
      <div class="info-text-item">
        <p class="display-flex align-items-center justify-content-sp">
          <span>聪明钱地址</span>
          <span>学长</span>
        </p>
        <p class="display-flex align-items-center justify-content-sp">
          <span>买入 (SOL)</span>
          <span>2.04</span>
        </p>
        <p class="display-flex align-items-center justify-content-sp">
          <span>收到(Casper)</span>
          <span>9.83M</span>
        </p>
        <p class="display-flex align-items-center justify-content-sp">
          <span>买入市值</span>
          <span>$35860.37</span>
        </p>
        <p class="display-flex align-items-center justify-content-sp">
          <span>交易Hash</span>
          <span class="display-flex align-items-center">
            {{
              shortifyAddress(
                '5VcgVHxHS5FVXoK4ABpU8fsYVeE6nqTbTN7eLS2ydit9ZGzfWUTwWn7GuZCkG68FFQEYLvCusGDtqq1sxTFzgsxh'
              )
            }}
            <svg-icon
              name="copy"
              class="copy"
              v-copy="
                '5VcgVHxHS5FVXoK4ABpU8fsYVeE6nqTbTN7eLS2ydit9ZGzfWUTwWn7GuZCkG68FFQEYLvCusGDtqq1sxTFzgsxh'
              "
            ></svg-icon>
          </span>
        </p>
        <p class="display-flex align-items-center justify-content-sp">
          <span>时间</span>
          <span>2024-10-25 19:40:12</span>
        </p>
      </div>
      <div class="line margin-bottom"></div>
      <div class="display-flex align-items-center justify-content-sp time-increase margin-bottom">
        <div
          class="display-flex align-items-center flex-direction-col time-increase-item time-increase-down"
        >
          <strong>+69.45%</strong>
          <span>5m</span>
        </div>
        <div
          class="display-flex align-items-center flex-direction-col time-increase-item time-increase-up"
        >
          <strong>+69.45%</strong>
          <span>1h</span>
        </div>
        <div
          class="display-flex align-items-center flex-direction-col time-increase-item time-increase-down"
        >
          <strong>+69.45%</strong>
          <span>6h</span>
        </div>
        <div
          class="display-flex align-items-center flex-direction-col time-increase-item time-increase-up"
        >
          <strong>+69.45%</strong>
          <span>24h</span>
        </div>
      </div>
      <div class="line margin-bottom"></div>
      <div class="hold margin-bottom">
        <p>我的持仓</p>
        <div class="hold-info display-flex align-items-center justify-content-sp">
          <div class="display-flex flex-direction-col">
            <span>余额(SOL)</span>
            <strong>0.00</strong>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <span>总买入(SOL)</span>
            <strong>0.00</strong>
          </div>
          <div class="display-flex flex-direction-col align-items-fd">
            <span>当前持仓(SOL)</span>
            <strong>0.00</strong>
          </div>
        </div>
      </div>
      <div class="trading-buy">
        <p>一键买入</p>
        <div class="trading-box">
          <span v-for="(item, index) in buyPosition" :key="index">买{{ item.label }}</span>
        </div>
      </div>
      <div class="trading-sell">
        <p>一键卖出</p>
        <div class="trading-box">
          <span v-for="(item, index) in sellPosition" :key="index">卖{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { numberFormat, shortifyAddress } from '@/utils'

const buyPosition = [
  {
    label: '10%',
    value: 0.1
  },
  {
    label: '20%',
    value: 0.2
  },
  {
    label: '50%',
    value: 0.5
  },
  {
    label: '80%',
    value: 0.8
  },
  {
    label: '100%',
    value: 1
  }
]

const sellPosition = [
  {
    label: '10%',
    value: 0.1
  },
  {
    label: '20%',
    value: 0.2
  },
  {
    label: '50%',
    value: 0.5
  },
  {
    label: '80%',
    value: 0.8
  },
  {
    label: '100%',
    value: 1
  }
]
</script>
<style lang="scss" scoped>
.smartMoney-item {
  padding: 0 6px;
  margin-bottom: 12px;
  .smartMoney-item-box {
    border-radius: 10px;
    padding: 12px;
    background-color: var(--hover-bg-color);
    .margin-bottom {
      margin-bottom: 12px;
    }
    .coin-info {
      .coin-text {
        margin-left: 12px;
        font-size: 18px;
        .base-symbol {
          color: var(--font-color-default);
        }
        .tokens—after {
          color: var(--dex-color-4);
        }
      }
      .address {
        color: var(--dex-color-4);
        font-size: 12px;
      }
      .copy {
        width: 16px;
        height: 16px;
        margin-left: 4px;
        cursor: pointer;
      }
    }
    .logo,
    .coin-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      position: relative;
    }
    .chainCode {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      position: absolute;
      bottom: 0;
      right: 0;
    }
    .trade-btn {
      padding: 4px 15px;
      border-radius: 48px;
      color: var(--font-color-default);
      font-size: 14px;
      cursor: pointer;
    }
    .coin-status {
      padding: 4px 8px;
      border-radius: 8px;
      background-color: #1c3135;
      span {
        color: var(--font-color-default);
        font-size: 10px;
        margin-left: 4px;
        margin-right: 8px;
      }
    }
  }
}

.line {
  height: 1px;
  background-color: #292d3a;
}
.info-text-item {
  p {
    margin-bottom: 12px;
    line-height: 1.2;
    span {
      font-size: 14px;
      color: var(--dex-color-4);
    }
    span:last-child {
      color: var(--font-color-default);
    }
    .copy {
      width: 16px;
      height: 16px;
      cursor: pointer;
      margin-left: 4px;
    }
  }
}
.time-increase {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  .time-increase-item {
    padding: 6px 0;
    border-radius: 8px;
    font-size: 12px;
    color: var(--dex-color-4);
    strong {
      font-size: 14px;
      font-weight: normal;
    }
  }
  .time-increase-up {
    background: #212f34;
    strong {
      color: var(--up-color);
      font-weight: normal;
    }
  }
  .time-increase-down {
    background: #342631;
    strong {
      color: var(--down-color);
      font-weight: normal;
    }
  }
}
.hold {
  font-size: 12px;
  .hold-info {
    padding: 8px 16px;
    span {
      color: var(--dex-color-4);
    }
    strong {
      font-weight: normal;
    }
  }
}
.trading-box {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  span {
    font-size: 12px;
    line-height: 24px;
    border-radius: 48px;
    color: var(--font-color-default);
    text-align: center;
    cursor: pointer;
  }
}
.trading-buy span {
  background-color: var(--up-color);
}
.trading-sell span {
  background-color: var(--down-color);
}
</style>
