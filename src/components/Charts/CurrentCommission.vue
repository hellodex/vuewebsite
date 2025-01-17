<template>
  <div class="currentCommission">
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
              <span class="text-color">{{ formatDate(scope.row.timestamp) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单号">
            <template #default="scope">
              <div class="display-flex align-items-center">
                <span class="text-color">{{
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
                  <span class="base-symbol font-family-Medium">{{
                    scope.row.baseSymbol || '-'
                  }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="方向">
            <template #default="scope">
              <div class="display-flex flex-direction-col">
                <template v-if="scope.row.fromOrderNo">
                  <span class="down-color font-family-Medium">卖出</span>
                  <span>涨幅{{ parseFloat(scope.row.profitFlag) * 100 }}%出本</span>
                </template>
                <template v-else>
                  <template v-if="scope.row.limitType == 1 || scope.row.limitType == 5">
                    <span class="up-color font-family-Medium">买入</span>
                    <span>高于价格后买入</span>
                  </template>
                  <template v-else-if="scope.row.limitType == 2 || scope.row.limitType == 6">
                    <span class="up-color font-family-Medium">买入</span>
                    <span>抄底</span>
                  </template>
                  <template v-else-if="scope.row.limitType == 3 || scope.row.limitType == 7">
                    <span class="down-color font-family-Medium">卖出</span>
                    <span>止盈</span>
                  </template>
                  <template v-else-if="scope.row.limitType == 4 || scope.row.limitType == 8">
                    <span class="down-color font-family-Medium">卖出</span>
                    <span>止损</span>
                  </template>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="委托类型">
            <template #default="scope">
              <span class="text-color font-family-Medium" v-if="scope.row.limitType > 4"
                >${{ numberFormat(scope.row.marketCap) || '-' }}</span
              >
              <span class="text-color font-family-Medium" v-else
                >${{ numberFormat(scope.row.price) || '-' }}</span
              >
              <br />
              <span v-if="scope.row.limitType > 4">市值</span>
              <span v-else>价格</span>
            </template>
          </el-table-column>
          <el-table-column label="委托金额">
            <template #default="scope">
              <span class="text-color font-family-Medium"
                >${{ numberFormat(scope.row.volume) || '-' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="委托数量">
            <template #default="scope">
              <span class="text-color font-family-Medium">{{
                numberFormat(scope.row.amount) || '-'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template #default>
              <span class="type-color">等待触发</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template #default="scope">
              <span class="btn" @click="handelCancel(scope.row)">取消委托</span>
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
import { numberFormat, formatDate } from '@/utils'
import { APIcancelOrder } from '@/api'
import { useGlobalStore } from '@/stores/global'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

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

const i18n = useI18n()
const globalStore = useGlobalStore()

const { chainLogoObj } = globalStore

const handelCancel = (row: any) => {
  ElMessageBox.confirm('是否取消委托？', i18n.t('Tips'), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    type: 'info'
  })
    .then(async () => {
      const res = await APIcancelOrder({ orderNo: row.orderNo })
      res && ElMessage.success('取消成功')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.currentCommission {
  .copy {
    width: 12px;
    min-width: 12px;
    height: 12px;
    margin-left: 6px;
    cursor: pointer;
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
    // .base-symbol {
    //   color: #f5f5f5;
    // }
  }
  .btn {
    padding: 4px 12px;
    border: 1px solid #222;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    margin-left: 8px;
    transition: all 0.2s;
    color: #848e9c;
  }
  .type-color {
    color: #ffc422;
  }
}
</style>
