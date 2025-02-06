<template>
  <el-scrollbar height="calc(100vh - 120px)">
    <div class="smartMoneyDetails-view">
      <div class="smartMoneyDetails-info display-flex align-items-center justify-content-sp">
        <div class="display-flex flex-direction-col">
          <div class="display-flex align-items-center">
            <img src="https://ipfs.io/ipfs/QmZqMneqDQ6dkFSq7SHtWtcT8BaBLoupQUksxsS4UTsnyD" alt="" />
            <div class="info display-flex flex-direction-col">
              <div class="edit-address display-flex align-items-center">
                <span class="shortifyAddress">{{ shortifyAddress(route.params.address) }}</span>
                <el-icon size="16" color="#9AA0AA"><EditPen /></el-icon>
              </div>
              <div class="address display-flex align-items-center">
                <span>{{ route.params.address }}</span>
                <svg-icon name="copy" class="copy" v-copy="route.params.address"></svg-icon>
              </div>
            </div>
          </div>
          <div class="display-flex align-items-center update-txt">
            <!-- <svg-icon name="icon-money" class="icon-money"></svg-icon> -->
            <el-icon size="14" style="margin-right: 4px; cursor: pointer"><RefreshRight /></el-icon>
            <span>更新于: 1h 以前</span>
          </div>
        </div>
        <div class="display-flex align-items-fd flex-direction-col">
          <div class="display-flex align-items-center">
            <div class="display-flex align-items-center btn justify-content-center">
              <svg-icon name="h5-wallet-cur" class="icon-user"></svg-icon>
              <span>钱包跟单</span>
            </div>
            <div class="display-flex align-items-center btn justify-content-center">
              <svg-icon name="icon-add-user" class="icon-user"></svg-icon>
              <span>关注</span>
            </div>
            <div class="display-flex align-items-center btn btn-defa justify-content-center">
              <svg-icon name="share-04" class="icon-user"></svg-icon>
              <span>分享</span>
            </div>
          </div>
          <div class="timeTab">
            <span
              v-for="(item, index) in timeTabList"
              :key="index"
              :class="timeTabIndex == item.value ? 'active' : ''"
              @click="handelTimeTab(item)"
              >{{ item.label }}</span
            >
          </div>
        </div>
      </div>

      <div class="smartMoneyDetails-items display-flex align-items-center justify-content-sp">
        <div class="smartMoneyDetails-item item-1">
          <h6 class="display-flex align-items-center justify-content-sp">
            <span class="font-family-Medium">最近{{ days }}盈亏</span>
            <strong class="font-family-Medium">胜率</strong>
          </h6>
          <h3 class="display-flex align-items-center justify-content-sp">
            <span
              class="font-family-Heavy"
              :class="
                parseFloat(walletAnalysisSummary?.plRate || '0') <= 0 ? 'down-color' : 'up-color'
              "
              >{{ parseFloat(walletAnalysisSummary?.plRate || '0').toFixed(2) }}%</span
            >
            <span class="font-family-Heavy"
              >{{ parseFloat(walletAnalysisSummary?.winningRate || '0').toFixed(2) }}%</span
            >
          </h3>
          <p
            class="display-flex align-items-center justify-content-sp font-family-Medium"
            :class="
              parseFloat(walletAnalysisSummary?.plProfit || '0') <= 0 ? 'down-color' : ' up-color'
            "
          >
            {{ priceNumFormat(walletAnalysisSummary?.plProfit || 0) }}
          </p>

          <div class="line-chart-box display-flex justify-content-fd">
            <div class="line-chart">
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 1%;
                    background-color: var(--down-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 74%;
                    background-color: var(--up-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 74px;
                    background-color: var(--up-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 84%;
                    background-color: var(--up-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 94%;
                    background-color: var(--up-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 3%;
                    background-color: var(--down-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 6%;
                    background-color: var(--down-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-2">
          <div class="display-flex align-items-center justify-content-sp">
            <div class="smartMoneyDetails-item item-2">
              <h6 class="display-flex align-items-center justify-content-sp">
                <span>利润</span>
                <div class="number-txt">
                  {{ days }} 交易数
                  <i class="up-color">{{ numberFormat(walletAnalysisSummary?.buyNumber || 0) }}</i
                  >/<i class="down">{{ numberFormat(walletAnalysisSummary?.sellNumber || 0) }}</i>
                </div>
              </h6>
              <p class="display-flex align-items-center justify-content-sp">
                <span>总盈亏</span>
                <strong
                  :class="
                    parseFloat(walletAnalysisSummary?.totalPl || '0') <= 0
                      ? 'down-color'
                      : ' up-color'
                  "
                  >{{ priceNumFormat(walletAnalysisSummary?.totalPl || 0) }} ({{
                    parseFloat(walletAnalysisSummary?.totalPlRate || '0').toFixed(2)
                  }}%)</strong
                >
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span>未实现利润</span>
                <strong class="down-color">-$0.234</strong>
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span>{{ days }} 买入总成本</span>
                <strong>{{ priceNumFormat(walletAnalysisSummary?.totalBuying || 0) }}</strong>
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span>{{ days }} 代币平均买入成本</span>
                <strong>{{ priceNumFormat(walletAnalysisSummary?.averageBuying || 0) }}</strong>
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span>{{ days }} 代币平均实现利润</span>
                <strong
                  :class="
                    parseFloat(walletAnalysisSummary?.averageRealizedProfit || '0') <= 0
                      ? 'down-color'
                      : ' up-color'
                  "
                  >{{ priceNumFormat(walletAnalysisSummary?.averageRealizedProfit || 0) }}</strong
                >
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span>ETH 余额</span>
                <strong>0 ETH ($0)</strong>
              </p>
            </div>
            <div class="smartMoneyDetails-item item-3">
              <h6 class="display-flex align-items-center justify-content-sp">
                <span>盈利分布 ({{ numberFormat(walletAnalysisSummary?.pnlTokenNum || 0) }})</span>
              </h6>
              <p class="display-flex align-items-center justify-content-sp">
                <span class="display-flex align-items-center">
                  <i style="background-color: rgba(46, 189, 133, 1)"></i>
                  &gt;500%
                </span>
                <strong
                  :style="{
                    color: walletAnalysisSummary?.pnlGt5xNum == 0 ? '#fff' : 'rgba(46, 189, 133, 1)'
                  }"
                  >{{ numberFormat(walletAnalysisSummary?.pnlGt5xNum || 0) }}</strong
                >
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span class="display-flex align-items-center">
                  <i style="background-color: rgba(46, 189, 133, 0.7)"></i>
                  200% ~ 500%
                </span>
                <strong
                  :style="{
                    color:
                      walletAnalysisSummary?.pnl2x5xNum == 0 ? '#fff' : 'rgba(46, 189, 133, 0.7)'
                  }"
                  >{{ numberFormat(walletAnalysisSummary?.pnl2x5xNum || 0) }}</strong
                >
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span class="display-flex align-items-center">
                  <i style="background-color: rgba(46, 189, 133, 0.5)"></i>
                  0% ~ 200%
                </span>
                <strong
                  :style="{
                    color:
                      walletAnalysisSummary?.pnlLt2xNum == 0 ? '#fff' : 'rgba(46, 189, 133, .5)'
                  }"
                  >{{ numberFormat(walletAnalysisSummary?.pnlLt2xNum || 0) }}
                </strong>
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span class="display-flex align-items-center">
                  <i style="background-color: rgba(246, 70, 93, 0.5)"></i>
                  0% ~ -50%
                </span>
                <strong
                  :style="{
                    color:
                      walletAnalysisSummary?.pnlMinusDot50xNum == 0
                        ? '#fff'
                        : 'rgba(246, 70, 93, 0.5)'
                  }"
                  >{{ numberFormat(walletAnalysisSummary?.pnlMinusDot50xNum || 0) }}</strong
                >
              </p>
              <p class="display-flex align-items-center justify-content-sp">
                <span class="display-flex align-items-center">
                  <i style="background-color: rgba(246, 70, 93, 1)"></i>
                  &lt;-50%
                </span>
                <strong
                  :style="{
                    color:
                      walletAnalysisSummary?.pnlLtMinusDot5Num == 0
                        ? '#fff'
                        : 'rgba(246, 70, 93, 1)'
                  }"
                  >{{ numberFormat(walletAnalysisSummary?.pnlLtMinusDot5Num || 0) }}</strong
                >
              </p>
              <p class="display-flex align-items-center justify-content-sp progress-p">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </p>
            </div>
          </div>
          <div class="smartMoneyDetails-item item-4">
            <h6 class="display-flex align-items-center">
              <svg-icon name="icon-fish" class="icon-fish"></svg-icon>
              <span>钓鱼检测</span>
            </h6>
            <div class="display-flex align-items-center">
              <p class="display-flex align-items-center fish-p">
                <span class="display-flex align-items-center">
                  <i style="background-color: var(--up-color)"></i>
                  黑名单:
                </span>
                <strong></strong>
              </p>
              <p class="display-flex align-items-center fish-p">
                <span class="display-flex align-items-center">
                  <i style="background-color: var(--up-color)"></i>
                  未购买:
                </span>
                <strong></strong>
              </p>
            </div>
            <div class="display-flex align-items-center" style="margin-top: 8px">
              <p class="display-flex align-items-center fish-p">
                <span class="display-flex align-items-center">
                  <i style="background-color: var(--up-color)"></i>
                  卖出量大于买入量:
                </span>
                <strong></strong>
              </p>
              <p class="display-flex align-items-center fish-p">
                <span class="display-flex align-items-center">
                  <i style="background-color: var(--up-color)"></i>
                  十秒内完成买/卖:
                </span>
                <strong></strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="smartMoneyDetails-list">
        <div class="display-flex align-items-center justify-content-sp filter-box">
          <div class="list-tab display-flex align-items-center">
            <span
              v-for="(item, index) in listTab"
              :key="index"
              :class="listTabIndex == item.value ? 'active' : ''"
              @click="handelListTab(item)"
              >{{ item.label }}</span
            >
          </div>
        </div>
        <div class="table-box">
          <template v-if="listTabIndex == 1">
            <el-table :data="walletAnalysisRecentPL" scrollbar-always-on>
              <el-table-column label="币种/最后活跃" sortable sort-by="date">
                <template #default="scope">
                  <div class="logo-item display-flex align-items-center">
                    <span>{{ scope.row.tokenName }}</span>
                    <svg-icon name="copy" class="copy" v-copy="scope.row.token"></svg-icon>
                    <el-icon size="13"><Search /></el-icon>
                  </div>
                  <span class="timeago-txt">{{ timeago(scope.row.lastTime || 0) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="未实现利润" sortable sort-by="date">
                <template #default="scope">
                  <div
                    class="display-flex flex-direction-col"
                    :class="
                      scope.row.totalUnrealizedProfitPercentage < 0 ? 'down-color' : 'up-color'
                    "
                  >
                    <span>{{ priceNumFormat(scope.row.totalUnrealizedProfit || 0) }}</span>
                    <span>{{ scope.row.totalUnrealizedProfitPercentage || 0 }}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="已实现利润" sortable sort-by="date">
                <template #default="scope">
                  <div class="display-flex flex-direction-col up-color">持有</div>
                </template>
              </el-table-column>
              <el-table-column label="总利润" sortable sort-by="date">
                <template #default="scope">
                  <div
                    class="display-flex flex-direction-col"
                    :class="scope.row.totalProfitPercentage < 0 ? 'down-color' : 'up-color'"
                  >
                    <span>{{ priceNumFormat(scope.row.totalProfit || 0) }}</span>
                    <span>{{ scope.row.totalProfitPercentage || 0 }}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="余额" sortable sort-by="date">
                <template #default="scope">
                  <div class="display-flex flex-direction-col">
                    <span>{{ priceNumFormat(scope.row.balance || 0) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="持仓" sortable sort-by="date">
                <template #default="scope">
                  <span>{{ scope.row.position || 0 }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="总买入/平均">
                <template #default="scope">
                  <div class="display-flex flex-direction-col">
                    <span>{{ priceNumFormat(scope.row.totalBuying || 0) }}</span>
                    <span>{{ priceNumFormat(scope.row.averageBuying || 0) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="总卖出/平均">
                <template #default="scope">
                  <div class="display-flex flex-direction-col">
                    <span>{{ priceNumFormat(scope.row.totalSelling || 0) }}</span>
                    <span>{{ priceNumFormat(scope.row.averageSelling || 0) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="30D 交易数">
                <template #default="scope">
                  <div class="display-flex align-items-center">
                    <span class="up-color">{{ numberFormat(scope.row.buyCount30d || 0) }}</span>
                    /
                    <span class="down-color">{{ numberFormat(scope.row.sellCount30d || 0) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column>
                <template #default>
                  <div class="display-flex align-items-center justify-content-center">
                    <svg-icon name="share-04" class="icon-user"></svg-icon>
                    <span>分享</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else-if="listTabIndex == 2">
            <el-table :data="walletAnalysisHoldings" scrollbar-always-on>
              <el-table-column label="币种/最后活跃" sortable sort-by="date">
                <template #default="scope">
                  <div class="logo-item display-flex align-items-center">
                    <span>{{ scope.row.tokenName }}</span>
                    <svg-icon name="copy" class="copy" v-copy="scope.row.token"></svg-icon>
                    <el-icon size="13"><Search /></el-icon>
                  </div>
                  <span class="timeago-txt">{{ timeago(scope.row.lastTime || 0) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="未实现利润" sortable sort-by="date">
                <template #default="scope">
                  <div
                    class="display-flex flex-direction-col"
                    :class="
                      scope.row.totalUnrealizedProfitPercentage < 0 ? 'down-color' : 'up-color'
                    "
                  >
                    <span>{{ priceNumFormat(scope.row.totalUnrealizedProfit || 0) }}</span>
                    <span>{{ scope.row.totalUnrealizedProfitPercentage || 0 }}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="已实现利润" sortable sort-by="date">
                <template #default="scope">
                  <div
                    class="display-flex flex-direction-col"
                    :class="scope.row.realizedProfitPercentage < 0 ? 'down-color' : 'up-color'"
                  >
                    <span>{{ priceNumFormat(scope.row.realizedProfit || 0) }}</span>
                    <span>{{ scope.row.realizedProfitPercentage || 0 }}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="总利润" sortable sort-by="date">
                <template #default="scope">
                  <div
                    class="display-flex flex-direction-col"
                    :class="scope.row.totalProfitPercentage < 0 ? 'down-color' : 'up-color'"
                  >
                    <span>{{ priceNumFormat(scope.row.totalProfit || 0) }}</span>
                    <span>{{ scope.row.totalProfitPercentage || 0 }}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="余额" sortable sort-by="date">
                <template #default="scope">
                  <div class="display-flex flex-direction-col">
                    <span>{{ priceNumFormat(scope.row.balance || 0) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="持仓" sortable sort-by="date">
                <template #default="scope">
                  <span>{{ scope.row.position || 0 }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="总买入/平均">
                <template #default="scope">
                  <div class="display-flex flex-direction-col">
                    <span>{{ priceNumFormat(scope.row.totalBuying || 0) }}</span>
                    <span>{{ priceNumFormat(scope.row.averageBuying || 0) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="总卖出/平均">
                <template #default="scope">
                  <div class="display-flex flex-direction-col">
                    <span>{{ priceNumFormat(scope.row.totalSelling || 0) }}</span>
                    <span>{{ priceNumFormat(scope.row.averageSelling || 0) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="30D 交易数">
                <template #default="scope">
                  <div class="display-flex align-items-center">
                    <span class="up-color">{{ numberFormat(scope.row.buyCount30d || 0) }}</span>
                    /
                    <span class="down-color">{{ numberFormat(scope.row.sellCount30d || 0) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column>
                <template #default>
                  <div class="display-flex align-items-center justify-content-center">
                    <svg-icon name="share-04" class="icon-user"></svg-icon>
                    <span>分享</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else-if="listTabIndex == 3">
            <el-table :data="walletAnalysisActivity" scrollbar-always-on>
              <el-table-column label="类型">
                <template #default="scope">
                  <div class="display-flex align-items-center">
                    <span :class="scope.row.transactionType == 1 ? 'up-color' : 'down-color'">{{
                      scope.row.transactionType == 1 ? '买入' : '卖出'
                    }}</span>
                    <el-tooltip content="✨ 首次购买该代币的钱包" effect="light">
                      <svg-icon
                        name="first-buy-star"
                        class="first-buy-star"
                        v-if="scope.row.isFirstBuy"
                        style="margin-left: 4px"
                      ></svg-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="币种">
                <template #default="scope">
                  <div class="logo-item display-flex align-items-center">
                    <span>{{ scope.row.tokenName }}</span>
                    <svg-icon name="copy" class="copy" v-copy="scope.row.token"></svg-icon>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="总额">
                <template #default="scope">
                  <span :class="scope.row.transactionType == 1 ? 'up-color' : 'down-color'">{{
                    priceNumFormat(scope.row.transactionAmount || 0)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="数量">
                <template #default="scope">
                  <span :class="scope.row.transactionType == 1 ? 'up-color' : 'down-color'">{{
                    priceNumFormat(scope.row.transactionQuantity || 0)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="价格">
                <template #default="scope">
                  <span :class="scope.row.transactionType == 1 ? 'up-color' : 'down-color'">{{
                    priceNumFormat(scope.row.transactionPrice || 0)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="利润">
                <template #default="scope">
                  <span :class="scope.row.transactionType == 1 ? 'up-color' : 'down-color'">{{
                    priceNumFormat(scope.row.profit || 0)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="时长">
                <template #default="scope">
                  <span>{{ timeago(scope.row.transactionTime || 0) }}</span>
                </template>
              </el-table-column>
              <el-table-column>
                <template #default>
                  <div class="display-flex align-items-center justify-content-center">
                    <svg-icon name="share-04" class="icon-user"></svg-icon>
                    <span>分享</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { numberFormat, shortifyAddress, priceNumFormat, timeago } from '@/utils'
import {
  APIwalletAnalysisSummary,
  APIwalletAnalysisToken,
  APIwalletAnalysisHoldings,
  APIwalletAnalysisRecentPL,
  APIwalletAnalysisActivity
} from '@/api'

const route = useRoute()

const walletAnalysisSummary = ref<any>({})
const walletAnalysisHoldings = ref<any>([])
const walletAnalysisRecentPL = ref<any>([])
const walletAnalysisActivity = ref<any>([])

const timeTabIndex = ref<string>('7d')
const timeTabList = [
  {
    label: '7D',
    value: '7d'
  },
  {
    label: '30D',
    value: '30d'
  }
]

const handelTimeTab = (item: any) => {
  timeTabIndex.value = item.value
  getWalletAnalysisSummary()
  getWalletAnalysisToken()
}

const days = computed(() => timeTabList.find((item) => item.value == timeTabIndex.value)?.label)

const listTab = [
  {
    label: '最近盈亏',
    value: 1
  },
  {
    label: '持有代币',
    value: 2
  },
  {
    label: '活动',
    value: 3
  }
]

const listTabIndex = ref(3)

const handelListTab = (item: any) => {
  listTabIndex.value = item.value
}

const getWalletAnalysisSummary = async () => {
  const res = await APIwalletAnalysisSummary({
    chainCode: route.params.chain,
    walletAddress: route.params.address,
    period: timeTabIndex.value
  })

  console.log(res)
  walletAnalysisSummary.value = res || {}
}

const getWalletAnalysisToken = async () => {
  const res = await APIwalletAnalysisToken({
    chainCode: route.params.chain,
    walletAddress: route.params.address,
    period: timeTabIndex.value
  })

  console.log(res)
}

const getWalletAnalysisHoldings = async () => {
  const res = await APIwalletAnalysisHoldings({
    chainCode: route.params.chain,
    walletAddress: route.params.address,
    direction: 'asc'
  })

  walletAnalysisHoldings.value = res || []
  console.log(res)
}

const getWalletAnalysisRecentPL = async () => {
  const res = await APIwalletAnalysisRecentPL({
    chainCode: route.params.chain,
    walletAddress: route.params.address,
    direction: 'asc'
  })
  walletAnalysisRecentPL.value = res || []
  console.log(res)
}

const getWalletAnalysisActivity = async () => {
  const res: any = await APIwalletAnalysisActivity({
    chainCode: route.params.chain,
    walletAddress: route.params.address
  })

  walletAnalysisActivity.value = res?.list || []
  console.log(res)
}

onMounted(() => {
  getWalletAnalysisSummary()
  getWalletAnalysisToken()
  getWalletAnalysisHoldings()
  getWalletAnalysisRecentPL()
  getWalletAnalysisActivity()
})
</script>

<style lang="scss" scoped>
.smartMoneyDetails-view {
  padding: 16px 24px 24px;
  width: 100%;
  .icon-user {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  .smartMoneyDetails-info {
    color: var(--dex-color-4);
    font-size: 14px;
    line-height: 1.2;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .copy,
    .icon-money {
      width: 12px;
      height: 12px;
    }
    .copy {
      margin-left: 4px;
    }
    .icon-money {
      margin-right: 6px;
    }
    .shortifyAddress {
      color: var(--font-color-default);
      font-size: 16px;
      font-family: 'PingFangSC-Heavy';
      margin-right: 4px;
    }
    .address {
      margin-bottom: 8px;
      color: #9aa0aa;
      font-size: 12px;
      font-family: 'PingFangSC-Medium';
    }
    .btn {
      border-radius: 100px;
      cursor: pointer;
      min-width: 96px;
      padding: 5px 0;
      background-color: var(--font-color-default);
      cursor: pointer;
      color: #101114;
      margin-left: 12px;
      font-size: 14px;
    }
    .btn-defa {
      background-color: rgba(58, 60, 64, 0.4);
      color: #9aa0aa;
    }
    .timeTab {
      border-radius: 4px;
      border: 1px solid rgba(38, 40, 44, 0.3);
      margin-top: 15px;
      font-size: 12px;
      overflow: hidden;
      span {
        display: inline-flex;
        padding: 6px 12px;
        background-color: transparent;
        color: #5c6068;
        cursor: pointer;
        transition: all 0.1s;
      }
      span.active {
        color: #f5f5f5;
        background-color: #17181b;
      }
    }
    .update-txt {
      font-size: 12px;
      margin-top: 10px;
      color: #9aa0aa;
      font-family: 'PingFangSC-Medium';
    }
  }
  .smartMoneyDetails-items {
    margin: 16px 0;

    .smartMoneyDetails-item {
      flex: 1;
      padding: 16px;
      border-radius: 8px;
      background: rgba(23, 24, 27, 0.3);
      font-size: 13px;
      font-family: 'PingFangSC-Medium';
      strong {
        font-weight: normal;
      }
      h6 {
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: normal;
        span {
          color: var(--font-color-default);
          font-size: 15px;
        }
        i {
          color: var(--down-color);
          font-style: normal;
        }
        .icon-fish {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
      h3 {
        font-size: 32px;
        margin-bottom: 4px;
        font-weight: normal;
      }
      .number-txt {
        color: #9aa0aa;
      }
      p {
        margin-bottom: 8px;
        span {
          color: #9aa0aa;
        }
        i {
          display: flex;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-right: 4px;
        }
      }
      p:last-child {
        margin: 0;
      }
      .fish-p {
        margin: 0;
        flex: 1;
      }
      .progress-p {
        span {
          width: 20%;
          display: block;
          height: 8px;
        }
        span:nth-child(1) {
          background-color: rgba(46, 189, 133, 1);
          border-top-left-radius: 16px;
          border-bottom-left-radius: 16px;
        }
        span:nth-child(2) {
          background-color: rgba(46, 189, 133, 0.7);
        }
        span:nth-child(3) {
          background-color: rgba(46, 189, 133, 0.5);
        }
        span:nth-child(4) {
          background-color: rgba(246, 70, 93, 0.5);
        }
        span:nth-child(5) {
          background-color: rgba(246, 70, 93, 1);
          border-top-right-radius: 16px;
          border-bottom-right-radius: 16px;
        }
      }
    }
    .flex-2 {
      flex: 2;
    }
    .item-1 {
      height: 338px;
      margin-right: 16px;
    }

    .item-2 {
      height: 215px;
      margin-right: 12px;
    }
    .item-3 {
      height: 215px;
    }

    .item-4 {
      margin-top: 16px;
      height: 107px;
    }

    .line-chart-box {
      margin-top: 80px;
    }
    .line-chart {
      height: 124px;
      display: flex;
      .line-chart-item {
        height: 100%;
        display: flex;
        align-items: flex-end;
        padding: 3px 2px;
        border-radius: 4px;
        margin-left: 2px;
        transition: all 0.3s;
      }
      .line-chart-item:hover {
        background-color: var(--hover-bg-color);
      }
    }
  }
  .filter-box {
    padding-bottom: 15px;
  }

  .list-tab {
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      padding: 0 10px;
      border-radius: 4px;
      margin-right: 10px;
      line-height: 1.2;
      cursor: pointer;
      transition: all 0.1s;
      background-color: transparent;
      color: #848e9c;
      white-space: nowrap;
      font-family: 'PingFangSC-Medium';
    }
    span.active {
      color: var(--font-color-default);
      background-color: rgba(58, 60, 64, 0.4);
    }
  }
  .table-box {
    border-radius: 8px;
    overflow: hidden;
    .logo-item {
      .copy {
        width: 12px;
        height: 12px;
        margin: 0 4px;
      }
    }
    .timeago-txt {
      font-size: 10px;
    }
    .first-buy-star {
      width: 12px;
      height: 12px;
      cursor: pointer;
    }
  }
}
</style>
