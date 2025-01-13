<template>
  <div class="walletBeautifulNumber-content">
    <div class="title display-flex align-items-center justify-content-sp">
      <span class="display-flex align-items-center">
        {{ i18n.t('tool.CustomizeYourWalletAddress') }}
        <i class="safety-tips display-flex align-items-center">
          <svg-icon name="auth-check" class="auth-check" style="color: #17b26a"></svg-icon>
          {{ i18n.t('tool.SecurityTips') }}
        </i>
      </span>
    </div>
    <div class="input-box">
      <el-input v-model="input" :placeholder="i18n.t('tool.EntertheCustomSuffix')" />
    </div>
    <p class="txt">Eg: 0x00a8E96BAc71a0ac717cBa30C07E029f6a980000</p>
    <div class="setting-box display-flex align-items-center justify-content-sp">
      <div class="setting-item display-flex flex-direction-col">
        <div class="title display-flex align-items-center justify-content-sp">
          <span>{{ i18n.t('tool.CaseSensitive') }}</span>
        </div>
        <div class="setting-operate display-flex align-items-center justify-content-sp">
          <span
            v-for="(item, index) in caseSensitiveList"
            :key="index"
            :class="caseSensitiveIndex == item.id ? 'active' : ''"
            >{{ item.text }}</span
          >
        </div>
      </div>
      <div class="setting-item display-flex flex-direction-col">
        <div class="title display-flex align-items-center justify-content-sp">
          <span>{{ i18n.t('tool.PrefixorSuffix') }}</span>
        </div>
        <div class="setting-operate display-flex align-items-center justify-content-sp">
          <span
            v-for="(item, index) in prefixList"
            :key="index"
            :class="prefixIndex == item.id ? 'active' : ''"
            >{{ item.text }}</span
          >
        </div>
      </div>
    </div>
    <div class="thread-box display-flex flex-direction-col">
      <div class="title display-flex align-items-center justify-content-sp">
        <span class="display-flex align-items-center">
          {{ i18n.t('tool.Threads') }}
          <el-tooltip
            effect="light"
            :content="i18n.t('tool.ThreadsTxt')"
            placement="right"
            popper-class="tooltip-item"
          >
            <el-icon color="#828282" class="icon-doubt"><QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </div>
      <el-input-number v-model="num1" />
    </div>
    <div class="tips display-flex align-items-center">
      <svg-icon name="alert-circle" class="alert-circle" style="color: #828282"></svg-icon>
      <span>{{ i18n.t('tool.tipsTxt') }}</span>
    </div>
    <div class="operate-btn display-flex align-items-center justify-content-sp">
      <span>{{ i18n.t('tool.Pause') }}</span>
      <span>{{ i18n.t('tool.Generate') }}</span>
    </div>
  </div>
  <div class="walletBeautifulNumber-schedule">
    <div class="title display-flex align-items-center justify-content-sp">
      <span class="display-flex align-items-center">
        {{ i18n.t('tool.GenerationProcess') }}
        <el-tooltip
          effect="light"
          :content="i18n.t('tool.ThreadsTxt')"
          placement="right"
          popper-class="tooltip-item"
        >
          <el-icon color="#828282" class="icon-doubt"><QuestionFilled /></el-icon>
        </el-tooltip>
      </span>
    </div>
    <div>
      <div
        class="schedule-info-item schedule-disabled display-flex align-items-center justify-content-sp"
      >
        <span>***</span>
        <span>{{ i18n.t('tool.Copy') }}</span>
      </div>
      <div
        class="schedule-info-item schedule-disabled display-flex align-items-center justify-content-sp"
      >
        <span>***</span>
        <span>{{ i18n.t('tool.Copy') }}</span>
      </div>
    </div>
    <div>
      <div class="schedule-info-item display-flex align-items-center justify-content-sp">
        <span>{{ i18n.t('kChart.Address') }}：0x09b2100F4f367C6ee1bC52fBd10310D3E0fb0701</span>
        <span>{{ i18n.t('tool.Copy') }}</span>
      </div>
      <div class="schedule-info-item display-flex align-items-center justify-content-sp">
        <span
          >{{
            i18n.t('tool.PrivateKey')
          }}：5d5a6aeaae198ada53f33d83793d1f1bbeeb665c8ec0be4d193df71d9998987d</span
        >
        <span>{{ i18n.t('tool.Copy') }}</span>
      </div>
    </div>
    <div class="schedule-progress">
      <el-progress :text-inside="true" :stroke-width="32" :percentage="70" />
    </div>
    <div class="detailed-info-content">
      <p class="display-flex align-items-center justify-content-sp">
        <span>{{ i18n.t('tool.CaseSensitive') }}</span>
        <span>1</span>
      </p>
      <p class="display-flex align-items-center justify-content-sp">
        <span>{{ i18n.t('tool.Generate') }}</span>
        <span>0 addresses</span>
      </p>
      <p class="display-flex align-items-center justify-content-sp">
        <span>{{ i18n.t('tool.Possibility') }}</span>
        <span>0 addresses</span>
      </p>
      <p class="display-flex align-items-center justify-content-sp">
        <span>{{ i18n.t('tool.Speed') }}</span>
        <span>0 addr/s</span>
      </p>
      <p class="display-flex align-items-center justify-content-sp">
        <span>{{ i18n.t('tool.Status') }}</span>
        <span>Waiting</span>
      </p>
    </div>
    <div class="detailed-info display-flex align-items-center justify-content-center">
      <span>{{ i18n.t('tool.DetailedInformation') }}</span>
      <svg-icon name="chevron-down" class="chevron" style="color: #fff"></svg-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const input = ref<string | null>(null)
const caseSensitiveIndex = ref<number>(1)
const caseSensitiveList = [
  {
    id: 1,
    text: 'YES'
  },
  {
    id: 0,
    text: 'NO'
  }
]

const prefixIndex = ref<number>(1)
const prefixList = [
  {
    id: 1,
    text: i18n.t('tool.Prefix')
  },
  {
    id: 0,
    text: i18n.t('tool.Suffix')
  }
]

const num1 = ref<number>(1)
</script>

<style lang="scss" scoped>
@import './tools.scss';
</style>
