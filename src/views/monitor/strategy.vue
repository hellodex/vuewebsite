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
        <div class="display-flex align-items-center add-btn" @click="handelAdd" v-else>
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
            <el-table-column label="触发条件">
              <template #default="scope">
                <span v-if="scope.row.type == 'price'"
                  >${{ numberFormat(scope.row.targetPrice || 0) }}</span
                >
                <span v-if="scope.row.type == 'chg'">{{ parseFloat(scope.row.data) * 100 }}%</span>
                <span v-if="scope.row.type == 'buy'">${{ numberFormat(scope.row.data) }}</span>
                <span v-if="scope.row.type == 'sell'">${{ numberFormat(scope.row.data) }}</span>
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
    <el-dialog v-model="dialogVisible" title="创建监控" width="510">
      <div class="strategy-dialog-content">
        <div
          class="display-flex align-items-center justify-content-sp strategy-dialog-content-item"
          @click="handelDialog('price', ruleFormRef)"
        >
          <div class="display-flex align-items-center title-txt">
            <svg-icon name="price-monitor" class="price-monitor icon"></svg-icon>
            <div>
              <span>价格监控</span>
              <p class="description-txt">设置代币到达指定价格时通知。</p>
            </div>
          </div>
          <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
        </div>
        <div
          class="display-flex align-items-center justify-content-sp strategy-dialog-content-item"
          @click="handelDialog('chg', ruleFormRef)"
        >
          <div class="display-flex align-items-center title-txt">
            <svg-icon name="chg-monitor" class="chg-monitor icon"></svg-icon>
            <div>
              <span>涨跌幅监控</span>
              <p class="description-txt">设置代币到达指定涨跌幅知。</p>
            </div>
          </div>
          <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
        </div>
        <div
          class="display-flex align-items-center justify-content-sp strategy-dialog-content-item"
          @click="handelDialog('buy', ruleFormRef)"
        >
          <div class="display-flex align-items-center title-txt">
            <svg-icon name="buy-monitor" class="icon buy-monitor"></svg-icon>
            <div>
              <span>大单买入监控</span>
              <p class="description-txt">设置代币每笔买入交易额通知。</p>
            </div>
          </div>
          <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
        </div>
        <div
          class="display-flex align-items-center justify-content-sp strategy-dialog-content-item"
          @click="handelDialog('sell', ruleFormRef)"
        >
          <div class="display-flex align-items-center title-txt">
            <svg-icon name="sell-monitor" class="icon sell-monitor"></svg-icon>
            <div>
              <span>大单卖出监控</span>
              <p class="description-txt">设置代币每笔卖出交易额通知。</p>
            </div>
          </div>
          <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
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
            <el-select v-model="ruleForm.type" :teleported="false" disabled>
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
                  <span class="span-txt">{{ item.chg }}%</span>
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
                <span v-if="ruleForm.symbol" style="margin-left: 2px">{{ ruleForm.symbol }}</span>
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
          <el-form-item
            label="触发条件"
            prop="data"
            v-else-if="ruleForm.type == 'chg'"
            :rules="[
              {
                validator: validateChgData,
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input v-model="ruleForm.data" placeholder="设置当天涨跌幅">
              <template #suffix>%</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="触发条件"
            prop="data"
            :rules="[
              {
                validator: validateBuySellData,
                trigger: ['blur', 'change']
              }
            ]"
            v-else
          >
            <el-input v-model="ruleForm.data" placeholder="请输入每笔交易总金额">
              <template #prefix>$</template>
            </el-input>
          </el-form-item>
          <el-form-item label="通知频率" prop="noticeType" class="checkbox-notice">
            <el-checkbox-group v-model="ruleForm.noticeType" @change="handleChange">
              <el-checkbox
                v-for="item in noticeTypeList"
                :value="item.value"
                :label="item.label"
                :key="item.value"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>

          <div class="display-flex align-items-center justify-content-fd btn">
            <span class="delete" @click="deleteForm(ruleFormRef)">删除监控</span>
            <span class="submit" @click="submitForm(ruleFormRef)">保存监控</span>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import {
  APIgetTokenMata,
  APIupdateCommonSubscribe,
  APIlistUserTokenSubscribe,
  APIupdateUserSubscribeSetting,
  APIdeleteUserTokenSubscribe,
  APIpauseUserTokenSubscribe,
  APIresumeUserTokenSubscribe
} from '@/api'
import { timeago, numberFormat } from '@/utils'
import { useI18n } from 'vue-i18n'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import { customMessage } from '@/utils/message'

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

const checkedChannel = ref<any>([])
const handleCheckedChannel = async (val: any) => {
  console.log(val)
  await APIupdateUserSubscribeSetting({
    channels: val
  })

  getTableData()
  customMessage({
    type: 'success',
    title: `渠道设置成功`
  })
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

const validateTargetPrice = (rule: any, value: any, callback: any) => {
  if (/^[1-9]\d*(\.\d+)?$|^0\.\d+$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入目标价格'))
  }
}

const validateBuySellData = (rule: any, value: any, callback: any) => {
  if (/^[1-9]\d*(\.\d+)?$|^0\.\d+$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入每笔交易总金额'))
  }
}

const validateChgData = (rule: any, value: any, callback: any) => {
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    callback()
  } else {
    callback(new Error('设置当天涨跌幅'))
  }
}

const dialogType = ref<string>('add')
const ruleFormRef = ref<FormInstance>()
const formSize = ref<ComponentSize>('large')
const ruleForm = ref<any>({
  type: 'price',
  coin: 'Single',
  chainCode: 'SOLANA',
  baseAddress: '',
  symbol: '',
  data: '',
  noticeType: [1],
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
    },
    { validator: validateTargetPrice, trigger: ['blur', 'change'] }
  ]
})

const options = ref<any>([])
const loading = ref(false)

const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    const res: any = await APIgetTokenMata({
      baseAddress: query,
      chainCode: ruleForm.value.chainCode
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

const handelAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

const handelDialog = (type: string, formEl: FormInstance | undefined) => {
  dialogVisible.value = false
  dialogFormVisible.value = true
  ruleForm.value.type = type
  ruleForm.value.logo = ''
  ruleForm.value.symbol = ''
  ruleForm.value.baseAddress = ''
  ruleForm.value.data = ''
  ruleForm.value.startPrice = ''
  ruleForm.value.targetPrice = ''
  formEl?.resetFields()
}

const handelSelectBaseAddress = (val: any) => {
  ruleForm.value.symbol = options.value.find((item: any) => item.address == val)?.symbol || ''
  ruleForm.value.startPrice = options.value.find((item: any) => item.address == val)?.price || ''
  ruleForm.value.logo = options.value.find((item: any) => item.address == val)?.logo || ''
}

const handleChange = (value: any) => {
  // 只允许选择一个选项，因此每次选择后清除之前的选中项（如果有的话）
  if (value && value.length > 1) {
    ruleForm.value.noticeType = [value[value.length - 1]] // 只保留最后一个选中的值
  } else {
    ruleForm.value.noticeType = value // 更新为当前选中的值
  }
}

const deleteForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      ruleForm.value.status = 0
      console.log(ruleForm.value)
      await APIupdateCommonSubscribe({
        ...ruleForm.value,
        noticeType: ruleForm.value.noticeType.join()
      })
      getTableData()
      customMessage({
        type: 'success',
        title: `${typeList.find((item) => item.value == ruleForm.value.type)?.label}删除成功`
      })
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
      console.log(ruleForm.value)

      await APIupdateCommonSubscribe({
        ...ruleForm.value,
        data: ruleForm.value.type == 'chg' ? ruleForm.value.data / 100 : ruleForm.value.data,
        noticeType: ruleForm.value.noticeType.join()
      })
      getTableData()
      customMessage({
        type: 'success',
        title: `${typeList.find((item) => item.value == ruleForm.value.type)?.label}创建成功`
      })
      dialogFormVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

const tableData = ref<any>([])
const skeleton = ref(false)

const getTableData = async () => {
  const res: any = await APIlistUserTokenSubscribe({
    chainCode: monitorChainCode.value == 'DEX' ? '' : monitorChainCode.value
  })
  tableData.value = res?.subscribeList || []
  checkedChannel.value = res?.subscribeSetting || []
}

const handelEdit = (row: any) => {
  dialogType.value = 'edit'
  for (const key in ruleForm.value) {
    if (Object.prototype.hasOwnProperty.call(ruleForm.value, key)) {
      ruleForm.value[key] = row[key]
    }
  }
  if (ruleForm.value.type == 'chg') {
    ruleForm.value.data = ruleForm.value.data * 100
  }

  ruleForm.value.noticeType = [ruleForm.value.noticeType]
  ruleForm.value.coin = 'Single'
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
        customMessage({
          type: 'success',
          title: `${typeList.find((item) => item.value == params.type)?.label}删除成功`
        })
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
    customMessage({
      type: 'info',
      title: `${typeList.find((item) => item.value == params.type)?.label}已暂停！`
    })
  }
}

const handelPlay = async (row: any) => {
  const params = row

  const res = await APIresumeUserTokenSubscribe({
    chainCode: params.chainCode,
    baseAddress: params.baseAddress,
    type: params.type
  })
  if (res) {
    getTableData()
    customMessage({
      type: 'success',
      title: `${typeList.find((item) => item.value == params.type)?.label}已启动`
    })
  }
}

const handelChangeChainCode = () => {
  initData()
}

watch(accountInfo, (newValue) => {
  if (accountInfo.value) {
    getTableData()
  }
})

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
  }

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
    background-color: #2ebd85;
    border-color: #2ebd85;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
    border-color: var(--font-color-default);
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
      cursor: pointer;
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
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: rgba(37, 37, 37, 0.2);
    padding: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
    margin-bottom: 12px;
    .title-txt {
      color: #cfd3dc;
    }
    .icon {
      width: 25px;
      height: 25px;
      margin-right: 8px;
    }
    .price-monitor {
      color: #bf8c00;
    }
    .chg-monitor,
    .sell-monitor {
      color: var(--down-color);
    }
    .buy-monitor {
      color: var(--up-color);
    }

    .description-txt {
      font-size: 12px;
      margin-top: 4px;
      color: var(--dex-color-4);
    }
    .chevron-right {
      width: 24px;
      height: 24px;
      color: #666;
    }
  }
  /* 水波纹效果 */
  .strategy-dialog-content-item::after {
    content: '';
    position: absolute;
    background: rgba(37, 37, 37, 0.6);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 0;
    transform: translate(-50%, -50%); /* 居中 */
    transition:
      width 1s,
      height 1s; /* 平滑过渡 */
    pointer-events: none; /* 防止影响点击 */
  }

  .strategy-dialog-content-item:hover::after {
    opacity: 1;
    width: 500px; /* 宽度增加到原来的两倍 */
    height: 500px; /* 高度增加到原来的两倍 */
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
  border-radius: 50%;
}
.span-txt {
  margin-left: 6px;
}

/* 水波纹动画 */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
