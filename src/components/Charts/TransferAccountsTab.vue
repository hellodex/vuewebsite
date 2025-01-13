<template>
  <div class="transferAccounts-tab-content" v-loading="transferAccountsTabInfo.loading">
    <el-table
      :data="transferAccountsTabInfo.transferInfo || []"
      :header-cell-style="{ background: '#f9f9f9' }"
      max-height="890px"
    >
      <el-table-column min-width="140">
        <template #header>
          <div class="display-flex align-items-center">
            <span>{{ i18n.t('kChart.Time') }}</span>
            <svg-icon name="calendar-date" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <div class="display-flex align-items-center">
            {{ timeago(scope.row.txTime * 1000) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="80">
        <template #header>
          <div class="display-flex align-items-center">
            <span>{{ i18n.t('kChart.Type1') }}</span>
            <svg-icon name="filter-funnel-01" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <span
            :class="scope.row.isContract == 1 ? 'down-color type-down-btn' : 'up-color type-up-btn'"
            >{{
              scope.row.isContract ? i18n.t('kChart.TransferOut') : i18n.t('kChart.TransferIn')
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="value" min-width="130">
        <template #header>
          <div class="display-flex align-items-center">
            <span>{{ i18n.t('kChart.Amount') }}({{ baseInfo.tokenInfo?.baseSymbol }})</span>
            <svg-icon name="filter-funnel-01" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <span :class="scope.row.isContract == 1 ? 'down-color' : 'up-color'">{{
            numberFormat(scope.row.value)
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="orderAmount">
        <template #header>
          <div class="display-flex align-items-center">
            <span>金额($)</span>
            <svg-icon name="filter-funnel-01" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <span :class="scope.row.isContract == 1 ? 'down-color' : 'up-color'">{{
            numberFormat(scope.row.orderAmount)
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="from" min-width="120">
        <template #header>
          <div class="display-flex align-items-center">
            <span>{{ i18n.t('kChart.From') }}</span>
            <svg-icon name="filter-funnel-01" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <div class="display-flex align-items-center">
            {{ shortifyAddress(scope.row.from) }}
            <svg-icon name="share-04" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="to" min-width="120px">
        <template #header>
          <div class="display-flex align-items-center">
            <span>{{ i18n.t('kChart.To') }}</span>
            <svg-icon name="filter-funnel-01" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <div class="display-flex align-items-center">
            {{ shortifyAddress(scope.row.to) }}
            <svg-icon name="share-04" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="tx">
        <template #header>
          <div class="display-flex align-items-center">
            <span>Tx</span>
            <svg-icon name="filter-funnel-01" class="transferAccounts-tab-icon"></svg-icon>
          </div>
        </template>

        <template #default="scope">
          <div class="display-flex align-items-center">
            <svg-icon name="share-04" class="img"></svg-icon>
            <svg-icon name="filter-funnel-01" class="img"></svg-icon>
            <a :href="CHAIN_URL[chainInfo.chainCode] + scope.row.tx" target="_blank">
              <svg-icon name="ethscan" class="img ethscan"></svg-icon>
            </a>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <empty-data></empty-data>
      </template>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useChainInfoStore } from '@/stores/chainInfo'
import { timeago, shortifyAddress, numberFormat } from '@/utils'

import { CHAIN_URL } from '@/types'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const useChainInfo = useChainInfoStore()
const { chainInfo } = storeToRefs(useChainInfo)
defineProps({
  transferAccountsTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  baseInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>
<style lang="scss" scoped>
.transferAccounts-tab-content {
  .transferAccounts-tab-icon,
  .img {
    width: 14px;
    height: 14px;
    display: block;
  }
  .transferAccounts-tab-icon {
    margin-left: 4px;
  }
  .img {
    margin-right: 4px;
  }
}
</style>
