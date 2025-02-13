<template>
  <div class="strategy">
    <div class="display-flex align-items-center justify-content-sp">
      <div class="display-flex align-items-center">
        <div
          v-for="(item, index) in strategyList"
          :key="index"
          @click="handelTab(item)"
          :class="strategyIndex == item.value ? 'active' : ''"
          class="display-flex align-items-center tab-content"
        >
          <svg-icon :name="item.icon" class="icon"></svg-icon>
          <span>{{ item.label }}</span>
        </div>

        <div class="display-flex align-items-center checkout-box">
          <span>推送渠道：</span>
          <el-checkbox-group v-model="checkedChannel" @change="handleCheckedChannel">
            <el-checkbox
              v-for="(item, index) in channels"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="display-flex align-items-center">
        <div style="width: 130px; margin-right: 12px">
          <el-select
            v-model="monitorChainCode"
            :teleported="false"
            placeholder="请选择网络"
            @change="handelChangeChainCode"
          >
            <template #prefix>
              <img
                :src="chainData.find((item: any) => item.chainCode == monitorChainCode)?.logo"
                alt=""
                class="icon-svg"
                v-if="chainData.find((item: any) => item.chainCode == monitorChainCode)?.logo"
              />
              <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
            </template>
            <el-option
              v-for="(item, index) in chainList"
              :key="index"
              :value="item.chainCode"
              :label="item.chainName"
            >
              <div class="display-flex align-items-center">
                <img v-if="item.logo" :src="item.logo" alt="" class="icon-svg" />
                <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
                <span class="span-txt">{{ item.chainName }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <WalletConnect v-if="!accountInfo">
          <div class="display-flex align-items-center add-btn">
            <el-icon size="14"><Plus /></el-icon>
            <span>创建监控</span>
          </div>
        </WalletConnect>
        <div class="display-flex align-items-center add-btn" @click="handelAdd(ruleFormRef)" v-else>
          <el-icon size="14"><Plus /></el-icon>
          <span>创建监控</span>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-skeleton style="width: 100%" :loading="skeleton" animated>
        <template #template>
          <el-skeleton-item
            variant="text"
            style="height: 30px; margin: 4.4px 0"
            v-for="item in 12"
            :key="item"
          />
        </template>
        <template #default>
          <el-table :data="tableData" style="width: 100%" max-height="100%">
            <el-table-column label="监控名称">
              <template #default="scope">
                <span>{{ typeList.find((item: any) => item.value == scope.row.type)?.label }}</span>
              </template>
            </el-table-column>
            <el-table-column label="监控币名称">
              <template #default="scope">
                <div class="display-flex align-items-center">
                  <div class="logo">
                    <el-image :src="scope.row.logo" alt="" class="coin-icon">
                      <template #error>
                        <svg-icon name="logo1" class="coin-icon"></svg-icon>
                      </template>
                    </el-image>
                    <img :src="chainLogoObj[scope.row.chainCode]" alt="" class="chainCode" />
                  </div>
                  <span>{{ scope.row.symbol }}</span>
                  <svg-icon name="copy" class="copy" v-copy="scope.row.baseAddress"></svg-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="目标价格">
              <template #default="scope">
                <span>${{ numberFormat(scope.row.targetPrice) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="通知频率">
              <template #default="scope">
                <span>{{
                  noticeTypeList.find((item: any) => item.value == scope.row.noticeType)?.label
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最近通知时间">
              <template #default="scope">
                <span>{{
                  scope.row.lastNoticeTime ? timeago(scope.row.lastNoticeTime) : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
              <template #default="scope">
                <span
                  class="monitor-btn"
                  @click="handelPlay(scope.row)"
                  v-if="scope.row.noticeType == 0"
                  >启动监控</span
                >
                <span class="monitor-btn" @click="handelPause(scope.row)" v-else>暂停监控</span>
                <span class="monitor-btn" @click="handelEdit(scope.row)">编辑</span>
                <span class="monitor-btn btn-del" @click.stop="handelDel(scope.row)">删除</span>
              </template>
            </el-table-column>
            <template #empty>
              <empty-data></empty-data>
            </template>
          </el-table>
        </template>
      </el-skeleton>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="创建监控" width="600">
    <div class="strategy-dialog-content">
      <div
        class="display-flex flex-direction-col strategy-dialog-content-item"
        @click="handelDialog"
      >
        <div class="display-flex align-items-center title-txt">
          <svg-icon name="icon-coin-monitor" class="icon"></svg-icon>
          <span>代币监控</span>
        </div>
        <p class="description-txt">
          设置代币到达指定价格时通过 网页、APP、TG机器人、邮件发送通知。
        </p>
      </div>
    </div>
  </el-dialog>

  <el-dialog v-model="dialogFormVisible" title="创建监控" width="600">
    <div class="strategy-dialog-content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :size="formSize"
        label-position="top"
        :hide-required-asterisk="true"
      >
        <el-form-item label="监控类型" prop="type">
          <el-select v-model="ruleForm.type" :teleported="false" @click="handelSelectType">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="display-flex align-items-center justify-content-sp">
          <el-form-item label="监控对象" style="width: 48%">
            <el-select v-model="ruleForm.coin" :teleported="false" disabled>
              <el-option label="代币" value="Single" />
            </el-select>
          </el-form-item>
          <el-form-item label="链" style="width: 48%">
            <el-select v-model="ruleForm.chainCode" :teleported="false">
              <template #prefix>
                <img
                  :src="chainData.find((item: any) => item.chainCode == ruleForm.chainCode)?.logo"
                  alt=""
                  class="icon-svg"
                />
              </template>
              <el-option
                v-for="(item, index) in chainData"
                :key="index"
                :value="item.chainCode"
                :label="item.chainName"
              >
                <div class="display-flex align-items-center">
                  <img v-if="item.logo" :src="item.logo" alt="" class="icon-svg" />
                  <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
                  <span class="span-txt">{{ item.chainName }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item prop="baseAddress" label="合约地址">
          <el-select
            v-model="ruleForm.baseAddress"
            :teleported="false"
            placeholder="请先输入代币合约地址"
            remote-show-suffix
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            filterable
            clearable
            :disabled="dialogType == 'edit'"
            @change="handelSelectBaseAddress"
          >
            <el-option v-for="item in options" :key="item.value" :value="item.value">
              <div class="display-flex align-items-center">
                <el-image :src="item.logo" alt="" class="icon-svg">
                  <template #error>
                    <svg-icon name="logo1" class="icon-svg"></svg-icon>
                  </template>
                </el-image>
                <span class="span-txt">{{ item.label }}</span>
                <span class="span-txt">{{ numberFormat(item.price) }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <div
          class="display-flex align-items-center justify-content-sp"
          v-if="ruleForm.type == 'price'"
          style="width: 100%"
        >
          <el-form-item label="当前价格" style="width: 48%" prop="startPrice">
            <div class="startPrice display-flex align-items-center">
              <el-image :src="ruleForm.logo" alt="" class="icon-svg" v-if="ruleForm.logo">
                <template #error>
                  <svg-icon name="logo1" class="icon-svg"></svg-icon>
                </template>
              </el-image>
              <span v-if="ruleForm.symbol" style="margin-left: 1px">{{ ruleForm.symbol }}</span>
              <span style="margin-left: 4px">$</span>
              <span style="margin-left: 2px" v-if="ruleForm.startPrice">{{
                numberFormat(ruleForm.startPrice)
              }}</span>
            </div>
          </el-form-item>
          <el-form-item label="目标价格" style="width: 48%" prop="targetPrice">
            <el-input v-model="ruleForm.targetPrice" placeholder="请输入目标价格">
              <template #prefix>$</template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="触发条件" prop="data" v-else-if="ruleForm.type == 'chg'">
          <el-input v-model="ruleForm.data" placeholder="请输入涨幅或跌幅百分比">
            <template #suffix>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="触发条件" prop="data" v-else>
          <el-input v-model="ruleForm.data" placeholder="请输入买单或卖单金额">
            <template #prefix>$</template>
          </el-input>
        </el-form-item>
        <el-form-item label="通知频率" prop="noticeType">
          <el-select v-model="ruleForm.noticeType" :teleported="false">
            <el-option
              v-for="item in noticeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="display-flex align-items-center justify-content-fd btn">
          <span class="delete" @click="deleteForm(ruleFormRef)">删除监控</span>
          <span class="submit" @click="submitForm(ruleFormRef)">保存监控</span>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import {
  APIgetTokenMata,
  APIupdateCommonSubscribe,
  APIlistUserTokenSubscribe,
  APIupdateUserSubscribeSetting,
  APIdeleteUserTokenSubscribe,
  APIpauseUserTokenSubscribe
} from '@/api'
import { timeago, numberFormat } from '@/utils'
import { useI18n } from 'vue-i18n'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'

// const data = {
//   baseAddress: '6LjccmR327LvnfbabH44xnKUBpDbErzMnbMovL8Kpump',
//   chainCode: 'SOLANA',
//   pairAddress: 'Drya4jMXfmGjh3LPg7JnkxAqiSpaPUDzyPWA85s7xhEg',
//   symbol: 'TRUMP',
//   price: '0.000447070755860641864914488145',
//   volume: '32.911237090021688249023105436791365885',
//   chg: '44.6531',
//   flag: 1
// }

// ElMessage({
//   type: data.flag == 0 ? 'success' : 'error',
//   dangerouslyUseHTMLString: true,
//   duration: 0,
//   customClass: 'socket-elMessage',
//   message: `
//   <div class="display-flex flex-direction-col">
//     <strong style="margin-bottom:8px;font-family:'PingFangSC-Heavy'">AI价格监控：${data.symbol}</strong>
//     <span style="color:#fff;font-size:12px">价格已到：${numberFormat(data.price)} 、交易额：${numberFormat(data.volume)}、方向：${data.flag == 0 ? '买入' : '卖出'}</span>
//   </div>
//   `,
//   showClose: true,
//   onClose: () => {
//     console.log()
//     if (window.location.href.indexOf(data.pairAddress) < 0) {
//       window.open(`/k/${data.pairAddress}?chainCode=${data.chainCode}&timeType=15m`)
//     }
//   }
// })

const i18n = useI18n()
const globalStore = useGlobalStore()
const { chainLogoObj, chainList } = globalStore
const chainData = chainList.filter((item: any) => item.chainType !== -1)
const accountInfo = computed(() => globalStore.accountInfo)

const channels = [
  { value: 'app', label: 'APP' },
  {
    value: 'web',
    label: '网页'
  },
  {
    value: 'telegram',
    label: 'Telegram'
  }
]

const checkedChannel = ref<any>(accountInfo.value?.subscribeSetting || [])
const handleCheckedChannel = async (val: any) => {
  console.log(val)
  await APIupdateUserSubscribeSetting({
    channels: val
  })

  const obj = Object.assign({}, accountInfo.value, {
    subscribeSetting: val
  })
  localStorage.setItem('accountInfo', JSON.stringify(obj))
  globalStore.setAccountInfo(obj)

  ElMessage.success(`渠道设置成功`)
}

const strategyList = [
  {
    label: '监控列表',
    value: 1,
    icon: 'icon-coin-strategy'
  }
]

const strategyIndex = ref(1)

const handelTab = (item: any) => {
  strategyIndex.value = item.value
}

const monitorChainCode = ref<string>('DEX')
const dialogVisible = ref<boolean>(false)
const dialogFormVisible = ref<boolean>(false)

const handelDialog = () => {
  dialogVisible.value = false
  dialogFormVisible.value = true
}

const typeList = [
  {
    value: 'price',
    label: '价格监控'
  },
  {
    value: 'chg',
    label: '涨跌幅监控'
  },
  {
    value: 'buy',
    label: '大单买入监控'
  },
  {
    value: 'sell',
    label: '大单卖出监控'
  }
]

const noticeTypeList = [
  {
    value: 1,
    label: '仅一次'
  },
  {
    value: 2,
    label: '一日一次'
  },
  {
    value: 3,
    label: '每次'
  },
  {
    value: 0,
    label: '暂停监控'
  }
]

const statusList = [
  {
    value: 1,
    label: '存在'
  },
  {
    value: 0,
    label: '删除'
  }
]

const dialogType = ref<string>('add')
const ruleFormRef = ref<FormInstance>()
const formSize = ref<ComponentSize>('large')
const ruleForm = reactive<any>({
  type: 'price',
  coin: 'Single',
  chainCode: 'SOLANA',
  baseAddress: '',
  symbol: '',
  data: '',
  noticeType: 1,
  startPrice: '',
  targetPrice: '',
  status: 1,
  logo: ''
})

const rules = reactive<FormRules<any>>({
  type: [
    {
      required: true,
      message: '请选择监控类型',
      trigger: ['blur', 'change']
    }
  ],
  baseAddress: [
    {
      required: true,
      message: '请先输入代币合约地址',
      trigger: ['blur', 'change']
    }
  ],
  data: [
    {
      required: true,
      message: ruleForm.type == 'chg' ? '请输入涨幅或跌幅百分比' : '请输入买单或卖单金额',
      trigger: ['blur', 'change']
    }
  ],
  startPrice: [
    {
      required: true,
      message: '请输入当前价格',
      trigger: ['blur', 'change']
    }
  ],
  targetPrice: [
    {
      required: true,
      message: '请输入目标价格',
      trigger: ['blur', 'change']
    }
  ]
})

const options = ref<any>([])
const loading = ref(false)

const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    const res: any = await APIgetTokenMata({
      baseAddress: query,
      chainCode: ruleForm.chainCode
    })
    const arr: any = res ? [{ ...res }] : []
    options.value = arr.map((item: any) => {
      return {
        ...item,
        label: item.symbol,
        value: item.address
      }
    })
    loading.value = false
  } else {
    options.value = []
  }
}

const handelAdd = (formEl: FormInstance | undefined) => {
  dialogType.value = 'add'
  dialogVisible.value = true
  ruleForm.logo = ''
  ruleForm.symbol = ''
  ruleForm.baseAddress = ''
  ruleForm.data = ''
  ruleForm.startPrice = ''
  ruleForm.targetPrice = ''

  if (!formEl) return
  formEl.resetFields()
}

const handelSelectBaseAddress = (val: any) => {
  ruleForm.symbol = options.value.find((item: any) => item.address == val).symbol
  ruleForm.startPrice = options.value.find((item: any) => item.address == val).price
  ruleForm.logo = options.value.find((item: any) => item.address == val).logo
}

const handelSelectType = () => {
  if (ruleForm.type == 'price') {
    ruleForm.data = ''
  } else {
    ruleForm.targetPrice = ''
    ruleForm.startPrice = ''
  }
}

const deleteForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      ruleForm.status = 0
      console.log(ruleForm)
      await APIupdateCommonSubscribe({
        ...ruleForm
      })
      getTableData()
      ElMessage.success(`${typeList.find((item) => item.value == ruleForm.type)?.label}删除成功`)
      dialogFormVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(ruleForm)
      await APIupdateCommonSubscribe({
        ...ruleForm
      })
      getTableData()
      ElMessage.success(`${typeList.find((item) => item.value == ruleForm.type)?.label}创建成功`)
      dialogFormVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

const tableData = ref<any>([])
const skeleton = ref(false)

const getTableData = async () => {
  const res = await APIlistUserTokenSubscribe({
    chainCode: monitorChainCode.value == 'DEX' ? '' : monitorChainCode.value
  })
  tableData.value = res || []
}

const handelEdit = (row: any) => {
  dialogType.value = 'edit'
  for (const key in ruleForm) {
    if (Object.prototype.hasOwnProperty.call(ruleForm, key)) {
      ruleForm[key] = row[key]
    }
  }
  ruleForm.coin = 'Single'
  dialogFormVisible.value = true
}

const handelDel = async (row: any) => {
  ElMessageBox.confirm('确定要删除此条监控', i18n.t('Tips'), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    type: 'info'
  })
    .then(async () => {
      const params = row
      const res = await APIdeleteUserTokenSubscribe({
        chainCode: params.chainCode,
        baseAddress: params.baseAddress,
        type: params.type
      })
      if (res) {
        getTableData()
        ElMessage.success(`${typeList.find((item) => item.value == params.type)?.label}删除成功`)
      }
    })
    .catch(() => {})
}

const handelPause = async (row: any) => {
  const params = row
  const res = await APIpauseUserTokenSubscribe({
    chainCode: params.chainCode,
    baseAddress: params.baseAddress,
    type: params.type
  })
  if (res) {
    getTableData()
    ElMessage.success(`${typeList.find((item) => item.value == params.type)?.label}已暂停`)
  }
}

const handelPlay = async (row: any) => {
  const params = row
  params.noticeType = 3
  await APIupdateCommonSubscribe({
    ...params
  })
  getTableData()
  ElMessage.success(`${typeList.find((item) => item.value == params.type)?.label}已启动`)
}

const handelChangeChainCode = () => {
  initData()
}

const initData = async () => {
  if (accountInfo.value) {
    skeleton.value = true
    await getTableData()
    skeleton.value = false
  }
}
onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.strategy {
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(23, 24, 27, 0.3);
  height: 100%;
  .checkout-box {
    margin-left: 12px;

    :deep(.el-checkbox) {
      margin-right: 15px;
    }
    :deep(.el-checkbox__label) {
      font-size: 12px;
    }
    :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: var(--font-color-default);
    }
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: var(--font-color-default);
      border-color: var(--font-color-default);
    }
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
      border-color: var(--bg-color);
    }
  }
  .tab-content {
    padding: 7px 12px;
    font-size: 12px;
    font-family: 'PingFangSC-Medium';
    color: #5c6068;
    background: rgba(33, 33, 33, 0.3);
    border-radius: 4px;
    cursor: pointer;
    .icon {
      width: 14px;
      height: 14px;
      margin-right: 6px;
    }
  }
  .active {
    color: #f5f5f5;
    background-color: rgba(58, 60, 64, 0.4);
  }

  .add-btn {
    padding: 7px 12px;
    font-size: 12px;
    border-radius: 4px;
    font-family: 'PingFangSC-Medium';
    background-color: #f5f5f5;
    color: #5c6068;
    cursor: pointer;
    span {
      margin-left: 6px;
    }
  }
  .connect-wallet-btn {
    min-width: 0;
    padding: 0;
  }
  .table-box {
    margin-top: 12px;
    height: calc(100% - 40px);
    .copy {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
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

    .monitor-btn {
      display: inline-block;
      line-height: 1.2;
      padding: 4px 12px;
      border-radius: 16px;
      border: 1px solid #222;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      margin-right: 8px;
      transition: all 0.2s;
      color: #848e9c;
      transition: all 0.2s;
    }
    .monitor-btn:hover {
      color: #f5f5f5;
    }
    .btn-del {
      background: rgba(246, 70, 93, 0.1);
      color: var(--down-color);
    }
    .btn-del:hover {
      color: red;
    }
  }
  :deep(.el-popper) {
    .el-select-dropdown__item {
      color: var(--dex-color-4);
    }
    .el-select-dropdown__item.is-selected {
      color: var(--font-color-default);
    }
  }
}
.strategy-dialog-content {
  .strategy-dialog-content-item {
    border: 1px solid rgb(92, 96, 104);
    padding: 12px;
    border-radius: 12px;
    transition: all 0.2s;
    cursor: pointer;
    margin-bottom: 12px;
    .title-txt {
      color: #cfd3dc;
    }
    .icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      color: #cfd3dc;
    }
    .description-txt {
      font-size: 12px;
      margin-top: 8px;
      color: var(--dex-color-4);
    }
  }
  .strategy-dialog-content-item:hover {
    border: 1px solid #f5f5f5;
    .title-txt,
    .icon {
      color: #f5f5f5;
    }
  }
  :deep(.el-popper) {
    .el-select-dropdown__item {
      color: var(--dex-color-4);
    }
    .el-select-dropdown__item.is-selected {
      color: var(--font-color-default);
    }
  }
  :deep(.el-input__prefix-inner) {
    margin-right: 4px;
  }
  :deep(.el-select__wrapper.is-disabled) {
    background-color: transparent;
  }
  .startPrice {
    width: 100%;
    cursor: not-allowed;
    padding: 0px 15px;
    border: 1px solid #212121;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .startPrice:hover {
    border: 1px solid var(--dex-color-4);
  }
  .btn {
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 12px;
      height: 36px;
      min-width: 94px;
      padding: 6px 16px;
      border-radius: 10px;
      cursor: pointer;
      background-color: rgba(58, 60, 64, 0.4);
      color: #5c6068;
    }
    .submit {
      color: #000;
      background-color: #f5f5f5;
    }
    .delete {
      background-color: transparent;
      border: 1px solid var(--down-color);
      color: var(--down-color);
    }
  }
}

.icon-svg {
  width: 20px;
  height: 20px;
  display: block;
}
.span-txt {
  margin-left: 6px;
}
</style>
