<template>
  <el-scrollbar :height="`calc(100vh - 104px - ${currencyDashboardSwitch ? '56px' : '0px'})`">
    <aside class="left-layout">
      <div class="coin-list">
        <div class="coin-tab display-flex align-items-center justify-content-sp">
          <div class="coin-tab-item display-flex align-items-center">
            <span
              :class="tabHoldIndex == item.id ? 'cur' : ''"
              v-for="item in tabHoldList"
              :key="item.id"
              @click="handelHoldTab(item)"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <WalletConnect v-if="!isConnected">
          <div class="connected-btn">
            <p>你需要登录</p>
            <span>登录</span>
          </div>
        </WalletConnect>
        <template v-else>
          <template v-if="tabHoldIndex == 1">
            <div class="table-items">
              <div class="table-items-head display-flex align-items-center justify-content-sp">
                <div class="display-flex align-items-center">
                  <div class="display-flex align-items-center">
                    <span>币种</span>
                  </div>
                  <span class="line">/</span>
                  <div class="display-flex align-items-center">
                    <span class="num">{{ i18n.t('home.txs') }}</span>
                  </div>
                </div>
                <div class="display-flex align-items-center">
                  <div class="display-flex align-items-center">
                    <span>{{ i18n.t('home.price') }}</span>
                  </div>
                  <span class="line">/</span>
                  <div class="display-flex align-items-center">
                    <span class="num">涨跌幅</span>
                  </div>
                </div>
              </div>
              <el-skeleton style="width: 100%" :loading="favoriteSkeleton" animated>
                <template #template>
                  <div
                    class="display-flex align-items-center justify-content-sp"
                    style="margin-top: 13px"
                    v-for="item in 3"
                    :key="item"
                  >
                    <div class="display-flex align-items-center">
                      <el-skeleton-item
                        variant="circle"
                        style="width: 28px; height: 28px; margin-right: 8px"
                      />
                      <div class="display-flex flex-direction-col align-items-fs">
                        <el-skeleton-item
                          variant="text"
                          style="width: 60px; height: 12px; margin-bottom: 4px"
                        />
                        <el-skeleton-item variant="text" style="width: 30px; height: 12px" />
                      </div>
                    </div>
                    <div class="display-flex flex-direction-col align-items-fd">
                      <el-skeleton-item
                        variant="text"
                        style="width: 50px; height: 12px; margin-bottom: 4px"
                      />
                      <el-skeleton-item variant="text" style="width: 30px; height: 12px" />
                    </div>
                  </div>
                </template>
                <template #default>
                  <div
                    class="table-items-main"
                    v-for="(item, index) in favoriteStatus
                      ? favoriteData
                      : favoriteData.filter((item: any, index: any) => index < 3)"
                    :key="index"
                    @click="handelJump(item)"
                  >
                    <div class="table-item display-flex align-items-center justify-content-sp">
                      <div class="display-flex align-items-center table-item-first">
                        <Favorite
                          :coinInfo="{
                            baseTokenAddress: item.baseToken.address,
                            chainCode: item.chainCode
                          }"
                        />
                        <div class="logo">
                          <el-image :src="item.baseToken.logo" alt="" class="img">
                            <template #error>
                              <svg-icon name="logo1" class="img"></svg-icon>
                            </template>
                          </el-image>
                          <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
                        </div>
                        <div>
                          <p class="display-flex align-items-center symbol">
                            <span>{{ item.baseToken.symbol || '-' }}</span>
                          </p>
                          <!-- <span class="number">{{
                        numberFormat(item.tradingSummary['tradingSummary1d'].TotalCount)
                      }}</span> -->
                        </div>
                      </div>
                      <div class="display-flex flex-direction-col table-item-last">
                        <span>${{ numberFormat(item.price) }}</span>
                        <PercentageNotbg :value="item.chg1d || 0" />
                      </div>
                    </div>
                  </div>
                  <div
                    @click="favoriteStatus = !favoriteStatus"
                    class="chevron-icon"
                    v-if="favoriteData.length > 3"
                  >
                    <svg-icon
                      name="chevron-up"
                      class="chevron-icon"
                      v-if="favoriteStatus"
                    ></svg-icon>
                    <svg-icon name="chevron-down" class="chevron-icon" v-else></svg-icon>
                  </div>
                  <empty-data :imageSize="80" v-if="favoriteData.length == 0"></empty-data>
                </template>
              </el-skeleton>
            </div>
          </template>
          <template v-if="tabHoldIndex == 2">
            <div class="table-items">
              <div class="table-items-head display-flex align-items-center justify-content-sp">
                <div class="display-flex align-items-center">
                  <div class="display-flex align-items-center">
                    <span>币种</span>
                  </div>
                  <span class="line">/</span>
                  <div class="display-flex align-items-center">
                    <span class="num">余额</span>
                  </div>
                </div>
                <div class="display-flex align-items-center">
                  <div class="display-flex align-items-center">
                    <span>收益</span>
                  </div>
                  <span class="line">/</span>
                  <div class="display-flex align-items-center">
                    <span class="num">收益率</span>
                  </div>
                </div>
              </div>
              <el-skeleton style="width: 100%" :loading="favoriteSkeleton" animated>
                <template #template>
                  <div
                    class="display-flex align-items-center justify-content-sp"
                    style="margin-top: 13px"
                    v-for="item in 3"
                    :key="item"
                  >
                    <div class="display-flex align-items-center">
                      <el-skeleton-item
                        variant="circle"
                        style="width: 28px; height: 28px; margin-right: 8px"
                      />
                      <div class="display-flex flex-direction-col align-items-fs">
                        <el-skeleton-item
                          variant="text"
                          style="width: 60px; height: 12px; margin-bottom: 4px"
                        />
                        <el-skeleton-item variant="text" style="width: 30px; height: 12px" />
                      </div>
                    </div>
                    <div class="display-flex flex-direction-col align-items-fd">
                      <el-skeleton-item
                        variant="text"
                        style="width: 50px; height: 12px; margin-bottom: 4px"
                      />
                      <el-skeleton-item variant="text" style="width: 30px; height: 12px" />
                    </div>
                  </div>
                </template>
                <template #default>
                  <div
                    class="table-items-main"
                    v-for="(item, index) in holdStatus
                      ? subscribePositions
                      : subscribePositions.filter((item: any, index: any) => index < 3)"
                    :key="index"
                    @click="handelJump(item)"
                  >
                    <div class="table-item display-flex align-items-center justify-content-sp">
                      <div class="display-flex align-items-center table-item-first">
                        <div class="logo">
                          <el-image :src="item.logo" alt="" class="img">
                            <template #error>
                              <svg-icon name="logo1" class="img"></svg-icon>
                            </template>
                          </el-image>
                          <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
                        </div>
                        <div>
                          <p class="display-flex align-items-center symbol">
                            <span>{{ item.symbol }}</span>
                          </p>
                          <span class="number">{{ numberFormat(item.amount) }}</span>
                        </div>
                      </div>
                      <div class="display-flex flex-direction-col table-item-last">
                        <span :class="item.totalEarn?.[0] === '-' ? 'down-color' : 'up-color'">{{
                          (item.totalEarn?.[0] === '-' ? '' : '+') + numberFormat(item.totalEarn)
                        }}</span>
                        <PercentageNotbg :value="item.totalEarnRate || 0" />
                      </div>
                    </div>
                  </div>
                  <div
                    @click="holdStatus = !holdStatus"
                    class="chevron-icon"
                    v-if="subscribePositions.length > 3"
                  >
                    <svg-icon name="chevron-up" class="chevron-icon" v-if="holdStatus"></svg-icon>
                    <svg-icon name="chevron-down" class="chevron-icon" v-else></svg-icon>
                  </div>
                  <empty-data :imageSize="80" v-if="subscribePositions.length == 0"></empty-data>
                </template>
              </el-skeleton>
            </div>
          </template>
        </template>
      </div>
      <div class="coin-list">
        <div class="coin-tab display-flex align-items-center justify-content-sp">
          <div class="coin-tab-item display-flex align-items-center">
            <span
              v-for="(item, index) in pumpTabList"
              :key="index"
              :class="pumpTabIndex == item.value ? 'active ' : ''"
              @click="handelPumpTab(item)"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
        <div class="table-items">
          <div class="table-items-head display-flex align-items-center justify-content-sp">
            <div class="display-flex align-items-center">
              <div class="display-flex align-items-center">
                <span>币种</span>
              </div>
              <span class="line">/</span>
              <div class="display-flex align-items-center">
                <span class="num">{{ i18n.t('home.txs') }}</span>
              </div>
            </div>
            <div class="display-flex align-items-center">
              <div class="display-flex align-items-center">
                <span>{{ i18n.t('home.price') }}</span>
              </div>
              <span class="line">/</span>
              <div class="display-flex align-items-center">
                <span class="num">进度</span>
              </div>
            </div>
          </div>
          <el-skeleton style="width: 100%" :loading="skeletonLoading" animated>
            <template #template>
              <div
                class="display-flex align-items-center justify-content-sp"
                style="margin-top: 13px"
                v-for="item in 15"
                :key="item"
              >
                <div class="display-flex align-items-center">
                  <el-skeleton-item
                    variant="circle"
                    style="width: 28px; height: 28px; margin-right: 8px"
                  />
                  <div class="display-flex flex-direction-col align-items-fs">
                    <el-skeleton-item
                      variant="text"
                      style="width: 60px; height: 12px; margin-bottom: 4px"
                    />
                    <el-skeleton-item variant="text" style="width: 30px; height: 12px" />
                  </div>
                </div>
                <div class="display-flex flex-direction-col align-items-fd">
                  <el-skeleton-item
                    variant="text"
                    style="width: 50px; height: 12px; margin-bottom: 4px"
                  />
                  <el-skeleton-item variant="text" style="width: 30px; height: 12px" />
                </div>
              </div>
            </template>
            <template #default>
              <div
                class="table-items-main"
                v-for="(item, index) in pumpList"
                :key="index"
                @click="
                  handelJump({
                    pairAddress: item.pairAddress,
                    chainCode: item.baseToken.chainCode
                  })
                "
              >
                <div class="table-item display-flex align-items-center justify-content-sp">
                  <div class="display-flex align-items-center table-item-first">
                    <Favorite
                      :coinInfo="{
                        baseTokenAddress: item.baseToken.address,
                        chainCode: item.baseToken.chainCode
                      }"
                    />
                    <div class="logo">
                      <el-image :src="item.logo" alt="" class="img">
                        <template #error>
                          <svg-icon name="logo1" class="img"></svg-icon>
                        </template>
                      </el-image>
                      <img :src="chainLogoObj[item.baseToken.chainCode]" alt="" class="chainCode" />
                    </div>
                    <div>
                      <p class="display-flex align-items-center symbol">
                        <span>{{ item.baseToken?.symbol || '-' }}</span>
                        <img src="@/assets/img/pump-logo.webp" class="pump-logo" alt="" />
                        <svg-icon
                          name="twitter-pump"
                          class="icon-url"
                          @click.stop="handelRouter(item.twitter)"
                          v-if="item.twitter"
                        ></svg-icon>

                        <svg-icon
                          name="website-pump"
                          class="icon-url"
                          @click.stop="handelRouter(item.website)"
                          v-if="item.website"
                        ></svg-icon>

                        <svg-icon
                          name="telegram-pump"
                          class="icon-url"
                          @click.stop="handelRouter(item.telegram)"
                          v-if="item.telegram"
                        ></svg-icon>
                      </p>
                      <div class="display-flex align-items-center">
                        <span class="number">{{ numberFormat(item.totalCount) }}</span>
                        <span class="clock-timer-txt">{{ timeago(item.createTime * 1000) }}</span>
                        <svg-icon name="icon-percent" class="icon-percent"></svg-icon>
                        <span class="up-color percent-txt"
                          >{{ numToFixedTwo(parseFloat(item.percent || '0')) }}%</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="display-flex flex-direction-col table-item-last">
                    <span>${{ numberFormat(item.price) }}</span>
                    <span class="up-color">
                      {{ numToFixedTwo(parseFloat(item.percent || '0')) }}%
                    </span>
                  </div>
                </div>
              </div>
              <empty-data :imageSize="80" v-if="pumpList.length == 0"></empty-data>
            </template>
          </el-skeleton>
        </div>
      </div>
    </aside>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ApiGetPumpRanking } from '@/api'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import Favorite from '@/components/Favorite.vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import { useGlobalStore } from '@/stores/global'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { numberFormat, timeago, numToFixedTwo } from '@/utils'
import { socket } from '@/utils/socket'

const i18n = useI18n()
const router = useRouter()
const globalStore = useGlobalStore()
const useSubscribeKChart = useSubscribeKChartInfo()

const dataTimer = ref<any>(null) // 数据定时器

const skeletonLoading = ref<boolean>(true)
const favoriteSkeleton = ref<boolean>(true)

const tabHoldIndex = ref<number>(1)
const pumpTabIndex = ref<number>(1)

const { chainLogoObj } = globalStore

const favoriteData = computed(() => globalStore.favoriteData)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const walletType = computed(() => globalStore.walletInfo.walletType)
const currencyDashboardSwitch = computed(() => globalStore.currencyDashboardSwitch)

const subscribePositions = computed(() => {
  return useSubscribeKChart.subscribePositions || []
})

const favoriteStatus = ref<boolean>(false)
const holdStatus = ref<boolean>(false)

const pumpList = ref<any>([])

const pumpTabList = [
  {
    label: '新创建',
    value: 1,
    icon: 'icon-pump-new'
  },
  {
    label: '即将打满',
    value: 2,
    icon: 'icon-pump-now'
  },
  {
    label: '新外盘',
    value: 3,
    icon: 'icon-pump-feat'
  }
]

const tabHoldList = computed(() => {
  if (walletType.value == 'Email') {
    return [
      {
        id: 1,
        name: '收藏'
      },
      {
        id: 2,
        name: '持仓'
      }
    ]
  } else {
    return [
      {
        id: 1,
        name: '收藏'
      }
    ]
  }
})

const handelPumpTab = (item: any) => {
  pumpTabIndex.value = item.value
  stopTimer()
  setPolling()
}

const handelHoldTab = (item: { id: number }) => {
  tabHoldIndex.value = item.id
}

const setPolling = async () => {
  getPumpRanking()
  dataTimer.value = setInterval(() => {
    pumpList.value = [...pumpList.value]
  }, 1000)
}

const getPumpRanking = async () => {
  const res: any = await ApiGetPumpRanking({
    type: pumpTabIndex.value
  })
  pumpList.value = res?.ranking || []
}

const handelJump = (param: any) => {
  router.push(`/k/${param.pairAddress}?chainCode=${param.chainCode}`)
}

const handelRouter = (url: string) => {
  console.log(url)
  window.open(url)
}

const stopTimer = () => {
  clearInterval(dataTimer.value)
  dataTimer.value = null
}

const pumpRankingFun = () => {
  socket.off('pumpRanking')
  socket.on('pumpRanking', (message: string) => {
    const data = JSON.parse(message)
    if (pumpTabIndex.value !== data.type) return
    
    // 使用智能更新，避免 logo 闪烁
    updateListWithKey(pumpList.value, data.ranking || [])
  })
}

// 智能更新列表，保持组件实例和 logo 不闪烁
const updateListWithKey = (oldList: any[], newList: any[]) => {
  // 创建映射便于查找
  const newMap = new Map(newList.map(item => [item.pairAddress, item]))
  
  // 更新现有项
  oldList.forEach((oldItem, index) => {
    const newItem = newMap.get(oldItem.pairAddress)
    if (newItem) {
      // 保存原有的 logo
      const oldLogo = oldItem.logo
      // 保持对象引用，只更新属性
      Object.assign(oldItem, newItem)
      // 恢复原有的 logo，避免闪烁
      oldItem.logo = oldLogo
      newMap.delete(oldItem.pairAddress)
    } else {
      // 标记为待删除
      oldItem._toDelete = true
    }
  })
  
  // 添加新项
  newMap.forEach(newItem => {
    oldList.push(newItem)
  })
  
  // 删除不存在的项
  for (let i = oldList.length - 1; i >= 0; i--) {
    if (oldList[i]._toDelete) {
      oldList.splice(i, 1)
    }
  }
  
  // 按照新列表的顺序排序
  oldList.sort((a, b) => {
    const aIndex = newList.findIndex(item => item.pairAddress === a.pairAddress)
    const bIndex = newList.findIndex(item => item.pairAddress === b.pairAddress)
    return aIndex - bIndex
  })
}

onMounted(async () => {
  skeletonLoading.value = true
  favoriteSkeleton.value = true
  await setPolling()
  pumpRankingFun()
  skeletonLoading.value = false
  favoriteSkeleton.value = false
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped lang="scss">
.left-layout {
  width: 284px;
  min-width: 284px;
  padding-top: 10px;
  overflow: hidden;
  margin-left: 12px;
  .coin-list {
    background: rgba(23, 24, 27, 0.3);
    border-radius: 12px;
    margin-bottom: 12px;
    :deep(.connect-wallet-btn) {
      padding: 0;
      background-color: transparent;
      min-width: auto;
    }
    .connected-btn {
      padding: 12px 0;
      text-align: center;
      font-family: 'PingFangSC-Medium';
      p {
        color: #9aa0aa;
        font-size: 12px;
      }
      span {
        margin-top: 0.16rem;
        display: inline-flex;
        height: 30px;
        padding-inline: 18px;
        border: 1px solid rgb(110, 114, 125);
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        border-radius: 24px;
        font-size: 12px;
        font-weight: normal;
        cursor: pointer;
        color: #f5f5f5;
      }
    }
    .icon-svg {
      width: 16px;
      height: 16px;
      display: block;
    }
    .star-icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      color: #e89f13;
    }
    .chevron-icon {
      display: block;
      width: 20px;
      height: 20px;
      color: #f5f5f5;
      margin: 0 auto;
      position: relative;
      top: 3px;
      cursor: pointer;
    }
    .coin-tab {
      height: 36px;
      padding: 0px 12px;
      border-bottom: 1px solid rgba(38, 40, 44, 0.3);
    }
    .coin-tab-item {
      span {
        line-height: 36px;
        color: #848e9c;
        font-size: 14px;
        font-style: normal;
        font-weight: normal;
        font-family: 'PingFangSC-Medium';
        margin-right: 20px;
        cursor: pointer;
        border-bottom: 1.5px solid transparent;
      }
      .cur {
        color: #f5f5f5;
        border-bottom: 1.5px solid #f5f5f5;
      }
      .active {
        color: #f5f5f5;
        border-bottom: 1.5px solid #f5f5f5;
      }
    }
    .table-items {
      padding: 10px 12px 12px;
    }
    .table-items-head {
      font-size: 13px;
      font-style: normal;
      font-weight: normal;
      color: #848e9c;
      :deep(.el-icon) {
        width: 9px;
        height: 7px;
        margin-left: 1px;
        font-weight: normal;
      }
      .line {
        margin: 0 3px;
      }
      .num {
        color: #f5f5f5;
      }
    }
    .table-items-main {
      cursor: pointer;
    }
    .table-item {
      margin-top: 13px;
      .logo,
      .img {
        width: 28px;
        height: 28px;
        position: relative;
      }
      .img {
        border-radius: 50%;
      }
      .logo {
        margin-right: 6px;
      }
      .chainCode {
        width: 14px;
        height: 14px;
        position: absolute;
        right: -2px;
        bottom: -2px;
        border-radius: 50%;
      }
      .table-item-first {
        text-align: left;
        .symbol {
          span {
            font-size: 13px;
            color: #9aa0aa;
          }
          span:first-child {
            font-family: 'PingFangSC-Heavy';
            color: #f5f5f5;
          }
          .pump-logo,
          .icon-url {
            width: 10px;
            height: 10px;
            margin-left: 1px;
            color: #9aa0aa;
          }
        }
        .number {
          font-size: 12px;
          font-family: 'PingFangSC-Medium';
          color: #9aa0aa;
        }
        .clock-timer-txt {
          font-size: 10px;
          color: var(--up-color);
          margin: 0 4px;
        }
        .icon-percent {
          width: 12px;
          height: 12px;
          margin-right: 2px;
          color: var(--up-color);
        }
        .percent-txt {
          font-size: 10px;
        }
      }
      .table-item-last {
        text-align: right;
        span {
          font-family: 'PingFangSC-Medium';
          font-size: 13px;
        }
        span:first-child {
          color: #9aa0aa;
        }
        .red {
          color: var(--down-color);
        }
        .green {
          color: var(--up-color);
        }
      }
    }
  }
}
</style>
