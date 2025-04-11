<template>
  <section class="h5-download-box">
    <van-sticky>
      <div class="download-head display-flex align-items-center">
        <svg-icon name="chevron-left" class="icon-arrow" @click="router.back()"></svg-icon>
        <span class="download-head-title">APP下载</span>
        <span class="download-head-right"></span>
      </div>
    </van-sticky>
    <div class="download-content">
      <div class="download-logo-main display-flex align-items-center justify-content-center">
        <svg-icon name="logo" class="logo-svg"></svg-icon>
        <span>HelloDex</span>
      </div>
      <div class="display-flex flex-direction-col align-items-center download-content-main">
        <strong class="title">开创和主导Web3变革</strong>
        <span class="sub-title">平台利润80%分给用户</span>
        <div class="download-items">
          <a
            href="https://testflight.apple.com/join/QWSnSN6O"
            target="_blank"
            class="download-item display-flex align-items-center justify-content-center"
          >
            <svg-icon name="icon-download-ios" class="icon-svg"></svg-icon>
            <span>苹果TF版下载</span>
          </a>
          <a
            href="https://hellodex.s3.ap-northeast-1.amazonaws.com/dex.apk"
            target="_blank"
            class="download-item display-flex align-items-center justify-content-center"
          >
            <svg-icon name="icon-download-android" class="icon-svg"></svg-icon>
            <span>安卓下载</span>
          </a>
          <a
            href="https://t.me/HelloDexBot"
            target="_blank"
            class="download-item display-flex align-items-center justify-content-center"
          >
            <svg-icon name="icon-download-tg" class="icon-svg"></svg-icon>
            <span>TG Bot</span>
          </a>
          <a
            href="https://hellodex.gitbook.io/hellodex"
            target="_blank"
            class="download-item display-flex align-items-center justify-content-center"
          >
            <svg-icon name="icon-download-doc" class="icon-svg"></svg-icon>
            <span>白皮书(预售中)</span>
          </a>
          <a
            href="https://t.me/HelloDex_cn"
            target="_blank"
            class="download-item display-flex align-items-center justify-content-center"
          >
            <svg-icon name="icon-download-tg" class="icon-svg"></svg-icon>
            <span>TG(电报群)</span>
          </a>

          <a
            href="https://discord.gg/hellodex"
            target="_blank"
            class="download-item display-flex align-items-center justify-content-center"
          >
            <svg-icon name="icon-download-discord" class="icon-svg"></svg-icon>
            <span>Discord</span>
          </a>
          <a
            href="https://x.com/HelloDex_io"
            target="_blank"
            class="download-item display-flex align-items-center justify-content-center"
          >
            <svg-icon name="icon-download-x" class="icon-svg"></svg-icon>
            <span>X</span>
          </a>
        </div>

        <!-- <div class="display-flex flex-direction-col">
          <span>{{ ua }}</span>
          <svg-icon
            name="copy"
            style="width: 0.64rem; height: 0.64rem; margin-left: 0.2133rem"
            v-copy="ua"
          ></svg-icon>
        </div> -->
      </div>
      <img src="../assets/img/download-img.png" alt="" class="download-img" />
      <img src="../assets/img/download-h5-bac.png" alt="" class="download-bac" />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const ua = ref(navigator.userAgent)
</script>
<style lang="scss" scoped>
.h5-download-box {
  height: 100vh;
  background: #0d0d0d;
  overflow: hidden;
  overflow-y: scroll;
  .download-head {
    padding: 0 0.24rem;
    height: 1.4933rem;
    background: #0d0d0d;
    position: relative;
    .icon-arrow {
      width: 0.64rem;
      height: 0.64rem;
      color: #fff;
      position: absolute;
      top: 0.4267rem;
      left: 0.24rem;
    }
    .download-head-title {
      width: 100%;
      font-size: 0.4267rem;
      font-style: normal;
      font-weight: normal;
      color: #fff;
      text-align: center;
    }
    .download-head-right {
      color: #fff;
      font-size: 0.3733rem;
      position: absolute;
      top: 0;
      right: 0.4267rem;
    }
  }
  .download-content {
    position: relative;
    padding-top: 0.8rem;
    .download-content-main {
      position: relative;
      z-index: 6;
    }
    .download-logo-main {
      font-size: 0.7467rem;
      color: #f5f5f5;
      .logo-svg {
        width: 1.2267rem;
        height: 1.2267rem;
        margin-right: 0.2933rem;
      }
    }
    .title {
      font-size: 0.8rem;
      color: #fff;
      font-family: 'PingFangSC-Heavy';
      margin-top: 0.32rem;
    }
    .sub-title {
      font-size: 0.64rem;
      color: #fff;
      font-family: 'PingFangSC-Heavy';
    }
    .download-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 0.3733rem;
      margin-top: 0.8rem;
    }
    .download-item {
      height: 1.0667rem;
      padding: 0.096rem 0.2133rem;
      border-radius: 0.2133rem;
      background: rgba(255, 255, 255, 0.1);
      font-size: 0.4rem;
      color: #fff;
      font-family: 'PingFangSC-Medium';
      .icon-svg {
        width: 0.5867rem;
        height: 0.5867rem;
        margin-right: 0.1067rem;
      }
    }
    .download-img {
      width: 90%;
      display: block;
      margin: 0.8rem auto 0;
    }
    .download-bac {
      width: 100vw;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
