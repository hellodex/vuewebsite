<template>
  <div class="language display-flex align-items-center">
    <el-dropdown trigger="click" @command="handelLanguage">
      <span class="el-dropdown-link">
        <svg-icon name="globe-language" class="language-icon-svg"></svg-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in languageList"
            :key="item.languageCode"
            :command="item.languageCode"
            :disabled="language === item.languageCode"
            >{{ item.languageName }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, watch, watchEffect, onMounted, computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'

const { reload }: any = inject('reload')
const i18n = useI18n()
const globalStore = useGlobalStore()

// 语言切换
const language = computed(() => globalStore.language)

const languageList = [
  {
    languageName: '简体中文',
    languageCode: 'zh'
  },
  {
    languageName: 'English',
    languageCode: 'en'
  }
]

const handelLanguage = (lang: string) => {
  i18n.locale.value = lang
  globalStore.setLanguage(lang)
  reload()
}
</script>

<style lang="scss" scoped>
.language {
  margin-left: 10px;
}
.language-icon-svg {
  width: 24px;
  height: 24px;
  color: #f5f5f5;
  cursor: pointer;
}
</style>
