<template>
  <div class="CommissionHistory">
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
          <el-table-column label="时间" min-width="170">
            <template #default="scope">
              <span class="text-color">{{ formatDate(scope.row.timestamp) || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单号" min-width="120">
            <template #default="scope">
              <div class="display-flex align-items-center">
                <span class="text-color">{{
                  scope.row.orderNo.substring(scope.row.orderNo.length - 6)
                }}</span>
                <svg-icon name="copy" class="copy" v-copy="scope.row.orderNo"></svg-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="币种" min-width="160">
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
                  <span class="base-symbol">{{ scope.row.baseSymbol || '-' }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="方向" min-width="220">
            <template #default="scope">
              <div class="display-flex align-items-center">
                <template v-if="scope.row.fromOrderNo">
                  <span class="down-color direction-txt"
                    >涨幅{{ parseFloat(scope.row.profitFlag) * 100 }}%出本</span
                  >
                  <span class="down-color direction-txt">卖出</span>
                </template>
                <template v-else>
                  <template v-if="scope.row.limitType == 1 || scope.row.limitType == 5">
                    <span class="up-color direction-txt">高于价格后买入</span>
                    <span class="up-color direction-txt">买入</span>
                  </template>
                  <template v-else-if="scope.row.limitType == 2 || scope.row.limitType == 6">
                    <span class="up-color direction-txt">抄底</span>
                    <span class="up-color direction-txt">买入</span>
                  </template>
                  <template v-else-if="scope.row.limitType == 3 || scope.row.limitType == 7">
                    <span class="down-color direction-txt">止盈</span>
                    <span class="down-color direction-txt">卖出</span>
                  </template>
                  <template v-else-if="scope.row.limitType == 4 || scope.row.limitType == 8">
                    <span class="down-color direction-txt">止损</span>
                    <span class="down-color direction-txt">卖出</span>
                  </template>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="委托类型" min-width="160">
            <template #default="scope">
              <span class="text-color" v-if="scope.row.limitType > 4"
                >${{ numberFormat(scope.row.marketCap) || '-' }}（市值）</span
              >
              <span class="text-color" v-else
                >${{ numberFormat(scope.row.price) || '-' }}（价格）</span
              >
            </template>
          </el-table-column>
          <el-table-column label="委托数量" min-width="120">
            <template #default="scope">
              <span class="text-color">{{ numberFormat(scope.row.amount) || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="委托金额" min-width="120">
            <template #default="scope">
              <span class="text-color">${{ numberFormat(scope.row.volume) || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易Hash" min-width="140" align="center">
            <template #default="scope">
              <div class="display-flex align-items-center justify-content-center">
                <span class="text-color">{{ shortifyAddress(scope.row.tx) || '-' }}</span>
                <svg-icon
                  name="copy"
                  class="copy"
                  v-copy="scope.row.tx"
                  v-if="scope.row.tx"
                ></svg-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="150" align="center">
            <template #default="scope">
              <span :class="scope.row.status == 200 ? 'up-color' : 'down-color'">{{
                STATUS_TYPE[scope.row.status] || '错误，请联系客服'
              }}</span>
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
import { numberFormat, shortifyAddress, formatDate } from '@/utils'
import { useGlobalStore } from '@/stores/global'
import { STATUS_TYPE } from '@/types'

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
</script>

<style lang="scss" scoped>
.CommissionHistory {
  .copy {
    width: 16px;
    height: 16px;
    margin-left: 6px;
    cursor: pointer;
  }
  .coin-box {
    .logo {
      width: 32px;
      height: 32px;
      position: relative;
      margin-right: 10px;
    }
    .coin-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .chainCode {
      width: 14px;
      height: 14px;
      position: absolute;
      right: -1px;
      bottom: 0px;
    }
    .base-symbol {
      color: var(--font-color-default);
    }
  }
  .btn {
    height: 28px;
    padding: 4px 15px;
    background: var(--hover-bg-color);
    line-height: 28px;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    margin-left: 8px;
  }
  .direction-txt {
    margin-right: 10px;
    white-space: nowrap;
  }
}
</style>
