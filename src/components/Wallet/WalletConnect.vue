<template>
  <div class="connect-wallet-btn" v-bind="$attrs" @click.stop="handelConnect">
    <slot>连接</slot>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'
import { useI18n } from 'vue-i18n'

const globalStore = useGlobalStore()

const { setDialogVisible } = globalStore

const handelConnect = () => {
  setDialogVisible({
    registerDialogVisible: false,
    logOnDialogVisible: true,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: false
  })
}
</script>
<style lang="scss">
.connect-wallet-btn {
  min-width: 88px;
  padding: 4px 16px;
  border-radius: 8px;
  background: var(--font-color-default);
  color: var(--bg-color);
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
}
.connect-wallet-btn:hover {
  background: #a9a9a9;
}
</style>
