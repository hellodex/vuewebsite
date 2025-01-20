<template>
  <div class="securityTest-tabs-content display-flex flex-direction-col">
    <div class="display-flex flex-direction-col securityTest-left-box">
      <div class="securityTest-score">
        <div class="securityTest-score-info">
          <div class="display-flex flex-direction-col securityTest-info">
            <span
              >创建者：{{ shortifyAddress(props.coinGoPlusInfo?.creator_address)
              }}{{ isblackHole(props.coinGoPlusInfo?.creator_address) ? '(黑洞地址)' : '' }}</span
            >
            <span v-if="props.coinGoPlusInfo?.chainCode !== 'SOLANA'"
              >持有者：{{ shortifyAddress(props.coinGoPlusInfo?.owner_address)
              }}{{ isblackHole(props.coinGoPlusInfo?.owner_address) ? '(黑洞地址)' : '' }}</span
            >
            <span>总量：{{ numberFormat(props.coinGoPlusInfo?.total_supply || 0) }} </span>
          </div>
        </div>
        <div class="display-flex justify-content-center progress-box">
          <el-progress
            type="dashboard"
            :percentage="isMainToken ? 20 : 75"
            :stroke-width="15"
            :color="isMainToken ? '#2EBD85' : '#f90'"
            :width="200"
            stroke-linecap="round"
          >
            <template #default="{ percentage }">
              <div class="display-flex flex-direction-col">
                <span class="percentage-value" :style="{ color: isMainToken ? '#2EBD85' : '#f90' }"
                  >{{ percentage }}%</span
                >
                <span class="percentage-label">风险评估</span>
                <p class="tips-text" :style="{ color: isMainToken ? '#2EBD85' : '#f90' }">
                  {{ isMainToken ? '可信任代币' : '可能存在风险' }}
                </p>
              </div>
            </template>
          </el-progress>
        </div>
      </div>
      <div class="securityTest-info-prompt" v-if="props.coinGoPlusInfo?.chainCode !== 'SOLANA'">
        <div class="display-flex align-items-center justify-content-sp">
          <div class="prompt-rate display-flex align-items-center justify-content-sp">
            <span>买税</span>
            <span>{{ parseFloat(props.coinGoPlusInfo?.buy_tax || 0).toFixed(1) }}%</span>
          </div>
          <div class="prompt-rate display-flex align-items-center justify-content-sp">
            <span>卖税</span>
            <span>{{ parseFloat(props.coinGoPlusInfo?.sell_tax || 0).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="securityTest-right-box">
      <div class="securityTest-risk">
        <div class="securityTest-txt">风险检查</div>
        <div class="securityTest-risk-items">
          <div
            v-for="(item, index) in riskList"
            :key="index"
            class="display-flex align-items-center securityTest-risk-item"
          >
            <svg-icon name="alert-triangle" class="icon" v-if="item.type == 'warning'"></svg-icon>
            <svg-icon name="shield-tick1" class="icon" v-if="item.type == 'success'"></svg-icon>
            <span :class="item.type">{{ item.title }}</span>
          </div>
        </div>
      </div>
      <div class="securityTest-risk-info">
        <div class="securityTest-txt">持币分析</div>
        <div class="hold-tab">
          <span
            :class="item.value === holdIndex ? 'active' : ''"
            v-for="item in holdTab"
            :key="item.value"
            @click="handelHoldTab(item)"
            >{{ item.label }}({{
              item.value == 0
                ? numberFormat(coinGoPlusInfo?.holders?.length || 0)
                : numberFormat(coinGoPlusInfo?.lp_holders?.length || 0)
            }})</span
          >
        </div>
        <div class="holder-info">
          <div class="display-flex align-items-center justify-content-sp">
            <span>Top10 占比</span>
            <div class="progress-main">
              <span class="txt">{{ (parseFloat(holdersPercentage) * 100).toFixed(2) }}%</span>
              <el-progress
                :percentage="parseFloat(holdersPercentage) * 100"
                color="#9c9c9c"
                class="progress"
                :stroke-width="10"
              ></el-progress>
            </div>
          </div>
          <div class="holders-list">
            <template v-if="holdIndex == 0">
              <div class="holders-title-txt">Top10 持币明细</div>
              <div
                v-for="(item, index) in coinGoPlusInfo?.holders || []"
                :key="index"
                class="display-flex align-items-center justify-content-sp"
              >
                <span>{{ index + 1 }}.{{ shortifyAddress(item.address || item.account) }}</span>
                <span
                  >{{ numberFormat(item.balance) }}（{{
                    (parseFloat(item.percent) * 100).toFixed(2)
                  }}%）</span
                >
              </div>
            </template>
            <template v-if="holdIndex == 1">
              <div class="holders-title-txt">Top10LP 持币明细</div>
              <div class="holders-list-item display-flex align-items-center justify-content-sp">
                <span>#</span>
                <span>渠道</span>
                <span>结束时间</span>
                <span>占比</span>
              </div>
              <div
                v-for="(item, index) in coinGoPlusInfo?.lp_holders || []"
                :key="index"
                class="holders-list-item display-flex align-items-center justify-content-sp"
              >
                <span>{{ index + 1 }}</span>
                <span class="display-flex align-items-center">
                  <svg-icon name="lock" class="lock" v-if="item.is_locked"></svg-icon>
                  {{ shortifyAddress(item.address || item.account) }}
                  {{ isblackHole(item.address || item.account) ? '(黑洞地址)' : '' }}
                </span>
                <span>-</span>
                <span
                  >{{ numberFormat(item.balance) }}（{{
                    (parseFloat(item.percent) * 100).toFixed(2)
                  }}%）</span
                >
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="community-trust-txt">
        <span
          >备注：合约检测只是单方面检测，某些新貔貅可能未能检测到需要结合更多维度来分析，比如K线走势，持仓变化，资金流向等等。</span
        >
        <span class="txt"
          >如对检测结果有疑惑，欢迎<a href="http://" target="_blank" rel="noopener noreferrer"
            >点击反馈</a
          ></span
        >
      </div>
      <div
        class="display-flex flex-direction-col align-items-center justify-content-center community-trust-support"
      >
        <span>合约检测技术支持</span>
        <svg-icon name="image-support" class="icon"></svg-icon>
        <span>gopluslabs.io</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { numberFormat, shortifyAddress } from '@/utils'
import { MAIN_COIN } from '@/types'

const holdTab = [
  {
    label: '持币人',
    value: 0
  },
  {
    label: 'LP',
    value: 1
  }
]
const holdIndex = ref(0)

const handelHoldTab = (item: any) => {
  holdIndex.value = item.value
}

const props = defineProps({
  coinGoPlusInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  tokenInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const isMainToken = computed(() => {
  return MAIN_COIN[props.tokenInfo?.baseSymbol]
})

const riskList = computed(() => {
  const obj = props.coinGoPlusInfo
  if (obj?.chainCode) {
    return obj.chainCode == 'SOLANA'
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

const holdersPercentage = computed(() => {
  const obj = props.coinGoPlusInfo
  let percentage = 0

  obj?.holders?.forEach((item: any) => {
    percentage += parseFloat(item.percent)
  })

  return percentage.toFixed(2)
})

const isblackHole = (address: string) => {
  return [
    '0x000000000000000000000000000000000000dead',
    '0x0000000000000000000000000000000000000000'
  ].includes(address?.toLocaleLowerCase())
}

onMounted(() => {})
</script>
<style lang="scss" scoped>
.securityTest-tabs-content {
  font-style: normal;
  padding: 0.4267rem 0.4267rem 0.2133rem;
  font-size: 0.32rem;
  .securityTest-txt {
    color: #9c9c9c;
    font-size: 0.3733rem;
    margin: 0.4267rem 0;
  }
  .progress-box {
    margin: 0.32rem auto;
    .percentage-value {
      font-size: 0.64rem;
      color: var(--up-color);
      font-weight: 900;
    }
    .percentage-label {
      font-size: 0.32rem;
      color: #9c9c9c;
      margin-top: 0.2667rem;
    }
    .tips-text {
      color: var(--up-color);
      font-size: 0.3733rem;
      margin-top: 0.2667rem;
    }
  }
  .securityTest-left-box {
    width: 100%;
    .securityTest-info {
      color: #9c9c9c;
    }
    .securityTest-info-prompt {
      padding: 0.2667rem;
      border-radius: 0.1067rem;
      background: #202020;
      color: #9c9c9c;

      .prompt-rate {
        flex: 1;
      }
      .prompt-rate:first-child {
        margin-right: 0.5333rem;
        span:last-child {
          color: var(--up-color);
        }
      }
      .prompt-rate:last-child {
        span:last-child {
          color: var(--down-color);
        }
      }
    }
  }
  .securityTest-right-box {
    width: 100%;
    .securityTest-risk-items {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(1, 1fr);
      gap: 0.2667rem;
      .securityTest-risk-item {
        white-space: nowrap;
        font-size: 0.32rem;
      }
      .icon {
        width: 0.5333rem;
        height: 0.5333rem;
        display: block;
        margin-right: 0.1067rem;
      }
      .info {
        color: #2970ff;
      }
      .warning {
        color: #f90;
      }
      .success {
        color: #9c9c9c;
      }
    }
    .securityTest-risk-info {
      .hold-tab {
        width: 75%;
        padding: 0.1067rem;
        background-color: #202020;
        border-radius: 0.1067rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto 0.4267rem;
        span {
          flex: 1;
          background-color: transparent;
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          border-radius: 0.1067rem;
          font-size: 12px;
        }
        .active {
          background-color: #000;
        }
      }
      .holder-info {
        :deep(.el-progress__text) {
          display: none;
        }
        .progress-main {
          position: relative;
          .txt {
            font-size: 12px;
            margin-right: 4px;
          }
          .progress {
            width: 1.3333rem;
            display: inline-block;
          }
        }
      }
      .holders-list {
        background-color: #202020;
        padding: 0.32rem;
        border-radius: 0.1067rem;
        color: #9c9c9c;
        font-size: 0.2667rem;
        line-height: 2.4;
        margin: 0.32rem 0 0.64rem;
        .holders-title-txt {
          font-size: 0.32rem;
        }
      }
      .holders-list-item {
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
        }
        .lock {
          width: 0.2667rem;
          height: 0.2667rem;
          color: #f90;
          margin-right: 0.04rem;
        }
      }
    }
    .community-trust-txt {
      font-size: 12px;
      color: #9c9c9c;
      display: flex;
      flex-direction: column;
      .txt {
        margin-top: 0.8rem;
        text-align: center;
      }
      a {
        color: #9c9c9c;
        text-decoration: underline;
      }
    }
    .community-trust-support {
      margin-top: 0.4rem;
      color: #9c9c9c;
      font-size: 12px;
      .icon {
        width: 1.0667rem;
        height: 0.8rem;
        display: block;
        margin: 0.4rem 0;
      }
      span:last-child {
        color: #9c9c9c;
      }
    }
  }
}
</style>
