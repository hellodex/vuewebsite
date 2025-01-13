<template>
  <div class="my-hold">
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
        <el-table :data="list" style="width: 100%" max-height="890px" @row-click="handelTableRow">
          <el-table-column label="币种" min-width="155">
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
                  <span class="base-symbol">{{ scope.row.symbol || '-' }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="当前价格" min-width="130">
            <template #default="scope">
              <PercentageChange :value="scope.row.chg1d" />
              <br />
              <span :class="scope.row?.chg1d?.[0] === '-' ? 'down-color' : 'up-color'"
                >${{ numberFormat(scope.row.price) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="平均买入价格" min-width="120">
            <template #default="scope">
              <span class="text-color">${{ numberFormat(scope.row.averagePrice) || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前持仓" min-width="130">
            <template #default="scope">
              <span class="text-color"
                >{{ numberFormat(scope.row.amount) || '-' }}<br />≈${{
                  numberFormat(scope.row.volume)
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="总买入" min-width="95">
            <template #default="scope">
              <span class="text-color"
                >{{ numberFormat(scope.row.totalBuyAmount) || '-' }}<br />≈${{
                  numberFormat(scope.row.totalBuyVolume)
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="总卖出" min-width="95">
            <template #default="scope">
              <span class="down-color"
                >{{ numberFormat(scope.row.totalSellAmount) || '-' }}<br />≈${{
                  numberFormat(scope.row.totalSellVolume)
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="累计收益" min-width="95">
            <template #default="scope">
              <span :class="scope.row?.totalEarn?.[0] === '-' ? 'down-color' : 'up-color'">{{
                (scope.row?.totalEarn?.[0] === '-' ? '-$' : '+$') +
                numberFormat(scope.row?.totalEarn.replace(/-/g, ''))
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收益率" min-width="95">
            <template #default="scope">
              <PercentageNotbg :value="scope.row?.totalEarnRate || 0" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right" width="260">
            <template #default="scope">
              <span class="hold-btn" @click.stop="handelSellLimit(scope.row)">止盈</span>
              <span class="hold-btn" @click.stop="handelStopLimit(scope.row)">止损</span>
              <span class="hold-btn" @click.stop="handelCustomTradeSwap(scope.row)">一键清仓</span>
            </template>
          </el-table-column>
          <template #empty>
            <empty-data></empty-data>
          </template>
        </el-table>
      </template>
    </el-skeleton>
  </div>
  <SellLimiDialog
    :limitInfo="rowInfo"
    :sellLimitVisible="sellLimitVisible"
    @close="handleClose"
    v-if="sellLimitVisible"
  />
  <StopLimitDialog
    :limitInfo="rowInfo"
    :stopLimitVisible="stopLimitVisible"
    @close="handleClose"
    v-if="stopLimitVisible"
  />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BigNumber from 'bignumber.js'
import { numberFormat } from '@/utils'
import { APIauthTradeSwap } from '@/api/coinWalletDetails'
import { useGlobalStore } from '@/stores/global'
import { USDT_CONFIG } from '@/types'
import { resetAddress, evmTransactionReceipt, solanaTransactionReceipt } from '@/utils/transition'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'
import { useI18n } from 'vue-i18n'

import StopLimitDialog from '../Dialogs/StopLimitDialog.vue'
import SellLimiDialog from '../Dialogs/SellLimiDialog.vue'

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

const okCoin = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const i18n = useI18n()

const useSubscribeKChart = useSubscribeKChartInfo()
const router = useRouter()

const chain = useChainConfigsStore()

const globalStore = useGlobalStore()

const { chainLogoObj } = globalStore

const customWalletInfo = computed(() => globalStore.customWalletInfo)
const chainConfigs = computed(() => chain.chainConfigs)
const price = computed(() =>
  new BigNumber(useSubscribeKChart.subscribeKChartInfo?.C || 0).toString(10)
)

const rowInfo = ref<any>({})
const stopLimitVisible = ref<boolean>(false) // 限价止损
const sellLimitVisible = ref<boolean>(false) // 限价卖出
const account: any = localStorage.getItem('accountInfo')
const slippage = account ? JSON.parse(account).slippage : '0.03'

const handelCustomTradeSwap = async (row: any) => {
  notificationInfo({
    title: `${row.symbol}：一键清仓交易处理中`,
    message: `<div class="display-flex align-items-center">
                <p class="notification_loader"></p>
                <span>一键清仓处理中</span>
              </div>
              <div class='notification-step-line-down'></div>
              `
  })
  const chainConfig = chainConfigs.value.find((item: any) => item.chainCode == row.chainCode)
  const res: any = await APIauthTradeSwap({
    amount: row.rawAmount,
    walletId: customWalletInfo.value.walletInfo?.walletId,
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    fromTokenAddress: resetAddress(row.tokenAddress),
    toTokenAddress: resetAddress(
      row.tokenAddress.toLowerCase() == okCoin
        ? USDT_CONFIG[row.chainCode].address
        : chainConfig.symbolAddress
    ),
    fromTokenDecimals: Number(row.decimals),
    toTokenDecimals: Number(
      row.tokenAddress.toLowerCase() == okCoin
        ? USDT_CONFIG[row.chainCode].decimals
        : chainConfig.decimals
    ),
    slippage,
    type: '1',
    tradeType: 'C',
    price: price.value,
    profitFlag: 0
  })
  if (res) {
    const result =
      row.chainCode == 'SOLANA'
        ? await solanaTransactionReceipt(res.tx, chainConfig.rpc)
        : await evmTransactionReceipt(res.tx, chainConfig.rpc)
    if (result === true) {
      notificationSuccessful({
        title: `${row.symbol}：一键清仓交易成功`,
        message: `${i18n.t('TransactionSuccessful')}`
      })
    } else if (result === false) {
      notificationFailed({
        title: `${row.symbol}：一键清仓交易失败`,
        message: `${i18n.t('TransactionFailed')}`
      })
    } else {
      notificationWarn({
        title: `${row.symbol}`,
        message: `${result}`
      })
    }
  } else {
    notificationFailed({
      title: `${row.symbol}：一键清仓交易失败`,
      message: `${i18n.t('TransactionFailed')}`
    })
  }
}

const handelStopLimit = (row: any) => {
  stopLimitVisible.value = true
  rowInfo.value = row
}

const handelSellLimit = (row: any) => {
  sellLimitVisible.value = true
  rowInfo.value = row
}

const handleClose = (val: boolean) => {
  stopLimitVisible.value = val
  sellLimitVisible.value = val
}

const handelTableRow = (row: any) => {
  if (window.location.href.indexOf('/k/') !== -1) {
    router.push(`/k/${row.pairAddress}?chainCode=${row.chainCode}&timeType=15m`)
  } else {
    window.open(`/k/${row.pairAddress}?chainCode=${row.chainCode}&timeType=15m`)
  }
}
</script>

<style lang="scss" scoped>
.my-hold {
  :deep(.el-table__row) {
    cursor: pointer;
  }
  .hold-btn {
    height: 28px;
    padding: 4px 15px;
    background: #1e1e1e;
    line-height: 28px;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    margin-left: 8px;
    transition: all 0.2s;
  }
  .hold-btn:hover {
    background-color: #333;
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
}
</style>
