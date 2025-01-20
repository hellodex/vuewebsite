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
      <div class="display-flex flex-direction-col align-items-center">
        <strong class="title">开创和主导Web3变革</strong>
        <span class="sub-title">平台利润80%分给用户</span>
        <div class="download-items">
          <a
            href="https://lnk.bio/go?d=https%3A%2F%2Ftestflight.apple.com%2Fjoin%2FQWSnSN6O&hash=06969aa126356fc0d702a3f7cacd6b26&id=7108159&ext=-1861636&timezone=America%2FNew_York&type=1"
            target="_blank"
            class="download-item display-flex align-items-center"
          >
            <svg-icon name="icon-download-ios" class="icon-svg"></svg-icon>
            <span>苹果TF版下载</span>
          </a>
          <a
            href="https://lnk.bio/go?d=https%3A%2F%2Fpub-9b1a3493aabe403482e838e3d4cb36d0.r2.dev%2Fdex.apk&hash=12ddafb09f0354cf20438d437f70fc0b&id=7108156&ext=-1861636&timezone=America%2FNew_York&type=1"
            target="_blank"
            class="download-item display-flex align-items-center"
          >
            <svg-icon name="icon-download-android" class="icon-svg"></svg-icon>
            <span>安卓下载</span>
          </a>
          <a
            href="https://lnk.bio/go?d=https%3A%2F%2Fhellodex.io%2Fido&hash=d4e78b59d2ae7a3d22af3028e71c906d&id=7108140&ext=-1861636&timezone=America%2FNew_York&type=1"
            target="_blank"
            class="download-item display-flex align-items-center"
          >
            <svg-icon name="icon-download-doc" class="icon-svg"></svg-icon>
            <span>白皮书(预售中)</span>
          </a>
          <a
            href="https://lnk.bio/go?d=https%3A%2F%2Ft.me%2FHelloDex_cn&hash=8e2b8abee04f4dd77925055774555bb3&id=7108162&ext=-1861636&timezone=America%2FNew_York&type=1"
            target="_blank"
            class="download-item display-flex align-items-center"
          >
            <svg-icon name="icon-download-tg" class="icon-svg"></svg-icon>
            <span>TG(电报群)</span>
          </a>

          <a
            href="https://lnk.bio/go?d=https%3A%2F%2Fdiscord.gg%2Fhellodex&hash=eae14c6f6ce9957447444b2a147b7229&id=7313058&ext=-1861636&timezone=America%2FNew_York&type=1"
            target="_blank"
            class="download-item display-flex align-items-center"
          >
            <svg-icon name="icon-download-discord" class="icon-svg"></svg-icon>
            <span>Discord</span>
          </a>
          <a
            href="https://lnk.bio/go?d=https%3A%2F%2Ftwitter.com%2FHelloDexCN&hash=f3d7fbce65a2531a29d1028b5ad52c44&id=7108163&ext=-1861636&timezone=America%2FNew_York&type=1"
            target="_blank"
            class="download-item display-flex align-items-center"
          >
            <svg-icon name="icon-download-x" class="icon-svg"></svg-icon>
            <span>X</span>
          </a>
        </div>
      </div>
      <img src="../assets/img/download-img.png" alt="" class="download-img" />
      <img src="../assets/img/download-bac.png" alt="" class="download-bac" />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
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
    padding-bottom: 0.2667rem;
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
      background-color: #000;
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
