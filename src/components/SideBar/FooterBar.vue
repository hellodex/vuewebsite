<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="web-footer display-flex align-items-center justify-content-sp">
    <div class="activity display-flex align-items-center justify-content-sp">
      <span></span>
      <div class="display-flex align-items-center activity-content">
        <span>🔥平台币预售中</span>
        <span
          @click="router.push('/Ido')"
          class="display-flex align-items-center"
          style="
            color: #569cee;
            border-bottom: 1px solid #569cee;
            margin-left: 8px;
            cursor: pointer;
            line-height: 1;
          "
        >
          {{ i18n.t('tabbar.advertNoticeOperate') }}<el-icon><Right /></el-icon
        ></span>
      </div>
      <div class="display-flex align-items-center activity-content">
        <span style="margin-left: 20px"></span>
        <img src="@/assets/img/select_airdrop.png" alt="" />
        <span
          @click="router.push('/airdrop')"
          class="display-flex align-items-center"
          style="
            color: #569cee;
            border-bottom: 1px solid #569cee;
            margin-left: 8px;
            cursor: pointer;
            line-height: 1;">
          {{ i18n.t('tabbar.airdrop') }} </span>
      </div>

      <div class="display-flex align-items-center activity-content">
        <span style="margin-left: 20px"></span>
        <img src="@/assets/img/vip/VIP.png" alt="" />
        <span
          @click="router.push('/pricing')"
          class="display-flex align-items-center"
          style="
            color: #569cee;
            border-bottom: 1px solid #569cee;
            margin-left: 8px;
            cursor: pointer;
            line-height: 1;">
          {{ i18n.t('tabbar.getVip') }} </span>
      </div>
      <span></span>
    </div>
    <div class="other-link">
      <a v-for="item in othersLink" :href="item.to" :key="item.to" target="_blank">
        <svg-icon :name="item.icon" class="link-icon" v-if="item.icon"></svg-icon>
        <img src="@/assets/img/img-tg.png" class="link-icon" v-else />
        <span style="color: #a0a0a0; margin-left: 4px">{{ item.txt }}</span>
      </a>
      <a target="_blank" href="https://t.me/HelloDex_cn">
        <span class="call-icon">
          <el-icon :size="13"><Service /></el-icon>
        </span>
        <span style="color: #a0a0a0; margin-left: 4px">联系客服</span>
      </a>
    </div>

    <!--    <div class="txt">💘你冲币、我冲你、亏了送U不离不弃💘</div>-->
  </footer>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const i18n = useI18n()
const router = useRouter()

const othersLink = ref<{ icon: string; to: string; txt: string }[]>([
  // 以后多个tg, 中文社区， 英文社区等， 可能需要确定一个或者先跳转去channel， 再去进入各种群
  {
    icon: 'github-grey',
    to: 'https://github.com/hellodex',
    txt: '代码已开源'
  },
  {
    icon: '',
    to: 'https://t.me/hellodexbot?start=start',
    txt: '交易机器人'
  },
  // {
  //   icon: 'bot',
  //   to: 'https://t.me/HelloDex_cn',
  //   txt: '报单机器人'
  // },
  {
    icon: 'twitter',
    to: 'https://x.com/HelloDex_io',
    txt: ''
  },
  {
    icon: 'tg',
    to: 'https://lnk.bio/HelloDex',
    txt: ''
  }
])
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
  .txt {
    width: 100%;
    text-align: center;
    line-height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
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
  .activity {
    font-family: 'PingFangSC-Medium';
    .activity-content {
      color: var(--font-color-default);
      font-size: 12px;
      a {
        color: #569cee;
        text-decoration: underline;
        cursor: pointer;
        font-style: inherit;
        margin-left: 8px;
      }
    }
  }
}
</style>
