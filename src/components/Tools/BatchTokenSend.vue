<template>
  <div class="batchTokenSend-head display-flex align-items-center justify-content-sp">
    <span class="active">{{ i18n.t('tool.Prepare') }}</span>
    <svg-icon name="icon-line" class="icon-line" style="color: #828282"></svg-icon>
    <span>{{ i18n.t('tool.Confirm') }}</span>
    <svg-icon name="icon-line" class="icon-line" style="color: #828282"></svg-icon>
    <span>{{ i18n.t('tool.Send') }}</span>
  </div>
  <div class="batchTokenSend-main">
    <div class="title display-flex align-items-center justify-content-sp">
      <span>{{ i18n.t('tool.SendToken') }}</span>
      <strong>{{ i18n.t('tool.Balance') }}：92.65</strong>
    </div>
    <div class="coin-box display-flex align-items-center justify-content-sp">
      <div class="display-flex align-items-center">
        <span class="logo">
          <!-- <img :src="item.logo" alt="" class="img" v-if="item.logo" /> -->
          <svg-icon name="coinSOLANA" class="img"></svg-icon>
          <svg-icon :name="'coinSOLANA'" class="chainCode"></svg-icon>
        </span>
        <div class="display-flex flex-direction-col">
          <span class="symbol">SOLANA</span>
          <span class="coin">SOLANA</span>
        </div>
      </div>
      <svg-icon name="chevron-down" class="chevron-down" style="color: #fff"></svg-icon>
    </div>
    <div class="title display-flex align-items-center justify-content-sp">
      <span>{{ i18n.t('tool.ReceivingAddressandAmount') }}</span>
      <strong class="underline">{{ i18n.t('tool.Example') }}</strong>
    </div>
    <div class="coin-token">
      <el-input
        v-model="token"
        :rows="6"
        type="textarea"
        :placeholder="i18n.t('tool.PleaseEnterAddress')"
      />
      <div class="coin-btn display-flex align-items-center justify-content-sp">
        <span>{{ i18n.t('tool.AutofillAmount') }}</span>
        <span>{{ i18n.t('tool.Upload') }}</span>
      </div>
    </div>
    <div class="tips display-flex align-items-center">
      <svg-icon name="alert-circle" class="alert-circle" style="color: #828282"></svg-icon>
      <span>{{ i18n.t('tool.TipEachLine') }}</span>
    </div>
    <div class="btn">{{ i18n.t('tool.NextStep') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const token = ref<string | null>(null)
</script>

<style lang="scss" scoped>
@use './tools.scss';
</style>
