<template>
  <div class="pump-box">
    <div class="pump-table">
      <div class="pump-list" v-for="(value, key, index) in pumpObj" :key="index">
        <div class="pump-list-title display-flex align-items-center justify-content-sp">
          <div v-if="index == 0" class="display-flex align-items-center">
            🌱 新创建
            <span class="pause-txt" v-if="curNode == 1">⏸ 已暂停</span>
          </div>
          <div v-if="index == 1" class="display-flex align-items-center">
            ⏳ 即将打满
            <span class="pause-txt" v-if="curNode == 2">⏸ 已暂停</span>
          </div>
          <div v-if="index == 2" class="display-flex align-items-center">
            ✨ 新外盘
            <span class="pause-txt" v-if="curNode == 3">⏸ 已暂停</span>
          </div>
          
          <!-- 筛选图标 -->
          <el-popover
            :visible="filterDialogVisible && currentFilterColumn === index"
            placement="bottom-end"
            :width="320"
            trigger="manual"
            popper-class="filter-popover"
            :teleported="false"
          >
            <template #reference>
              <div class="filter-icon-container" @click.stop="openFilterDialog(index)">
                <svg-icon name="h5-settings-01" class="filter-icon"></svg-icon>
              </div>
            </template>
            
            <!-- 筛选内容 -->
            <div class="filter-content" @click.stop>
              <div class="filter-scrollable">
                <!-- 指标 -->
                <div class="filter-section">
                  <div class="filter-label">指标</div>
                  <div class="filter-checkbox-grid">
                    <el-checkbox v-model="filterForm.hasSocialMedia" @change="applyFilters">
                      至少有一个社交媒体
                    </el-checkbox>
                    <el-checkbox v-model="filterForm.topHolders" @change="applyFilters">
                      前10持仓大户
                    </el-checkbox>
                    <el-checkbox v-model="filterForm.devNotSold" @change="applyFilters">
                      Dev未清仓
                    </el-checkbox>
                    <el-checkbox v-model="filterForm.devSold" @change="applyFilters">
                      Dev清仓
                    </el-checkbox>
                    <el-checkbox v-model="filterForm.devBurn" @change="applyFilters">
                      Dev烧币
                    </el-checkbox>
                    <el-checkbox v-model="filterForm.mintClosed" @change="applyFilters">
                      Mint关闭
                    </el-checkbox>
                    <el-checkbox v-model="filterForm.blacklist" @change="applyFilters">
                      黑名单
                    </el-checkbox>
                    <el-checkbox v-model="filterForm.burnedPool" @change="applyFilters">
                      烧池子
                    </el-checkbox>
                  </div>
                </div>

                <!-- 进度 -->
                <div class="filter-section">
                  <div class="filter-label">进度</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.progressMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">%</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.progressMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">%</span>
                  </div>
                </div>

                <!-- 市值 -->
                <div class="filter-section">
                  <div class="filter-label">市值</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.marketCapMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">K</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.marketCapMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">K</span>
                  </div>
                </div>

                <!-- 1h交易数 -->
                <div class="filter-section">
                  <div class="filter-label">1h交易数</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.txCountMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.txCountMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                  </div>
                </div>

                <!-- 持有人数 -->
                <div class="filter-section">
                  <div class="filter-label">持有人数</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.holdersMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.holdersMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                  </div>
                </div>

                <!-- 狙击人数 -->
                <div class="filter-section">
                  <div class="filter-label">狙击人数</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.snipersMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.snipersMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                  </div>
                </div>

                <!-- 成交额 -->
                <div class="filter-section">
                  <div class="filter-label">成交额</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.volumeMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">K</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.volumeMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">K</span>
                  </div>
                </div>

                <!-- 时间 -->
                <div class="filter-section">
                  <div class="filter-label">时间</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.timeMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">min</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.timeMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">min</span>
                  </div>
                </div>

                <!-- 跌路 -->
                <div class="filter-section">
                  <div class="filter-label">跌路</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.dropMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">%</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.dropMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">%</span>
                  </div>
                </div>

                <!-- 池子 -->
                <div class="filter-section">
                  <div class="filter-label">池子</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.poolMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">K</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.poolMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">K</span>
                  </div>
                </div>

                <!-- 钓鱼钱包 -->
                <div class="filter-section">
                  <div class="filter-label">钓鱼钱包</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.phishingMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">%</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.phishingMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">%</span>
                  </div>
                </div>

                <!-- 撸绒交易 -->
                <div class="filter-section">
                  <div class="filter-label">撸绒交易</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.rugPullMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">%</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.rugPullMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">%</span>
                  </div>
                </div>

                <!-- 总馈赠 -->
                <div class="filter-section">
                  <div class="filter-label">总馈赠</div>
                  <div class="range-inputs">
                    <el-input
                      v-model="filterForm.totalRewardMin"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">SOL</span>
                    <span class="range-to">to</span>
                    <el-input
                      v-model="filterForm.totalRewardMax"
                      placeholder=""
                      size="small"
                      @input="applyFilters"
                    />
                    <span class="range-separator">SOL</span>
                  </div>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="filter-actions">
                <el-button size="small" @click="resetFilters">
                  重置
                </el-button>
                <el-button type="primary" size="small" @click="closeFilterDialog">应用</el-button>
              </div>
            </div>
          </el-popover>
        </div>
        <el-scrollbar height="calc(100vh - 213px)">
          <div
            class="pump-list-items"
            @mouseover="handleMouseOver(index)"
            @mouseleave="handleMouseLeave(index)"
          >
            <el-skeleton style="width: 100%" :loading="skeletonLoading" animated>
              <template #template>
                <div
                  class="display-flex align-items-center justify-content-sp"
                  style="width: 100%; padding: 15px 10px"
                  v-for="item in 14"
                  :key="item"
                >
                  <div class="display-flex align-items-center">
                    <el-skeleton-item
                      variant="circle"
                      style="width: 56px; height: 56px; margin-right: 8px"
                    />
                    <div
                      class="display-flex flex-direction-col justify-content-sp"
                      style="height: 56px"
                    >
                      <el-skeleton-item variant="text" style="width: 80px; height: 16px" />
                      <el-skeleton-item variant="text" style="width: 60%; height: 12px" />
                      <el-skeleton-item variant="text" style="width: 120px; height: 14px" />
                    </div>
                  </div>
                  <div
                    class="display-flex flex-direction-col align-items-fd justify-content-sp"
                    style="height: 56px"
                  >
                    <el-skeleton-item variant="text" style="width: 30px; height: 18px" />
                    <el-skeleton-item variant="text" style="width: 120px; height: 22px" />
                  </div>
                </div>
              </template>
              <template #default>
                <div
                  class="pump-list-item display-flex align-items-center justify-content-sp"
                  v-for="item in getFilteredList(key, index)"
                  :key="item.pairAddress"
                  @click="handelTableRow(item)"
                >
                  <div class="display-flex align-items-fs">
                    <div
                      class="progress-circle"
                      :style="{
                        background: `conic-gradient(#20B26C 0% ${numToFixedTwo(parseFloat(item.percent || '0'))}%, rgba(32, 178, 108, 0.30) ${((item.percent || 0) * 100).toFixed(2)}% 100%)`
                      }"
                    >
                      <div class="logo">
                        <el-image :src="item.logo" alt="" class="coin-icon">
                          <template #error>
                            <svg-icon name="logo1" class="coin-icon"></svg-icon>
                          </template>
                        </el-image>
                      </div>
                    </div>
                    <div class="display-flex flex-direction-col">
                      <div class="coin-text display-flex align-items-fd">
                        <p class="display-flex align-items-center">
                          <span class="base-symbol">{{ item.baseToken?.symbol || '-' }}</span>
                          <span class="tokens—after">/{{ item.quoteToken?.symbol || '-' }}</span>
                        </p>
                        <p class="display-flex align-items-fd address">
                          <span>{{ shortifyAddress(item.baseToken.address) }}</span>
                          <svg-icon
                            name="copy"
                            class="copy"
                            v-copy="item.baseToken.address"
                          ></svg-icon>
                        </p>
                        <Favorite
                          :coinInfo="{
                            pairAddress: item.pairAddress,
                            chainCode: item.baseToken.chainCode
                          }"
                        />
                      </div>
                      <div class="time-icon-url display-flex align-items-center">
                        <p class="display-flex align-items-center">
                          <svg-icon name="clock-timer" class="clock-timer"></svg-icon>
                          <TimeAgo :timestamp="item.createTime * 1000" />
                        </p>
                        <span class="line"></span>
                        <p class="display-flex align-items-center">
                          <span @click.stop="handelRouter(item.twitter)" v-if="item.twitter">
                            <svg-icon name="twitter-pump" class="icon-url"></svg-icon>
                          </span>
                          <span @click.stop="handelRouter(item.website)" v-if="item.website">
                            <svg-icon name="website-pump" class="icon-url"></svg-icon>
                          </span>
                          <span @click.stop="handelRouter(item.telegram)" v-if="item.telegram">
                            <svg-icon name="telegram-pump" class="icon-url"></svg-icon>
                          </span>
                        </p>
                      </div>
                      <div class="display-flex align-items-center">
                        <div class="display-flex align-items-center percent-txt">
                          <svg-icon name="icon-percent" class="icon-percent"></svg-icon>
                          <span>{{ numToFixedTwo(parseFloat(item.percent || '0')) }}%</span>
                        </div>
                        <span class="num-txt">MC ${{ numberFormat(item.marketCap) }}</span>
                        <el-popover popper-class="pump-popper-box" :teleported="false">
                          <template #reference>
                            <span class="num-txt">Txs {{ numberFormat(item.totalCount) }}</span>
                          </template>
                          <template #default>
                            <div class="display-flex flex-direction-col">
                              <span class="count-title">交易数:</span>
                              <p class="count-txt">
                                <span class="up-color">{{ numberFormat(item.buyCount) }}</span>
                                <span class="line"> / </span>
                                <span class="down-color">{{ numberFormat(item.sellCount) }}</span>
                              </p>
                            </div>
                          </template>
                        </el-popover>
                        <el-popover popper-class="pump-popper-box" :teleported="false">
                          <template #reference>
                            <span class="num-txt">V ${{ numberFormat(item.totalVolume) }}</span>
                          </template>
                          <template #default>
                            <div class="display-flex flex-direction-col">
                              <span class="count-title">交易额:</span>
                              <p class="count-txt">
                                <span class="up-color">{{ numberFormat(item.buyVolume) }}</span>
                                <span class="line"> / </span>
                                <span class="down-color">{{ numberFormat(item.sellVolume) }}</span>
                              </p>
                            </div>
                          </template>
                        </el-popover>
                      </div>
                    </div>
                  </div>
                  <div class="operate display-flex flex-direction-col align-items-fd">
                    <span class="price-txt"><i>$</i>{{ numberFormat(item.price || 0) }}</span>
                    <div class="display-flex align-items-center justify-content-fd">
                      <WalletConnect v-if="!isConnected">
                        <div class="buy-operate-btn">
                          <span class="txt"
                            >买入 {{ amount && amount !== '0' ? numberFormat(amount) : '' }}</span
                          >
                        </div>
                      </WalletConnect>
                      <QuickBuyTrade :info="item" :amount="amount" v-else
                        >买入
                        {{ amount && amount !== '0' ? numberFormat(amount) : '' }}</QuickBuyTrade
                      >
                    </div>
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </el-scrollbar>
      </div>
    </div>

    
    <TradeDraw
      :coinInfo="coinInfo"
      :pairInfo="pairInfo"
      :tradeDrawVisible="tradeDrawVisible"
      @close="handleDrawClose"
      v-if="tradeDrawVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, onDeactivated } from 'vue'
import { ApiGetPumpRanking } from '@/api'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import { numberFormat, handleCoinPairInfo, shortifyAddress, numToFixedTwo } from '@/utils'

import TradeDraw from '@/components/Dialogs/TradeDraw.vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import QuickBuyTrade from './QuickBuyTrade.vue'
import Favorite from '@/components/Favorite.vue'
import TimeAgo from './TimeAgo.vue'
import { socket } from '@/utils/socket'

defineProps({
  amount: {
    required: true,
    type: String
  }
})

const i18n = useI18n()
const globalStore = useGlobalStore()

const isConnected = computed(() => globalStore.walletInfo.isConnected)

const skeletonLoading = ref<boolean>(false)

const pumpObj = reactive<Record<string, any>>({
  list1: [],
  list2: [],
  list3: []
})

// 筛选相关状态
const filterDialogVisible = ref<boolean>(false)
const currentFilterColumn = ref<number>(0)

// 创建默认筛选表单结构
const createDefaultFilterForm = () => ({
  // 复选框筛选
  hasSocialMedia: false,
  topHolders: false,
  devNotSold: false,
  devSold: false,
  devBurn: false,
  mintClosed: false,
  blacklist: false,
  burnedPool: false,
  
  // 数值范围筛选
  progressMin: '',
  progressMax: '',
  marketCapMin: '',
  marketCapMax: '',
  txCountMin: '',
  txCountMax: '',
  holdersMin: '',
  holdersMax: '',
  snipersMin: '',
  snipersMax: '',
  volumeMin: '',
  volumeMax: '',
  timeMin: '',
  timeMax: '',
  dropMin: '',
  dropMax: '',
  poolMin: '',
  poolMax: '',
  phishingMin: '',
  phishingMax: '',
  rugPullMin: '',
  rugPullMax: '',
  totalRewardMin: '',
  totalRewardMax: ''
})

// 每个列表独立的筛选表单
const filterForms = reactive({
  0: createDefaultFilterForm(), // 新创建
  1: createDefaultFilterForm(), // 即将打满
  2: createDefaultFilterForm()  // 新外盘
})

// 获取当前列的筛选表单（计算属性）
const filterForm = computed(() => {
  return filterForms[currentFilterColumn.value as keyof typeof filterForms]
})

// 筛选后的数据
const filteredData = reactive<Record<string, any>>({
  list1: [],
  list2: [],
  list3: []
})

const curNode = ref<number>(0)
const tradeDrawVisible = ref<boolean>(false)
const coinInfo = ref<any>(null)
const pairInfo = ref<any>(null)

// 获取筛选后的列表
const getFilteredList = (key: string, index: number) => {
  const currentForm = filterForms[index as keyof typeof filterForms]
  
  // 如果没有筛选条件被设置，返回原始数据
  const hasFilters = Object.keys(currentForm).some(filterKey => {
    const typedKey = filterKey as keyof typeof currentForm
    if (typeof currentForm[typedKey] === 'boolean') {
      return currentForm[typedKey] === true
    } else {
      return currentForm[typedKey] !== ''
    }
  })
  
  if (!hasFilters) {
    return pumpObj[key] || []
  }
  
  return filteredData[key] || []
}

// 应用筛选逻辑
const applyFilters = () => {
  Object.keys(pumpObj).forEach((key, index) => {
    let filtered = [...pumpObj[key]]
    const currentForm = filterForms[index as keyof typeof filterForms]

    // 复选框筛选
    if (currentForm.hasSocialMedia) {
      filtered = filtered.filter(item => 
        item.twitter || item.website || item.telegram
      )
    }
    
    if (currentForm.topHolders) {
      filtered = filtered.filter(item => item.topHolders === true)
    }
    
    if (currentForm.devNotSold) {
      filtered = filtered.filter(item => item.devSold === false)
    }
    
    if (currentForm.devSold) {
      filtered = filtered.filter(item => item.devSold === true)
    }
    
    if (currentForm.mintClosed) {
      filtered = filtered.filter(item => item.mintClosed === true)
    }
    
    if (currentForm.blacklist) {
      filtered = filtered.filter(item => item.isBlacklisted === true)
    }
    
    if (currentForm.burnedPool) {
      filtered = filtered.filter(item => item.poolBurned === true)
    }
    
    if (currentForm.devBurn) {
      filtered = filtered.filter(item => item.devBurn === true)
    }

    // 数值范围筛选
    if (currentForm.progressMin) {
      const min = parseFloat(currentForm.progressMin)
      filtered = filtered.filter(item => 
        parseFloat(item.percent || '0') >= min
      )
    }
    
    if (currentForm.progressMax) {
      const max = parseFloat(currentForm.progressMax)
      filtered = filtered.filter(item => 
        parseFloat(item.percent || '0') <= max
      )
    }
    
    if (currentForm.marketCapMin) {
      const min = parseFloat(currentForm.marketCapMin) * 1000
      filtered = filtered.filter(item => 
        parseFloat(item.marketCap || '0') >= min
      )
    }
    
    if (currentForm.marketCapMax) {
      const max = parseFloat(currentForm.marketCapMax) * 1000
      filtered = filtered.filter(item => 
        parseFloat(item.marketCap || '0') <= max
      )
    }
    
    if (currentForm.txCountMin) {
      const min = parseFloat(currentForm.txCountMin)
      filtered = filtered.filter(item => 
        parseFloat(item.totalCount || '0') >= min
      )
    }
    
    if (currentForm.txCountMax) {
      const max = parseFloat(currentForm.txCountMax)
      filtered = filtered.filter(item => 
        parseFloat(item.totalCount || '0') <= max
      )
    }
    
    if (currentForm.volumeMin) {
      const min = parseFloat(currentForm.volumeMin) * 1000
      filtered = filtered.filter(item => 
        parseFloat(item.totalVolume || '0') >= min
      )
    }
    
    if (currentForm.volumeMax) {
      const max = parseFloat(currentForm.volumeMax) * 1000
      filtered = filtered.filter(item => 
        parseFloat(item.totalVolume || '0') <= max
      )
    }

    filteredData[key] = filtered
  })
}

// 重置筛选
const resetFilters = () => {
  const currentForm = filterForms[currentFilterColumn.value as keyof typeof filterForms]
  Object.keys(currentForm).forEach(key => {
    const typedKey = key as keyof typeof currentForm
    if (typeof currentForm[typedKey] === 'boolean') {
      (currentForm[typedKey] as boolean) = false
    } else {
      (currentForm[typedKey] as string) = ''
    }
  })
  applyFilters()
}

// 打开筛选弹窗
const openFilterDialog = (columnIndex: number) => {
  console.log('点击筛选图标，列索引:', columnIndex, '当前状态:', filterDialogVisible.value)
  
  // 如果点击的是同一个列且弹窗已打开，则关闭弹窗
  if (filterDialogVisible.value && currentFilterColumn.value === columnIndex) {
    filterDialogVisible.value = false
  } else {
    // 否则打开对应列的弹窗
    currentFilterColumn.value = columnIndex
    filterDialogVisible.value = true
  }
}

// 关闭筛选弹窗
const closeFilterDialog = () => {
  filterDialogVisible.value = false
}

// 处理 Popover 显示状态变化
const handlePopoverVisibleChange = (visible: boolean) => {
  if (!visible) {
    filterDialogVisible.value = false
  }
}

// 添加点击外部关闭功能
const handleClickOutside = (event: Event) => {
  // 检查点击的目标是否在筛选弹窗内部
  const target = event.target as HTMLElement
  if (target && !target.closest('.filter-popover') && !target.closest('.filter-icon-container')) {
    filterDialogVisible.value = false
  }
}

// 获取列标题
const getColumnTitle = (index: number) => {
  const titles = ['新创建', '即将打满', '新外盘']
  return titles[index] || ''
}

const pumpRankingFun = () => {
  socket.off('pumpRanking')
  socket.on('pumpRanking', (message: string) => {
    const data = JSON.parse(message)
    const newRanking = data.ranking || []
    
    // 使用智能更新，保持现有项的引用
    switch (data.type) {
      case 1:
        updateListWithKey(pumpObj.list1, newRanking)
        break
      case 2:
        updateListWithKey(pumpObj.list2, newRanking)
        break
      case 3:
        updateListWithKey(pumpObj.list3, newRanking)
        break
      default:
        break
    }
    applyFilters()
  })
}

// 智能更新列表，保持组件实例
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

const getPumpRanking = async (type: number) => {
  const res: any = await ApiGetPumpRanking({
    type
  })
  const arr = res?.ranking || []
  switch (type) {
    case 1:
      pumpObj.list1 = arr
      break
    case 2:
      pumpObj.list2 = arr
      break
    case 3:
      pumpObj.list3 = arr
      break
    default:
      break
  }
  applyFilters()
}


const handelTrade = (row: any) => {
  coinInfo.value = handleCoinPairInfo({
    logo: row.logo,
    baseAddress: row.baseToken.address,
    quoteAddress: row.quoteToken.address,
    baseSymbol: row.baseToken.symbol,
    quoteSymbol: row.quoteToken.symbol,
    baseDecimal: row.baseToken.decimals,
    quoteDecimal: row.quoteToken.decimals,
    chainCode: row.baseToken.chainCode
  })

  pairInfo.value = {
    tvl: row.tvl || 0,
    circulationVol: row.marketCap || 0,
    price: row.price || 0
  }

  tradeDrawVisible.value = true
}

const handleDrawClose = () => {
  tradeDrawVisible.value = false
}

const handelTableRow = (row: any) => {
  handelJump(row)
}
const handelJump = (item: any) => {
  window.open(`/k/${item.pairAddress}?chainCode=${item.baseToken.chainCode}`)
}

const handelRouter = (url: string) => {
  console.log(url)
  window.open(url)
}

const handleMouseOver = (index: number) => {
  curNode.value = index + 1
  socket.off('pumpRanking')
}

const handleMouseLeave = (index: number) => {
  curNode.value = 0
  pumpRankingFun()
}

const initData = async () => {
  await Promise.all([
    getPumpRanking(1),
    getPumpRanking(2),
    getPumpRanking(3)
  ])
  // 确保初始化时应用筛选
  applyFilters()
}



onMounted(async () => {
  skeletonLoading.value = true
  await initData()
  skeletonLoading.value = false
  pumpRankingFun()
  
  // 添加全局点击事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  socket.off('pumpRanking')
  // 移除全局点击事件监听
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.pump-tab {
  padding-bottom: 16px;
  position: sticky;
  background-color: var(--bg-color);
  top: 50px;
  z-index: 9;
  span {
    height: 34px;
    padding: 0 10px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    margin-right: 10px;
    line-height: 1.2;
    cursor: pointer;
    transition: all 0.1s;
    background-color: transparent;
    color: #828282;
    white-space: nowrap;
  }
  span:hover,
  .active {
    color: var(--font-color-default);
    background-color: var(--hover-bg-color);
  }
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
}

.pump-table {
  border-radius: 12px;
  padding-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  .pump-list {
    min-width: 0;
    padding: 12px 0px;
    border-radius: 12px;
    background: rgba(23, 24, 27, 0.3);
    .pump-list-title {
      padding: 0px 16px 8px 16px;
      color: #f5f5f5;
      font-family: 'PingFangSC-Medium';
      font-size: 16px;
      position: relative;
      
      .pause-txt {
        padding: 1px 5px;
        margin-left: 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #ffec42;
        background-color: #595000;
        font-family: 'PingFangSC-Medium';
      }
      
      .filter-icon-container {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .filter-icon {
          width: 16px;
          height: 16px;
          color: #9aa0aa;
          transition: color 0.2s;
          
          &:hover {
            color: #f5f5f5;
          }
        }
      }
    }
    .pump-list-item {
      padding: 16px;
      border-bottom: 1px solid rgba(38, 40, 44, 0.3);
      cursor: pointer;
    }
    .coin-text {
      line-height: 1;
    }
    .progress-circle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: conic-gradient(#20b26c 0% 0%, rgba(32, 178, 108, 0.3) 0% 100%);
      position: relative;
      transition: background 0.5s;
      margin-right: 8px;
    }
    .progress-circle::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 89%;
      height: 89%;
      background: #222222;
      border-radius: 50%;
    }
    .logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 89%;
      height: 89%;
      border-radius: 50%;
    }
    .coin-icon {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: block;
    }
    .chainCode {
      width: 16px;
      height: 16px;
      position: absolute;
      right: -1px;
      bottom: 0px;
    }
    .base-symbol,
    .tokens—after {
      color: #f5f5f5;
      font-family: 'PingFangSC-Medium';
      font-size: 14px;
    }
    .address {
      margin: 0 4px;
      font-family: 'PingFangSC-Medium';
      font-size: 12px;
      color: #9aa0aa;
    }
    .copy {
      width: 12px;
      height: 12px;
      cursor: pointer;
      display: block;
      margin-left: 2px;
    }
    :deep(.favorite-box) {
      margin-left: 0px;
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
    .time-icon-url {
      margin: 4px 0;
      .line {
        height: 12px;
        width: 1px;
        background-color: #222;
        margin: 0 8px;
      }
      .clock-timer-txt {
        color: var(--up-color);
        font-size: 10px;
      }
      .clock-timer,
      .flash-trade {
        width: 12px;
        height: 12px;
        margin-right: 2px;
      }
      .icon-url {
        width: 12px;
        height: 12px;
        margin-right: 4px;
        display: block;
        color: #9aa0aa;
      }
    }
    .percent-txt {
      color: var(--up-color);
      font-size: 10px;
      font-family: 'PingFangSC-Medium';
    }
    .num-txt {
      margin-left: 8px;
      color: #9aa0aa;
      font-size: 10px;
      white-space: nowrap;
    }
    :deep(.pump-popper-box) {
      width: auto !important;
      min-width: 120px;
      padding: 8px 20px;
      background-color: #26282c !important;
      color: var(--font-color-default) !important;
      border: 1px solid #26282c !important;
      border-radius: 4px !important;
      .el-popper__arrow:before {
        top: 0;
        background-color: #26282c !important;
        border: 1px solid #26282c !important;
      }
    }

    .count-txt {
      font-size: 14px;
      font-family: 'PingFangSC-Medium';
      .count-title {
        font-size: #81868c;
        font-size: 12px;
      }
      .line {
        color: #f5f5f5;
      }
    }
    .icon-percent {
      width: 12px;
      height: 12px;
      margin-right: 2px;
    }
    .price-txt {
      color: #f5f5f5;
      font-family: 'PingFangSC-Medium';
      font-size: 14px;
      margin-bottom: 8px;
      i {
        font-style: normal;
        font-size: 10px;
        font-family: 'PingFangSC-Regular';
      }
    }
    .trade-operate-btn {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 16px;
      border: 1px solid #222;
      font-size: 12px;
      cursor: pointer;
      span {
        white-space: nowrap;
        color: #848e9c;
        font-family: 'PingFangSC-Medium';
      }
    }
    .buy-operate-btn {
      margin-left: 6px;
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 16px;
      background: rgba(46, 189, 133, 0.1);
      .txt {
        color: var(--up-color);
        font-size: 12px;
        white-space: nowrap;
        font-family: 'PingFangSC-Medium';
      }
    }
    .operate {
      :deep(.operate-btn) {
        margin-left: 6px;
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 16px;
        background: rgba(46, 189, 133, 0.1);
        height: auto;
        .txt {
          color: var(--up-color);
          font-size: 12px;
          white-space: nowrap;
          font-family: 'PingFangSC-Medium';
        }
        .icon-buy {
          display: none;
        }
      }
    }
  }

  :deep(.connect-wallet-btn) {
    padding: 0;
    background-color: transparent;
    min-width: auto;
  }

  .audit-text {
    justify-content: center;
    .audit-text-item {
      margin-right: 14px;
    }
    .audit-text-item:last-child {
      margin-right: 0;
    }
    span {
      margin-top: 5px;
      color: var(--font-color-default);
      font-size: 12px;
    }
  }
}
// 筛选弹窗样式
:deep(.filter-popover) {
  background-color: #000000 !important;
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8) !important;
  padding: 0 !important;
  
  .el-popper__arrow::before {
    background: #000000 !important;
    border: none !important;
  }
}

.filter-content {
  background-color: #000000;
  border-radius: 8px;
  
  .filter-scrollable {
    max-height: 500px;
    overflow-y: auto;
    padding: 20px;
    
    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: #111111;
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #333333;
      border-radius: 2px;
      
      &:hover {
        background: #444444;
      }
    }
  }
  
  .filter-section {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .filter-label {
    color: #ffffff;
    font-size: 14px;
    margin-bottom: 6px;
    font-weight: normal;
    line-height: 1.3;
  }
  
  .filter-checkbox-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-bottom: 6px;
    
    :deep(.el-checkbox) {
      margin: 0;
      display: flex;
      align-items: center;
      padding: 3px 0;
      
      .el-checkbox__label {
        color: #b5b5b5;
        font-size: 12px;
        line-height: 1.3;
        padding-left: 5px;
        font-weight: normal;
      }
      
      .el-checkbox__input {
        .el-checkbox__inner {
          width: 14px;
          height: 14px;
          background-color: transparent;
          border: 1px solid #555555;
          border-radius: 3px;
          transition: all 0.2s ease;
          
          &::after {
            width: 3px;
            height: 6px;
            left: 4px;
            top: 1px;
            border-width: 1px;
          }
        }
        
        &.is-checked .el-checkbox__inner {
          background-color: #ffffff;
          border-color: #ffffff;
          
          &::after {
            border-color: #000000;
            border-width: 1px;
          }
        }
        
        &:hover .el-checkbox__inner {
          border-color: #777777;
        }
      }
    }
  }
  
  .range-inputs {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
    
    :deep(.el-input) {
      flex: 1;
      
      .el-input__wrapper {
        background-color: #2a2a2a;
        border: 1px solid #3a3a3a;
        border-radius: 5px;
        box-shadow: none;
        height: 28px;
        
        &.is-focus {
          border-color: #ffffff;
          background-color: #2f2f2f;
        }
        
        .el-input__inner {
          color: #ffffff;
          font-size: 12px;
          height: 26px;
          line-height: 26px;
          text-align: left;
          padding: 0 6px;
          
          &::placeholder {
            color: #666666;
          }
        }
      }
    }
    
    .range-separator {
      color: #b5b5b5;
      font-size: 12px;
      font-weight: normal;
      padding: 0 1px;
    }
    
    .range-to {
      color: #b5b5b5;
      font-size: 12px;
      white-space: nowrap;
      font-weight: normal;
      padding: 0 1px;
    }
  }
}

.filter-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 12px 20px;
  background-color: #000000;
  margin: 8px 0 0 0;
  border-radius: 0 0 8px 8px;
  
  :deep(.el-button) {
    height: 28px;
    border-radius: 14px;
    font-size: 12px;
    font-weight: normal;
    padding: 0 16px;
    min-width: 50px;
    
    &.el-button--default {
      background-color: #2a2a2a;
      border: 1px solid #3a3a3a;
      color: #ffffff;
      
      &:hover {
        background-color: #404040;
        border-color: #555555;
        color: #ffffff;
      }
      
      &:active {
        background-color: #1a1a1a;
        border-color: #2a2a2a;
        color: #ffffff;
      }
      
      &:focus {
        background-color: #2a2a2a;
        border-color: #3a3a3a;
        color: #ffffff;
        box-shadow: none;
        outline: none;
      }
    }
    
    &.el-button--primary {
      background-color: #ffffff;
      border: 1px solid #ffffff;
      color: #000000;
      
      &:hover {
        background-color: #f0f0f0;
        border-color: #f0f0f0;
        color: #000000;
      }
      
      &:active {
        background-color: #e0e0e0;
        border-color: #e0e0e0;
        color: #000000;
      }
      
      &:focus {
        background-color: #f5f5f5;
        border-color: #f5f5f5;
        color: #000000;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

:deep(.el-drawer__title) {
  color: var(--font-color-default);
}
</style>
