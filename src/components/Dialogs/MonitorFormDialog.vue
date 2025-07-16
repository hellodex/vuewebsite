<template>
  <el-dialog 
    v-model="dialogVisible" 
    :before-close="handleClose" 
    title="创建监控" 
    width="600"
    :modal="true"
    :modal-class="'custom-modal-transparent'"
    :lock-scroll="false"
    :append-to-body="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true">
    <div class="monitorForm-dialog-content">
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
            <el-select
              v-model="ruleForm.chainCode"
              :teleported="false"
              :disabled="dialogType == 'edit'"
            >
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
              <span v-if="ruleForm.symbol" style="margin-left: 4px">{{ ruleForm.symbol }}</span>
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
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { typeList, noticeTypeList } from '@/types'
import { numberFormat } from '@/utils'
import { useGlobalStore } from '@/stores/global'
import { APIgetUserSubscribe, APIupdateCommonSubscribe } from '@/api'
import { customMessage } from '@/utils/message'

const globalStore = useGlobalStore()
const { chainList } = globalStore
const chainData = chainList.filter((item: any) => item.chainType !== -1)

const emit = defineEmits(['refresh', 'close'])

const props: any = defineProps({
  monitorFormDialogVisible: {
    type: [Boolean],
    default: false
  },
  dialogType: {
    type: String
  },
  info: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const dialogVisible: any = computed({
  // getter
  get() {
    return props.monitorFormDialogVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})

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

const ruleFormRef = ref<FormInstance>()
const formSize = ref<ComponentSize>('large')
const ruleForm = ref<any>(props.info)

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
    const res: any = await APIgetUserSubscribe({
      baseAddress: query,
      chainCode: ruleForm.value.chainCode,
      type: ruleForm.value.type
    })
    if (res) {
      if (JSON.stringify(res.subscribe) == '{}') {
        const arr: any = res ? [{ ...res.info }] : []
        options.value = arr.map((item: any) => {
          return {
            ...item,
            label: item.baseToken.symbol,
            value: item.baseToken.address
          }
        })
      } else {
        handelMap(res.subscribe)
      }
    } else {
      options.value = []
    }
    loading.value = false
  } else {
    options.value = []
  }
}

const handelSelectBaseAddress = (val: any) => {
  ruleForm.value.symbol = options.value.find((item: any) => item.value == val)?.label || ''
  ruleForm.value.startPrice = options.value.find((item: any) => item.value == val)?.price || ''
  ruleForm.value.logo = options.value.find((item: any) => item.value == val)?.logo || ''
}

const handleChange = (value: any) => {
  // 只允许选择一个选项，因此每次选择后清除之前的选中项（如果有的话）
  if (value && value.length > 1) {
    ruleForm.value.noticeType = [value[value.length - 1]] // 只保留最后一个选中的值
  } else {
    ruleForm.value.noticeType = value // 更新为当前选中的值
  }
}

const handelMap = (map: any) => {
  for (const key in ruleForm.value) {
    if (Object.prototype.hasOwnProperty.call(ruleForm.value, key)) {
      ruleForm.value[key] = map[key]
    }
  }
  if (ruleForm.value.type == 'chg') {
    ruleForm.value.data = ruleForm.value.data * 100
  }
  ruleForm.value.noticeType = [ruleForm.value.noticeType]
  ruleForm.value.coin = 'Single'
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
      customMessage({
        type: 'success',
        title: `${typeList.find((item) => item.value == ruleForm.value.type)?.label}删除成功`
      })
      emit('refresh', ruleForm.value)
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
      customMessage({
        type: 'success',
        title: `${typeList.find((item) => item.value == ruleForm.value.type)?.label}创建成功`
      })
      emit('refresh', ruleForm.value)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleClose = () => {
  emit('close', false)
}
</script>
<style lang="scss" scoped>
.monitorForm-dialog-content {
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
  .icon-svg {
    width: 20px;
    height: 20px;
    display: block;
    border-radius: 50%;
  }
  .span-txt {
    margin-left: 6px;
  }
}
</style>

<style lang="scss">
/* 设置透明但可点击的遮罩层 */
.el-overlay {
  background-color: rgba(0, 0, 0, 0.05) !important; /* 几乎透明的遮罩层，但保留可点击性 */
}

.custom-modal-transparent {
  background-color: transparent !important;
}

:deep(.el-dialog) {
  background-color: #1a1a1a !important; /* 确保弹窗背景是深色的 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important; /* 更强的阴影效果 */
  border: 1px solid #333; /* 添加边框增强对比 */
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #333;
  padding-bottom: 16px;
}

:deep(.el-dialog__title) {
  color: #fff !important;
  font-size: 18px;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
}
</style>
