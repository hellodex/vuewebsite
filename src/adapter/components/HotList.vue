<template>
  <div class="table-box">
    <el-skeleton style="width: 100%" :loading="tableLoading" animated>
      <template #template>
        <div style="width: 100%; padding: 15px 10px" v-for="item in 20" :key="item">
          <div class="display-flex align-items-center">
            <el-skeleton-item
              variant="circle"
              style="width: 32px; height: 32px; margin-right: 6px"
            />
            <el-skeleton-item variant="text" style="height: 20px" />
          </div>
        </div>
      </template>
      <template #default>
        <el-table
          :data="chainIdDataList"
          @row-click="handelTableRow"
          :row-class-name="getRowClassName"
          scrollbar-always-on
        >
          <el-table-column type="index" width="45" label="#" />
          <el-table-column :label="i18n.t('home.token')" min-width="280">
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
                <div class="display-flex flex-direction-col">
                  <p class="display-flex align-items-center">
                    <span class="base-symbol">{{ scope.row.baseToken?.symbol || '-' }}</span>
                    <span class="tokens—after">/{{ scope.row.quoteToken?.symbol || '-' }}</span>
                  </p>
                  <p class="display-flex align-items-center address">
                    <span>{{ shortifyAddress(scope.row.baseToken.address) }}</span>
                    <svg-icon
                      name="copy"
                      class="copy"
                      v-copy="scope.row.baseToken.address"
                    ></svg-icon>
                    <Favorite
                      :coinInfo="{
                        pairAddress: scope.row.pairAddress,
                        chainCode: scope.row.chainCode
                      }"
                    />
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="i18n.t('home.price') + '($)'"
            sortable
            sort-by="price"
            min-width="120"
          >
            <template #default="scope">
              <span class="txt">${{ numberFormat(scope.row.priceByPairAddress.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.t('home.MCap')" sortable sort-by="price" min-width="120">
            <template #default="scope">
              <span class="txt">${{ numberFormat(scope.row.priceByPairAddress.marketCap) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="TVL" sortable sort-by="price" min-width="120">
            <template #default="scope">
              <span class="txt">${{ numberFormat(scope.row.priceByPairAddress.tvl) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.t('home.holders')" sortable sort-by="price" min-width="120">
            <template #default="scope">
              <span style="color: #e89f13">{{
                scope.row.priceByPairAddress.holders
                  ? numberFormat(scope.row.priceByPairAddress.holders)
                  : '/'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="15m%" min-width="120px">
            <template #default="scope">
              <PercentageChange class="ml-5" :value="scope.row.priceByPairAddress.chg15m" />
            </template>
          </el-table-column>
          <el-table-column label="1h%" min-width="120">
            <template #default="scope">
              <PercentageChange class="ml-5" :value="scope.row.priceByPairAddress.chg1h" />
            </template>
          </el-table-column>
          <el-table-column label="24h%" min-width="120">
            <template #default="scope">
              <PercentageChange class="ml-5" :value="scope.row.priceByPairAddress.chg1d" />
            </template>
          </el-table-column>
          <el-table-column min-width="130">
            <template #header>
              <div class="display-flex align-items-center">
                <span class="table-head-tag">{{
                  timeTabIndex == '1d' ? '24h' : timeTabIndex
                }}</span>
                <span>{{ i18n.t('home.Vol') }}</span>
              </div>
            </template>
            <template #default="scope">
              <div class="trading-indicators display-flex flex-direction-col">
                <span class="txt"
                  >${{
                    numberFormat(
                      scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalValue
                    )
                  }}</span
                >
                <div
                  class="trading-indicators-proportion display-flex align-items-center"
                  v-if="scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalValue > 0"
                >
                  <div
                    class="proportion-up display-flex flex-direction-col"
                    v-if="
                      percentage(
                        scope.row.tradingSummary['tradingSummary' + timeTabIndex].buyTotalValue,
                        scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalValue
                      ) !== '0'
                    "
                    :style="{
                      width:
                        percentage(
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].buyTotalValue,
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalValue
                        ) + '%'
                    }"
                  >
                    <span
                      >{{
                        percentage(
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].buyTotalValue,
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalValue
                        )
                      }}%</span
                    >
                    <strong></strong>
                  </div>
                  <div
                    class="proportion-down display-flex flex-direction-col"
                    v-if="
                      percentage(
                        scope.row.tradingSummary['tradingSummary' + timeTabIndex].sellTotalValue,
                        scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalValue
                      ) !== '0'
                    "
                    :style="{
                      width:
                        percentage(
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].sellTotalValue,
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalValue
                        ) + '%'
                    }"
                  >
                    <span
                      >{{
                        percentage(
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].sellTotalValue,
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalValue
                        )
                      }}%</span
                    >
                    <strong></strong>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="130">
            <template #header>
              <div class="display-flex align-items-center">
                <span class="table-head-tag">{{
                  timeTabIndex == '1d' ? '24h' : timeTabIndex
                }}</span>
                <span>{{ i18n.t('home.Txns') }}</span>
              </div>
            </template>
            <template #default="scope">
              <div class="trading-indicators display-flex flex-direction-col">
                <span class="txt">{{
                  numberFormat(scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalCount)
                }}</span>
                <div
                  class="trading-indicators-proportion display-flex align-items-center"
                  v-if="scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalCount > 0"
                >
                  <div
                    class="proportion-up display-flex flex-direction-col"
                    v-if="
                      percentage(
                        scope.row.tradingSummary['tradingSummary' + timeTabIndex].buyCount,
                        scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalCount
                      ) !== '0'
                    "
                    :style="{
                      width:
                        percentage(
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].buyCount,
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalCount
                        ) + '%'
                    }"
                  >
                    <span
                      >{{
                        percentage(
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].buyCount,
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalCount
                        )
                      }}%</span
                    >
                    <strong></strong>
                  </div>
                  <div
                    class="proportion-down display-flex flex-direction-col"
                    v-if="
                      percentage(
                        scope.row.tradingSummary['tradingSummary' + timeTabIndex].sellCount,
                        scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalCount
                      ) !== '0'
                    "
                    :style="{
                      width:
                        percentage(
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].sellCount,
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalCount
                        ) + '%'
                    }"
                  >
                    <span
                      >{{
                        percentage(
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].sellCount,
                          scope.row.tradingSummary['tradingSummary' + timeTabIndex].TotalCount
                        )
                      }}%</span
                    >
                    <strong></strong>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="i18n.t('home.Top10hold') + '%'"
            sortable
            sort-by="price"
            min-width="150"
          >
            <template #default="scope">
              <span style="color: #e89f13"
                >{{
                  scope.row.topTenPercent != '0' ? (scope.row.topTenPercent * 100).toFixed(2) : 0
                }}%</span
              >
            </template>
          </el-table-column>
          <el-table-column :label="i18n.t('home.Time')" min-width="140">
            <template #default="scope">
              <span class="txt">{{ timeago(scope.row.priceByPairAddress.startTime * 1000) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="i18n.t('home.Security')"
            sortable
            sort-by="price"
            min-width="110"
          >
            <template #default="scope">
              <svg-icon
                name="auth-check"
                style="width: 24px; height: 24px; color: #17b26a"
                v-if="scope.row.security == '0'"
              ></svg-icon>
              <svg-icon
                name="alert-triangle"
                style="width: 24px; height: 24px"
                v-else-if="scope.row.security == '1'"
              ></svg-icon>
              <span v-else class="txt">未知</span>
            </template>
          </el-table-column>
          <el-table-column label="DEX" sortable sort-by="price" min-width="110">
            <template #default="scope">
              <el-image :src="scope.row.dex" alt="" style="width: 24px; height: 24px">
                <template #error>
                  <svg-icon name="logo1" style="width: 24px; height: 24px"></svg-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            :label="i18n.t('home.Operation')"
            width="240"
            align="right"
            fixed="right"
          >
            <template #default="scope">
              <div class="display-flex align-items-center justify-content-fd">
                <WalletConnect v-if="!isConnected">
                  <div class="operate-btn">
                    <svg-icon name="icon-buy" class="flash-trade"></svg-icon>
                    <span class="txt"
                      >买入 {{ amount && amount !== '0' ? numberFormat(amount) : '' }}</span
                    >
                  </div>
                </WalletConnect>
                <QuickBuyTrade :info="scope.row" :amount="amount" v-else
                  >买入 {{ amount && amount !== '0' ? numberFormat(amount) : '' }}</QuickBuyTrade
                >
                <WalletConnect v-if="!isConnected">
                  <div class="operate-btn">
                    <svg-icon name="flash-trade" class="flash-trade"></svg-icon>
                    <span class="txt">挂单交易</span>
                  </div>
                </WalletConnect>
                <div class="operate-btn" @click.stop="handelTrade(scope.row)" v-else>
                  <svg-icon name="flash-trade" class="flash-trade"></svg-icon>
                  <span class="txt">挂单交易</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <empty-data></empty-data>
          </template>
        </el-table>
      </template>
    </el-skeleton>
    <TradeDraw
      :coinInfo="coinInfo"
      :pairInfo="pairInfo"
      :tradeDrawVisible="tradeDrawVisible"
      @close="handleDrawClose"
      v-if="tradeDrawVisible"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'
import { numberFormat, timeago, shortifyAddress, handleCoinPairInfo } from '@/utils'
import TradeDraw from '@/components/Dialogs/TradeDraw.vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import QuickBuyTrade from './QuickBuyTrade.vue'
import Favorite from '@/components/Favorite.vue'

const i18n = useI18n()
const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore
const isConnected = computed(() => globalStore.walletInfo.isConnected)

const tradeDrawVisible = ref<boolean>(false)
const coinInfo = ref<any>(null)
const pairInfo = ref<any>(null)

defineProps({
  tableLoading: {
    type: Boolean,
    default: false
  },
  timeTabIndex: {
    type: String,
    default: '1d'
  },
  chainIdDataList: {
    type: Array,
    default: () => {
      return []
    }
  },
  amount: {
    required: true,
    type: String
  }
})

const percentage = (numerator: number, denominator: number): string => {
  return ((numerator / denominator) * 100).toFixed(0)
}

const getRowClassName = ({ row }: { row: any }) => {
  return row.riseAndFall
}

const handelTableRow = (row: any) => {
  handelJump(row)
}
const handelJump = (item: any) => {
  window.open(`/k/${item.pairAddress}?chainCode=${item.chainCode}`)
}

const handelTrade = (row: any) => {
  console.log(row)
  coinInfo.value = handleCoinPairInfo({
    logo: row.logo,
    baseAddress: row.baseToken.address,
    quoteAddress: row.quoteToken.address,
    baseSymbol: row.baseToken.symbol,
    quoteSymbol: row.quoteToken.symbol,
    baseDecimal: row.baseToken.decimals,
    quoteDecimal: row.quoteToken.decimals,
    chainCode: row.chainCode
  })
  pairInfo.value = {
    tvl: row.priceByPairAddress.tvl || 0,
    circulationVol: row.priceByPairAddress.marketCap || 0,
    price: row.priceByPairAddress.price || 0
  }

  tradeDrawVisible.value = true
}

const handelBuy = (row: any) => {
  console.log(row)
}

const handleDrawClose = () => {
  tradeDrawVisible.value = false
}
</script>
<style scoped lang="scss">
.table-box {
  border-radius: 12px;
  padding: 12px;
  background-color: var(--card-bg-color);
  :deep(.el-table__row) {
    cursor: pointer;
  }
  :deep(.el-table) {
    overflow: initial;
    .cell {
      line-height: 1.2;
    }
  }
  :deep(.el-table .el-table__header-wrapper) {
    position: sticky;
    top: 50px;
    z-index: 9;
  }
  .audit-text {
    justify-content: center;
    .audit-text-item {
      margin-right: 10px;
    }
    .audit-text-item:last-child {
      margin-right: 0;
    }
    span {
      margin-top: 5px;
      color: #999;
      font-size: 10px;
    }
  }
  .txt {
    color: var(--font-color-default);
  }
  .tokens—after {
    color: var(--dex-color-4);
    margin-left: 0 !important;
  }
  .table-head-tag {
    width: 32px;
    height: 20px;
    border-radius: 4px;
    font-size: 12px;
    color: #e0e0e0;
    background: #343434;
    margin-right: 4px;
    line-height: 20px;
    text-align: center;
  }
  .operate-btn {
    margin-left: 6px;
    display: inline-flex;
    align-items: center;
    height: 34px;
    padding: 8px 12px;
    border-radius: 8px;
    background: #1e1e1e;
    font-size: 12px;
    color: var(--font-color-default);
    cursor: pointer;
    transition: all 0.2;
    .flash-trade {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
    span {
      white-space: nowrap;
    }
  }
  .operate-btn:hover {
    background-color: #333;
  }

  :deep(.connect-wallet-btn) {
    padding: 0;
    background-color: transparent;
    min-width: auto;
  }

  .tarding-text {
    font-size: 12px;
    color: #b4b4b4;
    margin-right: 8px;
  }
  .trading-indicators {
    width: 100%;
    .trading-indicators-proportion {
      width: 100%;
    }
    .proportion-up {
      font-size: 10px;
      color: var(--up-color);
      line-height: 1.8;
      span {
        white-space: nowrap;
      }
      strong {
        width: 100%;
        height: 3px;
        background-color: var(--up-color);
        border-radius: 99px 0 0 99px;
        font-weight: normal;
      }
    }
    .proportion-down {
      font-size: 10px;
      color: var(--down-color);
      text-align: right;
      line-height: 1.8;
      span {
        white-space: nowrap;
      }
      strong {
        width: 100%;
        height: 3px;
        background-color: var(--down-color);
        border-radius: 0 99px 99px 0;
        font-weight: normal;
      }
    }
  }
  .address {
    margin: 2px 0;
    font-size: 12px;
    :deep(.favorite-box) {
      margin-left: 4px;
      .star-o-icon {
        width: 12px;
        height: 12px;
        margin-right: 0;
      }
      .star-icon {
        width: 12px;
        height: 12px;
        margin-right: 0;
      }
    }
  }

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
  .copy {
    width: 12px;
    height: 12px;
    cursor: pointer;
    margin-left: 4px;
  }
  .coin-box {
    min-width: 116px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
