import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMessageDispatchStore = defineStore('messageDispatch', () => {
  const messageDispatchCount = ref<number>(0)
  function messageDispatchIncrement() {
    messageDispatchCount.value++
  }

  return { messageDispatchCount, messageDispatchIncrement }
})
