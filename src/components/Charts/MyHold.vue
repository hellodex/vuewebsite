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
          <el-table-column label="币种" min-width="150">
            <template #default="scope">
              <div class="display-flex align-items-center coin-box" style="flex-wrap: wrap">
                <span class="logo">
                  <el-image :src="scope.row.logo" alt="" class="coin-icon">
                    <template #error>
                      <svg-icon name="logo1" class="coin-icon"></svg-icon>
                    </template>
                  </el-image>
                  <img :src="chainLogoObj[scope.row.chainCode]" alt="" class="chainCode" />
                </span>
                <p class="display-flex align-items-center">
                  <span class="base-symbol font-family-Medium">{{ scope.row.symbol || '-' }}</span>
                  <svg-icon name="copy" class="copy" v-copy="scope.row.tokenAddress"></svg-icon>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="平均买入价格">
            <template #default="scope">
              <span class="text-color font-family-Medium"
                >${{ numberFormat(scope.row.averagePrice) || '-' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="当前价格">
            <template #default="scope">
              <span
                :class="
                  scope.row?.chg1d?.[0] === '-'
                    ? 'font-family-Medium down-color'
                    : 'font-family-Medium up-color'
                "
                >${{ numberFormat(scope.row.price) }}
              </span>
              <br />
              <PercentageNotbg :value="scope.row.chg1d" />
            </template>
          </el-table-column>
          <el-table-column label="当前持仓">
            <template #default="scope">
              <span class="text-color font-family-Medium"
                >{{ numberFormat(scope.row.amount) || '-' }}<br />
              </span>
              <span class="">≈${{ numberFormat(scope.row.volume) }} </span>
            </template>
          </el-table-column>
          <el-table-column label="总买入">
            <template #default="scope">
              <span class="up-color font-family-Medium"
                >{{ numberFormat(scope.row.totalBuyAmount) || '-' }}
              </span>
              <br />
              <span>≈${{ numberFormat(scope.row.totalBuyVolume) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总卖出">
            <template #default="scope">
              <span class="down-color font-family-Medium"
                >{{ numberFormat(scope.row.totalSellAmount) || '-' }}
              </span>
              <br />
              <span>≈${{ numberFormat(scope.row.totalSellVolume) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="累计收益">
            <template #default="scope">
              <span
                :class="
                  scope.row?.totalEarn?.[0] === '-'
                    ? 'font-family-Medium down-color'
                    : 'font-family-Medium up-color'
                "
                >{{
                  (scope.row?.totalEarn?.[0] === '-' ? '-$' : '+$') +
                  numberFormat(scope.row?.totalEarn.replace(/-/g, ''))
                }}</span
              >
              <br />
              <PercentageNotbg :value="scope.row?.totalEarnRate || 0" class="font-family-Medium" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="right">
            <template #default="scope">
              <div class="display-flex align-items-center justify-content-fd">
                <span class="hold-btn" @click.stop="handelShare(scope.row)">分享</span>

                <span class="hold-btn btn-trade" @click.stop="handelCustomTradeSwap(scope.row)"
                  >一键清仓</span
                >
                <div class="display-flex flex-direction-col">
                  <span class="hold-btn btn-buy" @click.stop="handelSellLimit(scope.row)"
                    >止盈</span
                  >
                  <span class="hold-btn btn-trade" @click.stop="handelStopLimit(scope.row)"
                    >止损</span
                  >
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

  <TokenShareDialog
    :tokenShareVisible="tokenShareVisible"
    :shareCoinInfo="shareCoinInfo"
    :qrcodeUrl="qrcodeUrl"
    :chartData="chartData"
    @close="handleClose"
    v-if="tokenShareVisible"
  />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BigNumber from 'bignumber.js'
import QRCode from 'qrcode'
import { numberFormat } from '@/utils'
import { APIauthTradeSwap } from '@/api/coinWalletDetails'
import { useGlobalStore } from '@/stores/global'
import { USDT_CONFIG } from '@/types'
import { resetAddress } from '@/utils/transition'
import { notificationInfo, notificationSuccessful, notificationFailed } from '@/utils/notification'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import { useI18n } from 'vue-i18n'
import { APIgetChartByBaseAddress } from '@/api'
import StopLimitDialog from '../Dialogs/StopLimitDialog.vue'
import SellLimiDialog from '../Dialogs/SellLimiDialog.vue'
import TokenShareDialog from '../Dialogs/TokenShareDialog.vue'
import { showLoadingToast, closeToast } from 'vant'

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
const tokenShareVisible = ref<boolean>(false) // 分享弹窗
const shareCoinInfo = ref<any>({})
const chartData = ref<any>({})
const qrcodeUrl = ref<string>('')

const account: any = localStorage.getItem('accountInfo')
const slippage = account ? JSON.parse(account).slippage : '0.03'

const handelCustomTradeSwap = async (row: any) => {
  notificationInfo({
    title: `${row.symbol}：一键清仓处理中`,
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
  if (res.code == 200) {
    notificationSuccessful({
      title: `${row.symbol}：一键清仓成功`,
      message: `一键清仓成功`
    })
  } else {
    notificationFailed({
      title: `${row.symbol}：一键清仓失败`,
      message: `${res.msg}`
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
  tokenShareVisible.value = val
}

const handelTableRow = (row: any) => {
  if (window.location.href.indexOf('/k/') !== -1) {
    router.push(`/k/${row.pairAddress}?chainCode=${row.chainCode}`)
  } else {
    window.open(`/k/${row.pairAddress}?chainCode=${row.chainCode}`)
  }
}

const handelShare = async (row: any) => {
  showLoadingToast({
    message: `加载中...`,
    forbidClick: true
  })
  shareCoinInfo.value = row
  const url = ` https://t.me/HelloDex_cn`
  qrcodeUrl.value = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H'
  })
  const res: any = await APIgetChartByBaseAddress({
    baseAddress: row.tokenAddress,
    chainCode: row.chainCode,
    type: '5m',
    size: 20
  })

  closeToast()

  chartData.value = {
    kLine: res.reverse() || [],
    options:
      row.totalEarn[0] === '-'
        ? {
            topColor: '#F6465D',
            shadowTopColor: 'rgba(246, 70, 93, 0.2)',
            shadowBottomColor: 'rgba(246, 70, 93, 0)'
          }
        : {
            topColor: '#2EBD85',
            shadowTopColor: 'rgba(46, 189, 133, 0.2)',
            shadowBottomColor: 'rgba(46, 189, 133, 0)'
          }
  }
  tokenShareVisible.value = true
}
</script>

<style lang="scss" scoped>
.my-hold {
  :deep(.el-table__row) {
    cursor: pointer;
  }
  .hold-btn {
    display: inline-block;
    line-height: 1.2;
    padding: 4px 12px;
    border-radius: 16px;
    border: 1px solid #222;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    margin-left: 8px;
    transition: all 0.2s;
    color: #848e9c;
    margin-bottom: 8px;
    transition: all 0.2s;
  }
  .hold-btn:hover {
    color: #f5f5f5;
  }
  .btn-trade {
    background: rgba(246, 70, 93, 0.1);
    color: var(--down-color);
    transition: all 0.3s;
  }
  .btn-trade:hover {
    color: red;
  }
  .btn-buy {
    background: rgba(46, 189, 133, 0.1);
    color: green;
    transition: all 0.3s;
  }
  .btn-buy:hover {
    color: var(--up-color);
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
      line-height: 1.8;
    }
  }
  .copy {
    width: 12px;
    min-width: 12px;
    height: 12px;
    margin-left: 4px;
    cursor: pointer;
  }
}
</style>
