<template>
  <div class="input-box display-flex align-items-center">
    <el-input
      v-model="item.value"
      autocomplete="off"
      maxlength="1"
      oninput="value=value.replace(/[^A-Za-z0-9]/g, '')"
      v-for="(item, index) in captchaVal"
      :key="index"
      :id="`captcha-input${index}`"
      @input="handleInput(index)"
      @keydown.delete="handelDelete(index)"
      @paste="handlePaste($event, index)"
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
  if (captchaVal[index].value && index < captchaVal.length - 1) {
    // 自动跳到下一个输入框
    setTimeout(() => {
      document.getElementById(`captcha-input${index + 1}`)?.focus()
    }, 50)
  }

  emitData()
}

const handelDelete = (index: number) => {
  // 如果当前输入框为空，且不是第一个输入框，则跳到上一个
  if (!captchaVal[index].value && index > 0) {
    captchaVal[index - 1].value = ''
    setTimeout(() => {
      document.getElementById(`captcha-input${index - 1}`)?.focus()
    }, 50)
  }
  emitData()
}

const handlePaste = (event: ClipboardEvent, index: number) => {
  event.preventDefault()
  const pasteData = event.clipboardData?.getData('text') || ''
  // 只保留字母和数字
  const cleanData = pasteData.replace(/[^A-Za-z0-9]/g, '')
  
  // 将粘贴的内容分配到各个输入框
  let currentIndex = index
  for (let i = 0; i < cleanData.length && currentIndex < captchaVal.length; i++) {
    captchaVal[currentIndex].value = cleanData[i]
    currentIndex++
  }
  
  // 聚焦到最后一个有值的输入框的下一个，或最后一个输入框
  const nextIndex = Math.min(currentIndex, captchaVal.length - 1)
  setTimeout(() => {
    document.getElementById(`captcha-input${nextIndex}`)?.focus()
  }, 50)
  
  emitData()
}

const emitData = () => {
  captcha.value = ''

  captchaVal.forEach((item) => {
    captcha.value += item.value
  })

  emit('update:modelValue', captcha.value)
}
</script>
