<template>
  <el-scrollbar height="calc(100vh - 120px)">
    <div class="smartMoney-content">
      <div class="smartMoney-chain display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center">
          <span class="smartMoney-tab-item active">KOL</span>
          <div class="display-flex align-items-center table-operate-switch">
            <strong>一键交易</strong>
            <el-switch
              v-model="listFormatSwitch"
              size="small"
              style="--el-switch-on-color: #fff; --el-switch-off-color: #43464f"
            />
          </div>
        </div>

        <el-popover
          placement="bottom"
          :width="400"
          :visible="popperVisible"
          popper-class="table-network-popper"
          ref="popoverRef"
        >
          <template #reference>
            <div
              class="table-select-text display-flex align-items-center justify-content-sp"
              @click="popperVisible = !popperVisible"
            >
              <img
                v-if="chainLogoObj?.[chainInfo.chainCode]"
                :src="chainLogoObj[chainInfo.chainCode]"
                alt=""
                class="icon-svg"
              />
              <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
              <span>{{ chainInfo.chainName }}</span>
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
                chainInfo.chainId == item.chainType
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
      <div class="table-box">
        <template v-if="!listFormatSwitch">
          <el-skeleton style="width: 100%" :loading="skeleton" animated>
            <template #template>
              <div style="width: 100%; padding: 15px 10px" v-for="item in 17" :key="item">
                <div class="display-flex align-items-center">
                  <el-skeleton-item
                    variant="circle"
                    style="width: 36px; height: 36px; margin-right: 6px"
                  />
                  <el-skeleton-item variant="text" style="height: 20px" />
                </div>
              </div>
            </template>
            <template #default>
              <el-table :data="smartList" @row-click="handelTableRow">
                <el-table-column
                  :label="`钱包/${chainInfo.chainName} 余额`"
                  min-width="180"
                  sortable
                  sort-by="walletAddress"
                >
                  <template #default="scope">
                    <div class="display-flex align-items-center">
                      <div class="logo">
                        <el-image :src="scope.row.logo" alt="" class="logo-icon">
                          <template #error>
                            <svg-icon name="logo1" class="logo-icon"></svg-icon>
                          </template>
                        </el-image>
                      </div>
                      <div class="display-flex flex-direction-col">
                        <div class="display-flex align-items-center">
                          <span class="walletAddress">{{
                            shortifyAddress(scope.row.walletAddress)
                          }}</span>
                          <el-tooltip
                            effect="light"
                            content="聪明钱"
                            popper-class="tooltip-item"
                            placement="top"
                          >
                            <svg-icon name="icon-money" class="icon-money"></svg-icon>
                          </el-tooltip>
                          <el-tooltip
                            effect="light"
                            content="Pump聪明钱"
                            popper-class="tooltip-item"
                            placement="top"
                          >
                            <svg-icon name="icon-pump-money" class="icon-money"></svg-icon>
                          </el-tooltip>
                          <svg-icon
                            name="copy"
                            class="copy"
                            v-copy="scope.row.walletAddress"
                          ></svg-icon>
                          <svg-icon name="icon-heart" class="icon-heart"></svg-icon>
                        </div>
                        <span class="display-flex align-items-center" style="font-size: 12px">
                          <svg-icon name="icon-smart" class="icon-smart"></svg-icon>
                          0
                        </span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="1D Pnl" sortable sort-by="avgPnl1d">
                  <template #default="scope">
                    <div class="display-flex flex-direction-col data-text">
                      <span v-if="scope.row.avgPnl1d == 0">0</span>
                      <span
                        v-else
                        :class="scope.row.avgPnl1d[0] === '-' ? 'down-color' : 'up-color'"
                        >{{ numberFormat(scope.row.avgPnl1d) }}%</span
                      >

                      <span v-if="scope.row.pnl1d == 0">0</span>
                      <span
                        v-else
                        :class="scope.row.pnl1d[0] === '-' ? 'down-color' : 'up-color'"
                        >{{ numberFormat(scope.row.pnl1d) }}</span
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="7D Pnl" sortable sort-by="avgPnl7d">
                  <template #default="scope">
                    <div class="display-flex flex-direction-col data-text">
                      <span v-if="scope.row.avgPnl7d == 0">0</span>
                      <span
                        v-else
                        :class="scope.row.avgPnl7d[0] === '-' ? 'down-color' : 'up-color'"
                        >{{ numberFormat(scope.row.avgPnl7d) }}%</span
                      >

                      <span v-if="scope.row.pnl7d == 0">0</span>
                      <span
                        v-else
                        :class="scope.row.pnl7d[0] === '-' ? 'down-color' : 'up-color'"
                        >{{ numberFormat(scope.row.pnl7d) }}</span
                      >
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="30D Pnl" sortable sort-by="avgPnl30d">
                  <template #default="scope">
                    <div class="display-flex flex-direction-col data-text">
                      <span v-if="scope.row.avgPnl30d == 0">0</span>
                      <span
                        v-else
                        :class="scope.row.avgPnl30d[0] === '-' ? 'down-color' : 'up-color'"
                        >{{ numberFormat(scope.row.avgPnl30d) }}%</span
                      >
                      <span v-if="scope.row.pnl30d == 0">0</span>
                      <span
                        v-else
                        :class="scope.row.pnl30d[0] === '-' ? 'down-color' : 'up-color'"
                        >{{ numberFormat(scope.row.pnl30d) }}</span
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="7D 胜率" sortable sort-by="winRate7d">
                  <template #default="scope">
                    <span>{{ numberFormat(scope.row.winRate7d) }}%</span>
                  </template>
                </el-table-column>
                <el-table-column label="7D 交易数" sortable sort-by="tradeCount7d">
                  <template #default="scope">
                    <span>{{ numberFormat(scope.row.tradeCount7d) }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="120" label="7D 代币分布">
                  <template #default="scope">
                    <div class="display-flex align-items-center">
                      <div class="token-dist">
                        <span v-if="scope.row.tokenDist7dAbove500 == 0">0</span>
                        <span v-else class="up-color up-line">{{
                          numberFormat(scope.row.tokenDist7dAbove500)
                        }}</span>
                        <strong>&gt;500%</strong>
                      </div>
                      <div class="token-dist">
                        <span v-if="scope.row.tokenDist7d0To500 == 0">0</span>
                        <span v-else class="up-color up-line">{{
                          numberFormat(scope.row.tokenDist7d0To500)
                        }}</span>
                        <strong>0-500%</strong>
                      </div>
                      <div class="token-dist">
                        <span v-if="scope.row.tokenDist7dBelow0 == 0">0</span>
                        <span v-else class="down-color down-line">{{
                          numberFormat(scope.row.tokenDist7dBelow0)
                        }}</span>
                        <strong>&lt;0</strong>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="7D 利润">
                  <template #default="scope">
                    <span>{{ numberFormat(scope.row.totalProfit7d) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="7D 平均买入成本">
                  <template #default="scope">
                    <span>${{ numberFormat(scope.row.avgBuyPrice7d) }}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="date" label="最近时间" sortable sort-by="date">
                  <template #default="scope">
                    <span>{{ timeago(scope.row.lastTradeTime) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-skeleton>
        </template>
        <template v-else>
          <div class="smartMoney-list">
            <SmartmoneyItem />
            <SmartmoneyItem />
            <SmartmoneyItem />
            <SmartmoneyItem />
            <SmartmoneyItem />
            <SmartmoneyItem />
            <SmartmoneyItem />
            <SmartmoneyItem />
            <SmartmoneyItem />
            <SmartmoneyItem />
          </div>
        </template>
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { ref, unref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ClickOutside as vClickOutside } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import { numberFormat, timeago, shortifyAddress } from '@/utils'
import SmartmoneyItem from './components/SmartmoneyItem.vue'

import { APIlistSmartWallet } from '@/api'

const router = useRouter()
const i18n = useI18n()
const globalStore = useGlobalStore()
const { chainLogoObj, chainList } = globalStore

const popperVisible = ref<boolean>(false)
const popoverRef = ref()
const listFormatSwitch = ref<boolean>(false)

const chainInfo = ref<any>({})

const smartList = ref<any>([])
const skeleton = ref<boolean>(false)

const getSmartList = () => {
  chainInfo.value = chainList[0]
  getList()
}

const handelChain = async (item: any) => {
  chainInfo.value = item
  popperVisible.value = false
  getList()
}

/**点击空白处隐藏 */
const onClickOutside = (e: any) => {
  if (popperVisible.value && !unref(popoverRef).popperRef.contentRef.contains(e.target)) {
    popperVisible.value = false
  }
}

const handelTableRow = (row: any) => {
  // window.open(`/eth/address/0x9003c0aedc4b6cb70c12761e1461a4d9727037fc`)
  router.push(`/eth/address/0x9003c0aedc4b6cb70c12761e1461a4d9727037fc`)
}

const getList = async () => {
  skeleton.value = true
  const res = await APIlistSmartWallet({
    chainCode: chainInfo.value.chainCode == 'DEX' ? null : chainInfo.value.chainCode
  })
  smartList.value = res || []
  skeleton.value = false
}

onMounted(() => {
  getSmartList()
})
</script>

<style lang="scss" scoped>
.smartMoney-content {
  padding: 16px 24px 24px;
  width: 100%;
  .icon-svg {
    width: 20px;
    height: 20px;
    display: block;
  }
  .smartMoney-tab-item {
    height: 28px;
    padding: 0 11px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.1s;
    background-color: transparent;
    color: var(--dex-color-4);
    white-space: nowrap;
  }
  .smartMoney-tab-item.active {
    color: var(--font-color-default);
    background-color: var(--hover-bg-color);
  }
  .table-operate-switch {
    strong {
      color: #b4b4b4;
      font-size: 14px;
      font-weight: normal;
      margin-right: 13px;
    }
    :deep(.el-switch .el-switch__core .el-switch__action) {
      background-color: #1f232d;
    }
  }
  .smartMoney-chain {
    padding-bottom: 16px;
    position: sticky;
    top: 0;
    z-index: 9;
    background-color: var(--bg-color);
  }
  .table-select-text {
    border-radius: 8px;
    background: transparent;
    padding: 6px 4px 6px 6px;
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.1s;
    span {
      margin: 0 8px;
    }
  }
  .table-box {
    background-color: var(--card-bg-color);
    border-radius: 12px;
    padding: 12px;
    :deep(.el-table__row) {
      cursor: pointer;
    }
    :deep(.el-table) {
      overflow: initial;
    }
    :deep(.el-table .el-table__header-wrapper) {
      position: sticky;
      top: 48px;
      z-index: 8;
    }
    .walletAddress {
      color: var(--font-color-default);
      margin-right: 4px;
    }
    .icon-money,
    .copy,
    .icon-heart,
    .icon-smart {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }

    .logo,
    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .logo {
      margin-right: 6px;
    }
    .data-text {
      span:last-child {
        font-size: 12px;
      }
    }
    .token-dist {
      margin-right: 20px;

      strong {
        display: block;
        font-weight: normal;
        color: var(--dex-color-4);
        font-size: 12px;
      }
      .down-line {
        cursor: pointer;
        border-bottom: 1px solid var(--down-color);
      }
      .up-line {
        cursor: pointer;
        border-bottom: 1px solid var(--up-color);
      }
    }
  }
  .smartMoney-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
