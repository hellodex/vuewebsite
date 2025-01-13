/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */
import type { Directive, DirectiveBinding } from 'vue'
import { ElMessage } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
const lang: any = {
  zh: '复制成功',
  en: 'CopySuccessful'
}
interface ElType extends HTMLElement {
  copyData: string | number
  copyText: string
  __handleClick__: any
}
const copy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    const globalStore = useGlobalStore()
    const bindingData = binding.value
    el.copyData = Array.isArray(bindingData) ? bindingData[0] : bindingData
    el.copyText = Array.isArray(bindingData) ? bindingData[1] : lang[globalStore.language || 'zh']
    el.addEventListener('click', function (event) {
      // 阻止事件冒泡
      event.stopPropagation()
      handleClick(el)
    })
  },
  updated(el: ElType, binding: DirectiveBinding) {
    const globalStore = useGlobalStore()
    const bindingData = binding.value
    el.copyData = Array.isArray(bindingData) ? bindingData[0] : bindingData
    el.copyText = Array.isArray(bindingData) ? bindingData[1] : lang[globalStore.language || 'zh']
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  }
}

async function handleClick(el: any) {
  try {
    await navigator.clipboard.writeText(el.copyData)
  } catch (err) {
    console.error('复制操作不被支持或失败: ', err)
  }
  ElMessage({
    type: 'success',
    message: el.copyText
  })
}

export default copy
