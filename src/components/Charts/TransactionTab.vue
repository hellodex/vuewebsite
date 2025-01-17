<template>
  <div class="transaction-tab-content">
    <el-table :data="subscribeSwap" max-height="890px">
      <el-table-column>
        <template #header>
          <div class="display-flex align-items-center">
            <span>{{ i18n.t('kChart.Time') }}</span>
            <svg-icon name="calendar-date" class="transaction-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <div class="display-flex align-items-center text-color">
            {{ timeago(scope.row.txTime * 1000) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="flag">
        <template #header>
          <div class="display-flex align-items-center">
            <span>{{ i18n.t('kChart.Type1') }}</span>
            <svg-icon name="filter-funnel-01" class="transaction-tab-icon"></svg-icon>
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
            <span>{{ i18n.t('home.price') }}($)</span>
            <svg-icon name="filter-funnel-01" class="transaction-tab-icon"></svg-icon>
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
            <span>{{ i18n.t('kChart.Amount') }}({{ baseInfo.tokenInfo?.baseSymbol }})</span>
            <svg-icon name="filter-funnel-01" class="transaction-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <span :class="scope.row.flag == 0 ? 'up-color' : 'down-color'">{{
            numberFormat(scope.row.amount)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderAmount">
        <template #header>
          <div class="display-flex align-items-center">
            <span>{{ i18n.t('kChart.Volume') }}($)</span>
            <svg-icon name="filter-funnel-01" class="transaction-tab-icon"></svg-icon>
          </div>
        </template>
        <template #default="scope">
          <span :class="scope.row.flag == 0 ? 'up-color' : 'down-color'"
            >${{ numberFormat(scope.row.orderAmount) }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="to">
        <template #header>
          <div class="display-flex align-items-center">
            <span>钱包</span>
            <svg-icon name="filter-funnel-01" class="transaction-tab-icon"></svg-icon>
          </div>
        </template>

        <template #default="scope">
          <div class="display-flex align-items-center">
            <!-- <svg-icon name="logo1" class="img"></svg-icon> -->
            {{ shortifyAddress(scope.row.sender) }}
            <span class="num-text">({{ scope.row.orderCount }})</span>
            <svg-icon name="whale" class="img" v-if="scope.row.group === 2"></svg-icon>
            <svg-icon name="dolphin" class="img" v-if="scope.row.group === 1"></svg-icon>
            <svg-icon name="robot" class="img" v-if="scope.row.isRobot === 1"></svg-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tx" align="center">
        <template #header>
          <div class="display-flex align-items-center justify-content-fd">
            <span>Tx</span>
          </div>
        </template>

        <template #default="scope">
          <div class="display-flex align-items-center justify-content-fd">
            {{ shortifyAddress(scope.row.tx) }} &nbsp;
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
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { numberFormat, timeago, shortifyAddress } from '@/utils'
import { CHAIN_URL } from '@/types'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const useChainInfo = useChainInfoStore()
const { chainInfo } = storeToRefs(useChainInfo)

const timer = ref<any>(null)
defineProps({
  baseInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const useSubscribeKChart = useSubscribeKChartInfo()

const subscribeSwap = ref<any>([])

onMounted(() => {
  timer.value = setInterval(() => {
    subscribeSwap.value = [...(useSubscribeKChart.subscribeSwap || [])]
  }, 1000)
})
</script>
<style lang="scss" scoped>
.transaction-tab-content {
  .transaction-tab-icon,
  .img {
    width: 14px;
    height: 14px;
    display: block;
  }
  .transaction-tab-icon {
    margin-left: 4px;
  }
  .img {
    margin-right: 4px;
  }
  .num-text {
    color: #2e90fa;
    margin: 0 4px;
  }
}
</style>
