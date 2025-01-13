<template>
  <div class="checked-box display-flex align-items-center">
    <div class="display-flex align-items-center">
      <span>自定义涨幅</span>
      <div style="width: 55px; margin: 0 8px">
        <el-input
          v-model="increaseSet"
          placeholder="百分比"
          size="small"
          oninput="value=value.replace(/[^0-9.]/g,'')"
          @input="handelIncreaseSetInput"
        >
          <template #suffix>
            <span class="suffix-txt">%</span>
          </template>
        </el-input>
      </div>
      <span style="color: #f5f5f5">出本</span>
    </div>
    <el-checkbox
      v-model="increaseSwitch"
      @change="handelSwitch"
      :true-value="1"
      :false-value="0"
      style="margin-left: 8px"
    ></el-checkbox>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const increaseSet = ref<string>(localStorage.getItem('increaseSet') || '100')
const increaseSwitch = ref<number>(
  localStorage.getItem('increaseSwitch') === '0'
    ? Number(localStorage.getItem('increaseSwitch'))
    : 1
)

increaseSwitch.value && localStorage.setItem('increaseSet', increaseSet.value)

const handelIncreaseSetInput = (val: any) => {
  console.log(val)
  localStorage.setItem('increaseSet', val)
}

const handelSwitch = (val: any) => {
  localStorage.setItem('increaseSwitch', val)
  if (val) {
    localStorage.setItem('increaseSet', increaseSet.value)
  } else {
    localStorage.removeItem('increaseSet')
  }
}
</script>

<style scoped lang="scss">
.checked-box {
  margin-right: 20px;
  white-space: nowrap;
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
  :deep(.el-input--small .el-input__wrapper) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
