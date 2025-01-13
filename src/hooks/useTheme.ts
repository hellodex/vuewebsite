import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global'

/**
 * @description 全局主题 hooks
 * */

export function useTheme() {
  const globalStore = useGlobalStore()
  const { theme } = storeToRefs(globalStore)

  // 切换主题
  const switchDark = () => {
    const html = document.documentElement as HTMLElement
    html.setAttribute('class', theme.value)
  }

  // init theme
  const initTheme = () => {
    switchDark()
  }

  return {
    initTheme,
    switchDark
  }
}
