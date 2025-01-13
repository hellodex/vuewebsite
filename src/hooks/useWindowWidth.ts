import { ref, onUnmounted } from 'vue'

export function useWindowWidth() {
  const windowWidth = ref<number>(0)
  // 定义一个函数来获取并打印窗口宽度
  function printWindowWidth(): void {
    windowWidth.value = window.innerWidth
    console.log('窗口宽度: ' + windowWidth.value + '像素')
    // showToast(`窗口宽高: ${windowWidth.value} * ${window.innerHeight}像素`)
  }

  printWindowWidth()
  // 在窗口大小改变时调用该函数
  window.addEventListener('resize', function () {
    printWindowWidth()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', function () {
      printWindowWidth()
    })
  })

  return {
    windowWidth
  }
}
