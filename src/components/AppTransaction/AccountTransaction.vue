<template>
  <section class="account-trade">
    <div class="trade-content">
      <div class="trade-operate">
        <div
          class="coin-symbol display-flex align-items-center"
          @click="isConnected ? handelSearch() : handelLogon()"
        >
          <div class="logo">
            <el-image :src="baseInfo?.tokenInfo?.logo" alt="" class="img">
              <template #error>
                <svg-icon name="logo1" class="img"></svg-icon>
              </template>
            </el-image>
            <img :src="chainLogoObj[baseInfo.chainInfo?.chainCode]" alt="" class="chainCode" />
          </div>
          <div class="display-flex align-items-fd">
            <span class="base-symbol"
              >{{
                MAIN_COIN[baseInfo.tokenInfo?.baseSymbol] || baseInfo.tokenInfo?.baseSymbol || '-'
              }}
            </span>
            <strong class="quote-symbol">/{{ baseInfo.tokenInfo?.quoteSymbol || '-' }}</strong>
          </div>
          <svg-icon name="chevron-down" class="chevron-down"></svg-icon>
        </div>
        <div class="buy-sell-tab display-flex align-items-center">
          <span
            v-for="item in tabList"
            :key="item.value"
            :class="tabIndex == item.value ? `active${item.value}` : ''"
            @click="handelTab(item)"
            >{{ item.label }}</span
          >
        </div>
        <div class="trade-op display-flex flex-direction-col justify-content-sp">
          <template v-if="tabIndex == 1">
            <BuyTrade
              :coinInfo="coinInfo"
              :pairInfo="{
                circulationVol: tokenInfo?.marketCap || 0,
                tvl: tokenInfo?.tvl || 0,
                chg: tokenInfo?.chg,
                price: tokenInfo?.price
              }"
            />
          </template>
          <template v-if="tabIndex == 2">
            <SellTrade
              :coinInfo="coinInfo"
              :pairInfo="{
                circulationVol: tokenInfo?.marketCap || 0,
                tvl: tokenInfo?.tvl || 0,
                chg: tokenInfo?.chg,
                price: tokenInfo?.price
              }"
            />
          </template>
        </div>
      </div>
      <div class="trade-data">
        <div class="trade-data-title display-flex align-items-center justify-content-fd">
          <div class="market">
            总市值
            <span style="color: #202020">${{ numberFormat(tokenInfo?.marketCap || 0) }}</span>
          </div>
          <svg-icon name="chevron-down" class="market-kline" @click="handelJump"></svg-icon>
        </div>
        <div class="price-list">
          <div class="price-list-head display-flex align-items-center justify-content-sp">
            <span>价格</span>
            <span>数量</span>
          </div>
          <div class="price-list-content">
            <p
              class="display-flex align-items-center justify-content-sp"
              v-for="(item, index) in sellTransactions"
              :key="index"
            >
              <span class="down">{{
                MAIN_COIN[item.baseSymbol]
                  ? numFormat(item.price || 0)
                  : numberFormat(item.price || 0)
              }}</span>
              <span class="down">{{ numberFormat(item.amount) }}</span>
            </p>
          </div>
          <div class="price-text">
            <p :class="tokenInfo?.chg?.[0] == '-' ? 'down-color' : 'up-color'">
              ${{
                MAIN_COIN[baseInfo.tokenInfo?.baseSymbol]
                  ? numFormat(tokenInfo?.price || 0)
                  : numberFormat(tokenInfo?.price || 0)
              }}
            </p>
            <PercentageNotbg :value="tokenInfo?.chg || '0'" />
          </div>
          <div class="price-list-content">
            <p
              class="display-flex align-items-center justify-content-sp"
              v-for="(item, index) in buyTransactions"
              :key="index"
            >
              <span class="up">{{
                MAIN_COIN[item.baseSymbol]
                  ? numFormat(item.price || 0)
                  : numberFormat(item.price || 0)
              }}</span>
              <span class="up">{{ numberFormat(item.amount || 0) }}</span>
            </p>
          </div>
        </div>
        <div class="all-text">全部</div>
      </div>
    </div>
    <div class="hold-content">
      <van-sticky>
        <div class="hold-tab-items">
          <div class="hold-tab">
            <span
              :class="holdTabIndex == item.value ? 'active' : ''"
              v-for="item in holdTabList"
              :key="item.value"
              @click="handelHoldTab(item)"
              >{{ item.label }}</span
            >
          </div>
          <!-- <span class="refresh-text" v-if="holdTabIndex == 1">点击刷新仓位</span> -->
        </div>
      </van-sticky>
      <template v-if="holdTabIndex == 1">
        <div
          class="hold-item"
          v-for="(item, index) in initLimitedOrders.positions"
          :key="index"
          @click="router.push(`/trade/${item.pairAddress}?chainCode=${item.chainCode}`)"
        >
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex align-items-center">
              <div class="logo">
                <el-image :src="item.logo" alt="" class="img">
                  <template #error>
                    <svg-icon name="logo1" class="img"></svg-icon>
                  </template>
                </el-image>
                <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
              </div>
              <div class="display-flex flex-direction-col justify-content-sp">
                <div class="display-flex align-items-center">
                  <span class="base-symbol">{{ item.symbol || '-' }} </span>
                  <strong class="quote-symbol"></strong>
                </div>
                <div class="display-flex align-items-center">
                  <PercentageChange class="ml-5" :value="item.chg1d" />
                  <span :class="item.chg1d?.[0] === '-' ? 'price down-color' : ' price up-color'"
                    >${{ numberFormat(item.price) }}</span
                  >
                </div>
              </div>
            </div>
            <img
              src="@/assets/img/share.png"
              alt=""
              class="share-img"
              @click.stop="handelShare(item)"
            />
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>当前持仓</span>
              <strong class="txt">
                {{ numberFormat(item.amount) }}<i>≈${{ numberFormat(item.volume) }}</i>
              </strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>平均买入价格</span>
              <strong class="txt">${{ numberFormat(item.averagePrice) }} </strong>
            </div>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>总买入（{{ item.symbol }}）</span>
              <strong class="txt">
                {{ numberFormat(item.totalBuyAmount)
                }}<i>≈${{ numberFormat(item.totalBuyVolume) }}</i>
              </strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>总卖出（{{ item.symbol }}）</span>
              <strong class="txt">
                {{ numberFormat(item.totalSellAmount)
                }}<i>≈${{ numberFormat(item.totalSellVolume) }}</i>
              </strong>
            </div>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>累计收益</span>
              <strong :class="item.totalEarn?.[0] === '-' ? 'txt down-color' : 'txt up-color'">{{
                (item.totalEarn?.[0] === '-' ? '-$' : '+$') +
                numberFormat(item.totalEarn.replace(/-/g, ''))
              }}</strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>收益率</span>
              <PercentageNotbg :value="item.totalEarnRate || 0" class="txt" />
            </div>
          </div>

          <div class="display-flex align-items-center justify-content-sp">
            <div class="limit-btn" @click.stop="handelSellLimit(item)">止盈</div>
            <div class="limit-btn" @click.stop="handelOneClickTrade(item)">一键清仓</div>
            <div class="limit-btn" @click.stop="handelStopLimit(item)">止损</div>
          </div>
        </div>
      </template>
      <template v-else-if="holdTabIndex == 2">
        <div
          class="hold-item"
          v-for="(item, index) in initLimitedOrders.openingOrders"
          :key="index"
        >
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex align-items-center">
              <div class="logo">
                <el-image :src="item.logo" alt="" class="img">
                  <template #error>
                    <svg-icon name="logo1" class="img"></svg-icon>
                  </template>
                </el-image>
                <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
              </div>
              <div class="display-flex flex-direction-col justify-content-sp">
                <div class="display-flex align-items-center">
                  <span class="base-symbol">{{ item.baseSymbol || '-' }} </span>
                </div>
                <div class="display-flex align-items-center">
                  <template v-if="item.fromOrderNo">
                    <span class="down-color direction-txt"
                      >涨幅{{ parseFloat(item.profitFlag) * 100 }}%出本</span
                    >
                    <span class="down-color direction-txt">卖出</span>
                  </template>
                  <template v-else>
                    <template v-if="item.limitType == 1 || item.limitType == 5">
                      <span class="up-color direction-txt">高于价格后买入</span>
                      <span class="up-color direction-txt">买入</span>
                    </template>
                    <template v-else-if="item.limitType == 2 || item.limitType == 6">
                      <span class="up-color direction-txt">抄底</span>
                      <span class="up-color direction-txt">买入</span>
                    </template>
                    <template v-else-if="item.limitType == 3 || item.limitType == 7">
                      <span class="down-color direction-txt">止盈</span>
                      <span class="down-color direction-txt">卖出</span>
                    </template>
                    <template v-else-if="item.limitType == 4 || item.limitType == 8">
                      <span class="down-color direction-txt">止损</span>
                      <span class="down-color direction-txt">卖出</span>
                    </template>
                  </template>
                </div>
              </div>
            </div>
            <span>等待触发</span>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <template v-if="item.limitType > 4">
              <span>触发市值</span>
              <strong class="color-txt">${{ numberFormat(item.marketCap) || '-' }} </strong>
            </template>
            <template v-else>
              <span>触发价格</span>
              <strong class="color-txt">${{ numberFormat(item.price) }} </strong>
            </template>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <span>委托数量（{{ item.fromTokenSymbol }}）</span>
            <strong class="color-txt">{{ numberFormat(item.amount) }}</strong>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <span>委托时间</span>
            <strong>{{ formatDate(item.timestamp) }}</strong>
          </div>
          <div class="display-flex align-items-center justify-content-sp">
            <div class="limit-btn" @click="handelCancel(item)">取消委托</div>
          </div>
        </div>
      </template>
      <template v-else-if="holdTabIndex == 3">
        <div class="hold-item" v-for="(item, index) in initLimitedOrders.orders" :key="index">
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex align-items-center">
              <div class="logo">
                <el-image :src="item.logo" alt="" class="img">
                  <template #error>
                    <svg-icon name="logo1" class="img"></svg-icon>
                  </template>
                </el-image>
                <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
              </div>
              <div class="display-flex flex-direction-col justify-content-sp">
                <div class="display-flex align-items-center">
                  <span class="base-symbol">{{ item.baseSymbol || '-' }} </span>
                </div>
                <div class="display-flex align-items-center">
                  <span
                    :class="
                      item.direction == 1 ? 'down-color direction-txt' : 'up-color direction-txt'
                    "
                    >{{ TRANSFER_TYPE[item.tradeType] || '交易' }}</span
                  >
                  <span
                    :class="
                      item.direction == 1 ? 'down-color direction-txt' : 'up-color direction-txt'
                    "
                    >{{ item.direction == 1 ? '卖出' : '买入' }}</span
                  >
                </div>
              </div>
            </div>
            <span></span>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>成交市值</span>
              <strong class="txt">{{ numberFormat(item.marketCap) }} </strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>成交价格</span>
              <strong class="txt">${{ numberFormat(item.price) }} </strong>
            </div>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>成交数量（{{ item.baseSymbol }}）</span>
              <strong class="txt"> {{ numberFormat(item.amount) }} </strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>成交金额</span>
              <strong class="txt">{{ numberFormat(item.volume) }} </strong>
            </div>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>时间</span>
              <strong class="txt">{{ formatDate(item.timestamp) }}</strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>交易Hash</span>
              <div class="display-flex align-items-center txt">
                <span>{{ shortifyAddress(item.tx) || '-' }}</span>
                <svg-icon name="copy" class="copy" v-copy="item.tx" v-if="item.tx"></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="holdTabIndex == 4">
        <div
          class="hold-item"
          v-for="(item, index) in initLimitedOrders.historyOrders"
          :key="index"
        >
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex align-items-center">
              <div class="logo">
                <el-image :src="item.logo" alt="" class="img">
                  <template #error>
                    <svg-icon name="logo1" class="img"></svg-icon>
                  </template>
                </el-image>
                <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
              </div>
              <div class="display-flex flex-direction-col justify-content-sp">
                <div class="display-flex align-items-center">
                  <span class="base-symbol">{{ item.baseSymbol || '-' }} </span>
                  <strong class="quote-symbol">/{{ item.quoteSymbol }}</strong>
                </div>
                <div class="display-flex align-items-center">
                  <template v-if="item.fromOrderNo">
                    <span class="down-color direction-txt"
                      >涨幅{{ parseFloat(item.profitFlag) * 100 }}%出本</span
                    >
                    <span class="down-color direction-txt">卖出</span>
                  </template>
                  <template v-else>
                    <template v-if="item.limitType == 1 || item.limitType == 5">
                      <span class="up-color direction-txt">高于价格后买入</span>
                      <span class="up-color direction-txt">买入</span>
                    </template>
                    <template v-else-if="item.limitType == 2 || item.limitType == 6">
                      <span class="up-color direction-txt">抄底</span>
                      <span class="up-color direction-txt">买入</span>
                    </template>
                    <template v-else-if="item.limitType == 3 || item.limitType == 7">
                      <span class="down-color direction-txt">止盈</span>
                      <span class="down-color direction-txt">卖出</span>
                    </template>
                    <template v-else-if="item.limitType == 4 || item.limitType == 8">
                      <span class="down-color direction-txt">止损</span>
                      <span class="down-color direction-txt">卖出</span>
                    </template>
                  </template>
                </div>
              </div>
            </div>
            <span :class="item.status == 200 ? 'up-color' : 'down-color'">{{
              item.orderStatusUI
            }}</span>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>委托市值</span>
              <strong class="txt">{{ numberFormat(item.marketCap) }} </strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>委托数量（{{ item.baseSymbol }}）</span>
              <strong class="txt">{{ numberFormat(item.amount) }} </strong>
            </div>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>委托价格</span>
              <strong class="txt">${{ numberFormat(item.price) }} </strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>委托金额</span>
              <strong class="txt">${{ numberFormat(item.volume) }} </strong>
            </div>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>委托方式</span>
              <strong class="txt" v-if="item.limitType > 4">市值</strong>
              <strong class="txt" v-else>价格</strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>委托时间</span>
              <strong class="txt">{{ formatDate(item.timestamp) }} </strong>
            </div>
          </div>
          <div class="display-flex align-items-center justify-content-sp margin-bottom-12">
            <div class="display-flex flex-direction-col">
              <span>交易时间</span>
              <strong class="txt">{{
                item.lastUpdateTime ? formatDate(item.lastUpdateTime) : '-'
              }}</strong>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span>交易Hash</span>
              <div class="display-flex align-items-center txt">
                <span>{{ shortifyAddress(item.tx) || '-' }}</span>
                <svg-icon name="copy" class="copy" v-copy="item.tx" v-if="item.tx"></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <SellLimiPopup
      :limitInfo="rowInfo"
      :sellLimitShowBottom="sellLimitShowBottom"
      @close="handleClose"
    />

    <StopLimitPopup
      :limitInfo="rowInfo"
      :stopLimitShowBottom="stopLimitShowBottom"
      @close="handleClose"
    />

    <SearchPop :popupShow="popupShow" type="trade" @close="handleSearchPopClose" />
    <van-popup
      v-model:show="showPopup"
      class="share-popup"
      round
      position="bottom"
      :style="{ height: '90%' }"
      :close-on-click-overlay="false"
    >
      <div class="share-img-dom" ref="shareImg">
        <img src="@/assets/img/trade_share_bg.png" alt="" class="img" />
        <div class="share-dom display-flex flex-direction-col justify-content-sp">
          <div class="display-flex align-items-center justify-content-sp">
            <div class="share-title-box">
              <div class="display-flex align-items-center">
                <img src="@/assets/icons/logo.svg" alt="" class="logo" />
                <span class="logo-title">HelloDex</span>
              </div>
              <p class="display-flex align-items-center">
                任何平台都要把<i style="color: #2ebd85; font-style: normal">利润80%</i>分给用户
              </p>
              <span class="tips-txt">开创和主导Web3变革</span>
            </div>
            <div class="code-txt display-flex flex-direction-col">
              <span>邀请码：</span>
              <span>{{ accountInfo.invitationCode }}</span>
            </div>
          </div>
          <div class="coin-info-box display-flex flex-direction-col">
            <div class="coin-logo display-flex align-items-center">
              <div class="logo">
                <el-image :src="shareCoinInfo.logo" alt="" class="img">
                  <template #error>
                    <svg-icon name="logo1" class="img"></svg-icon>
                  </template>
                </el-image>
                <img :src="chainLogoObj[shareCoinInfo.chainCode]" alt="" class="chainCode" />
              </div>
              <div class="display-flex flex-direction-col">
                <span class="symbol-txt">{{ shareCoinInfo.symbol }}</span>
                <p class="p-txt">
                  收益：<strong
                    :class="shareCoinInfo.totalEarn?.[0] === '-' ? 'down-color' : 'up-color'"
                    >{{
                      (shareCoinInfo.totalEarn?.[0] === '-' ? '-$' : '+$') +
                      numberFormat(shareCoinInfo.totalEarn.replace(/-/g, ''))
                    }}</strong
                  >
                </p>
              </div>
            </div>
            <PercentageNotbg :value="shareCoinInfo.totalEarnRate || 0" class="shareCoin-Rate" />
            <div class="display-flex align-items-center justify-content-sp">
              <div class="display-flex align-items-center">
                <span class="p-txt">买入市值：</span>
                <strong>${{ numberFormat(shareCoinInfo.averageBuyMarketCap) }}</strong>
              </div>
              <div class="display-flex align-items-center">
                <span class="p-txt">当前市值：</span>
                <strong>${{ numberFormat(shareCoinInfo.nowMarketCap) }}</strong>
              </div>
            </div>
            <div class="chart-box">
              <CoinsAreaChart :chart-data="chartData" />
            </div>
          </div>
          <div class="share-qccode-box display-flex align-items-center justify-content-sp">
            <div class="display-flex flex-direction-col">
              <span>HelloDex 扫码交易此币</span>
              <span>支持链上所有币挂单抄底，止盈止损</span>
            </div>
            <img :src="qrcodeUrl" alt="" />
          </div>
        </div>
      </div>
      <div class="share-content">
        <div class="share-title">
          <span>分享</span>
          <svg-icon name="share_close" class="share_close" @click="showPopup = false"></svg-icon>
        </div>
        <div class="share-btn">
          <div>
            <div class="share-info display-flex align-items-center justify-content-sp">
              <span>我的邀请码</span>
              <div class="display-flex align-items-center">
                <span class="code-txt">{{ accountInfo.invitationCode }}</span>
                <svg-icon
                  name="icon-copy"
                  class="icon"
                  v-copy="accountInfo.invitationCode"
                ></svg-icon>
              </div>
            </div>
            <div class="share-info display-flex align-items-center justify-content-sp">
              <span>邀请链接</span>
              <div class="display-flex align-items-center">
                <span class="url-txt"
                  >{{ tgWebAppData ? 'https://t.me/HelloDexBot' : origin }}...{{
                    accountInfo.invitationCode
                  }}</span
                >
                <svg-icon
                  name="icon-copy"
                  class="icon"
                  v-copy="tgWebAppData ? helloDexBotUrl : urlRefer"
                ></svg-icon>
              </div>
            </div>
          </div>

          <div class="display-flex align-items-center justify-content-sp">
            <div class="btn" @click="dowanLoading ? null : handelSaveImage()">
              <el-icon class="is-loading" :size="14" v-if="dowanLoading">
                <Loading />
              </el-icon>
              保存图片
            </div>
            <div class="btn btn-par">立即分享</div>
          </div>
        </div>
      </div>
    </van-popup>
  </section>
</template>
<script lang="ts" setup>
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showLoadingToast, showSuccessToast, closeToast } from 'vant'

// hook 函数
import { useBaseInfo } from '@/hooks/useBaseInfo' // 头部 代币信息 hook

// store 缓存
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'

import { APIcancelOrder, APIgetTokenTransaction, APIgetChartByBaseAddress } from '@/api'
import { APIinitTokenData, initLimitedOrderPage, APIauthTradeSwap } from '@/api/coinWalletDetails'
import { numberFormat, handleCoinPairInfo, formatDate, shortifyAddress, numFormat } from '@/utils'
import { TRANSFER_TYPE, STATUS_TYPE, USDT_CONFIG, MAIN_COIN } from '@/types'
import { resetAddress, evmTransactionReceipt, solanaTransactionReceipt } from '@/utils/transition'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'

import BuyTrade from './BuyTrade.vue'
import SellTrade from './SellTrade.vue'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import SellLimiPopup from '../Dialogs/SellLimiPopup.vue'
import StopLimitPopup from '../Dialogs/StopLimitPopup.vue'
import SearchPop from '@/components/Dialogs/SearchPop.vue'
import CoinsAreaChart from '@/adapter/components/CoinsAreaChart.vue'

const telegram__initParams = sessionStorage.getItem('__telegram__initParams')
const tgWebAppData = (telegram__initParams && JSON.parse(telegram__initParams)?.tgWebAppData) || ''

const i18n = useI18n()
const route = useRoute()
const router = useRouter()

/** 页面基础数据 */
const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore
const useChainInfo = useChainInfoStore()
//获取token数据
const useTokenInfo = useTokenInfoStore()

const chain = useChainConfigsStore()

const customWalletInfo = computed(() => globalStore.customWalletInfo)
const walletType = computed(() => globalStore.walletInfo.walletType)
const isConnected = computed(() => globalStore.walletInfo.isConnected)

const chainConfigs = computed(() => chain.chainConfigs)

useChainInfo.createChainInfo({
  chainCode: route.query.chainCode, // 币ID
  pairAddress: route.params.pairAddress, // 币 pairAddress
  timeType: '15m' // 时间类型
})

const baseInfo = ref<any>({
  tradingLoading: true
})

const coinInfo = ref<any>({})

// 池子信息
const timer = ref<any>(null)
const initLimitedOrders = ref<any>({})
const popupShow = ref<boolean>(false)
const tokenInfo = ref<any>({})

// 初始化
const initTokenData = async () => {
  const chainInfo = useChainInfo.chainInfo
  const res = await APIinitTokenData({
    pairAddress: chainInfo?.pairAddress,
    chainCode: chainInfo?.chainCode
  })
  useTokenInfo.createTokenInfo(res)
  baseInfo.value = await useBaseInfo()
  getTokenTransaction()
  coinInfo.value = handleCoinPairInfo({
    ...baseInfo.value.tokenInfo,
    chainCode: baseInfo.value.chainInfo?.chainCode
  })
}

const getOrderData = async () => {
  const res = await initLimitedOrderPage({
    walletId: parseFloat(customWalletInfo.value.walletInfo?.walletId),
    walletKey: customWalletInfo.value.walletInfo?.walletKey
  })
  initLimitedOrders.value = res || {}
}

const getTokenTransaction = async () => {
  const chainInfo = useChainInfo.chainInfo
  const res: any = await APIgetTokenTransaction({
    chainCode: chainInfo.chainCode,
    pairAddress: chainInfo?.pairAddress,
    walletId: parseFloat(customWalletInfo.value?.walletInfo?.walletId || -1)
  })
  tokenInfo.value = res || {}
}

const sellTransactions = computed(() => {
  const arr =
    tokenInfo.value?.sellTransactions?.map((item: any) => {
      return {
        ...item,
        baseSymbol: baseInfo.value.tokenInfo?.baseSymbol
      }
    }) || []
  return arr.reverse()
})

const buyTransactions = computed(() => {
  const arr =
    tokenInfo.value?.buyTransactions?.map((item: any) => {
      return {
        ...item,
        baseSymbol: baseInfo.value.tokenInfo?.baseSymbol
      }
    }) || []
  return arr
})

const handelSearch = () => {
  popupShow.value = true
}

const handleSearchPopClose = () => {
  popupShow.value = false
}

const handelLogon = () => {
  router.push('/h5/signIn')
}

/*********** 买卖 操作区 start ***********/
const tabList = [
  {
    label: '买入',
    value: 1
  },
  {
    label: '卖出',
    value: 2
  }
]

const tabIndex = ref<number>(route.query.type == 'sell' ? 2 : 1)

const handelTab = (item: any) => {
  tabIndex.value = item.value
}
/*********** 买卖 操作区 end ***********/

/*********** 持仓数据 start ***********/
const okCoin = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const account: any = localStorage.getItem('accountInfo')
const slippage = account ? JSON.parse(account).slippage : '0.03'
const sellLimitShowBottom = ref(false)
const stopLimitShowBottom = ref(false)
const rowInfo = ref<any>({})

const holdTabList = [
  {
    label: '我的持仓',
    value: 1
  },
  {
    label: '当前委托',
    value: 2
  },
  {
    label: '交易历史',
    value: 3
  },
  {
    label: '委托历史',
    value: 4
  }
]

const holdTabIndex = ref<number>(1)

const handelHoldTab = (item: any) => {
  holdTabIndex.value = item.value
}

const handelOneClickTrade = async (row: any) => {
  notificationInfo({
    title: `${row.symbol}：一键清仓交易处理中`,
    customClass: 'notification-h5',
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
    price: tokenInfo.value.price,
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
        customClass: 'notification-h5',
        message: `${i18n.t('TransactionSuccessful')}`
      })
    } else if (result === false) {
      notificationFailed({
        title: `${row.symbol}：一键清仓交易失败`,
        customClass: 'notification-h5',
        message: `${i18n.t('TransactionFailed')}`
      })
    } else {
      notificationWarn({
        title: `${row.symbol}`,
        customClass: 'notification-h5',
        message: `${result}`
      })
    }
  } else {
    notificationFailed({
      title: `${row.symbol}：一键清仓交易失败`,
      customClass: 'notification-h5',
      message: `${i18n.t('TransactionFailed')}`
    })
  }
}
const handelStopLimit = (row: any) => {
  stopLimitShowBottom.value = true
  rowInfo.value = row
}

const handelSellLimit = (row: any) => {
  sellLimitShowBottom.value = true
  rowInfo.value = row
}

const handleClose = (val: boolean) => {
  sellLimitShowBottom.value = val
  stopLimitShowBottom.value = val
}

const handelCancel = async (item: any) => {
  showLoadingToast({
    message: `取消中...`,
    forbidClick: true
  })
  const res = await APIcancelOrder({ orderNo: item.orderNo })
  if (res) {
    showSuccessToast('取消成功')
    getOrderData()
  }
}

/*********** 持仓数据 end ***********/

/*********** 分享 start ***********/
// https://t.me/HelloDexBot/hellodex?startapp=Refer_invitationCode_zAq03TI2

const accountInfo = computed(() => globalStore.accountInfo)

const origin = window.location.origin
const urlRefer = `${origin}/Refer?invitationCode=${accountInfo.value?.invitationCode}`
const helloDexBotUrl = `https://t.me/HelloDexBot/hellodex?startapp=Refer_invitationCode_${accountInfo.value?.invitationCode}`

const shareImg = ref()
const dowanLoading = ref<boolean>(false)
const showPopup = ref<boolean>(false)
const qrcodeUrl = ref<string>('')

const shareCoinInfo = ref<any>({})
const chartData = ref<any>({})

const handelShare = async (params: any) => {
  showLoadingToast({
    message: `加载中...`,
    forbidClick: true
  })
  shareCoinInfo.value = params
  const url = `${origin}/k/${params.pairAddress}?chainCode=${params.chainCode}&timeType=15m`
  console.log(url)
  qrcodeUrl.value = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H'
  })
  const res: any = await APIgetChartByBaseAddress({
    baseAddress: params.baseToken.address,
    chainCode: params.chainCode,
    type: '5m',
    size: 20
  })
  closeToast()
  chartData.value = {
    priceByPairAddress: {
      k1h: res.reverse() || []
    },
    seriesOptions:
      params.totalEarn[0] === '-'
        ? {
            topColor: '#F6465D',
            bottomColor: 'rgba(246, 70, 93, 0.1)',
            lineColor: '#F6465D',
            lineWidth: 2,
            lastValueVisible: false,
            priceLineVisible: false
          }
        : {
            topColor: '#2EBD85',
            bottomColor: 'rgba(46, 189, 133, 0.1)',
            lineColor: '#2EBD85',
            lineWidth: 2,
            lastValueVisible: false,
            priceLineVisible: false
          }
  }
  showPopup.value = true

  console.log(res)
}

const handelSaveImage = async () => {
  dowanLoading.value = true
  await html2canvas(shareImg.value, {
    backgroundColor: '#171717'
  }).then((canvas) => {
    dowanLoading.value = false
    let url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'share_img.png'
    a.click()
  })
}

/*********** 分享 end ***********/

const handelJump = () => {
  router.push(`/k/${route.params.pairAddress}?chainCode=${route.query.chainCode}&timeType=15m`)
}

onMounted(() => {
  initTokenData()
  walletType.value == 'Email' && getOrderData()
  timer.value = setInterval(() => {
    getTokenTransaction()
    walletType.value == 'Email' && getOrderData()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.account-trade {
  padding: 0.16rem 0.32rem;
  color: #9c9c9c;
  :deep(.search-box) {
    background: #fff;
    .van-field {
      background-color: #f2f2f2;
      color: #202020;
    }
    .van-field__control {
      color: #202020;
    }
  }
  :deep(.tabs-content-item) {
    color: #202020 !important;
  }
  .trade-content {
    width: 100%;
    display: grid;
    column-gap: 0.32rem;
    grid-template-columns: 2fr 1.5fr;
    .coin-symbol {
      margin-bottom: 0.4rem;
      color: #9c9c9c;
      .logo,
      .img {
        width: 0.8rem;
        height: 0.8rem;
        position: relative;
      }
      .logo {
        margin-right: 0.24rem;
      }
      .img {
        border-radius: 50%;
      }
      .chainCode {
        width: 0.32rem;
        height: 0.32rem;
        border-radius: 50%;
        position: absolute;
        bottom: -0.0533rem;
        right: -0.0267rem;
      }
      .base-symbol {
        font-size: 0.48rem;
        color: #202020;
      }
      .quote-symbol {
        font-weight: normal;
        position: relative;
        top: -0.08rem;
      }
      .chevron-down {
        width: 0.4267rem;
        height: 0.4267rem;
        margin-left: 0.1067rem;
      }
    }
    .trade-data {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .trade-data-title {
      color: #9c9c9c;
      padding-top: 0.08rem;
      margin-bottom: 0.4rem;
      .market-kline {
        width: 0.5333rem;
        height: 0.5333rem;
        color: #202020;
        margin-left: 0.2133rem;
      }
      .market {
        padding: 0.08rem;
        border: 0.0267rem solid #e5e5e5;
        border-radius: 0.1067rem;
        white-space: nowrap;
      }
    }
    .buy-sell-tab {
      width: 100%;
      height: 0.8rem;
      background-color: #f2f2f2;
      border-radius: 0.5333rem;
      margin-bottom: 0.32rem;
      span {
        display: flex;
        width: 50%;
        height: 100%;
        border-radius: 0.5333rem;
        align-items: center;
        justify-content: center;
        font-size: 0.3733rem;
        background-color: transparent;
      }
      .active1 {
        background-color: var(--up-color);
        color: var(--font-color-default);
      }
      .active2 {
        background-color: var(--down-color);
        color: var(--font-color-default);
      }
    }
    .trade-op {
      height: 60vh;
    }
    .price-text {
      text-align: center;
      padding: 0.2667rem 0;
      p {
        font-size: 0.5333rem;
      }
    }
    .price-list {
      height: 100%;
      .price-list-content {
        height: 25vh;
        overflow: hidden;
        overflow-y: auto;
        padding: 0.2667rem 0;
        p {
          margin: 0.2667rem 0;
        }
        p:first-child {
          margin-top: 0;
        }

        .up {
          color: var(--up-color);
        }
        .down {
          color: var(--down-color);
        }
      }
    }
    .all-text {
      padding: 0.08rem 0.2667rem;
      border: 0.0267rem solid #e5e5e5;
      border-radius: 0.1067rem;
      color: #202020;
    }
  }
  .hold-content {
    margin-top: 0.16rem;
    .hold-tab-items {
      background-color: #fff;
      position: relative;
    }
    .hold-tab {
      display: flex;
      margin-bottom: 0.08rem;
      span {
        font-size: 0.3467rem;
        margin-right: 0.5333rem;
        line-height: 2;
        border-bottom: 0.0533rem solid transparent;
      }
      .active {
        color: #202020;
        border-bottom: 0.0533rem solid #202020;
      }
    }
    .refresh-text {
      float: right;
    }
    .hold-tab-items::after {
      content: '';
      clear: both;
      display: block;
    }
    .hold-item {
      margin-top: 0.5333rem;
      .logo,
      .img {
        width: 0.9333rem;
        height: 0.9333rem;
        position: relative;
      }
      .logo {
        margin-right: 0.2133rem;
      }
      .img {
        border-radius: 50%;
      }

      .chainCode {
        width: 0.3733rem;
        height: 0.3733rem;
        border-radius: 50%;
        position: absolute;
        bottom: -0.0267rem;
        right: -0.0267rem;
      }
      .base-symbol {
        color: #202020;
        font-size: 0.3733rem;
      }
      :deep(.text-on-container-red),
      :deep(.text-on-container-green) {
        line-height: 1.2;
      }
      .price {
        margin-left: 0.16rem;
      }
      .margin-bottom-12 {
        margin-bottom: 0.32rem;
      }
      strong {
        font-weight: normal;
      }
      .txt {
        color: #202020;
        font-size: 0.3733rem;
        font-weight: normal;
        i {
          font-style: normal;
          color: #9c9c9c;
          font-size: 0.32rem;
        }
      }
      .color-txt {
        color: #202020;
      }
      .direction-txt {
        margin-right: 0.16rem;
      }
      .limit-btn {
        flex: 1;
        height: 0.8rem;
        color: #202020;
        background-color: #f2f2f2;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.1067rem;
      }
      .limit-btn:nth-child(2) {
        margin: 0 0.32rem;
      }
      .copy {
        width: 0.3733rem;
        height: 0.3733rem;
      }
    }
  }
  .share-img {
    width: 0.4267rem;
  }
  .share-popup {
    background-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .icon {
      width: 0.3467rem;
      height: 0.3467rem;
      margin-left: 0.0533rem;
    }
    .share-img-dom {
      width: 92%;
      height: 65%;
      background-color: #171717;
      border-radius: 0.2667rem;
      position: relative;
      overflow: hidden;
      color: #fff;
      font-size: 0.32rem;
      .img {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }
      .share-dom {
        width: 100%;
        height: 100%;
        padding: 0.32rem;
        position: relative;
        z-index: 1;
      }
      .share-title-box {
        .logo {
          width: 0.6933rem;
          height: 0.6933rem;
          border: 0.0267rem solid #9c9c9c;
          border-radius: 0.1067rem;
        }
        .logo-title {
          font-size: 0.48rem;
          margin-left: 0.1333rem;
        }
        p {
          margin: 0.16rem 0;
          line-height: 1.2;
        }
        .tips-txt {
          padding: 0.0533rem;
          border-radius: 0.1067rem;
          border: 0.0267rem solid #9c9c9c;
          font-size: 0.2133rem;
        }
      }
      .code-txt {
        font-size: 0.3333rem;
      }
      .share-main-box {
        p {
          font-size: 0.3733rem;
          margin-top: 0.1067rem;
          line-height: 1;
        }
        .share_kchart {
          width: 80%;
          margin-top: 0.2667rem;
          position: relative;
          left: 10%;
        }
      }
      .share-qccode-box {
        line-height: 2;
        img {
          width: 1.3333rem;
          height: 1.3333rem;
        }
      }
    }
    .coin-info-box {
      margin: 0.16rem 0;
      .logo,
      .img {
        width: 0.88rem;
        height: 0.88rem;
      }
      .logo {
        position: relative;
        margin-right: 0.1067rem;
      }
      .img,
      .chainCode {
        border-radius: 50%;
      }
      .chainCode {
        width: 0.32rem;
        height: 0.32rem;
        position: absolute;
        right: 0;
        bottom: 0;
      }
      .symbol-txt {
        font-size: 0.4267rem;
        line-height: 1.2;
      }
      .p-txt {
        color: #9c9c9c;
      }
      .shareCoin-Rate {
        font-size: 0.64rem;
      }
      .chart-box {
        width: 108%;
        height: 3rem;
        position: relative;
        left: -4%;
      }
    }
    .share-content {
      width: 100%;
      height: 32%;
      background-color: #fff;
      border-radius: 0.2667rem 0.2667rem 0 0;
      padding: 0.2667rem 0.5333rem;
      color: #202020;
      font-size: 0.32rem;
      .share-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.4267rem;
      }
      .share_close {
        width: 0.4267rem;
        height: 0.4267rem;
        display: block;
      }
      .share-btn {
        margin-top: 0.2667rem;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .share-info {
        padding: 0.2667rem;
        background-color: #f9f9f9;
        border-radius: 0.1067rem;
        margin-bottom: 0.2667rem;
        line-height: 1.2;
        color: #9c9c9c;
        .code-txt,
        .url-txt {
          white-space: nowrap;
          color: #202020;
        }
      }
      .btn {
        flex: 1;
        height: 0.8rem;
        border: 0.0267rem solid #202020;
        border-radius: 0.1067rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0.4267rem;
      }
      .btn:last-child {
        margin: 0;
      }
      .btn-par {
        background-color: #202020;
        color: #fff;
      }
    }
  }
}
</style>
