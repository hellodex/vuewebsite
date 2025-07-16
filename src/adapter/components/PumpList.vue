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
          
          <div class="filter-controls display-flex align-items-center">
            <!-- 搜索输入框 -->
            <el-input 
              v-model="searchKeywords[index]"
              placeholder="搜索"
              size="small"
              clearable
              class="search-input"
              @input="handleSearch(index)"
            >
              <template #prefix>
                <svg-icon name="h5-search-md" class="search-icon"></svg-icon>
              </template>
            </el-input>
            
            <!-- 声音图标 -->
            <el-popover
              :visible="audioDialogVisible[index]"
              placement="bottom"
              :width="200"
              trigger="manual"
              popper-class="audio-popover"
              :teleported="false"
            >
              <template #reference>
                <div 
                  class="audio-icon-container" 
                  :class="{ 'has-audio': selectedAudio[index] !== '关闭' }"
                  :style="selectedAudio[index] !== '关闭' ? 'color: #ffffff !important' : ''"
                  @click.stop="openAudioDialog(index)"
                >
                  <svg-icon 
                    :name="selectedAudio[index] === '关闭' ? 'icon-mute-notification' : 'icon-bell'" 
                    class="audio-icon"
                  ></svg-icon>
                </div>
              </template>
              
              <!-- 音频选择列表 -->
              <div class="audio-list" @click.stop>
                <div 
                  class="audio-item"
                  :class="{ active: selectedAudio[index] === '关闭' }"
                  @click="selectAudio(index, '关闭')"
                >
                  <span>关闭</span>
                  <svg-icon name="check" class="check-icon" v-if="selectedAudio[index] === '关闭'"></svg-icon>
                </div>
                <div 
                  class="audio-item"
                  v-for="audioFile in audioFiles"
                  :key="audioFile"
                  :class="{ active: selectedAudio[index] === audioFile }"
                  @click="selectAudio(index, audioFile)"
                >
                  <span>{{ audioFile.replace('.mp3', '') }}</span>
                  <svg-icon name="check" class="check-icon" v-if="selectedAudio[index] === audioFile"></svg-icon>
                </div>
              </div>
            </el-popover>
            
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
                  <svg-icon name="filter-funnel" class="filter-icon"></svg-icon>
                  <span v-if="getActiveFilterCount(index) > 0" class="filter-count">{{ getActiveFilterCount(index) }}</span>
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
                <el-button size="small" @click="resetFilters" class="reset-button">
                  重置
                </el-button>
                <el-button type="primary" size="small" @click="closeFilterDialog">应用</el-button>
              </div>
            </div>
          </el-popover>
          </div>
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
                            baseTokenAddress: item.baseToken.address,
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
import { useRouter } from 'vue-router'
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
const router = useRouter()
const globalStore = useGlobalStore()

const isConnected = computed(() => globalStore.walletInfo.isConnected)

const skeletonLoading = ref<boolean>(false)

const pumpObj = reactive<Record<string, any>>({
  list1: [],
  list2: [],
  list3: []
})

// 搜索关键词，每个列表独立
const searchKeywords = reactive(['', '', ''])

// 音频相关状态
const audioFiles = ['Alipay.mp3', 'Bell.mp3', 'Cheer.mp3', 'Coins.mp3', 'Handgun.mp3', 'Kaching.mp3', 'Nice.mp3', 'Pop.mp3', 'Shotgun.mp3', 'Sonumi.mp3', 'Wechat.mp3', 'Yes.mp3']
const audioDialogVisible = reactive([false, false, false])
const selectedAudio = reactive(['关闭', '关闭', '关闭'])
const audioInstances = reactive<Record<number, HTMLAudioElement>>({})

// 导入所有音频文件
const audioModules = import.meta.glob('/src/assets/audio/*.mp3', { eager: true, as: 'url' })

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
  const searchKeyword = searchKeywords[index]
  
  // 如果没有筛选条件和搜索关键词，返回原始数据
  const hasFilters = Object.keys(currentForm).some(filterKey => {
    const typedKey = filterKey as keyof typeof currentForm
    if (typeof currentForm[typedKey] === 'boolean') {
      return currentForm[typedKey] === true
    } else {
      return currentForm[typedKey] !== ''
    }
  })
  
  // 如果既没有筛选条件也没有搜索关键词，返回原始数据
  if (!hasFilters && !searchKeyword) {
    return pumpObj[key] || []
  }
  
  // 获取要处理的数据（如果有筛选条件，使用筛选后的数据，否则使用原始数据）
  let dataToFilter = hasFilters ? (filteredData[key] || []) : (pumpObj[key] || [])
  
  // 如果有搜索关键词，进行搜索过滤
  if (searchKeyword) {
    const keyword = searchKeyword.toLowerCase()
    dataToFilter = dataToFilter.filter((item: any) => {
      const symbol = item.baseToken?.symbol || ''
      return symbol.toLowerCase().includes(keyword)
    })
  }
  
  return dataToFilter
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
  
  // 检查点击的目标是否在音频弹窗内部
  if (target && !target.closest('.audio-popover') && !target.closest('.audio-icon-container')) {
    audioDialogVisible.forEach((_, i) => {
      audioDialogVisible[i] = false
    })
  }
}

// 获取列标题
const getColumnTitle = (index: number) => {
  const titles = ['新创建', '即将打满', '新外盘']
  return titles[index] || ''
}

// 计算已激活的筛选项数量
const getActiveFilterCount = (index: number) => {
  const currentForm = filterForms[index as keyof typeof filterForms]
  let count = 0
  
  // 计算复选框筛选项
  if (currentForm.hasSocialMedia) count++
  if (currentForm.topHolders) count++
  if (currentForm.devNotSold) count++
  if (currentForm.devSold) count++
  if (currentForm.devBurn) count++
  if (currentForm.mintClosed) count++
  if (currentForm.blacklist) count++
  if (currentForm.burnedPool) count++
  
  // 计算数值范围筛选项
  if (currentForm.progressMin || currentForm.progressMax) count++
  if (currentForm.marketCapMin || currentForm.marketCapMax) count++
  if (currentForm.txCountMin || currentForm.txCountMax) count++
  if (currentForm.holdersMin || currentForm.holdersMax) count++
  if (currentForm.snipersMin || currentForm.snipersMax) count++
  if (currentForm.volumeMin || currentForm.volumeMax) count++
  if (currentForm.timeMin || currentForm.timeMax) count++
  if (currentForm.dropMin || currentForm.dropMax) count++
  if (currentForm.poolMin || currentForm.poolMax) count++
  if (currentForm.phishingMin || currentForm.phishingMax) count++
  if (currentForm.rugPullMin || currentForm.rugPullMax) count++
  if (currentForm.totalRewardMin || currentForm.totalRewardMax) count++
  
  return count
}

// 处理搜索
const handleSearch = (index: number) => {
  // 搜索会实时触发，getFilteredList 会自动处理搜索逻辑
}

// 打开音频选择弹窗
const openAudioDialog = (index: number) => {
  // 关闭其他弹窗
  audioDialogVisible.forEach((_, i) => {
    audioDialogVisible[i] = false
  })
  filterDialogVisible.value = false
  
  // 打开当前弹窗
  audioDialogVisible[index] = !audioDialogVisible[index]
}

// 选择音频
const selectAudio = (index: number, audioFile: string) => {
  selectedAudio[index] = audioFile
  audioDialogVisible[index] = false
  
  // 如果选择了音频文件，预加载音频
  if (audioFile !== '关闭') {
    // 从预导入的模块中获取音频URL
    const audioPath = `/src/assets/audio/${audioFile}`
    const audioUrl = audioModules[audioPath] || ''
    
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.preload = 'auto'
      audioInstances[index] = audio
    } else {
      console.error('音频文件未找到:', audioPath)
    }
  } else {
    // 如果选择关闭，删除音频实例
    if (audioInstances[index]) {
      delete audioInstances[index]
    }
  }
}

// 播放音频
const playAudio = (index: number) => {
  if (selectedAudio[index] !== '关闭' && audioInstances[index]) {
    // 克隆音频实例以支持重叠播放
    const audio = audioInstances[index].cloneNode(true) as HTMLAudioElement
    audio.play().catch(err => {
      console.error('播放音频失败:', err)
    })
  }
}

const pumpRankingFun = () => {
  socket.off('pumpRanking')
  socket.on('pumpRanking', (message: string) => {
    const data = JSON.parse(message)
    const newRanking = data.ranking || []
    
    // 检查是否有新数据（仅对新创建列表）
    let hasNewItems = false
    if (data.type === 1 && newRanking.length > 0) {
      // 如果是第一次加载（列表为空），不播放声音
      if (pumpObj.list1.length === 0) {
        // 初始加载，不播放
      } else {
        // 检查是否有新的代币（通过pairAddress判断）
        const currentPairs = new Set(pumpObj.list1.filter((item: any) => item && item.pairAddress).map((item: any) => item.pairAddress))
        hasNewItems = newRanking.some((item: any) => item && item.pairAddress && !currentPairs.has(item.pairAddress))
      }
    }
    
    // 使用智能更新，保持现有项的引用
    switch (data.type) {
      case 1:
        updateListWithKey(pumpObj.list1, newRanking)
        // 新创建列表有新数据时播放音频
        if (hasNewItems) {
          playAudio(0)
        }
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
  router.push(`/k/${item.pairAddress}?chainCode=${item.baseToken.chainCode}`)
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
      
      .filter-controls {
        gap: 8px;
        
        .audio-icon-container {
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.03);
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.08);
            
            &:not(.has-audio) .audio-icon {
              color: var(--up-color);
            }
          }
          
          .audio-icon {
            width: 14px;
            height: 14px;
            color: #6b6e73;
            transition: color 0.2s;
          }
          
          &.has-audio {
            :deep(.audio-icon) {
              color: #ffffff !important;
              
              svg {
                color: #ffffff !important;
                
                path {
                  fill: #ffffff !important;
                }
              }
            }
          }
        }
        
        .search-input {
          width: 90px;
          
          :deep(.el-input__wrapper) {
            background-color: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            box-shadow: none !important;
            outline: none !important;
            height: 24px;
            transition: border-color 0.2s;
            padding: 0 8px;
            
            &:hover {
              border-color: rgba(255, 255, 255, 0.8);
              background-color: rgba(255, 255, 255, 0.02);
              box-shadow: none !important;
              outline: none !important;
            }
            
            &.is-focus {
              border-color: rgba(255, 255, 255, 0.8);
              background-color: rgba(255, 255, 255, 0.02);
              box-shadow: none !important;
              outline: none !important;
            }
            
            &:focus,
            &:focus-visible {
              box-shadow: none !important;
              outline: none !important;
            }
            
            .el-input__prefix {
              margin-right: 0;
              left: 8px;
            }
            
            .el-input__prefix-inner {
              display: flex;
              align-items: center;
              
              .search-icon {
                width: 12px;
                height: 12px;
                color: #6b6e73;
              }
            }
            
            .el-input__inner {
              color: #f5f5f5;
              font-size: 11px;
              height: 22px;
              line-height: 22px;
              text-align: left;
              box-shadow: none !important;
              outline: none !important;
              
              &:focus,
              &:focus-visible {
                box-shadow: none !important;
                outline: none !important;
              }
              
              &::placeholder {
                color: #6b6e73;
                font-size: 11px;
              }
            }
            
            .el-input__clear {
              display: none !important;
            }
          }
        }
      }
      
      .filter-icon-container {
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.03);
        position: relative;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
          
          .filter-icon {
            color: var(--up-color);
          }
        }
        
        .filter-icon {
          width: 14px;
          height: 14px;
          color: #ffffff;
          transition: color 0.2s;
        }
        
        .filter-count {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--up-color);
          color: #000000;
          font-size: 9px;
          font-weight: 600;
          min-width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
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
        color: #81868c;
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
  background-color: #1a1b1e !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
  padding: 0 !important;
  
  .el-popper__arrow::before {
    background: #1a1b1e !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
}

.filter-content {
  background-color: #1a1b1e;
  border-radius: 12px;
  color: #f5f5f5;
  overflow: hidden;
  
  .filter-scrollable {
    max-height: 400px;
    overflow-y: auto;
    padding: 16px 16px 0 16px;
    
    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    }
  }
  
  .filter-section {
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .filter-label {
    color: #9aa0aa;
    font-size: 12px;
    margin-bottom: 10px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }
  
  .filter-checkbox-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
    
    :deep(.el-checkbox) {
      margin: 0;
      display: flex;
      align-items: center;
      padding: 3px 0;
      
      .el-checkbox__label {
        color: #e0e0e0;
        font-size: 12px;
        line-height: 1.4;
        padding-left: 6px;
        font-weight: normal;
      }
      
      .el-checkbox__input {
        .el-checkbox__inner {
          width: 16px;
          height: 16px;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          transition: all 0.2s ease;
          
          &::after {
            width: 4px;
            height: 7px;
            left: 5px;
            top: 2px;
            border-width: 1px;
          }
        }
        
        &.is-checked .el-checkbox__inner {
          background-color: var(--up-color);
          border-color: var(--up-color);
          
          &::after {
            border-color: #000000;
            border-width: 2px;
          }
        }
        
        &:hover .el-checkbox__inner {
          border-color: rgba(255, 255, 255, 0.3);
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
        background-color: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        box-shadow: none;
        height: 32px;
        transition: all 0.2s;
        
        &:hover {
          border-color: rgba(255, 255, 255, 0.15);
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        &.is-focus {
          border-color: var(--up-color);
          background-color: rgba(32, 178, 108, 0.05);
        }
        
        .el-input__inner {
          color: #f5f5f5;
          font-size: 13px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          padding: 0 8px;
          
          &::placeholder {
            color: #6b6e73;
          }
        }
      }
    }
    
    .range-separator {
      color: #6b6e73;
      font-size: 11px;
      font-weight: normal;
      padding: 0 2px;
    }
    
    .range-to {
      color: #6b6e73;
      font-size: 11px;
      white-space: nowrap;
      font-weight: 500;
      padding: 0 2px;
    }
  }
}

.filter-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.02);
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  // 覆盖Element Plus的CSS变量
  --el-button-hover-text-color: #ff6b6b;
  --el-button-hover-bg-color: rgba(255, 75, 75, 0.1);
  --el-button-hover-border-color: rgba(255, 75, 75, 0.3);
  --el-button-active-text-color: #ff6b6b;
  --el-button-active-bg-color: rgba(255, 75, 75, 0.15);
  --el-button-active-border-color: rgba(255, 75, 75, 0.4);
  
  :deep(.el-button) {
    height: 32px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    padding: 0 20px;
    min-width: 80px;
    transition: all 0.2s;
    
    &.el-button--default {
      background-color: rgba(255, 255, 255, 0.03) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      color: #c0c0c0 !important;
      
      &:hover,
      &:hover:not(.is-disabled):not(.is-loading),
      &:hover:not(:disabled) {
        background-color: rgba(255, 75, 75, 0.1) !important;
        border-color: rgba(255, 75, 75, 0.3) !important;
        color: #ff6b6b !important;
        transform: translateY(-1px);
        box-shadow: none !important;
        outline: none !important;
      }
      
      &:active,
      &:active:not(.is-disabled):not(.is-loading) {
        background-color: rgba(255, 75, 75, 0.15) !important;
        border-color: rgba(255, 75, 75, 0.4) !important;
        color: #ff6b6b !important;
        transform: translateY(0);
        box-shadow: none !important;
        outline: none !important;
      }
      
      &:focus,
      &:focus:not(:hover) {
        background-color: rgba(255, 255, 255, 0.03) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
        color: #c0c0c0 !important;
        box-shadow: none !important;
        outline: none !important;
      }
      
      &:focus:hover {
        background-color: rgba(255, 75, 75, 0.1) !important;
        border-color: rgba(255, 75, 75, 0.3) !important;
        color: #ff6b6b !important;
        box-shadow: none !important;
        outline: none !important;
      }
    }
    
    &.el-button--primary {
      background-color: var(--up-color);
      border: 1px solid var(--up-color);
      color: #000000;
      font-weight: 600;
      
      &:hover {
        background-color: #1fa065;
        border-color: #1fa065;
        color: #000000;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(32, 178, 108, 0.25);
      }
      
      &:active {
        background-color: #1a8f5a;
        border-color: #1a8f5a;
        color: #000000;
        transform: translateY(0);
      }
      
      &:focus {
        background-color: var(--up-color);
        border-color: var(--up-color);
        color: #000000;
        box-shadow: 0 0 0 3px rgba(32, 178, 108, 0.2);
      }
    }
    
    // 重置按钮特定样式
    &.reset-button {
      // 移除 Element Plus 的默认 CSS 变量
      --el-button-hover-text-color: none !important;
      --el-button-hover-bg-color: none !important;
      --el-button-hover-border-color: none !important;
      
      background-color: rgba(255, 255, 255, 0.03) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      color: #c0c0c0 !important;
      
      &:hover,
      &:hover:not(.is-disabled):not(.is-loading),
      &:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.08) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
        color: #f5f5f5 !important;
        transform: translateY(-1px);
        box-shadow: none !important;
        outline: none !important;
      }
      
      &:active,
      &:active:not(.is-disabled):not(.is-loading) {
        background-color: rgba(255, 255, 255, 0.12) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        color: #f5f5f5 !important;
        transform: translateY(0);
        box-shadow: none !important;
        outline: none !important;
      }
      
      &:focus,
      &:focus:not(:hover) {
        background-color: rgba(255, 255, 255, 0.03) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
        color: #c0c0c0 !important;
        box-shadow: none !important;
        outline: none !important;
      }
      
      &:focus:hover {
        background-color: rgba(255, 255, 255, 0.08) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
        color: #f5f5f5 !important;
        box-shadow: none !important;
        outline: none !important;
      }
    }
  }
}

:deep(.el-drawer__title) {
  color: var(--font-color-default);
}

// 音频弹窗样式
:deep(.audio-popover) {
  background-color: #1a1b1e !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;
  padding: 8px !important;
  
  .el-popper__arrow::before {
    background: #1a1b1e !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
}

.audio-list {
  .audio-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    color: #c0c0c0;
    font-size: 13px;
    margin-bottom: 4px;
    position: relative;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: #f5f5f5;
    }
    
    &.active {
      background-color: rgba(32, 178, 108, 0.1);
      color: var(--up-color);
    }
    
    span {
      flex: 1;
      margin-right: 8px;
    }
    
    .check-icon {
      width: 14px;
      height: 14px;
      color: #ffffff;
      position: absolute;
      right: 12px;
    }
  }
}
</style>
