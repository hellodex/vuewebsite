<template>
  <el-dialog
    v-model="dialogVisible"
    width="530"
    align-center
    :before-close="handleClose"
    :show-close="false"
    class="search-transaction-dialog"
  >
    <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <el-input
          :class="titleClass"
          :id="titleId"
          v-model="input"
          placeholder="搜索币名、合约地址"
          @input="handleChange()"
          clearable
        >
          <template #prepend>
            <el-button :icon="Search" :loading="loading" />
          </template>
        </el-input>
      </div>
    </template>
    <div class="search-transaction">
      <div class="display-flex align-items-center search-transaction-items">
        <div class="display-flex align-items-center search-transaction-item">
          <!-- <img :src="token.logo" alt="" class="coin-icon" v-if="token.logo" /> -->
          <svg-icon name="logo1" class="coin-icon"></svg-icon>
          <span>ETH</span>
        </div>
      </div>
    </div>
    <div class="search-content">
      <div class="search-label display-flex align-items-center">
        <span>资产</span>
      </div>
      <el-scrollbar>
        <div class="search-result">
          <div
            class="display-flex align-items-center justify-content-sp search-result-item"
            v-for="(item, index) in tokenList"
            :key="index"
            @click="handleSelect(item)"
          >
            <div class="display-flex align-items-center">
              <div class="logo">
                <el-image :src="item.logo" alt="" class="logo-img">
                  <template #error>
                    <svg-icon name="logo1" class="logo-img"></svg-icon>
                  </template>
                </el-image>
                <img :src="chainLogoObj[item.chainCode]" alt="" class="chainCode" />
              </div>
              <div class="display-flex flex-direction-col chain-name">
                <span
                  >{{ item.baseToken }}<i>/{{ item.quoteToken }}</i></span
                >
                <span>{{ shortifyAddress(item.baseAddress) }}</span>
              </div>
            </div>
            <div class="display-flex flex-direction-col chain-price">
              <span>{{ numberFormat(decimalsFormat(item.tvl, item.baseTokenDecimals)) }}</span>
              <span>{{ item.quoteToken }}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { APISearchToken, APIgetTokensByWalletAddr } from '@/api'
import { debounce, isAllSpaces, shortifyAddress, mainNetworkCurrency, numberFormat } from '@/utils'

import { useChainConfigsStore } from '@/stores/chainConfigs'
import { useGlobalStore } from '@/stores/global'
import { decimalsFormat } from '@/utils/transition'

const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore

const props: any = defineProps({
  searchDialogVisible: {
    type: [Boolean],
    default: false
  },
  // 拉起弹窗时 是卖出还是买入 的标识
  sellingBuy: {
    type: String,
    default: ''
  },
  walletInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const dialogVisible: any = computed({
  // getter
  get() {
    return props.searchDialogVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})
/** 弹框 业务处理 */
const tokenList = ref<any>([])
const input = ref<string>('')
const loading = ref<boolean>(false)
const propertyList = ref<any>([])
const chainConfigs = useChainConfigsStore().chainConfigs

async function getTokenList() {
  const selectCoinInfo = sessionStorage.getItem('selectCoinInfo') || ''
  const tokens: any = await APISearchToken({
    query: input.value,
    chainCode: props.sellingBuy == 'buy' ? JSON.parse(selectCoinInfo)?.chainCode : ''
  })
  tokenList.value = tokens.map((item: any) => {
    const isCurrency = chainConfigs.some((itm: { symbol: any }) => itm.symbol == item.baseToken)
    return {
      logo: isCurrency
        ? chainConfigs.find((itm: { symbol: any }) => itm.symbol == item.baseToken)?.logo
        : item.logo
          ? item.logo
          : '',
      chainCode: item.chainCode,
      baseTokenDecimals: item.baseTokenDecimals,
      baseToken: item.baseToken,
      baseAddress: isCurrency ? '' : item.baseAddress,
      tvl: item.tvl,
      quoteToken: item.quoteToken
    }
  })
  loading.value = false
}

/** 弹框逻辑处理 */
const emit = defineEmits(['close', 'select'])

const handleClose = () => {
  emit('close', false)
}

const handleSelect = (item: any) => {
  if (props.sellingBuy == 'selling') {
    sessionStorage.setItem('selectCoinInfo', JSON.stringify(item))
  }
  emit('select', {
    coinInfo: {
      logo: item.logo,
      chainCode: item.chainCode,
      baseTokenDecimals: item.baseTokenDecimals,
      baseToken: item.baseToken,
      chainCodeName: mainNetworkCurrency(item.chainCode)?.chain,
      baseAddress: item.baseAddress
    },
    dialogVisible: false
  })
}

function handleChange() {
  if (isAllSpaces(input.value)) {
    return false
  }
  debounce(() => {
    loading.value = true
    getTokenList()
  }, 500)
}
const getTokensByWalletAddr = async (params: any) => {
  const res: any = await APIgetTokensByWalletAddr(params)
  tokenList.value = res.map((item: any) => {
    const isCurrency = chainConfigs.some((itm: { symbol: any }) => itm.symbol == item.symbol)
    return {
      logo: isCurrency
        ? chainConfigs.find((itm: { symbol: any }) => itm.symbol == item.symbol)?.logo
        : item.logo
          ? item.logo
          : '',
      chainCode: item.chainCode,
      baseTokenDecimals: item.decimals,
      baseToken: item.symbol,
      baseAddress: isCurrency ? '' : item.address,
      tvl: item.amount,
      quoteToken: item.chainCode
    }
  })
}

onMounted(() => {
  if (props.walletInfo.isConnected) {
    getTokensByWalletAddr({
      walletAddress: props.walletInfo.address,
      chainCode: props.walletInfo.chainCode
    })
  }
})
</script>
<style lang="scss">
.search-transaction-dialog {
  border-radius: 16px !important;
  -webkit-border-radius: 16px !important;
  -moz-border-radius: 16px !important;
  -ms-border-radius: 16px !important;
  -o-border-radius: 16px !important;

  font-style: normal;
  color: var(--font-color-default);
  background-color: var(--bg-color);
  font-size: 14px;
  line-height: 1.25;
  .el-dialog__header {
    width: 530px;
    padding: 0 !important;
    position: relative;
    left: -16px;
    top: -16px;
    .el-input {
      height: 52px;
      border-bottom: 1px solid var(--color-border);
      color: var(--dex-color-4);

      .el-input__prefix-inner {
        color: var(--font-color-default);
      }
    }
    .el-input__wrapper {
      box-shadow: none !important;
      border-radius: 16px 16px 0 0 !important;
      background-color: var(--bg-color) !important;
    }
    .el-input__inner {
      color: var(--font-color-default);
    }
    .el-input-group__prepend {
      color: var(--font-color-default);
      font-size: 18px;
      padding: 0 4px 0 25px;
      background-color: var(--bg-color) !important;
      box-shadow: none !important;
      border-radius: 16px 0 0 0 !important;
      .el-button {
        position: relative;
        top: -4px;
      }
      .el-button.is-loading:before {
        background-color: transparent;
      }
    }
  }
  .search-label {
    font-size: 14px;
    margin-bottom: 8px;
    color: var(--font-color-default);
    .search-icon {
      width: 15px;
      height: 15px;
      margin-right: 4px;
    }
  }
  .search-transaction {
    margin-bottom: 4px;
    .search-history-title {
      color: var(--font-color-default);
    }
    .trash-icon,
    .coin-icon {
      width: 18px;
      height: 18px;
    }
    .trash-icon {
      cursor: pointer;
    }
    .search-transaction-items {
      flex-wrap: wrap;
    }
    .search-transaction-item {
      padding: 4px 8px 4px 4px;
      border-radius: 35px;
      border: 1px solid var(--color-border);
      line-height: 1.2;
      color: var(--dex-color-4);
      margin-right: 12px;
      margin-bottom: 12px;
      flex-wrap: wrap;
      :hover {
        cursor: pointer;
      }
    }
    .coin-icon {
      margin-right: 4px;
    }
  }
  .search-content {
    padding-top: 12px;
    padding-bottom: 12px;
    .search-result {
      padding-right: 6px;
      height: 400px;
    }
    .search-result-item {
      margin-top: 4px;
      padding: 8px 4px;
      border-radius: 8px;
      cursor: pointer;
      .chain-name,
      .chain-price {
        color: var(--font-color-default);
      }
      .chain-price {
        text-align: right;
      }
      .chain-name span:last-child {
        color: var(--dex-color-4);
        text-decoration: underline;
      }
      .chain-price span:last-child {
        color: var(--dex-color-4);
      }
      i {
        font-style: normal;
        color: var(--dex-color-4);
      }
    }
    .icon {
      width: 28px;
      height: 28px;
      display: block;
      margin-right: 8px;
    }
  }
  .logo {
    position: relative;
    margin-right: 8px;
  }
  .logo,
  .logo-img {
    width: 32px;
    height: 32px;
  }
  .logo-img {
    border-radius: 50%;
  }
  .chainCode {
    width: 16px;
    height: 16px;
    position: absolute;
    right: -2px;
    bottom: -2px;
  }
  .txt {
    color: var(--font-color-default);
    line-height: 1.3;
  }
}
</style>
