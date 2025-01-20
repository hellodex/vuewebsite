<template>
  <section class="download-box">
    <div class="download-content">
      <div class="download-logo-main display-flex align-items-center justify-content-center">
        <svg-icon name="logo" class="logo-svg"></svg-icon>
        <span>HelloDex</span>
      </div>
      <div class="display-flex flex-direction-col align-items-center">
        <strong class="title">开创和主导Web3变革</strong>
        <span class="sub-title">平台利润80%分给用户</span>
        <div class="download-items display-flex align-items-center">
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
        </div>
        <div class="display-flex align-items-center">
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
    </div>
    <img src="../assets/img/download-bac.png" alt="" class="download-bac" />
  </section>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.download-box {
  height: calc(100vh - 128px);
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  .download-content {
    width: 1200px;
    padding-top: 55px;
    margin: 0 auto;
  }
  .download-logo-main {
    font-size: 40px;
    color: #f5f5f5;
    .logo-svg {
      width: 64px;
      height: 64px;
      margin-right: 16px;
    }
  }
  .title {
    font-size: 50px;
    color: #fff;
    font-family: 'PingFangSC-Heavy';
    margin-top: 8px;
  }
  .sub-title {
    font-size: 40px;
    color: #fff;
    font-family: 'PingFangSC-Heavy';
  }
  .download-items {
    margin-top: 30px;
  }
  .download-item {
    height: 35px;
    padding: 0px 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 14px;
    color: #fff;
    font-family: 'PingFangSC-Medium';
    margin: 0 9px 14px 0;
    .icon-svg {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
  }
  .download-item:last-child {
    margin-right: 0;
  }
  .download-img {
    width: 1200px;
  }
  .download-bac {
    width: 100vw;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
