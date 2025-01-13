<template>
  <div class="display-flex align-items-center">
    <el-input
      v-model="item.value"
      autocomplete="off"
      maxlength="1"
      oninput="value=value.replace(/[^A-Za-z0-9]/g, '')"
      v-for="(item, index) in captchaVal"
      :key="index"
      :id="`captcha-input${index}`"
      @input="handleInput(index)"
      :style="{
        width: '46px',
        animation: captchaStatus == 1 ? '' : getBoxStyle(index)
      }"
    ></el-input>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { isAllSpaces } from '@/utils'

const emit = defineEmits(['update:modelValue'])

defineProps({
  captchaStatus: {
    type: Number,
    default: 1
  },
  moduleValue: {
    type: String,
    default: ''
  }
})

const captcha = ref('')
const captchaVal = reactive([
  {
    value: ''
  },
  {
    value: ''
  },
  {
    value: ''
  },
  {
    value: ''
  },
  {
    value: ''
  },
  {
    value: ''
  }
])

const getBoxStyle = (index: any) => {
  return `fadeIn 1s forwards ${index * 0.4}s` // 延迟时间逐渐增加
}

const handleInput = (index: number) => {
  captcha.value = ''
  if (index < captchaVal.length - 1) {
    // 自动跳到下一个输入框
    setTimeout(() => {
      document.getElementById(`captcha-input${index + 1}`)?.focus()
    }, 100)
  }

  captchaVal.forEach((item) => {
    captcha.value += item.value
  })

  emit('update:modelValue', captcha.value)
}
</script>
