<template>
  <div class="securityTest-tabs-content">
    <div class="display-flex align-items-center">
      <span class="logo">
        <el-image :src="baseInfo?.tokenInfo?.logo" alt="" class="baseInfo-img">
          <template #error>
            <svg-icon name="logo1" class="baseInfo-img"></svg-icon>
          </template>
        </el-image>
        <svg-icon :name="'coin' + baseInfo?.chainInfo?.chainCode" class="chainCode"></svg-icon>
      </span>
      <div class="display-flex flex-direction-col">
        <div class="display-flex align-items-center">
          <div class="display-flex align-items-center coin-text font-family-Heavy">
            <span>{{
              MAIN_COIN[baseInfo?.tokenInfo?.baseSymbol] || baseInfo?.tokenInfo?.baseSymbol || '-'
            }}</span>
            <span class="coin-sub-txt">/{{ baseInfo?.tokenInfo?.quoteSymbol || '-' }}</span>
          </div>
          <div class="display-flex align-items-center">
            <svg-icon name="icon-pc" class="icon-pc" @click="handelIcon"></svg-icon>
            <svg-icon name="twitter-pump" class="icon-chat" @click="handelIcon"></svg-icon>
            <svg-icon name="telegram-pump" class="icon-chat" @click="handelIcon"></svg-icon>
            <a
              :href="`https://x.com/search?q=${baseInfo?.tokenInfo?.baseAddress}`"
              target="_blank"
              class="icon-chat"
            >
              <el-icon size="16"><Search /></el-icon>
            </a>
          </div>
          <div class="increase-text display-flex align-items-center font-family-Heavy">
            <span :class="priceIncrease.increase[0] === '-' ? 'down-color' : 'up-color'"
              >${{ numberFormat(priceIncrease.price || 0) }}</span
            >
            <PercentageChange :value="priceIncrease.increase" />
          </div>
        </div>
        <div class="display-flex align-items-center address-text">
          <div
            class="info-txt font-family-Medium display-flex align-items-center justify-content-sp"
          >
            <span>{{ i18n.t('kChart.Address') }}：</span>
            <div class="display-flex align-items-center">
              <span class="text-on-container-secondary">{{
                shortifyAddress(baseInfo?.tokenInfo?.baseAddress)
              }}</span>
              <svg-icon
                name="copy"
                class="copy"
                v-copy="baseInfo?.tokenInfo?.baseAddress"
              ></svg-icon>
            </div>
          </div>
          <div class="info-txt display-flex align-items-center justify-content-sp">
            <span>{{ i18n.t('kChart.liquidityPool') }}：</span>
            <div class="display-flex align-items-center">
              <span class="text-on-container-secondary">{{
                shortifyAddress(baseInfo?.chainInfo?.pairAddress)
              }}</span>
              <svg-icon
                name="copy"
                class="copy"
                v-copy="baseInfo?.chainInfo?.pairAddress"
              ></svg-icon>
            </div>
          </div>
          <div class="pond-buy display-flex align-items-center">
            <span class="font-family-Medium">税：</span>
            <span class="font-family-Heavy"
              >{{ parseFloat(baseInfo?.coinGoPlusInfo?.buy_tax || 0).toFixed(1) }}%</span
            >
            <span class="font-family-Heavy"
              >{{ parseFloat(baseInfo?.coinGoPlusInfo?.sell_tax || 0).toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="tips-txt">
      安全检测结果基于链上数据分析，仅供参考。这并不意味着数据是 100%
      正确的。请始终进行自己的研究并承担相应的风险。
    </div>
    <div class="display-flex flex-direction-col securityTest-box">
      <div class="securityTest-risk">
        <div class="securityTest-txt font-family-Heavy">交易安全报告</div>
        <div class="tips-btn display-flex align-items-center justify-content-center">
          <div class="display-flex align-items-center">
            <span>买税</span>
            <strong class="up-color"
              >{{ parseFloat(baseInfo?.coinGoPlusInfo?.buy_tax || 0).toFixed(1) }}%</strong
            >
          </div>
          <span class="line"></span>
          <div class="display-flex align-items-center">
            <span>卖税</span>
            <strong class="down-color"
              >{{ parseFloat(baseInfo?.coinGoPlusInfo?.sell_tax || 0).toFixed(1) }}%</strong
            >
          </div>
        </div>
        <div class="securityTest-risk-items">
          <div
            v-for="(item, index) in riskList"
            :key="index"
            class="display-flex securityTest-risk-item"
          >
            <svg-icon name="alert-triangle" class="icon" v-if="item.type == 'warning'"></svg-icon>
            <svg-icon
              name="shield-tick1"
              class="icon"
              v-else-if="item.type == 'success'"
            ></svg-icon>
            <span :class="item.type">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="securityTest-right-box">
      <div class="securityTest-risk-info">
        <div class="securityTest-txt font-family-Heavy">
          持币人（{{ numberFormat(holdingCoinsTabInfo?.topHolders?.holds || 0) }}）
        </div>
        <div class="holders-progress display-flex align-items-center justify-content-sp">
          <span>{{ holdingCoinsTabInfo?.name }}占比</span>
          <div class="progress-main">
            <span class="txt"
              >{{
                parseFloat(holdingCoinsTabInfo?.topHolders?.topProPortion || 0).toFixed(2)
              }}%</span
            >
            <el-progress
              :percentage="parseFloat(holdingCoinsTabInfo?.topHolders?.topProPortion || 0)"
              color="#569CEE"
              class="progress"
              :stroke-width="6"
            ></el-progress>
          </div>
        </div>
        <div class="holders-list">
          <div
            v-for="(item, index) in holdingCoinsTabInfo?.topHolders?.vos || []"
            :key="index"
            class="holders-list-item display-flex align-items-center justify-content-sp"
          >
            <span>{{ index + 1 }}.{{ shortifyAddress(item.walletAddress) }}</span>
            <span>{{ numberFormat(item.amount) }}（{{ numberFormat(item.per) }}%）</span>
          </div>
        </div>
        <div class="securityTest-txt font-family-Heavy">
          LP（{{ numberFormat(baseInfo?.coinGoPlusInfo?.lp_holders?.length || 0) }}）
        </div>
        <div class="holders-progress display-flex align-items-center justify-content-sp">
          <span>LP锁仓占比</span>
          <div class="progress-main">
            <span class="txt"
              >{{ baseInfo?.coinGoPlusInfo?.lp_holders?.length > 0 ? 100 : 0 }}%</span
            >
            <el-progress
              :percentage="baseInfo?.coinGoPlusInfo?.lp_holders?.length > 0 ? 100 : 0"
              color="#569CEE"
              class="progress"
              :stroke-width="6"
            ></el-progress>
          </div>
        </div>
        <div class="holders-list">
          <div
            v-for="(item, index) in baseInfo?.coinGoPlusInfo?.lp_holders || []"
            :key="index"
            class="holders-list-item display-flex align-items-center justify-content-sp"
          >
            <span class="display-flex align-items-center">
              {{ index + 1 }}.
              <svg-icon name="lock" class="lock" v-if="item.is_locked"></svg-icon>
              {{ shortifyAddress(item.address || item.account) }}
              {{ isblackHole(item.address || item.account) ? '(黑洞地址)' : '' }}
            </span>
            <span
              >{{ numberFormat(item.balance) }}（{{
                (parseFloat(item.percent) * 100).toFixed(2)
              }}%）</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="display-flex align-items-center justify-content-center community-trust-support font-family-Heavy"
  >
    <svg-icon name="image-support" class="icon"></svg-icon>
    <span>GoPlus</span>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { numberFormat, shortifyAddress } from '@/utils'
import { MAIN_COIN } from '@/types'
import { useI18n } from 'vue-i18n'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'
import { customMessage } from '@/utils/message'

const i18n = useI18n()

const useSubscribeKChart = useSubscribeKChartInfo()

const priceIncrease = computed(() => {
  return {
    price: useSubscribeKChart.subscribeKChartInfo?.C || 0,
    increase: useSubscribeKChart.subscribeKChartInfo?.chg || 0
  }
})

const props = defineProps({
  baseInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  holdingCoinsTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const isMainToken = computed(() => {
  return MAIN_COIN[props.baseInfo?.tokenInfo?.baseSymbol]
})

const riskList = computed(() => {
  const obj = props.baseInfo?.coinGoPlusInfo

  if (props.baseInfo?.chainInfo?.chainCode) {
    return props.baseInfo.chainInfo.chainCode == 'SOLANA'
      ? [
          {
            title: obj?.non_transferable == 0 ? '可转账' : '不可转账，有风险',
            type: obj?.non_transferable == 0 ? 'success' : 'warning'
          },
          {
            title: obj?.transfer_hook?.length == 0 ? '无外部转账合约调用' : '有外部转账合约调用',
            type: obj?.transfer_hook?.length == 0 ? 'success' : 'warning'
          },
          {
            title: obj?.mintable?.status == 0 ? '不可增发' : '可增发',
            type: obj?.mintable?.status == 0 ? 'success' : 'warning'
          },
          {
            title: obj?.freezable?.status == 0 ? '不可冻结代币' : '可冻结代币',
            type: obj?.freezable?.status == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.closable?.status == 0
                ? '不可随时关闭代币'
                : '可随时关闭代币。如关闭，所有资产将被销毁',
            type: obj?.closable?.status == 0 ? 'success' : 'warning'
          },
          {
            title: obj?.transfer_fee_upgradable?.status == 0 ? '不可更改转账费' : '可更改转账费',
            type: obj?.transfer_fee_upgradable?.status == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.default_account_state_upgradable?.status == 0
                ? '不可更改账户状态'
                : '可更改账户状态',
            type: obj?.default_account_state_upgradable?.status == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.balance_mutable_authority?.status == 0
                ? '不可更改持有者代币余额'
                : '可更改持有者代币余额',
            type: obj?.balance_mutable_authority?.status == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.transfer_hook_upgradable?.status == 0
                ? '不可更改外部转账合约'
                : '可更改外部转账合约',
            type: obj?.transfer_hook_upgradable?.status == 0 ? 'success' : 'warning'
          }
        ]
      : [
          {
            title: obj?.is_open_source == 1 ? '合约已开源' : '合约未开源,请注意风险',
            type: obj?.is_open_source == 1 ? 'success' : 'warning'
          },
          {
            title: obj?.is_proxy == 0 ? '不存在代理合约' : '存在代理合约，可能包含重大风险',
            type: obj?.is_proxy == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.is_mintable == 0 ? '不存在铸造代币功能' : '存在铸造代币，可能引发大规模抛售',
            type: obj?.is_mintable == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.can_take_back_ownership == 0
                ? '无法收回所有权'
                : '可收回所有权，具有铸造、修改滑点、暂停交易、设置黑名单等',
            type: obj?.can_take_back_ownership == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.owner_change_balance == 0
                ? '无法更改代币持有者余额'
                : '可更改代币持有人的余额，或大量铸造和抛售',
            type: obj?.owner_change_balance == 0 ? 'success' : 'warning'
          },
          {
            title: obj?.hidden_owner == 0 ? '没有隐藏的所有权' : '有隐藏的所有权，恶意合约别参与！',
            type: obj?.hidden_owner == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.selfdestruct == 0
                ? '无法自毁'
                : '可自毁，合约将被销毁，所有功能不可用，相关资产也将被抹去',
            type: obj?.selfdestruct == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.external_call == 0
                ? '无外部调用'
                : '可外部调用合，可能会有风险，也可能没有风险，请自行了解',
            type: obj?.external_call == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.gas_abuse == 1
                ? '有无滥用Gas，与此类地址的任何互动都可能导致财产损失'
                : '无滥用Gas',
            type: obj?.gas_abuse == 1 ? 'warning' : 'success'
          },
          {
            title:
              obj?.cannot_sell_all == 0
                ? '可全部出售代币'
                : '无法一次性全部卖掉，无法在一次中卖掉你所有的代币。',
            type: obj?.cannot_sell_all == 0 ? 'success' : 'warning'
          },
          {
            title: obj?.slippage_modifiable == 0 ? '无法修改交易税' : '可修改交易税，请谨慎判断',
            type: obj?.slippage_modifiable == 0 ? 'success' : 'warning'
          },
          {
            title: obj?.is_honeypot == 0 ? '不是蜜罐' : '是蜜罐无法出售',
            type: obj?.is_honeypot == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.transfer_pausable == 0
                ? '无法暂停交易'
                : '可随时暂停交易，此后任何人都将无法出售，除非拥有特殊权限的人',
            type: obj?.transfer_pausable == 0 ? 'success' : 'warning'
          },
          {
            title: obj?.is_blacklisted == 0 ? '无黑名单' : '有黑名单，被拉黑后持币者无法进行交易',
            type: obj?.transfer_pausable == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.is_whitelisted == 0
                ? '没有白名单(白名单只限制特定地址可交易'
                : '有白名单可暂停交易代币',
            type: obj?.is_whitelisted == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.is_anti_whale == 0
                ? '无可修改的防鲸鱼'
                : '有防鲸鱼，可限制最大交易金额或最大持币数量',
            type: obj?.is_anti_whale == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.trading_cooldown == 0
                ? '无交易冷却'
                : '有交易冷却，可以限制两笔交易之间的间距时间',
            type: obj?.trading_cooldown == 0 ? 'success' : 'warning'
          },
          {
            title:
              obj?.personal_slippage_modifiable == 0
                ? '无修改指定地址交易税'
                : '有修改指定地址交易税',
            type: obj?.personal_slippage_modifiable == 0 ? 'success' : 'warning'
          }
        ]
  } else {
    return []
  }
})

const isblackHole = (address: string) => {
  return [
    '0x000000000000000000000000000000000000dead',
    '0x0000000000000000000000000000000000000000'
  ].includes(address?.toLocaleLowerCase())
}

const handelIcon = () => {
  customMessage({
    type: 'info',
    title: '代币未收录信息，请联系项目方在平台收录信息'
  })
}

onMounted(() => {})
</script>
<style lang="scss" scoped>
.securityTest-tabs-content {
  font-style: normal;
  height: calc(100vh - 130px);
  overflow: hidden;
  overflow-y: auto;
  .logo {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    position: relative;
    .chainCode {
      width: 18px;
      height: 18px;
      position: absolute;
      right: -2px;
      bottom: -2px;
    }
  }
  .baseInfo-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .coin-text {
    font-size: 16px;
    margin-right: 4px;
    color: #f5f5f5;
    .coin-sub-txt {
      color: #959a9f;
    }
  }
  .icon-chat {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    color: #959a9f;
  }
  .icon-pc {
    width: 24px;
    height: 24px;
    margin-right: 2px;
  }
  .info-txt {
    font-size: 12px;
    color: #959a9f;
    margin-right: 6px;
    white-space: nowrap;
    .text-on-container-secondary {
      color: #959a9f;
    }
    .copy {
      width: 12px;
      height: 12px;
      margin-left: 4px;
      cursor: pointer;
    }
  }
  .increase-text {
    margin-left: 10px;
    span:first-child {
      font-size: 16px;
      line-height: 1.2;
      margin-right: 6px;
    }
  }
  .pond-buy {
    margin-left: 8px;
    span {
      display: block;
      font-size: 12px;
      line-height: 1.2;
    }
    span:nth-child(1) {
      color: #959a9f;
    }
    span:nth-child(2) {
      color: var(--up-color);
    }
    span:last-child {
      color: var(--down-color);
      margin-left: 4px;
    }
  }

  .tips-txt {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ffc422;
    background: rgba(255, 196, 34, 0.1);
    color: #f5f5f5;
    font-size: 12px;
    margin-top: 15px;
  }

  .tips-btn {
    height: 38px;
    padding: 6px 11px;
    border-radius: 12px;
    border: 1px solid #26282c;
    font-size: 12px;
    margin-top: 10px;
    .line {
      width: 25px;
      height: 1px;
      transform: rotate(90deg);
      background: #26282c;
      margin: 0 50px;
    }
    strong {
      margin-left: 10px;
      font-family: 'PingFangSC-Medium';
    }
  }

  .securityTest-txt {
    color: #f5f5f5;
    font-size: 14px;
  }

  .securityTest-score {
    margin-top: 16px;
    .percentage-value {
      font-size: 28px;
    }
    .percentage-label {
      font-size: 12px;
      margin: 12px 0;
    }
    .tips-text {
      font-size: 14px;
    }
  }
  .securityTest-box {
    width: 100%;
    .securityTest-info {
      line-height: 2;
      color: #828282;
      margin-top: 12px;
      font-size: 13px;
    }
    .securityTest-risk {
      margin-top: 15px;
    }
    .securityTest-risk-items {
      display: flex;
      flex-direction: column;
      font-size: 13px;
      .securityTest-risk-item {
        margin-top: 10px;
      }
      .icon {
        width: 20px;
        height: 20px;
        display: block;
        margin-right: 4px;
      }
      .info {
        color: #2970ff;
      }
      .warning {
        color: #f90;
      }
      .success {
        color: #828282;
      }
    }
  }
  .securityTest-right-box {
    width: 100%;
    margin: 15px 0;
    .holders-progress {
      font-size: 12px;
      margin: 10px 0;
      color: #aaa;
      :deep(.el-progress__text) {
        display: none;
      }
      :deep(.el-progress-bar__outer) {
        background-color: #26282c;
      }
      .progress-main {
        position: relative;
        .txt {
          margin-right: 8px;
          font-size: 12px;
          color: #f5f5f5;
        }
        .progress {
          width: 100px;
          display: inline-block;
          position: relative;
          top: -2px;
        }
      }
    }
    .holders-list {
      min-height: 60px;
      .holders-title-txt {
        font-size: 14px;
      }
      .holders-list-item {
        margin: 8px 0;
        line-height: 1.8;
        font-size: 12px;
        color: #aaa;
        .lock {
          width: 13px;
          height: 13px;
        }
        span {
          flex: 4;
          white-space: nowrap;
        }
        span:nth-child(1) {
          flex: 1;
        }
        span:nth-child(3) {
          flex: 2;
          text-align: center;
        }
        span:last-child {
          text-align: right;
          color: #f5f5f5;
        }
      }
    }
  }
}
.community-trust-support {
  padding-top: 15px;
  font-size: 14px;
  color: #fff;
  .icon {
    width: 24px;
    height: 20px;
    display: block;
    margin-right: 4px;
  }
}
</style>
