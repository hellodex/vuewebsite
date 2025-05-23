<template>
  <el-dialog v-model="dialogVisible"  :before-close="handleClose"  width="600" v-loading="dialogLoading" element-loading-text="加载中..." element-loading-background="rgba(0, 0, 0, 0.7)" >

    <template #header>
      <div style="font-size: 13px; color: #ffffff; font-weight: bold;">
        {{ isUpdate ? '修改监控' : '创建监控' }}
      </div>
    </template>
    <div class="monitorForm-dialog-content">
      <el-form
        class="monitorForm-dialog-form"
        ref="ruleFormRef"
        v-loading="isLoading"
        :model="ruleForm"
        :rules="rules"
        :size="formSize"
        label-position="top"
        :hide-required-asterisk="true"
        :scroll-into-view-options="{behavior: 'smooth', block: 'center'}"
      >
        <el-form-item label="监控名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入自定义监控名，例如：只报买入卖出"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="监控类型" prop="watchType">
          <el-select v-model="ruleForm.watchType" :teleported="false" placeholder="请选择监控类型" @change="windowTypeChange" >
            <el-option label="钱包监控" value="0" />
            <el-option label="N时间内多钱包买入监控" value="1" />
            <el-option label="N时间内多钱包卖出监控" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择分组" prop="groupIds">
          <el-select v-model="ruleForm.groupIds" :teleported="false" multiple placeholder="请选择选择分组">
            <el-option
              v-for="item in walletGroups"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <el-checkbox :model-value="ruleForm.groupIds && ruleForm.groupIds.includes(item.id)" disabled></el-checkbox>
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <div class="el-form-item__label">触发条件</div>
        <template v-if="ruleForm.watchType == 0">
          <el-form-item class="trigger-condition-label"  label="操作类型" prop="actionType"  label-position="left" label-width="180px">
            <el-select v-model="ruleForm.actionType" :teleported="false" multiple placeholder="请选择操作类型">
              <el-option label="买入" :value="1" >
                <el-checkbox :model-value="ruleForm.actionType && ruleForm.actionType.includes(1)" disabled></el-checkbox>
                <span>买入</span>
              </el-option>
              <el-option label="卖出" :value="2" >
                <el-checkbox :model-value="ruleForm.actionType && ruleForm.actionType.includes(2)" disabled></el-checkbox> 
                <span>卖出</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="trigger-condition-label"  label="交易额大于" prop="type" label-position="left" label-width="180px">
            <el-input
              v-model="ruleForm.walletAmountThreshold"
              type="number"
              placeholder="请输入金额，单位：美元，可不填"
            >
            </el-input>
          </el-form-item>
        </template>
        <template v-if="ruleForm.watchType === '1'">
          <el-form-item class="trigger-condition-label"  label="N时间内多钱包买入" prop="actionType" label-position="left" label-width="180px">
            <div class="trigger-condition display-flex align-items-center">
              <el-select v-model="ruleForm.buyInWindow" style="flex: 1;"  :teleported="false">
                <el-option
                  v-for="item in timeTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="ruleForm.windowType"  style="flex: 1;"  :teleported="false" >
                <el-option label="钱包数" :value="1" />
                <el-option label="交易额" :value="2" />
              </el-select>

              <el-input v-if="ruleForm.windowType == 1" v-model="ruleForm.walletCountInWindow"  type="number" placeholder="钱包数" style="flex: 1.5;" ></el-input>
              <el-input v-else v-model="ruleForm.totalAmountInWindow"  type="number" placeholder="交易总额" style="flex: 1.5;" ></el-input>

            </div>
          </el-form-item>
          <el-form-item class="trigger-condition-label" label="每个钱包交易额大于" prop="type" label-position="left" label-width="180px">
            <el-input
              v-model="ruleForm.walletAmountThreshold"
              type="number"
              placeholder="请输入金额，单位：美元，可不填"
            >
            </el-input>
          </el-form-item>
        </template>
        <template v-if="ruleForm.watchType === '2'">
          <el-form-item  class="trigger-condition-label" label="N时间内多钱包卖出" prop="actionType" label-position="left" label-width="180px">
            <div class="trigger-condition display-flex align-items-center">
              <el-select v-model="ruleForm.sellInWindow" style="flex: 1;"  :teleported="false">
                <el-option
                  v-for="item in timeTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="ruleForm.windowType"  style="flex: 1;"  :teleported="false">
                <el-option label="钱包数" :value="1" />
                <el-option label="交易额" :value="2" />
              </el-select>

              <el-input v-if="ruleForm.windowType == 1" v-model="ruleForm.walletCountInWindow"  type="number" placeholder="钱包数" style="flex: 1.5;" ></el-input>
              <el-input v-else v-model="ruleForm.totalAmountInWindow"  type="number" placeholder="交易总额" style="flex: 1.5;" ></el-input>

            </div>
          </el-form-item>
          <el-form-item class="trigger-condition-label" label="每个钱包交易额大于" prop="type" label-position="left" label-width="180px">
            <el-input
              v-model="ruleForm.walletAmountThreshold"
              type="number"
              placeholder="请输入金额，单位：美元，可不填"
            >
            </el-input>
          </el-form-item>
        </template>
        <el-form-item class="trigger-condition-label" label="过滤非主动交易&空投" prop="type" label-position="left" label-width="180px">
          <el-select v-model="ruleForm.tradeType" :teleported="false">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item class="trigger-condition-label" label="忽略平台币" prop="type" label-position="left" label-width="180px">
          <el-select v-model="ruleForm.tokenType" :teleported="false"> 
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item class="trigger-condition-label" label="公链列表" prop="chainCode" label-position="left" label-width="180px">
          <el-select v-model="ruleForm.chainCode" :teleported="false" multiple placeholder="请选择公链列表">
            <el-option label="ETH" value="ETH">
              <el-checkbox :model-value="ruleForm.chainCode && ruleForm.chainCode.includes('ETH')" disabled></el-checkbox>
              <span>ETH</span>
            </el-option>
            <el-option label="Solana" value="Solana">
              <el-checkbox :model-value="ruleForm.chainCode && ruleForm.chainCode.includes('Solana')" disabled></el-checkbox>
              <span>Solana</span>
            </el-option>
            <el-option label="BSC" value="BSC">
              <el-checkbox :model-value="ruleForm.chainCode && ruleForm.chainCode.includes('BSC')" disabled></el-checkbox>
              <span>BSC</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="trigger-condition-label"  label="黑名单" prop="type" label-position="left" label-width="180px">
          <el-input
            v-model="ruleForm.blockedList"
            :rows="5"
            type="textarea"
            placeholder="填写Token地址，多个请换行，支持填写BNB、ETH等平台币，可不填"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="trigger-condition-label" label="市值大于" prop="type" label-position="left" label-width="180px">
          <el-input
            v-model="ruleForm.marketcapThreshold"
            type="number"

            placeholder="市值大于到多少进行通知，单位：美元，可不填"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="trigger-condition-label" label="市值小于" prop="type" label-position="left" label-width="180px">
          <el-input
            v-model="ruleForm.marketcapLimit"
            type="number"
            placeholder="市值小于到多少进行通知，单位：美元，可不填"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="trigger-condition-label" label="币种5分钟交易量大于" prop="type" label-position="left" label-width="180px">
          <el-input
            v-model="ruleForm.token5minTradeAmount"
            type="number"
            placeholder="请输入5分钟交易量大于多少警告，可不填"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="trigger-condition-label" label="币种1分钟交易量大于" prop="type" label-position="left" label-width="180px">
          <el-input
            v-model="ruleForm.token1minTradeAmount"
            type="number"
            placeholder="请输入1分钟交易量大于多少警告，可不填"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="trigger-condition-label" label="发射时间大于" prop="type" label-position="left" label-width="180px">
          <el-input
            v-model="ruleForm.launchTimeExceed"
            type="number"
            placeholder="请输入发射时间大于多少告警，可不填"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="trigger-condition-label" label="发射时间小于" prop="type" label-position="left" label-width="180px">
          <el-input
            v-model="ruleForm.launchTimeBelow"
            type="number"
            placeholder="请输入发射时间小于多少告警，可不填"
          >
          </el-input>
        </el-form-item>
        
        <el-form-item label="通知频率" prop="notificationType" class="checkbox-notice">
          <el-checkbox-group v-model="ruleForm.notificationType" @change="handleChange">
            <el-checkbox
              v-for="item in noticeTypeList"
              :value="String(item.value)"
              :label="item.label"
              :key="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>

        <div class="display-flex align-items-center justify-content-fd btn">
          <!-- <span class="delete">上一步</span> -->
          <span class="submit" @click="submitForm(ruleFormRef)" :class="{ 'disabled': submitting }" v-loading="submitting">
            {{ submitting ? '提交中...' : '提交' }}
          </span>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive,  onMounted,watch, nextTick } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { timeTypeList, noticeTypeList } from '@/types'
import { walletWatchGroupList, addWalletWatchStrategy,updateWalletWatchStrategy, getWalletWatchStrategy } from '@/api'
import { customMessage } from '@/utils/message'


const emit = defineEmits(['refresh', 'close'])

const props: any = defineProps({
  monitorObserveGroupDialogVisible: {
    type: [Boolean],
    default: false
  },
  info: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const isUpdate = ref(false)
const dialogVisible: any = computed({
  // getter
  get() {
    return props.monitorObserveGroupDialogVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})


const ruleFormRef = ref<FormInstance>()
const formSize = ref<ComponentSize>('large')
const ruleForm = ref<any>({
  name: '',
  type: 'group',
  watchType: '0',
  status:0,
  groupIds: [],
  actionType:[1,2],
  blockedList:'',
  whiteList:'',
  buyInWindow: 5,
  windowType: 1,
  sellInWindow: 5,
  walletCountInWindow:'',
  totalAmountInWindow:'',
  walletAmountThreshold:0,
  tradeType:'1',
  tokenType:'1',
  chainCode:['ETH'], 
  notificationType:['1'],
  marketcapThreshold:'',
  marketcapLimit:'',
  token5minTradeAmount:'',
  token1minTradeAmount:'',
  launchTimeExceed:'',
  launchTimeBelow:'',
})

const rules = reactive<FormRules<any>>({
  name: [
    {
      required: true,
      message: '请输入监控名称',
      trigger: ['blur']
    }
  ],
  groupIds: [
    {
      required: true,
      message: '请选择分组，可多选',
      trigger: ['blur', 'change']
    }
  ],
  actionType: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (ruleForm.value.watchType == 0 &&  value.length === 0) {
          callback(new Error('请选择操作类型'))
        }  else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ],
  chainCode: [
    {
      required: true,
      message: '请选择需要监控的公链列表',
      trigger: ['blur', 'change']
    }
  ],
  notificationType: [
    {
      validator: (rule: any, value: any, callback: any) => {
        console.log('value', value)

        if (!value || value.length === 0) {
          callback(new Error('请选择通知频率'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ],
})
const isLoading = ref(false)
const dialogLoading = ref(false)
const submitting = ref(false)

// 初始化
onMounted(() => {
  fetchWalletGroups()
  if(props.info.id){
    dialogLoading.value = true
    isLoading.value = true
    isUpdate.value = true
    fetchWalletData()
    
  }else{
    isUpdate.value = false
  }
})





const walletGroups = ref<any[]>([])
// 获取分组列表
const fetchWalletGroups = async () => {
  try {
    const data = await walletWatchGroupList({})
    walletGroups.value = Array.isArray(data) ? data : []

  } catch (error) {
    console.error('获取分组列表错误:', error)
  }
}

const fetchWalletData = async () => {
  try {
    const data = await getWalletWatchStrategy({id: props.info.id})
    ruleForm.value = {...data}
    ruleForm.value.groupIds = ruleForm.value.selectGroupList.map((e:any) => e.id)
    ruleForm.value.actionType = JSON.parse(ruleForm.value.actionType)
    ruleForm.value.chainCode =  JSON.parse(ruleForm.value.chainCode)
    ruleForm.value.notificationType = [ruleForm.value.notificationType]
    ruleForm.value.blockedList = JSON.parse(ruleForm.value.blockedList).join('\n')
    
    if(!ruleForm.value.windowType && ruleForm.value.walletCountInWindow){
      ruleForm.value.windowType = 1
    } else if(!ruleForm.value.windowType && ruleForm.value.totalAmountInWindow){
      ruleForm.value.windowType = 2
    }

  } catch (error) {
    console.error('获取监控详情出错:', error)
  } finally {
    isLoading.value = false
    dialogLoading.value = false
  }
}

const handleClose = () => {
  emit('close', false)
}

const windowTypeChange = () => {
  ruleForm.value.windowType = 1
  ruleForm.value.sellInWindow = 5
  ruleForm.value.buyInWindow = 5
  ruleForm.value.walletCountInWindow = ''
  ruleForm.value.totalAmountInWindow = ''
}



const handleChange = (value: any) => {
  // 只允许选择一个选项，因此每次选择后清除之前的选中项（如果有的话）
  if (value && value.length > 1) {
    ruleForm.value.notificationType = [value[value.length - 1]] // 只保留最后一个选中的值
  } else {
    ruleForm.value.notificationType = value // 更新为当前选中的值
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl || submitting.value) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        submitting.value = true
        /*
  'name': '', // 策略名称
  'watchType': '', // 监控类型：0=钱包监控，1=N时间内多钱包买入监控，2=N时间内多钱包卖出监控
  'status': '', // 状态：0=正常监控，1=暂停
  'groupIds': '', // 监控的钱包组 ID，JSON 格式，可多个
  'actionType': '', // 钱包操作类型，JSON字符串格式，watch_type=0 时生效， 1买入，2卖出可多选
  'blockedList': '', // 黑名单，JSON字符串格式，watch_type=0 时生效
  'whiteList': '', // 白名单，JSON字符串格式，watch_type=0 时生效
  'buyInWindow': '', // N时间内多钱包买入，分钟数，例如 5 表示 5 分钟，watch_type!=0 时生效
  'sellInWindow': '', // N时间内多钱包卖出，分钟数，例如 5 表示 5 分钟，watch_type!=0 时生效
  'walletCountInWindow': '', // N时间内多钱包买入/卖出钱包数量，watch_type!=0 时生效
  'totalAmountInWindow': '', // N时间内多钱包成交额，数量和成交额任一非0唯一生效，watch_type!=0 时生效
  'walletAmountThreshold': '', // 每个钱包交易额大于，字符串格式
  'tradeType': '', // 交易类型：0=不区分全部交易额，1=过滤非主动交易/空投的代币
  'tokenType': '', // 代币类型：0=不区分代币，1=忽略平台币/公链主网币
  'chainCode': '', // 监控的链列表，JSON字符串格式
  'notificationType': '', // 通知频率类型，传递1
  'marketcapThreshold': '', // 市值大于
  'marketcapLimit': '', // 市值小于
  'token5minTradeAmount': '', // 代币5分钟交易额
  'token1minTradeAmount': '', // 代币1分钟交易额
  'launchTimeExceed': '', // 开盘时间大于，单位：分钟
  'launchTimeBelow': '', // 开盘时间小于，单位：分钟
       */
        const params = { ...ruleForm.value}
        if(params.windowType == 1){
          params.totalAmountInWindow = null
        } else {
           params.walletCountInWindow = null
        }
        params.notificationType = params.notificationType.join()
        // params.status = params.notificationType == '4' ? 1 : 0
        params.actionType = JSON.stringify(params.actionType)
        params.chainCode =  JSON.stringify(params.chainCode)
        if(params.blockedList.trim()){
          params.blockedList =JSON.stringify(params.blockedList.split('\n'))
        }
        params.launchTimeBelow =  params.launchTimeBelow ? parseInt(params.launchTimeBelow): 0
        params.launchTimeExceed =  params.launchTimeExceed ? parseInt(params.launchTimeExceed): 0
        params.token1minTradeAmount =  params.token1minTradeAmount ? parseInt(params.token1minTradeAmount): 0
        params.token5minTradeAmount =  params.token5minTradeAmount ? parseInt(params.token5minTradeAmount): 0
        params.marketcapLimit =  params.marketcapLimit ? parseInt(params.marketcapLimit): 0
        params.marketcapThreshold =  params.marketcapThreshold ? parseInt(params.marketcapThreshold): 0
        if(isUpdate.value && params.id){
          await updateWalletWatchStrategy(params)
          customMessage({
            type: 'success',
            title: `${params.name} 监控更新成功`
          })
        }else{
          await addWalletWatchStrategy(params)
          customMessage({
            type: 'success',
            title: `${params.name} 监控创建成功`
          })
        }
        emit('refresh', ruleForm.value)
      } catch (error) {
        console.error('提交表单出错:', error)
        customMessage({
          type: 'error',
          title: '操作失败，请稍后重试'
        })
      } finally {
        submitting.value = false
      }
    } else {
      console.log('error submit!', fields)
      if (fields) {
        const firstErrorField = Object.keys(fields)[0];
        if (firstErrorField) {
          nextTick(() => {
            formEl.scrollToField(firstErrorField);
          });
        }
      }
    }
  })
}
</script>
<style lang="scss" scoped>
.monitorForm-dialog-content {
  height: 60vh;
  overflow-y: auto;
  padding: 1px;
  margin-top: 16px;
  
  .center{
    :deep(){
      label{
        justify-content: center;
      }
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
  .trigger-condition-label {
    :deep(){
      label,.el-form-item__label{
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        padding-left: 16px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        margin-right: 8px;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
      }
 
      input[type='number'] {
        -moz-appearance: textfield;
      }
    }
  }
  .trigger-condition {
    width: 100%;
    gap: 10px;
    // margin-bottom: 10px;
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
    .submit.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .delete {
      background-color: transparent;
      border: 1px solid var(--down-color);
      color: var(--down-color);
    }
  }
  .add-condition {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    color: #5c6068;
    height: 28px;
    line-height: 1.5;
    font-size: 12px;
    padding: 5px 15px;
    border-radius: 6px;
    white-space: nowrap;
    cursor: pointer;
  }
  
  // 添加选项内容的样式
  :deep(.el-select-dropdown__item) {
    display: flex;
    align-items: center;
  }
  
  // 自定义el-option内部的布局
  :deep(.el-option__content) {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  // 复选框样式调整
  :deep(.el-checkbox) {
    margin-right: 20px;
    
    .el-checkbox__input {
      .el-checkbox__inner {
        background-color: transparent;
        border: 1px solid rgba(255, 255, 255, 0.6);
        
        &::after {
          border-color: #ffffff;
        }
      }
      
      &.is-checked {
        .el-checkbox__inner {
          background-color: #409EFF;
          border-color: #409EFF;
        }
      }
    }
    
    .el-checkbox__label {
      color: #ffffff;
      padding-left: 8px;
    }
  }
  
  // 特别针对通知频率复选框组的样式
  .checkbox-notice {
    :deep(.el-checkbox-group) {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    :deep(.el-checkbox) {
      margin-right: 0;
    }
  }
  
  // 添加全局表单标签样式
  :deep(.el-form-item__label) {
    color: #ffffff; // 设置标签为白色
    font-weight: bolder;
  }
}

:deep(.el-dialog__header) {
  margin-bottom: 10px;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
}
</style>
