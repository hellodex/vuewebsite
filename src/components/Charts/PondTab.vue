<template>
  <div class="coinWallet-tabs-content display-flex align-items-fs justify-content-sp">
    <div class="display-flex flex-direction-col pond-box">
      <div class="display-flex align-items-center justify-content-sp">
        <span class="pond-txt">{{ i18n.t('kChart.liquidityPool1') }}</span>
        <div class="display-flex align-items-center">
          <div class="display-flex align-items-center pond-info">
            <span>{{ i18n.t('kChart.LP') }}：</span>
            <span>{{ props.pondTabInfo.lpList?.length }}</span>
          </div>
          <div class="display-flex align-items-center pond-info">
            <span>LP {{ i18n.t('home.Top10hold') }}：</span>
            <span>{{ percent }}%</span>
          </div>
        </div>
      </div>
      <el-scrollbar>
        <div class="pond-tab">
          <div
            v-for="(item, index) in props.pondTabInfo.poolList"
            :key="item.id"
            @click="handelTab(item, index)"
            :class="item.id == tabIndex ? 'pond-tab-item pond-tab-active' : 'pond-tab-item'"
          >
            <div class="display-flex align-items-center">
              <div class="display-flex align-items-center flex-direction-col pond-centent-txt">
                <span>{{
                  item.coinName1.length == 44 ? shortifyAddress(item.coinName1) : item.coinName1
                }}</span>
                <span class="pond-tab-item-txt">{{
                  numberFormat(parseFloat(item.num1 || 0))
                }}</span>
              </div>
              <div class="pond-coin-border"></div>
              <div class="display-flex align-items-center flex-direction-col">
                <span>{{ item.coinName2 }}</span>
                <span class="pond-tab-item-txt">{{
                  numberFormat(parseFloat(item.num2 || 0))
                }}</span>
              </div>
            </div>
            <div class="display-flex align-items-fd flex-direction-col">
              <svg-icon name="lock" class="lock" v-if="index == tabIndex && isLocked"></svg-icon>
              <span class="display-flex align-items-center">
                <i></i>
                <span class="pond-tab-item-txt">${{ numberFormat(item.price) }}</span>
              </span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="pond-table-box">
      <div class="pond-txt-tab">
        <span
          v-for="(item, index) in rightTabList"
          :class="rightTabIndex == index ? 'pond-txt-def pond-txt-act' : 'pond-txt-def'"
          :key="index"
          @click="rightTab(item, index)"
          >{{ item.name }}</span
        >
      </div>
      <template v-if="rightTabIndex == 0">
        <el-table
          :data="props.pondTabInfo.mobilityList"
          :header-cell-style="{ background: '#f9f9f9' }"
          class="pond-table"
          max-height="890px"
        >
          <el-table-column prop="txTime" :label="i18n.t('kChart.Time')" min-width="140">
            <template #default="scope">
              <div class="display-flex align-items-center text-color">
                {{ timeago(scope.row.txTime * 1000) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.t('kChart.Type')" min-width="90">
            <template #default="scope">
              <span
                :class="
                  scope.row.type == 'MINT' ? 'up-color type-up-btn' : 'down-color type-down-btn'
                "
                >{{
                  scope.row.type == 'MINT' ? i18n.t('kChart.Increase') : i18n.t('kChart.Remove')
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="percent"
            :label="i18n.t('kChart.Amount')"
            align="center"
            min-width="200"
          >
            <template #default="scope">
              <p class="percent-p">
                <span :class="scope.row.type == 'MINT' ? 'up-color' : 'down-color'">{{
                  numberFormat(scope.row.baseTokenAmount)
                }}</span
                ><span>{{ scope.row.baseTokenSymbol }}</span>
              </p>
              <p class="percent-p">
                <span :class="scope.row.type == 'MINT' ? 'up-color' : 'down-color'">{{
                  numberFormat(scope.row.quoteTokenAmount)
                }}</span
                ><span>{{ scope.row.quoteTokenSymbol }}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="baseTokenAmount" :label="i18n.t('kChart.Volume')">
            <template #default="scope">
              <span class="text-color">{{ numberFormat(scope.row.baseTokenAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="addLiquidityAddress" :label="i18n.t('kChart.Holder')" width="120">
            <template #default="scope">
              <span class="text-color">{{ shortifyAddress(scope.row.addLiquidityAddress) }}</span>
            </template>
          </el-table-column>
          <template #empty>
            <empty-data></empty-data>
          </template>
        </el-table>
      </template>
      <template v-if="rightTabIndex == 1">
        <el-table
          :data="props.pondTabInfo.lpList"
          :header-cell-style="{ background: '#f9f9f9' }"
          class="pond-table"
          max-height="890px"
        >
          <el-table-column type="index" width="50" label="#" />
          <el-table-column prop="is_locked" :label="i18n.t('kChart.Channel')">
            <template #default="scope">
              <span class="text-color">{{ scope.row.is_locked == 0 ? '未锁' : '已锁' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.t('kChart.EndTime')">
            <template #default="scope">
              <span class="text-color">{{
                !scope.row.locked_detail
                  ? '-'
                  : moment(scope.row.locked_detail[0].end_time).format('YYYY-MM-DD HH:MM:SS')
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="percent" :label="i18n.t('kChart.Proportion')">
            <template #default="scope">
              <span class="text-color"
                >{{ (parseFloat(scope.row.percent) * 100).toFixed(2) }}%</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" :label="i18n.t('kChart.Holder')">
            <template #default="scope">
              <span class="text-color">{{ shortifyAddress(scope.row.address) }}</span>
            </template>
          </el-table-column>
          <template #empty>
            <empty-data></empty-data>
          </template>
        </el-table>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { shortifyAddress, numberFormat, timeago } from '@/utils'

import moment from 'moment'

const i18n = useI18n()
const props = defineProps({
  pondTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const percent = computed(() => {
  let percent = 0
  props.pondTabInfo?.lpList?.forEach((item: { percent: string }) => {
    percent += Number(item.percent)
  })
  return (percent * 100).toFixed(2)
})

const isLocked = computed(() => {
  const isLocked = props.pondTabInfo.lpList?.some(
    (item: { is_locked: number | string }) => item.is_locked == 1
  )
  return isLocked || 0
})
const rightTabList = [
  {
    name: i18n.t('kChart.Liquidity')
  },
  {
    name: i18n.t('kChart.LP')
  }
]

const tabIndex = ref(0)
const rightTabIndex = ref(0)
const handelTab = (item: any, index: number) => {
  tabIndex.value = index
}

const rightTab = (item: any, index: number) => {
  rightTabIndex.value = index
}
</script>
<style lang="scss" scoped>
.coinWallet-tabs-content {
  .pond-txt-tab {
    width: 124px;
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 6px;
    background: var(--bg-color);
  }
  .pond-txt,
  .pond-txt-def {
    color: var(--font-color-default);
    font-size: 14px;

    font-style: normal;
  }
  .pond-txt-def {
    padding: 4px 8px;
    border-radius: 4px;
    background-color: var(--bg-color);
    color: var(--dex-color-4);
    cursor: pointer;
  }
  .pond-txt-act {
    color: var(--font-color-default);
    background-color: var(--tab-bg-color);
  }
  .percent-p {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 6px;
    span:first-child {
      text-align: right;
    }
    span:last-child {
      text-align: left;
    }
  }
  .pond-box {
    width: 32%;
    min-width: 300px;
    margin-right: 20px;
    .pond-info {
      font-size: 12px;
      margin-left: 16px;
      span {
        color: var(--dex-color-4);
      }
      span:last-child {
        color: var(--font-color-default);
      }
    }
  }
  .pond-tab {
    margin-top: 8px;
    max-height: 600px;
  }
  .pond-tab-item {
    padding: 8px 16px;
    border-radius: 8px;
    display: flex;
    display: -webkit-flex;
    align-items: flex-end;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 4px;
    color: var(--dex-color-4);
    background-color: var(--bg-color);

    font-style: normal;
    cursor: pointer;
    .pond-centent-txt {
      width: 80px;
    }
    .pond-tab-item-txt {
      font-size: 14px;
      color: var(--dex-color-4);
      white-space: nowrap;
    }
    .lock {
      width: 12px;
      height: 12px;
      margin-bottom: 6px;
    }
    .pond-coin-border {
      width: 1px;
      height: 38px;
      background: var(--color-border);
      margin: 0 16px;
    }
  }
  .pond-tab-active {
    border-radius: 8px;
    background: var(--tab-bg-color);
    .pond-tab-item-txt {
      color: var(--font-color-default);
    }
    .lock {
      color: var(--up-color);
    }
  }
  .pond-table-box {
    width: 64%;
    position: relative;
    overflow: hidden;
    .pond-table {
      margin-top: 8px;
    }
  }
}
</style>
