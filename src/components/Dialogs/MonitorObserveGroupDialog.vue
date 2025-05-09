<template>
  <el-dialog v-model="dialogVisible" :before-close="handleClose" title="创建监控" width="600">
    <div class="monitorForm-dialog-content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :size="formSize"
        label-position="top"
        :hide-required-asterisk="true"
      >
        <el-form-item label="监控名称" prop="baseAddress">
          <el-input
            v-model="ruleForm.baseAddress"
            placeholder="请输入自定义监控名，例如：只报买入卖出"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="监控类型" prop="type">
          <el-select v-model="ruleForm.type" :teleported="false" placeholder="请选择监控类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择分组" prop="type">
          <el-select v-model="ruleForm.type" :teleported="false" placeholder="请选择选择分组">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="触发条件">
          <div class="trigger-condition display-flex align-items-center">
            <el-select v-model="ruleForm.type" style="width: 180px" :teleported="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="ruleForm.type" style="width: 110px" :teleported="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="ruleForm.type" style="width: 110px" :teleported="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-model="ruleForm.baseAddress" style="width: 110px"></el-input>
          </div>
          <div class="trigger-condition display-flex align-items-center">
            <el-select v-model="ruleForm.type" style="width: 180px" :teleported="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-model="ruleForm.baseAddress" style="width: 350px">
              <template #suffix>$</template>
            </el-input>
          </div>
          <div class="trigger-condition display-flex align-items-center">
            <el-select v-model="ruleForm.type" style="width: 180px" :teleported="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="ruleForm.type" style="width: 350px" :teleported="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="trigger-condition display-flex align-items-center">
            <el-select v-model="ruleForm.type" style="width: 180px" :teleported="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="ruleForm.type" style="width: 350px" :teleported="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="add-condition">
            <el-icon size="14"><CirclePlus /></el-icon>
            <span>&nbsp;添加更多条件</span>
          </div>
        </el-form-item>
        <el-form-item label="通知渠道" prop="type">
          <el-select v-model="ruleForm.type" :teleported="false" placeholder="请选择通知渠道">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <div class="display-flex align-items-center justify-content-fd btn">
          <span class="delete">上一步</span>
          <span class="submit">提交</span>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { numberFormat } from '@/utils'
import { customMessage } from '@/utils/message'

const emit = defineEmits(['refresh', 'close'])

const props: any = defineProps({
  monitorObserveGroupDialogVisible: {
    type: [Boolean],
    default: false
  }
})

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

const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]

const ruleFormRef = ref<FormInstance>()
const formSize = ref<ComponentSize>('large')
const ruleForm = ref<any>({
  type: '',
  name: ''
})

const rules = reactive<FormRules<any>>({
  type: [
    {
      required: true,
      message: '请选择监控类型',
      trigger: ['blur', 'change']
    }
  ],
  name: [
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
    }
  ]
})

const handleClose = () => {
  emit('close', false)
}
</script>
<style lang="scss" scoped>
.monitorForm-dialog-content {
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
  .trigger-condition {
    gap: 10px;
    margin-bottom: 10px;
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
}
</style>
