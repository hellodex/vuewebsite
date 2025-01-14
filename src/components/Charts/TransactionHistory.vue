<template>
  <div class="transactionHistory">
    <!-- <div class="transactionHistory-tab">
      <span
        v-for="(item, index) in historicalTransactionTabList"
        :key="index"
        :class="historicalTransactionTabIndex == item.value ? 'active' : ''"
        @click="handelHistoricalTransactionTab(item)"
        >{{ item.label }}</span
      >
    </div> -->
    <el-skeleton style="width: 100%" :loading="skeleton" animated>
      <template #template>
        <el-skeleton-item
          variant="text"
          style="height: 30px; margin: 4.4px 0"
          v-for="item in 10"
          :key="item"
        />
      </template>
      <template #default>
        <el-table :data="list" style="width: 100%" max-height="890px">
          <el-table-column label="时间">
            <template #default="scope">
              <span class="text-color font-family-Medium">{{
                formatDate(scope.row.timestamp) || '-'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单号">
            <template #default="scope">
              <div class="display-flex align-items-center">
                <span class="text-color font-family-Medium">{{
                  scope.row.orderNo.substring(scope.row.orderNo.length - 6)
                }}</span>
                <svg-icon name="copy" class="copy" v-copy="scope.row.orderNo"></svg-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="币种">
            <template #default="scope">
              <div class="display-flex align-items-center coin-box">
                <span class="logo">
                  <el-image :src="scope.row.logo" alt="" class="coin-icon">
                    <template #error>
                      <svg-icon name="logo1" class="coin-icon"></svg-icon>
                    </template>
                  </el-image>
                  <img :src="chainLogoObj[scope.row.chainCode]" alt="" class="chainCode" />
                </span>
                <p class="display-flex align-items-center">
                  <span class="base-symbol font-family-Heavy">{{
                    scope.row.baseSymbol || '-'
                  }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template #default="scope">
              <span class="text-color font-family-Heavy">{{
                TRANSFER_TYPE[scope.row.tradeType] || '交易'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="方向">
            <template #default="scope">
              <span
                :class="
                  scope.row.direction == 1
                    ? 'down-color font-family-Heavy'
                    : 'up-color font-family-Heavy'
                "
                >{{ scope.row.direction == 1 ? '卖出' : '买入' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="成交价格">
            <template #default="scope">
              <span class="text-color font-family-Heavy"
                >${{ numberFormat(scope.row.price) || '-' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="成交数量">
            <template #default="scope">
              <span class="text-color font-family-Heavy">{{
                numberFormat(scope.row.amount) || '-'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成交金额">
            <template #default="scope">
              <span class="text-color font-family-Heavy"
                >${{ numberFormat(scope.row.volume) || '-' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="交易Hash" width="140" align="center">
            <template #default="scope">
              <div class="display-flex align-items-center justify-content-center">
                <span class="text-color" style="text-decoration: underline" v-if="scope.row.tx">{{
                  shortifyAddress(scope.row.tx)
                }}</span>
                <span v-else>-</span>
                <svg-icon
                  name="copy"
                  class="copy"
                  v-copy="scope.row.tx"
                  v-if="scope.row.tx"
                ></svg-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template #default="scope">
              <span
                :class="
                  scope.row.status == 200
                    ? 'up-color  font-family-Medium'
                    : 'down-color  font-family-Medium'
                "
                >{{ scope.row.orderStatusUI }}</span
              >
            </template>
          </el-table-column>
          <template #empty>
            <empty-data></empty-data>
          </template>
        </el-table>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { numberFormat, shortifyAddress, formatDate } from '@/utils'

import { useGlobalStore } from '@/stores/global'
import { TRANSFER_TYPE } from '@/types'

defineProps({
  list: {
    required: true,
    type: Array,
    default: () => {
      return []
    }
  },
  skeleton: {
    type: Boolean,
    required: true,
    default: false
  }
})

const globalStore = useGlobalStore()

const { chainLogoObj } = globalStore

const historicalTransactionTabList = [
  {
    label: '一键买卖',
    value: 1
  },
  {
    label: '市价交易',
    value: 2
  },
  {
    label: '限价委托',
    value: 3
  },
  {
    label: '止盈止损',
    value: 4
  }
  // {
  //   label: '移动止盈止损',
  //   value: 5
  // }
]

const historicalTransactionTabIndex = ref<number>(1)

const handelHistoricalTransactionTab = (item: any) => {
  historicalTransactionTabIndex.value = item.value
}
</script>

<style lang="scss" scoped>
.transactionHistory {
  .copy {
    width: 12px;
    min-width: 12px;
    height: 12px;
    margin-left: 6px;
    cursor: pointer;
  }
  .transactionHistory-tab {
    display: inline-block;
    border-radius: 8px;
    background: var(--bg-color);
    padding: 4px;
    margin-bottom: 8px;
    span {
      display: inline-block;
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 12px;
      background-color: transparent;
      color: var(--dex-color-4);
      cursor: pointer;
    }
    span.active {
      background-color: var(--tab-bg-color);
      color: var(--font-color-default);
    }
  }
  .coin-box {
    .logo {
      width: 24px;
      height: 24px;
      position: relative;
      margin-right: 4px;
    }
    .coin-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .chainCode {
      width: 12px;
      height: 12px;
      position: absolute;
      right: -1px;
      bottom: 0px;
    }
    .base-symbol {
      color: #f5f5f5;
    }
  }
}
</style>
