<template>
  <div class="myCoinTab-tab-content display-flex align-items-fs justify-content-sp">
    <div class="display-flex flex-direction-col myCoinTab-bininfo">
      <span class="myCoinTab-label">{{ i18n.t('kChart.TotalValue') }}</span>
      <div class="display-flex flex-direction-col myCoinTab-bininfo-main">
        <p>
          ${{
            myCoinTabInfo.mystock?.holdCost < 0
              ? numberFormat(myCoinTabInfo.mystock.holdCost.toFixed(6))
              : numberFormat(myCoinTabInfo.mystock.holdCost || 0)
          }}
          USDT
        </p>
        <p>
          {{ numberFormat(myCoinTabInfo.mystock.hold || 0) }}
        </p>

        <div class="display-flex justify-content-sa align-items-center bininfo-price">
          <div class="display-flex flex-direction-col align-items-center bininfo-price-txt">
            <span>{{ i18n.t('kChart.AverageBuyingPrice') }}</span>
            <span>{{ numberFormat(myCoinTabInfo.mystock.averageInCost || 0) }}</span>
          </div>
          <div class="bininfo-price-border"></div>
          <div class="display-flex flex-direction-col align-items-center bininfo-price-txt">
            <span>{{ i18n.t('kChart.TokenBalance') }}</span>
            <span>{{ numberFormat(myCoinTabInfo.mystock.hold || 0) }}</span>
          </div>
        </div>
        <div class="display-flex flex-direction-col trade-box">
          <div class="display-flex justify-content-sp align-items-center">
            <div class="display-flex flex-direction-col purchase-transfer">
              <span>{{ i18n.t('kChart.Buy1') }}</span>
              <span class="">${{ numberFormat(myCoinTabInfo.mystock.flowInCost || 0) }}</span>
            </div>
            <div class="display-flex flex-direction-col transfer-sale">
              <span>{{ i18n.t('kChart.Sell1') }}</span>
              <span>${{ numberFormat(myCoinTabInfo.mystock.flowOutCost || 0) }}</span>
            </div>
          </div>
          <div class="display-flex justify-content-sp align-items-center">
            <div class="display-flex flex-direction-col purchase-transfer">
              <span>{{ i18n.t('kChart.TransferIn1') }}</span>
              <span>{{ numberFormat(myCoinTabInfo.mystock.transferIn || 0) }}</span>
            </div>
            <div class="display-flex flex-direction-col transfer-sale">
              <span>{{ i18n.t('kChart.TransferOut1') }}</span>
              <span>{{ numberFormat(myCoinTabInfo.mystock.transferOut || 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="display-flex flex-direction-col myCoinTab-tabel">
      <span class="myCoinTab-label">{{ i18n.t('kChart.History') }}</span>
      <el-table
        :data="myCoinTabInfo.transactionInfo"
        :header-cell-style="{ background: '#f9f9f9' }"
        max-height="890px"
      >
        <template #empty>
          <span>{{ isConnected ? '暂无数据' : '请先登录' }}</span>
        </template>
        <el-table-column min-width="140">
          <template #header>
            <div class="display-flex align-items-center">
              <span>{{ i18n.t('kChart.Time') }}</span>
              <svg-icon name="calendar-date" class="myCoin-tab-icon"></svg-icon>
            </div>
          </template>
          <template #default="scope">
            <div class="display-flex align-items-center">
              {{ timeago(scope.row.txTime * 1000) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="flag">
          <template #header>
            <div class="display-flex align-items-center">
              <span>{{ i18n.t('kChart.Type1') }}</span>
              <svg-icon name="filter-funnel-01" class="myCoin-tab-icon"></svg-icon>
            </div>
          </template>
          <template #default="scope">
            <span
              :class="scope.row.flag == 0 ? 'up-color type-up-btn' : 'down-color type-down-btn'"
              >{{ scope.row.flag == 0 ? i18n.t('kChart.Buy') : i18n.t('kChart.Sell') }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="price">
          <template #header>
            <div class="display-flex align-items-center">
              <span>{{ i18n.t('home.price') }}</span>
              <svg-icon name="filter-funnel-01" class="myCoin-tab-icon"></svg-icon>
            </div>
          </template>
          <template #default="scope">
            <span :class="scope.row.flag == 0 ? 'up-color' : 'down-color'"
              >${{ numberFormat(scope.row.price) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="amount">
          <template #header>
            <div class="display-flex align-items-center">
              <span>{{ i18n.t('kChart.Amount') }}</span>
              <svg-icon name="filter-funnel-01" class="myCoin-tab-icon"></svg-icon>
            </div>
          </template>
          <template #default="scope">
            <span :class="scope.row.flag == 0 ? 'up-color' : 'down-color'">{{
              numberFormat(scope.row.amount)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <div class="display-flex align-items-center">
              <span>{{ i18n.t('kChart.Volume') }}</span>
              <svg-icon name="filter-funnel-01" class="myCoin-tab-icon"></svg-icon>
            </div>
          </template>
          <template #default="scope">
            <span :class="scope.row.flag == 0 ? 'up-color' : 'down-color'"
              >${{ numberFormat(scope.row.orderAmount) }}</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { numberFormat, timeago } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
const globalStore = useGlobalStore()
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const i18n = useI18n()

defineProps({
  myCoinTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>
<style lang="scss" scoped>
.myCoinTab-tab-content {
  font-size: 12px;

  font-style: normal;
  .myCoin-tab-icon {
    width: 12px;
    height: 12px;
    display: block;
    margin-left: 4px;
  }
  .myCoinTab-label {
    margin-bottom: 6px;
    font-size: 14px;
  }
  .myCoinTab-bininfo {
    width: 25%;
    min-width: 300px;
    #myCoinCoins-echarts {
      width: 100%;
      height: 65px;
    }
    .myCoinTab-bininfo-main {
      p:nth-child(1) {
        font-size: 20px;
        color: var(--font-color-default);
      }
      p:nth-child(2) {
        font-size: 14px;
        // color: #34a853;
      }
      .bininfo-price {
        border-radius: 8px;
        background: var(--tab-bg-color);
        padding: 10px;
        margin: 8px 0;
        .bininfo-price-border {
          width: 1px;
          height: 34px;
          background: var(--color-border);
        }
        .bininfo-price-txt {
          span:first-child {
            font-size: 12px;
            color: var(--dex-color-4);
          }
          span:last-child {
            font-size: 14px;
            color: var(--font-color-default);
          }
        }
      }
      .trade-box {
        font-size: 12px;
        padding: 10px;
        border-radius: 8px;
        background: var(--tab-bg-color);
        div:first-child {
          margin-bottom: 2px;
        }
      }
      .purchase-transfer {
        span:last-child {
          color: var(--up-color);
        }
      }
      .transfer-sale {
        text-align: right;
        span:last-child {
          color: var(--down-color);
        }
      }
    }
  }
  .myCoinTab-tabel {
    width: 73%;
    overflow: hidden;
  }
}
</style>
