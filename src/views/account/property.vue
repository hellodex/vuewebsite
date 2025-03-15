<template>
  <el-scrollbar>
    <div class="property">
      <h1>我的资产</h1>
      <div class="card-box property-user display-flex align-items-center">
        <img src="../../assets/img/0xSun.png" alt="" />
        <div class="nickname-box display-flex flex-direction-col justify-content-sp">
          <div class="display-flex align-items-center">
            <span class="nickname">{{ accountInfo?.nickname }}</span>
            <!-- <el-icon :size="18" class="edit-icon"><EditPen /></el-icon> -->
          </div>
          <div class="display-flex align-items-center">
            <div class="price-box display-flex align-items-center">
              <strong class="price" v-if="!sensitive">${{ numberFormat(total) }}</strong>
              <strong class="price" v-if="sensitive">****</strong>
              <svg-icon
                name="icon-eye"
                class="icon-price"
                @click="sensitive = true"
                v-if="!sensitive"
              ></svg-icon>
              <svg-icon
                name="icon-chose-eye"
                class="icon-price icon-chose-eye"
                @click="sensitive = false"
                v-if="sensitive"
              ></svg-icon>
            </div>
            <div class="display-flex align-items-center">
              <span class="wallet-to-out" @click="handelTransfeIn(null, customWalletInfo)"
                >转入</span
              >
              <span
                class="wallet-to-out"
                @click="
                  handelTransfeOut({
                    symbol: customWalletInfo.symbol,
                    wallet: customWalletInfo.walletInfo?.wallet,
                    walletId: customWalletInfo.walletInfo?.walletId,
                    walletKey: customWalletInfo.walletInfo?.walletKey,
                    decimals: customWalletInfo.decimals
                  })
                "
                >转出</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="card-box">
        <div class="display-flex align-items-center" style="margin-bottom: 16px">
          <svg-icon name="icon-price" class="icon-price"></svg-icon>
          <span class="wallet-name">持有代币</span>
        </div>
        <el-skeleton style="width: 100%" :loading="propertySkeleton" animated>
          <template #template>
            <el-skeleton-item
              variant="text"
              style="height: 30px; margin: 4.4px 0"
              v-for="item in 8"
              :key="item"
            />
          </template>
          <template #default>
            <el-table
              :data="propertyData"
              style="width: 100%"
              max-height="350px"
              @row-click="handelTableRow"
            >
              <el-table-column label="币种">
                <template #default="scope">
                  <div class="display-flex align-items-center coin-box">
                    <span class="logo">
                      <el-image :src="scope.row.logo" alt="" class="coin-icon">
                        <template #error>
                          <svg-icon name="logo1" class="coin-icon"></svg-icon>
                        </template>
                      </el-image>
                      <img :src="chainLogoObj[scope.row.chainCode]" alt="" class="chainCode" />
                    </span>
                    <p class="display-flex align-items-center">
                      <span class="base-symbol">{{ scope.row.symbol || '-' }}</span>
                    </p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="余额" width="150">
                <template #default="scope">
                  <span class="text-color">{{
                    numberFormat(decimalsFormat(scope.row.amount, scope.row.decimals)) || '-'
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="价格" width="150">
                <template #default="scope">
                  <span class="text-color">${{ numberFormat(scope.row.price) || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="总金额" width="150">
                <template #default="scope">
                  <span class="text-color">${{ numberFormat(scope.row.totalAmount) || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="24h涨跌幅" align="right" width="150">
                <template #default="scope">
                  <PercentageNotbg :value="scope.row.chg1d || 0" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="right" width="240">
                <template #default="scope">
                  <div class="display-flex align-items-center justify-content-fd">
                    <span
                      class="wallet-to-out"
                      @click.stop="handelTransfeIn(scope.row, customWalletInfo)"
                      >转入</span
                    >
                    <span
                      class="wallet-to-out"
                      @click.stop="
                        handelTransfeOut({
                          symbol: scope.row.symbol,
                          wallet: scope.row.address,
                          walletId: customWalletInfo.walletInfo?.walletId,
                          walletKey: customWalletInfo.walletInfo?.walletKey,
                          decimals: scope.row.decimals
                        })
                      "
                      >转出</span
                    >
                  </div>
                </template>
              </el-table-column>
              <template #empty>
                <empty-data></empty-data>
              </template>
            </el-table>
          </template>
        </el-skeleton>
      </div>
      <div class="card-box">
        <div class="entrustTab display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <span
              v-for="(item, index) in entrustTabList"
              :key="index"
              :class="entrustTabIdex == item.value ? 'active' : ''"
              @click="handelEntrustTab(item)"
              >{{ item.label }}</span
            >
          </div>
          <div class="data-items display-flex align-items-center" v-if="entrustTabIdex == 1">
            <span style="margin-right: 4px">隐藏小金额</span>
            <el-switch
              v-model="hidePosition"
              @change="handelHidePosition"
              size="small"
              :active-value="1"
              :inactive-value="0"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #26282c"
            />
          </div>
        </div>

        <template v-if="entrustTabIdex == 1">
          <MyHold :list="initLimitedOrders.positions" :skeleton="skeleton" />
        </template>
        <template v-if="entrustTabIdex == 2">
          <CurrentCommission :list="initLimitedOrders.openingOrders" :skeleton="skeleton" />
        </template>
        <template v-if="entrustTabIdex == 3">
          <TransactionHistory :list="initLimitedOrders.orders" :skeleton="skeleton" />
        </template>
        <template v-if="entrustTabIdex == 4">
          <CommissionHistory :list="initLimitedOrders.historyOrders" :skeleton="skeleton" />
        </template>
      </div>
    </div>
  </el-scrollbar>
  <el-dialog v-model="transfeInVisible" title="转入" width="450" align-center>
    <div class="display-flex flex-direction-col">
      <p class="network-text">选择网络</p>
      <div class="network-box display-flex align-items-center">
        <img :src="transfeInInfo.logo" alt="" class="icon-logo" v-if="transfeInInfo.logo" />
        <span>{{ transfeInInfo.symbol || transfeInInfo.chain }}</span>
      </div>
    </div>
    <div class="qrcode-box display-flex flex-direction-col">
      <p>
        仅接收
        {{
          transfeInInfo.symbol ? transfeInInfo.symbol + ' 代币' : transfeInInfo.chain + ' 网络资产'
        }}
      </p>
      <div class="qrcode">
        <img :src="transfeInInfo.qrcodeUrl" alt="" class="qrcode-img" />
      </div>
      <span
        >{{ transfeInInfo.wallet
        }}<svg-icon name="copy" class="copy" v-copy="transfeInInfo.wallet"></svg-icon
      ></span>
    </div>
    <template #footer>
      <div class="footer-btn" @click="transfeInCoinVisible = true">
        <span>分享地址</span>
        <el-icon><Share /></el-icon>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="transfeOutVisible" title="转出" width="500" align-center>
    <el-form
      ref="ruleFormRef"
      label-position="top"
      :model="ruleForm"
      :rules="rules"
      size="large"
      class="form-box"
    >
      <p class="network-text">转出币种</p>
      <div class="network-box display-flex align-items-center" style="margin-bottom: 22px">
        <img :src="customWalletInfo.logo" alt="" class="icon-logo" v-if="customWalletInfo.logo" />
        <span>{{ transfeOutInfo.symbol || customWalletInfo.chain }}</span>
      </div>
      <el-form-item label="转出地址" prop="to">
        <el-input v-model="ruleForm.to" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="转出数量" prop="amount">
        <el-input
          oninput="value=value.replace(/[^0-9.]/g,'')"
          v-model="ruleForm.amount"
          placeholder="请输入转出数量"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer-btn" @click="!loading ? handelSubmitForm(ruleFormRef) : null">
        确认转出
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="transfeInCoinVisible" title="" width="450" align-center>
    <div class="transfeInCoin-box" ref="transfeInCoinImg">
      <div class="transfeInCoin-qrcode">
        <h5>充币</h5>
        <img :src="transfeInInfo.qrcodeUrl" alt="" class="qrcode-img" />
      </div>
      <div class="display-flex flex-direction-col">
        <p>网络</p>
        <div class="display-flex align-items-center">
          <img :src="transfeInInfo.logo" alt="" class="icon-logo" v-if="transfeInInfo.logo" />
          <span>{{ transfeInInfo.chain }}</span>
        </div>
        <p>地址</p>
        <span>{{ transfeInInfo.wallet }}</span>
      </div>
    </div>
    <template #footer>
      <div class="download-btn display-flex align-items-center" @click="handelDownload">
        <el-icon :size="16"><Download /></el-icon>
        <span>&nbsp;&nbsp;下载</span>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted, onUnmounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import BigNumber from 'bignumber.js'
import { useGlobalStore } from '@/stores/global'
import { numberFormat, isAllSpaces } from '@/utils'
import {
  decimalsFormat,
  getTokenList,
  evmTransactionReceipt,
  solanaTransactionReceipt,
  isEvmAddress,
  isSolanaAddress
} from '@/utils/transition'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'

import { APItransferTo } from '@/api'
import { useI18n } from 'vue-i18n'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { initLimitedOrderPage } from '@/api/coinWalletDetails'

import TransactionHistory from '@/components/Charts/TransactionHistory.vue'
import MyHold from '@/components/Charts/MyHold.vue'
import CurrentCommission from '@/components/Charts/CurrentCommission.vue'
import CommissionHistory from '@/components/Charts/CommissionHistory.vue'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'

const i18n = useI18n()
const chain = useChainConfigsStore()

const sensitive = ref<boolean>(false)

const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore
const chainConfigs = computed(() => chain.chainConfigs)
const accountInfo = computed(() => globalStore.accountInfo)
const customWalletInfo = computed(() => globalStore.customWalletInfo)

const timer = ref<any>(null)

const transfeInInfo = ref<any>({})
const transfeInVisible = ref<boolean>(false)
const transfeInCoinVisible = ref<boolean>(false)
const transfeInCoinImg = ref()

const transfeOutVisible = ref<boolean>(false)
const transfeOutInfo = ref<any>({})

const skeleton = ref<boolean>(false)
const initLimitedOrders = ref<any>({})
const total = ref<number>(0)

const hidePosition = ref(Number(localStorage.getItem('hidePosition')))

interface RuleForm {
  to: string
  amount: string
}

const loading = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  to: '',
  amount: ''
})

const validateAddress = (rule: any, value: any, callback: any) => {
  if (isAllSpaces(value)) {
    callback(new Error('请输入地址'))
  } else if (customWalletInfo.value.chainCode == 'SOLANA' && !isSolanaAddress(value)) {
    callback(new Error(`请输入 ${customWalletInfo.value.chainCode} 合约地址`))
  } else if (customWalletInfo.value.chainCode != 'SOLANA' && !isEvmAddress(value)) {
    callback(new Error(`请输入 ${customWalletInfo.value.chainCode} 合约地址`))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<RuleForm>>({
  to: [
    {
      required: true,
      validator: validateAddress,
      trigger: 'blur'
    }
  ],
  amount: [
    {
      required: true,
      message: '请输入转出数量',
      trigger: 'blur'
    }
  ]
})

const propertySkeleton = ref<boolean>(false)
const propertyData = ref<any>([])
const getProperty = async (chainCode: any, walletAddress: any) => {
  const res = await getTokenList(chainCode, walletAddress)
  console.log(res)
  total.value = 0
  propertyData.value = res || []
  propertyData.value.forEach((item: any) => {
    total.value += parseFloat(item.totalAmount)
  })
  propertySkeleton.value = false
}

watch(customWalletInfo, (newValue) => {
  clearInterval(timer.value)
  propertySkeleton.value = true
  skeleton.value = true
  getProperty(newValue.chainCode, newValue.walletInfo.wallet)
  getData()
  restart()
})

const handelTransfeIn = async (row: any, info: any) => {
  transfeInInfo.value.symbol = row?.symbol
  transfeInInfo.value.logo = info.logo
  transfeInInfo.value.chain = info.chain
  transfeInInfo.value.wallet = info.walletInfo?.wallet
  try {
    transfeInInfo.value.qrcodeUrl = await QRCode.toDataURL(info.walletInfo?.wallet, {
      errorCorrectionLevel: 'H'
    })
    transfeInVisible.value = true
  } catch (err) {
    console.error(err)
  }
}

const handelDownload = async () => {
  await html2canvas(transfeInCoinImg.value, {
    backgroundColor: '#111'
  }).then((canvas) => {
    let url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'transfeIn.png'
    a.click()
  })
}

const handelTransfeOut = (param: any) => {
  resetForm(ruleFormRef.value)
  transfeOutVisible.value = true
  transfeOutInfo.value = {
    symbol: param?.symbol,
    token: param.wallet,
    walletId: param.walletId,
    walletKey: param.walletKey,
    decimals: param.decimals
  }
}

const handelSubmitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      notificationInfo({
        title: `${transfeOutInfo.value.symbol}：转出处理中`,
        message: `<div class="display-flex align-items-center">
                    <p class="notification_loader"></p>
                    <span>转出处理中</span>
                  </div>
                  <div class='notification-step-line-down'></div>
                  `
      })
      const chainConfig = chainConfigs.value.find(
        (item: any) => item.chainCode == customWalletInfo.value.chainCode
      )
      const num = 10 ** Number(transfeOutInfo.value.decimals)
      const spendAmount = new BigNumber(ruleForm.amount)
        .times(num)
        .integerValue(BigNumber.ROUND_DOWN)
      console.log('submit!')
      const res: any = await APItransferTo({
        to: ruleForm.to,
        amount: spendAmount,
        ...transfeOutInfo.value
      })
      transfeOutVisible.value = false
      loading.value = false
      if (res) {
        const result =
          customWalletInfo.value.chainCode == 'SOLANA'
            ? await solanaTransactionReceipt(res.tx, chainConfig.rpc)
            : await evmTransactionReceipt(res.tx, chainConfig.rpc)
        if (result === true) {
          notificationSuccessful({
            title: `${transfeOutInfo.value.symbol}：转出成功`,
            message: `${i18n.t('TransactionSuccessful')}`
          })
        } else if (result === false) {
          notificationFailed({
            title: `${transfeOutInfo.value.symbol}：转出失败`,
            message: `${i18n.t('TransactionFailed')}`
          })
        } else {
          notificationWarn({
            title: `${transfeOutInfo.value.symbol}`,
            message: `${result}`
          })
        }
      } else {
        notificationFailed({
          title: `${transfeOutInfo.value.symbol}：转出失败`,
          message: `${i18n.t('TransactionFailed')}`
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const entrustTabList = [
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

const entrustTabIdex = ref<number>(1)

const handelEntrustTab = (item: any) => {
  entrustTabIdex.value = item.value
}

const getData = async () => {
  const res = await initLimitedOrderPage({
    walletId: parseFloat(customWalletInfo.value.walletInfo?.walletId),
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    hidePosition: hidePosition.value
  })

  if (res) {
    initLimitedOrders.value = res
  }
  skeleton.value = false
}

const restart = () => {
  timer.value = setInterval(async () => {
    getProperty(customWalletInfo.value.chainCode, customWalletInfo.value.walletInfo?.wallet)
    getData()
  }, 5000)
}

const handelTableRow = (row: any) => {
  window.open(`/k/${row.pairAddress}?chainCode=${row.chainCode}`)
}

const handelHidePosition = (val: string) => {
  localStorage.setItem('hidePosition', val)
  getData()
}

onMounted(() => {
  propertySkeleton.value = true
  skeleton.value = true
  getProperty(customWalletInfo.value.chainCode, customWalletInfo.value.walletInfo?.wallet)
  getData()
  restart()
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
<style scoped lang="scss">
.property {
  h1 {
    font-size: 28px;
    padding: 12px;
  }
  .card-box {
    padding: 12px;
    border-radius: 12px;
    background-color: rgba(23, 24, 27, 0.3);
    margin-bottom: 16px;
  }
  .coin-box {
    .logo {
      width: 32px;
      height: 32px;
      position: relative;
      margin-right: 10px;
    }
    .coin-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .chainCode {
      width: 14px;
      height: 14px;
      position: absolute;
      right: -1px;
      bottom: 0px;
    }
    .base-symbol {
      color: var(--font-color-default);
    }
  }
  .property-user {
    img {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .nickname {
      font-size: 18px;
      margin-right: 5px;
    }
    .edit-icon {
      cursor: pointer;
    }
    strong {
      font-size: 13px;
      font-weight: normal;
    }
  }
  .icon-price {
    width: 25px;
    height: 24px;
    color: #fff;
    cursor: pointer;
  }
  .icon-chose-eye {
    position: relative;
    top: -5px;
  }
  .wallet-name {
    font-size: 14px;
    margin-left: 3px;
  }
  .price-box {
    margin-right: 12px;
    .price {
      font-size: 30px;
      margin-right: 8px;
    }
  }
  .price-rate {
    color: #00c278;
    font-size: 14px;
  }
  .wallet-to-out {
    display: block;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    background: #1e1e1e;
    margin-left: 8px;
    line-height: 32px;
    border-radius: 16px;
    cursor: pointer;
    color: var(--dex-color-4);
    transition: all 0.2s;
  }
  .wallet-to-out:hover {
    background-color: #333;
  }
  .entrustTab {
    margin-bottom: 16px;
    span {
      color: var(--dex-color-4);
      font-size: 14px;
      margin-right: 16px;
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }

    span.active {
      border-bottom: 2px solid var(--font-color-default);
      color: var(--font-color-default);
    }
  }
  .subTab {
    display: inline-block;
    border-radius: 8px;
    background: var(--bg-color);
    padding: 4px;
    span {
      display: inline-block;
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 12px;
      background-color: transparent;
      color: var(--dex-color-4);
      cursor: pointer;
    }
    span.active {
      background-color: var(--tab-bg-color);
      color: var(--font-color-default);
    }
  }

  :deep(.el-table td.el-table__cell),
  :deep(.el-table th.el-table__cell.is-leaf) {
    border-bottom: none !important;
  }
}
.network-text {
  font-size: 14px;
  margin-bottom: 8px;
}
.network-box {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 8px 16px;
}
.icon-logo {
  width: 22px;
  height: 22px;
  margin-right: 8px;
}
.qrcode-box {
  align-items: center;
  font-size: 14px;
  margin-top: 16px;
  p {
    color: var(--dex-color-4);
  }
  span {
    display: block;
    width: 200px;
    color: var(--font-color-default);
  }
  .qrcode {
    border-radius: 16px;
    overflow: hidden;
    margin: 16px 0;
    .qrcode-img {
      width: 200px;
      height: 200px;
      display: block;
      border-radius: 16px;
    }
  }
  .copy {
    width: 18px;
    height: 18px;
    margin-left: 4px;
    position: relative;
    top: 3px;
    cursor: pointer;
  }
}
.transfeInCoin-box {
  width: 350px;
  padding: 16px;
  background-color: var(--bg-color);
  margin: 0 auto;
  font-size: 14px;
  border-radius: 8px;
  .transfeInCoin-qrcode {
    text-align: center;
    margin-bottom: 20px;
    h5 {
      font-size: 20px;
      margin-bottom: 26px;
    }
  }
  p {
    color: var(--dex-color-4);
    margin: 10px 0 6px 0;
  }
  span {
    color: var(--font-color-default);
  }
}

.text-color {
  color: var(--font-color-default);
}

.footer-btn,
.download-btn {
  width: 100%;
  padding: 12px 19px;
  background-color: var(--font-color-default);
  color: var(--bg-color);
  height: 40px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  line-height: 1;
  outline: none;
  text-align: center;
  transition: 0.1s;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  align-items: center;
}
</style>
