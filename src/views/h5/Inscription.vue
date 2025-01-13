<template>
  <section class="inscription-box">
    <van-sticky>
      <div class="inscription-head display-flex align-items-center justify-content-sp">
        <div class="inscription-tab display-flex align-items-center">
          <span
            v-for="item in tabList"
            :key="item.id"
            :class="tabIndex == item.id ? 'active' : ''"
            @click="handelTabChange(item)"
            >{{ item.name }}</span
          >
        </div>
        <svg-icon name="h5-search-md" class="h5-search-md" @click="handelSearch"></svg-icon>
      </div>
      <template v-if="tabIndex === 0">
        <div class="inscription-main-tab display-flex align-items-center">
          <span
            v-for="item in pumpTabList"
            :key="item.value"
            @click="handelTab(item)"
            :class="pumpTabIndex == item.value ? 'cur' : ''"
            >{{ item.label }}</span
          >
        </div>
        <div class="double-cost-box display-flex align-items-center justify-content-sp">
          <DoubleCost class="double-cost" />
          <el-input
            v-model="amount"
            placeholder="输入买入数量"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 32%"
          >
            <template #suffix>
              <span class="suffix-txt">SOL</span>
            </template>
          </el-input>
        </div>
      </template>
      <div class="inscription-main-tab display-flex align-items-center" v-if="tabIndex === 1">
        <span
          v-for="item in inscriptionTabList"
          :key="item.id"
          @click="handelInscriptionChange(item)"
          :class="inscriptionTabIndex == item.id ? 'cur' : ''"
          >{{ item.name }}</span
        >
      </div>
    </van-sticky>
    <div class="inscription-main" v-if="tabIndex === 0">
      <div class="pump-box">
        <van-skeleton :loading="skeletonLoading">
          <template #template>
            <div style="width: 100%">
              <div v-for="item in 3" :key="item" :style="{ padding: '24px 0' }">
                <div
                  :style="{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                  }"
                >
                  <div :style="{ flex: 1, display: 'flex', width: '100%', alignItems: 'center' }">
                    <van-skeleton-avatar
                      style="
                        width: 1.2rem;
                        height: 1.2rem;
                        border-radius: 50%;
                        margin-right: 0.2133rem;
                      "
                    />
                    <div :style="{ flex: 1 }">
                      <van-skeleton-paragraph row-width="50%" />
                      <van-skeleton-paragraph
                        row-width="100%"
                        style="margin-top: 15px !important"
                      />
                    </div>
                  </div>
                  <div
                    :style="{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end'
                    }"
                  >
                    <van-skeleton-paragraph row-width="25%" />
                  </div>
                </div>

                <div
                  :style="{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '12px 0'
                  }"
                >
                  <van-skeleton-paragraph row-width="30%" />
                  <van-skeleton-paragraph row-width="30%" />
                </div>
                <div
                  :style="{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '12px 0'
                  }"
                >
                  <van-skeleton-paragraph row-width="30%" />
                  <van-skeleton-paragraph row-width="30%" />
                </div>
                <div
                  :style="{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '12px 0'
                  }"
                >
                  <van-skeleton-paragraph row-width="10%" />
                </div>
                <div
                  :style="{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '12px 0'
                  }"
                >
                  <van-skeleton-paragraph row-width="20%" />
                  <van-skeleton-paragraph row-width="20%" />
                  <van-skeleton-paragraph row-width="20%" />
                  <van-skeleton-paragraph row-width="20%" />
                </div>
              </div>
            </div>
          </template>
          <div class="pump-item" v-for="(item, index) in pumpList" :key="index">
            <div class="display-flex align-items-fs justify-content-sp">
              <div class="display-flex align-items-center">
                <div class="logo">
                  <el-image :src="item.logo" alt="" class="img">
                    <template #error>
                      <svg-icon name="logo1" class="img"></svg-icon>
                    </template>
                  </el-image>
                  <img :src="chainLogoObj[item.baseToken.chainCode]" alt="" class="chainCode" />
                </div>
                <div class="pump-item-symol">
                  <div class="display-flex align-items-center">
                    <span>{{ item.baseToken?.symbol || '-' }}</span>
                    <svg-icon name="copy" class="copy" v-copy="item.baseToken.address"></svg-icon>
                    <a
                      :href="`https://x.com/search?q=${item.baseToken.address}`"
                      target="_blank"
                      class="icon-chat"
                    >
                      <el-icon size="14" color="#9c9c9c"><Search /></el-icon>
                    </a>
                  </div>
                  <div class="display-flex align-items-center">
                    <span class="time-txt">{{ timeago(item.createTime * 1000) }}</span>
                    <span class="up-color percent-txt"
                      >{{ ((item.percent || 0) * 100).toFixed(2) }}%</span
                    >
                    <img src="@/assets/img/pump-logo.webp" class="icon-url" alt="" />
                    <span @click.stop="handelRouter(item.twitter)" v-if="item.twitter">
                      <svg-icon name="twitter-pump" class="icon-url"></svg-icon>
                    </span>
                    <span @click.stop="handelRouter(item.website)" v-if="item.website">
                      <svg-icon name="website-pump" class="icon-url"></svg-icon>
                    </span>
                    <span @click.stop="handelRouter(item.telegram)" v-if="item.telegram">
                      <svg-icon name="telegram-pump" class="icon-url"></svg-icon>
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="registration-trade display-flex align-items-center"
                @click="handelTrade(item)"
              >
                <span>看K线</span>
                <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
              </div>
            </div>
            <div
              class="pump-item-txt display-flex align-items-center justify-content-sp margin-top-12"
            >
              <span>价格：${{ numberFormat(item.price || 0) }}</span>
              <span>市值：${{ numberFormat(item.marketCap) }}</span>
            </div>
            <div
              class="pump-item-txt display-flex align-items-center justify-content-sp margin-top-12"
            >
              <div class="display-flex align-items-center">
                <span>交易额：</span>
                <div class="display-flex flex-direction-col justify-content-fd">
                  <span class="txt">${{ numberFormat(item.totalVolume) }}</span>
                  <p>
                    <span class="up-color">${{ numberFormat(item.buyVolume) }}</span>
                    <span>/</span>
                    <span class="down-color">${{ numberFormat(item.sellVolume) }}</span>
                  </p>
                </div>
              </div>
              <div class="display-flex align-items-center">
                <span>交易数：</span>
                <div class="display-flex flex-direction-col justify-content-fd">
                  <span class="txt">{{ numberFormat(item.totalCount) }}</span>
                  <p>
                    <span class="up-color">{{ numberFormat(item.buyCount) }}</span>
                    <span>/</span>
                    <span class="down-color">{{ numberFormat(item.sellCount) }}</span>
                  </p>
                </div>
              </div>
            </div>
            <PumpTrade
              :info="item"
              :amount="amount"
              :tokenList="tokenList"
              v-if="isConnected"
              class="margin-top-12"
            />
            <H5WalletConnect v-else>
              <div class="trade-btn-box margin-top-12">
                <span>0.1 SOL</span>
                <span>0.5 SOL</span>
                <span>1 SOL</span>
                <span>{{ amount ? numberFormat(amount || 0) + ' SOL' : '右上角输入' }}</span>
              </div>
            </H5WalletConnect>
          </div>
        </van-skeleton>
      </div>
    </div>
    <div class="inscription-main" v-if="tabIndex === 1">
      <template v-if="[0, 1, 2].includes(inscriptionTabIndex)">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="i18n.t('h5.Nomore')"
            :loading-text="i18n.t('h5.loading')"
            @load="onLoad"
          >
            <div class="inscription-content">
              <div
                class="inscription-content-head display-flex align-items-center justify-content-sp"
              >
                <span>{{ i18n.t('h5.Name') }}</span>
                <span>{{ i18n.t('h5.Progress') }}</span>
                <span>{{ i18n.t('h5.Holders') }}</span>
              </div>
              <div class="inscription-content-main display-flex flex-direction-col">
                <div
                  class="inscription-content-item"
                  v-for="(item, index) in inscriptionList"
                  :key="index"
                >
                  <div class="display-flex align-items-center tabs-first">
                    <div class="logo">
                      <img
                        src="https://img.apihellodex.lol/inscriptions/BSC/fans_icon.png"
                        alt=""
                        class="img"
                        v-if="index == 0"
                      />
                      <svg-icon name="logo1" class="img" v-else></svg-icon>
                    </div>
                    <div>
                      <p class="display-flex align-items-center symbol">
                        <span>{{ item.tick }}</span>
                        <span>/{{ item.protocol.toUpperCase() }}</span>
                      </p>
                      <span class="address">{{ shortifyAddress(item.tick_hash) }}</span>
                    </div>
                  </div>
                  <div class="display-flex flex-direction-col tabs-center">
                    <span
                      >{{
                        ((parseFloat(item.minted) / parseFloat(item.max)) * 100).toFixed(2)
                      }}%</span
                    >
                    <el-progress
                      :percentage="(parseFloat(item.minted) / parseFloat(item.max)) * 100"
                      color="#202020"
                    >
                      <span></span>
                    </el-progress>
                  </div>
                  <div class="display-flex flex-direction-col tabs-last">
                    <span>{{ numberFormat(item.holders) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </template>
      <div class="no-data" v-else>
        <svg-icon name="nodata" class="nodata"></svg-icon>
        <span class="next_version">{{ i18n.t('h5.ComingSoon') }}</span>
      </div>
    </div>
    <div class="no-data" v-if="tabIndex === 2">
      <svg-icon name="nodata" class="nodata"></svg-icon>
      <span class="next_version">{{ i18n.t('h5.ComingSoon') }}</span>
    </div>
    <div class="inscription-main" v-if="tabIndex === 3">
      <van-steps
        direction="vertical"
        :active="0"
        active-icon="underway"
        inactive-icon="underway"
        active-color="#202020"
      >
        <van-step v-for="item in flashList" :key="item.id">
          <p class="flash-step display-flex align-items-center justify-content-sp">
            <span>{{ timeago(item.create_time * 1000) }}</span>
            <span>{{ i18n.t('h5.Source') }}BlockBeats</span>
          </p>
          <h6 class="flash-h6">{{ item.title }}</h6>
          <div v-html="item.content" class="flash-content"></div>
          <p class="flash-step display-flex align-items-center justify-content-sp">
            <span></span>
            <a :href="item.link" target="_blank">{{ i18n.t('h5.View') }}</a>
          </p>
        </van-step>
      </van-steps>
    </div>
    <div class="inscription-main" v-if="tabIndex === 4">
      <div class="tool-area">
        <p class="title">{{ i18n.t('h5.Tools') }}</p>
        <div class="tool-items">
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/goplus_lgoo.png" alt="" class="icon" />
            <span>{{ i18n.t('h5.ContractAudit') }}</span>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/revoke400.png" alt="" class="icon" />
            <span>{{ i18n.t('h5.AuthorizationCheck') }}</span>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/tool_download.png" alt="" class="icon" />
            <span>{{ i18n.t('h5.Downloads') }}</span>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/tool_browser.png" alt="" class="icon" />
            <span>{{ i18n.t('h5.BlockchainBrowser') }}</span>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/service.svg" alt="" class="icon" />
            <span>{{ i18n.t('h5.BlockchainCommunication') }}</span>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/media.png" alt="" class="icon" />
            <span>{{ i18n.t('h5.Media') }}</span>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/mint.svg" alt="" class="icon" />
            <span>{{ i18n.t('h5.InscriptionRune') }}</span>
          </div>
        </div>
      </div>
      <div class="tool-area">
        <p class="title">{{ i18n.t('h5.ComingSoon') }}</p>
        <div class="tool-items">
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/tool_monitor.png" alt="" class="icon" />
            <span>{{ i18n.t('h5.TransactionTransferMonitoring') }}</span>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/tool_whale.png" alt="" class="icon" />
            <span>{{ i18n.t('h5.BigWhale') }}</span>
          </div>
          <div class="display-flex flex-direction-col align-items-center">
            <img src="@/assets/img/tool_whale.png" alt="" class="icon" />
            <span>{{ i18n.t('h5.OneclickCoinIssuance') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Tabbar :active="3" />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { APIinscription, APIopenFlash, APIh5PumpRanking } from '@/api'
import { timeago, numberFormat, shortifyAddress } from '@/utils'
import Tabbar from '@/components/SideBar/Tabbar.vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import { getTokenList } from '@/utils/transition'
import DoubleCost from '@/components/DoubleCost.vue'
import PumpTrade from './components/Trade/PumpTrade.vue'
import H5WalletConnect from '@/components/Wallet/H5WalletConnect.vue'

const i18n = useI18n()
const router = useRouter()
const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore

const isConnected = computed(() => globalStore.walletInfo.isConnected)
const customWalletInfo = computed(() => globalStore.customWalletInfo)

const tokenList = ref<any>([])

const handelSearch = () => {
  router.push('/Search')
}

const tabList = [
  {
    id: 0,
    name: 'Pump'
  },
  {
    id: 1,
    name: i18n.t('h5.Inscription')
  },
  {
    id: 2,
    name: 'DApp'
  },
  {
    id: 3,
    name: i18n.t('h5.News')
  },
  {
    id: 4,
    name: i18n.t('h5.Tool')
  }
]
const tabIndex = ref<number>(0)

const handelTabChange = (item: { id: number }) => {
  tabIndex.value = item.id
}

/***************** Pump start ******************/
const pumpTabList = [
  {
    label: '新创建',
    value: 1
  },
  {
    label: '即将打满',
    value: 2
  },
  {
    label: '新外盘',
    value: 3
  }
]

const pumpTabIndex = ref<number>(parseFloat(localStorage.getItem('pumpTabIndex') || '0') || 1)
const skeletonLoading = ref<boolean>(false)
const timer = ref<any>(null)
const pumpList = ref<any>([])
const amount = ref<string>('')

const getPumpRanking = async () => {
  const res: any = await APIh5PumpRanking({
    type: pumpTabIndex.value
  })

  pumpList.value = res || []
}

const handelTab = async (item: any) => {
  skeletonLoading.value = true
  pumpTabIndex.value = item.value
  localStorage.setItem('pumpTabIndex', pumpTabIndex.value.toString())
  clearInterval(timer.value)
  await getPumpRanking()
  skeletonLoading.value = false
  setPolling()
}

const getToken = async () => {
  const res: any = await getTokenList('SOLANA', customWalletInfo.value.walletInfo?.wallet)
  tokenList.value = res || []
}

const setPolling = () => {
  timer.value = setInterval(() => {
    getPumpRanking()
    isConnected.value && getToken()
  }, 5000)
}

const handelRouter = (url: string) => {
  console.log(url)
  window.open(url)
}

const handelTrade = (item: any) => {
  router.push(`/k/${item.pairAddress}?chainCode=${item.baseToken.chainCode}&timeType=15m`)
}
/***************** Pump end ******************/

/***************** 铭文 start ******************/
const inscriptionTabList = [
  {
    id: 0,
    name: i18n.t('h5.All')
  },
  {
    id: 1,
    name: i18n.t('h5.Progressing')
  },
  {
    id: 2,
    name: i18n.t('h5.Finished')
  },
  {
    id: 3,
    name: i18n.t('h5.Listing')
  },
  {
    id: 4,
    name: i18n.t('h5.Monitoring')
  }
]

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref<number>(-1)
const inscriptionTabIndex = ref<number>(0)
const inscriptionList = ref<any>([])
const handelInscriptionChange = (item: { id: number }) => {
  inscriptionTabIndex.value = item.id
  if ([0, 1, 2].includes(item.id)) {
    inscriptionList.value = []
    page.value = -1
    onLoad()
  }
}

const getData = async () => {
  const res: any = await APIinscription({
    status: inscriptionTabIndex.value,
    page: page.value,
    protocol: 'bnb-48',
    page_size: 20
  })
  if (refreshing.value) {
    inscriptionList.value = []
    refreshing.value = false
  }
  inscriptionList.value = inscriptionList.value.concat(res.list)
  loading.value = false

  if (inscriptionList.value.length >= res.count) {
    finished.value = true
  }
}

const onLoad = () => {
  page.value++
  getData()
}

const onRefresh = () => {
  // 清空列表数据
  page.value = -1
  finished.value = false

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  onLoad()
}
/***************** 铭文 end ******************/

/***************** 快讯 start ******************/
const flashList = ref<any>([])

const getOpenFlash = async () => {
  const res: any = await APIopenFlash()
  flashList.value = res.data
}

/***************** 快讯 start ******************/

onMounted(async () => {
  getOpenFlash()
  skeletonLoading.value = true
  await getPumpRanking()
  skeletonLoading.value = false
  setPolling()
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.inscription-box {
  padding-bottom: var(--van-tabbar-height);

  .inscription-head {
    padding: 0.32rem;
    background-color: #fff;
  }
  .inscription-tab {
    span {
      color: #9c9c9c;
      font-size: 0.4267rem;
      font-style: normal;
      cursor: pointer;
      margin-left: 0.32rem;
    }
    span:first-child {
      margin-left: 0;
    }
    .active {
      color: #202020;
    }
  }
  .double-cost-box {
    padding: 0 0.32rem;
    color: #9c9c9c;
    font-size: 0.32rem;
    background-color: #fff;
    padding-bottom: 0.16rem;
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 0.0267rem #e5e5e5 !important;
    }
    :deep(.el-input__inner) {
      color: #202020;
    }
    .double-cost {
      :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
        color: #202020;
      }
      :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
        background-color: #202020;
        border-color: #202020;
      }
      :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
        border-color: var(--font-color-default);
      }
    }
  }
  .h5-search-md {
    width: 0.5rem;
    height: 0.5rem;
    color: #9c9c9c;
    cursor: pointer;
  }

  .inscription-content,
  .pump-box {
    padding: 0 0.32rem 0.32rem;
    color: #9c9c9c;
    :deep(.van-skeleton) {
      padding: 0;
      .van-skeleton-paragraph:not(:first-child) {
        margin-top: 0 !important;
      }
    }
  }
  .pump-item {
    padding: 0.48rem 0;
    border-bottom: 0.0267rem solid #e9e9e9;
    .logo,
    .img {
      width: 0.9067rem;
      height: 0.9067rem;
      border-radius: 50%;
    }
    .logo {
      position: relative;
      margin-right: 0.16rem;
    }
    .chainCode {
      position: absolute;
      right: -0.0267rem;
      bottom: -0.0267rem;
      width: 0.32rem;
      height: 0.32rem;
    }
    .copy,
    .icon-url {
      width: 14px;
      height: 14px;
      color: #9c9c9c;
      margin-left: 0.1333rem;
      display: block;
    }
    .pump-item-symol {
      font-size: 0.4rem;
      color: #000;
      .time-txt {
        color: #9c9c9c;
        font-size: 0.2933rem;
        margin-right: 0.1333rem;
      }
      .percent-txt {
        font-size: 0.2933rem;
      }
    }
    .icon-chat {
      display: block;
      position: relative;
      top: 2px;
      margin-left: 0.1333rem;
    }
    .registration-trade {
      color: #9c9c9c;

      .chevron-right {
        width: 14px;
        height: 14px;
      }
    }
    .margin-top-12 {
      margin-top: 0.32rem;
    }
    .pump-item-txt {
      font-size: 0.32rem;
    }
    :deep(.h5-connect-wallet-btn) {
      width: 100%;
      background-color: #fff;
      border-radius: 0;
      padding: 0;
      display: block;
    }
    .trade-btn-box {
      display: grid;
      gap: 0.24rem;
      grid-template-columns: repeat(4, 1fr);
      span {
        background-color: var(--up-color);
        color: #fff;
        font-size: 0.2933rem;
        height: 0.6rem;
        text-align: center;
        line-height: 0.6rem;
        border-radius: 0.4rem;
        cursor: pointer;
      }
    }
  }
  .inscription-content-head {
    span {
      color: #9c9c9c;
      font-size: 0.3733rem;
      text-align: right;
    }
    span:first-child {
      width: 4.8rem;
      text-align: left;
    }
    span:last-child {
      width: 2.3467rem;
    }
  }
  .inscription-content-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2133rem 0;
    color: #202020;
    :deep(.el-progress__text) {
      display: none;
    }
    .logo {
      width: 0.8533rem;
      height: 0.8533rem;
      position: relative;
      margin-right: 0.2667rem;
    }
    .img {
      width: 0.8533rem;
      height: 0.8533rem;
      border-radius: 50%;
    }
    .chainCode {
      width: 0.32rem;
      height: 0.32rem;
      position: absolute;
      right: -1px;
      bottom: -1px;
    }
    .tabs-first {
      width: 4.8rem;
      justify-content: flex-start;
    }
    .tabs-last {
      width: 2.3467rem;
      justify-content: center;
      align-items: flex-end;
    }
    .symbol {
      font-size: 0.3733rem;
      span {
        white-space: nowrap;
      }
      span:last-child {
        color: #9c9c9c;
      }
    }
    .address {
      font-size: 0.32rem;
      color: #9c9c9c;
    }
    .tabs-center {
      font-size: 0.32rem;
      color: #202020;
    }
    .tabs-last {
      span:first-child {
        font-size: 0.3733rem;
        word-break: break-all;
      }
      span:last-child {
        font-size: 0.32rem;
        padding: 0.0533rem 0.1333rem;
        border-radius: 0.1067rem;
      }
      .red {
        background-color: rgba(234, 57, 67, 0.16);
        color: var(--down-color);
      }
      .green {
        background-color: rgba(20, 199, 132, 0.16);
        color: var(--up-color);
      }
    }
  }
  .inscription-main-tab {
    padding: 0 0.32rem 0.16rem;
    background-color: #fff;
    span {
      color: #9c9c9c;
      font-size: 0.3733rem;
      line-height: 0.5333rem;
      padding-bottom: 0.16rem;
      border-bottom: 0.0533rem solid #fff;
      margin-left: 0.4rem;
      cursor: pointer;
    }
    span:first-child {
      margin-left: 0;
    }
    .cur {
      color: #202020;
      border-bottom: 0.0533rem solid #202020;
    }
  }
  .flash-step {
    font-size: 0.32rem;
    color: #9c9c9c;
    a {
      color: #9c9c9c;
    }
  }

  .flash-h6 {
    font-size: 0.32rem;
    color: #202020;
    margin: 0.32rem 0;
  }
  .flash-content {
    font-size: 0.32rem;
    color: #9c9c9c;
    margin-bottom: 0.32rem;
  }
  .tool-area {
    padding: 0.32rem;
    .title {
      color: #202020;
      font-size: 0.3733rem;
      font-style: normal;
      font-weight: normal;
      margin-bottom: 0.5333rem;
    }
    .tool-items {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 0.32rem;

      .icon {
        width: 0.64rem;
        height: 0.64rem;
        color: #000;
        margin-bottom: 0.32rem;
      }
      span {
        color: #000;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 400;
        white-space: nowrap;
      }
    }
  }
}
</style>
