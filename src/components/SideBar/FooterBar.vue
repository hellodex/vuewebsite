<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="web-footer display-flex align-items-center justify-content-sp">
    <div class="display-flex align-items-center">
      <div class="footer-item">
        <span>{{ i18n.t('TotalDividend') }}：</span>
        <span>{{ i18n.t('AfterIDOpresale') }}</span>
      </div>
      <div class="footer-item">
        <span>HelloDex：</span>
        <span>{{ i18n.t('AfterIDOpresale') }}</span>
      </div>
    </div>
    <div class="other-link">
      <a v-for="item in othersLink" :href="item.to" :key="item.to" target="_blank">
        <svg-icon :name="item.icon" class="link-icon"></svg-icon>
        <span style="color: #a0a0a0; margin-left: 4px">{{ item.txt }}</span>
      </a>
      <a target="_blank" href="https://t.me/HelloDex_cn">
        <span class="call-icon">
          <el-icon :size="13"><Service /></el-icon>
        </span>
        <span style="color: #a0a0a0; margin-left: 4px">联系客服</span>
      </a>
    </div>
  </footer>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const othersLink = ref<{ icon: string; to: string; txt: string }[]>([
  // 以后多个tg, 中文社区， 英文社区等， 可能需要确定一个或者先跳转去channel， 再去进入各种群
  {
    icon: 'github-grey',
    to: 'https://github.com/hellodex',
    txt: '代码已开源'
  },
  {
    icon: 'bot',
    to: 'https://t.me/HelloDex_cn',
    txt: '报单机器人'
  },
  {
    icon: 'twitter',
    to: 'https://lnk.bio/HelloDex',
    txt: ''
  },
  {
    icon: 'tg',
    to: 'https://lnk.bio/HelloDex',
    txt: ''
  }
])

const feeVolume = ref<any>(0)

onMounted(() => {})
</script>
<style scoped lang="scss">
.web-footer {
  width: 100%;
  font-size: 12px;
  height: 40px;
  border-top: 1px solid #26282c;
  background-color: #17181b;
  font-style: normal;
  padding: 6px 24px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9;
  .footer-item {
    text-align: center;
    line-height: 31px;
    margin-right: 64px;
    span:first-child {
      color: #aaa;
    }
    span:last-child {
      color: #616161;
    }
  }
  .footer-item:last-child {
    text-align: left;
  }
  .footer-item:first-child {
    text-align: right;
  }
  .other-link {
    display: flex;
    align-items: center;
    .link-icon {
      width: 16px;
      height: 16px;
      display: block;
      color: #aaa;
    }
    a {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
    .call-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      color: var(--bg-color);
      background-color: #aaa;
      cursor: pointer;
      text-decoration: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }
}
</style>
