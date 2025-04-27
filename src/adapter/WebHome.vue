<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <section class="webhome-content animation-bg">
    <div class="home-table-data">
      <div class="table-nav display-flex align-items-center justify-content-sp">
        <div class="table-noun-screen display-flex align-items-center">
          <span
            :class="
              nounScreenId == item.id
                ? 'display-flex align-items-center noun-screen-active'
                : 'display-flex align-items-center'
            "
            v-for="item in nounScreenList"
            :key="item.id"
            @click="handelNounScreenTab(item)"
          >
            <svg-icon
              :name="item.icon?.name"
              :style="{ color: item.icon?.color }"
              class="noun-screen-icon"
              v-if="item.icon && item.id !== 13"
            ></svg-icon>
            <img
              src="@/assets/img/pump-logo.webp"
              class="noun-screen-icon"
              alt=""
              v-else-if="item.id == 13"
            />
            {{ item.name }}
          </span>
          <a
            href="https://t.me/HelloDex_cn"
            target="_blank"
            class="display-flex align-items-center noun-screen-active"
          >
            <img src="@/assets/img/img-tg.png" class="noun-screen-icon" />
            0 延时通知
          </a>
        </div>
        <div class="table-network-screen display-flex align-items-center">
          <!-- <div class="time-tab display-flex align-items-center" v-if="nounScreenId != 13">
              <span
                v-for="item in timeTabList"
                :key="item.code"
                :class="timeTabIndex == item.code ? 'cur' : ''"
                @click="handelTimeTab(item)"
                >{{ item.name }}</span
              >
            </div> -->
          <div class="quick-buy-box display-flex align-items-center">
            <DoubleCost style="margin-right: 20px" />
            <svg-icon :name="isConnected ? 'icon-buy-cur' : 'icon-buy'" class="icon-svg"></svg-icon>
            <span style="margin: 0 8px 0 4px">买入数量</span>
            <el-input
              v-model="amount"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              style="width: 80px"
              size="small"
              placeholder="请输入"
            >
              <template #prefix>
                <img
                  v-if="nounScreenId != 13 ? chainLogoObj[chainCode] : chainLogoObj['SOLANA']"
                  :src="nounScreenId != 13 ? chainLogoObj[chainCode] : chainLogoObj['SOLANA']"
                  alt=""
                  class="icon-svg"
                />
                <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
              </template>
            </el-input>
          </div>
          <el-popover
            placement="bottom"
            :width="400"
            :visible="popperVisible"
            popper-class="table-network-popper"
            ref="popoverRef"
            v-if="nounScreenId != 13"
          >
            <template #reference>
              <div
                class="table-select-text display-flex align-items-center justify-content-sp"
                @click="popperVisible = !popperVisible"
                style="margin-left: 16px"
              >
                <img
                  v-if="chainLogoObj?.[chainCode]"
                  :src="chainLogoObj[chainCode]"
                  alt=""
                  class="icon-svg"
                />
                <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
                <span>{{ chainName }}</span>
                <el-icon color="#828282" v-if="!popperVisible"><ArrowDownBold /></el-icon>
                <el-icon color="#828282" v-else><ArrowUpBold /></el-icon>
              </div>
            </template>
            <div class="display-flex flex-direction-col">
              <span
                v-for="item in chainList"
                :key="item.id"
                @click="handelChain(item)"
                v-click-outside="onClickOutside"
                :class="
                  chainId == item.chainType
                    ? 'display-flex align-items-center active'
                    : 'display-flex align-items-center'
                "
              >
                <img v-if="item.logo" :src="item.logo" alt="" class="icon-svg" />
                <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
                {{ item.chainName }}
              </span>
            </div>
          </el-popover>
        </div>
      </div>
      <AiSignals :amount="amount" v-if="nounScreenId == 99" />
      <PumpList :amount="amount" v-else-if="nounScreenId == 13" />
      <HotList
        :tableLoading="tableLoading"
        :timeTabIndex="timeTabIndex"
        :chainIdDataList="chainIdDataList"
        :amount="amount"
        v-else
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import {
  ref,
  unref,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  computed,
  watch
} from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ClickOutside as vClickOutside } from 'element-plus'

import DoubleCost from '@/components/DoubleCost.vue'
import AiSignals from '@/adapter/components/AiSignals.vue'
import HotList from '@/adapter/components/HotList.vue'
import PumpList from '@/adapter/components/PumpList.vue'
import { APIinitTokenInfo, APIfreshPriceList, ApiGetRankings } from '@/api'
import { useGlobalStore } from '@/stores/global'
import { numberFormat, dataAssembly, numFormat } from '@/utils'

const router = useRouter()
const i18n = useI18n()

const globalStore = useGlobalStore()
const { language, chainLogoObj, chainList } = globalStore

const isConnected = computed(() => globalStore.walletInfo.isConnected)

const timeTabList = [
  {
    name: '1m',
    code: '1m'
  },
  {
    name: '5m',
    code: '5m'
  },
  {
    name: '15m',
    code: '15m'
  },
  {
    name: '1H',
    code: '1h'
  },
  {
    name: '4H',
    code: '4h'
  },
  {
    name: '24H',
    code: '1d'
  }
]

const timeTabIndex = ref<string>('1d')

const skeletonLoading = ref<boolean>(true)
const popperVisible = ref<boolean>(false)
const popoverRef = ref()
const hotSearchByChainData = ref<any>([]) // 涨幅榜代币数据
const hotSearchList = ref<any>([]) // 涨幅榜数据

const mainstreamCoinsData = ref<any>([]) // 主流币数据
const mainstreamCoinsList = ref<any>([]) // 主流币实时价格数据

const chainIdChainData = ref<any>([]) // 公链ID 代币数据

const chainIdDataList = ref<any>([]) // 根据公链ID 获取数据

const btcFearAndGreed = ref<any>({}) // 恐惧与贪婪指数

const timer = ref<any>(null) // 定时器

const chainId = ref<number | string>(0) // 公链ID
const chainCode = ref<string>('') // 公链code
const chainName = ref<string>('') // 公链name
const tableLoading = ref<boolean>(false)

const nounScreenId = ref<number>(parseFloat(localStorage.getItem('nounScreenId') || '0') || 13) // 名词筛选

const amount = ref<string>('0.01')

const nounScreenList = ref<any>([])
const nounScreenIcon: any = {
  1: {
    name: 'fire',
    color: '#F6465D'
  },
  8: {
    name: 'activity',
    color: '#F6465D'
  },
  9: {
    name: 'stars',
    color: '#E89F13'
  },
  2: {
    name: 'line-chart-up-02',
    color: '#17B26A'
  },
  3: {
    name: 'line-chart-down-02',
    color: '#F6465D'
  }
}

/**
 *
 * @param currentData 当前请求的数据
 * @param lastData  上次请求缓存的数据
 *
 * @returns currentData 返回当前请求的数据
 */
function lastComparedToCurrent(currentData: any[] = [], lastData: any[] = []): any[] {
  currentData.forEach((item: any) => {
    lastData.forEach((itm: any) => {
      if (itm.pairAddress == item.pairAddress) {
        if (parseFloat(item.priceByPairAddress.chg1d) > parseFloat(itm.priceByPairAddress.chg1d)) {
          item.riseAndFall = 'rise'
        } else if (
          parseFloat(item.priceByPairAddress.chg1d) < parseFloat(itm.priceByPairAddress.chg1d)
        ) {
          item.riseAndFall = 'fall'
        }
      }
    })
  })

  return currentData
}

async function getInitTokenInfo() {
  const tokenInfoByChainData: any = await APIinitTokenInfo()
  btcFearAndGreed.value = tokenInfoByChainData?.btcFearAndGreed || {}

  nounScreenList.value =
    [
      {
        createTime: '2024-07-01 02:50:42',
        id: 99,
        location: 0,
        logo: '',
        name: 'AI 信号',
        sort: 0,
        type: '',
        updateTime: '2024-08-19 07:59:23'
      },
      ...(tokenInfoByChainData?.rankingInfo?.filter((item: { id: number }) => item.id == 13) || []),
      ...(tokenInfoByChainData?.rankingInfo?.filter((item: { id: number }) => item.id != 13) || [])
    ].map((item: { name: any; id: string | number }) => {
      return {
        name: item.name,
        id: item.id,
        icon: nounScreenIcon[item.id]
      }
    }) || []
  hotSearchByChainData.value = tokenInfoByChainData?.pumpFunRanking || []
  mainstreamCoinsData.value = tokenInfoByChainData?.topRanking || []
  await getRankings()
  getFreshPriceList()
}

async function getRankings() {
  const res: any = await ApiGetRankings({
    chainCode: chainCode.value == 'DEX' ? null : chainCode.value,
    type: nounScreenId.value
  })
  console.log(res)
  chainIdChainData.value = res?.customRank || []
}

async function getFreshPriceList() {
  const mainstreamCoinsPairAddressList = mainstreamCoinsData.value.map(
    (item: any) => item.pairAddress
  )
  const priceList: any = await APIfreshPriceList({
    price: [...hotSearchByChainData.value.map((item: any) => `${item.searchId}`)],
    priceAndInfo: [
      ...chainIdChainData.value.map((item: any) => `${item.searchId}`),
      ...mainstreamCoinsData.value.map((item: any) => `${item.searchId}`)
    ],
    period: timeTabIndex.value
  })

  const chainIdDataPriceList =
    (priceList.priceAndInfo &&
      priceList.priceAndInfo.filter(
        (item: { pairAddress: any }) => !mainstreamCoinsPairAddressList.includes(item.pairAddress)
      )) ||
    []
  const mainstreamCoinsPriceList =
    (priceList?.priceAndInfo &&
      priceList.priceAndInfo.filter((item: { pairAddress: any }) =>
        mainstreamCoinsPairAddressList.includes(item.pairAddress)
      )) ||
    []

  console.log('chainIdDataPriceList', chainIdDataPriceList)
  console.log('mainstreamCoinsPriceList', mainstreamCoinsPriceList)

  hotSearchList.value = dataAssembly(hotSearchByChainData.value, priceList.price)
  chainIdDataList.value = dataAssembly(chainIdChainData.value, chainIdDataPriceList)
  mainstreamCoinsList.value = dataAssembly(mainstreamCoinsData.value, mainstreamCoinsPriceList)
  skeletonLoading.value = false
  tableLoading.value = false
}

async function getChainList() {
  chainId.value = chainList[0].chainType
  chainCode.value = chainList[0].chainCode
  chainName.value = chainList[0].chainName
  getInitTokenInfo()
}

const handelNounScreenTab = async (item: any) => {
  nounScreenId.value = item.id
  localStorage.setItem('nounScreenId', nounScreenId.value.toString())
  if (nounScreenId.value !== 13) {
    tableLoading.value = true
    await getRankings()
    await getFreshPriceList()
    tableLoading.value = false
    setPolling()
  } else {
    clearInterval(timer.value)
    timer.value = null
  }
}

const handelChain = async (item: any) => {
  chainId.value = item.chainType
  chainCode.value = item.chainCode
  chainName.value = item.chainName
  tableLoading.value = true
  popperVisible.value = false
  await getRankings()
  await getFreshPriceList()
  tableLoading.value = false
  setPolling()
}

const handelTimeTab = async (item: { code: string }) => {
  timeTabIndex.value = item.code
}
/**点击空白处隐藏 */
const onClickOutside = (e: any) => {
  if (popperVisible.value && !unref(popoverRef).popperRef.contentRef.contains(e.target)) {
    popperVisible.value = false
  }
}

const getHomeData = () => {
  skeletonLoading.value = true
  tableLoading.value = true
  getChainList()
}

const setPolling = () => {
  clearInterval(timer.value)
  timer.value = setInterval(() => {
    getFreshPriceList()
  }, 5000)
}
watch(
  () => hotSearchList.value,
  (newVal, oldVal) => {
    lastComparedToCurrent(newVal, oldVal)
  }
)

watch(
  () => chainIdDataList.value,
  (newVal, oldVal) => {
    lastComparedToCurrent(newVal, oldVal)
  }
)

watch(
  () => mainstreamCoinsList.value,
  (newVal, oldVal) => {
    newVal.forEach((item: any) => {
      item.seriesOptions =
        item.priceByPairAddress.chg1d[0] === '-'
          ? {
              topColor: '#F6465D',
              bottomColor: 'rgba(246, 70, 93, 0.28)',
              lineColor: '#F6465D',
              lineWidth: 2,
              lastValueVisible: false,
              priceLineVisible: false
            }
          : {
              topColor: '#2EBD85',
              bottomColor: 'rgba(46, 189, 133, 0.28)',
              lineColor: '#2EBD85',
              lineWidth: 2,
              lastValueVisible: false,
              priceLineVisible: false
            }
    })
  }
)

onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
  if (nounScreenId.value !== 13) {
    setPolling()
  }
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  clearInterval(timer.value)
  timer.value = null
})
onMounted(() => {
  getHomeData()
})

onUnmounted(() => {
  clearInterval(timer.value)
  timer.value = null
})
</script>

<style lang="scss" scoped>
.webhome-content {
  padding: 0 20px 20px;
  width: 100%;
  background-color: var(--bg-color);
  .quick-buy-box {
    color: #adb3b8;
    .suffix-txt {
      line-height: 22px;
    }
  }
  .home-functional-area {
    overflow: hidden;
    overflow-x: scroll;
    .home-dashboard {
      min-width: 264px;
      width: 264px;
      height: 120px;
      padding: 12px;
      border-radius: 12px;
      background: var(--card-bg-color);
      margin-right: 16px;
      transition: all 0.1s;
      .home-dashboard-title,
      .home-dashboard-exponent {
        font-size: 16px;
        color: var(--font-color-default);
        span {
          white-space: nowrap;
        }
      }
      // .home-dashboard-exponent{
      //   font-size: 14px;
      // }

      .home-dashboard-time {
        font-size: 12px;
        color: var(--dex-color-4);
      }
    }
    .coin-operate {
      font-size: 12px;
      color: var(--font-color-default);
      cursor: pointer;
      margin-right: 8px;
      border-radius: 4px;
      padding: 4px 2px 4px 6px;
      transition: all 0.1s;
    }

    .home-area-item {
      width: 264px;
      min-width: 264px;
      height: 120px;
      padding: 12px 0px 12px 12px;
      border-radius: 12px;
      background: var(--card-bg-color);
      margin-right: 16px;
      transition: all 0.1s;
    }
    .chart-box {
      width: 150px;
      height: 70px;
    }
    .coin-name,
    .price-txt {
      color: var(--font-color-defaul);
      font-size: 18px;
      font-style: normal;
      font-weight: normal;
    }
    .coin-logo {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .price-txt {
      display: block;
      margin-bottom: 4px;
      font-size: 18px;
    }
    .volume-price {
      color: var(--dex-color-4);
      font-size: 12px;
    }
    .activity-area {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      margin-right: 16px;
      grid-gap: 8px;
    }
    .activity-area-item {
      min-width: 254px;
      height: 56px;
      padding: 8px 10px;
      background-color: var(--card-bg-color);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.1s;
      border-radius: 12px;
      cursor: pointer;
      .activity-icon {
        width: 18px;
        height: 18px;
        margin-right: 2px;
      }
      span {
        color: var(--font-color-defaul);
        font-size: 16px;
      }
      p,
      p span {
        color: var(--dex-color-4);
        font-size: 12px;
      }
    }
    .activity-area-item-last {
      border: 1px solid #242424;
      background-color: transparent;
    }
    .list-hot {
      flex: 2;
      min-width: 696px;
      .list-hot-item {
        flex: 1;
        padding: 2px 12px;
        background: var(--card-bg-color);
        height: 120px;
      }
      .list-hot-item:first-child {
        border-radius: 12px 0 0 12px;
      }
      .list-hot-item:last-child {
        border-radius: 0 12px 12px 0;
      }
      .list-item-title {
        height: 40px;
        padding: 0 0 4px 0;
        font-size: 16px;
        color: var(--font-color-default);
      }
      .data-list {
        height: 36px;
        padding: 4px 0;
        border-radius: 4px;
        transition: all 0.1s;
        .left-element span:last-child {
          .logo {
            width: 24px;
            height: 24px;
            position: relative;
            margin-right: 10px;
          }
          .img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
          .chainCode {
            width: 12px;
            height: 12px;
            position: absolute;
            right: -1px;
            bottom: -1px;
          }
          .symbol {
            font-size: 14px;
          }
        }
        .right-element {
          span {
            font-size: 14px;
          }
          .percentage {
            display: block;
            min-width: 80px;
            text-align: right;
          }
        }
      }
    }
  }

  .icon-svg {
    width: 16px;
    height: 16px;
    display: block;
  }
  .home-table-data {
    .table-nav {
      position: sticky;
      top: 0;
      padding: 10px 0;
      font-size: 14px;
      font-style: normal;
      z-index: 9;
      background-color: var(--bg-color);
    }
    :deep(.el-switch .el-switch__core .el-switch__action) {
      background-color: #1f232d;
    }
    .table-operate-switch {
      margin-left: 35px;
      strong {
        color: #b4b4b4;
        font-size: 14px;
        font-weight: normal;
        margin-right: 13px;
      }
    }
    .table-noun-screen {
      flex-wrap: nowrap;
      span,
      a {
        padding: 5px 10px;
        border-radius: 4px;
        background: rgba(33, 33, 33, 0.3);
        margin-right: 10px;
        cursor: pointer;
        font-size: 14px;
        font-family: 'PingFangSC-Medium';
        color: #5c6068;
        white-space: nowrap;
      }
      span:last-child {
        margin: 0;
      }
      .noun-screen-active {
        color: #f5f5f5;
        background: rgba(58, 60, 64, 0.4);
      }
      .noun-screen-icon {
        width: 15px;
        height: 15px;
        margin-right: 4px;
        display: block;
      }
    }
    .table-network-screen {
      .time-tab {
        padding: 2px;
        border-radius: 10px;
        border: 1px solid var(--color-border);
        margin-right: 16px;
        span {
          border-radius: 8px;
          padding: 4px 12px;
          background-color: transparent;
          color: var(--dex-color-4);
          cursor: pointer;
          transition: all 0.1s;
        }
        .cur {
          color: var(--font-color-default);
          background-color: var(--hover-bg-color);
        }
        span:hover {
          color: var(--font-color-default);
        }
      }
      .table-select-text {
        border-radius: 8px;
        background: transparent;
        padding: 3px 4px 3px 6px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.1s;
        font-size: 12px;
        span {
          margin: 0 8px;
        }
      }
      .table-select-text:hover {
        border: 1px solid var(--dex-color-4);
      }
    }
  }
  .tokens—after {
    color: var(--dex-color-4);
    margin-left: 0 !important;
  }

  .home-dashboard:hover,
  .activity-area-item-nth:hover,
  .coin-operate:hover,
  .data-list:hover,
  .table-select-text:hover {
    background-color: var(--hover-bg-color);
  }
  .activity-area-item-last:hover {
    border: 1px solid var(--hover-bg-color);
    background-color: var(--hover-bg-color);
  }
}
</style>
