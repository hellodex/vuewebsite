<template>
  <section class="h5-chong-dog-ventures">
    <van-sticky>
      <div class="chong-dog-ventures-head display-flex align-items-center">
        <svg-icon name="chevron-left" class="icon-arrow" @click="router.back()"></svg-icon>
        <span class="chong-dog-ventures-head-title">冲狗基金</span>
        <span class="chong-dog-ventures-head-right"></span>
      </div>
    </van-sticky>
    <div class="display-flex flex-direction-col">
      <div class="display-flex flex-direction-col align-items-center txt-main">
        <h1>冲狗基金 - 第一期</h1>
        <p class="display-flex flex-direction-col p-txt1">
          <strong>每天随机免费获得1.5U以上&nbsp;&nbsp;</strong>
          <span>冲狗基金(亏损至1U后获得)</span>
        </p>
<!--        <p class="p-txt2">-->
<!--          普通用户撑起整个Web3、却被明里暗里抢钱、没有普通用户就没有Web3<br />开创和主导Web3变革、任何平台从用户身上赚的钱要80%分给用户-->
<!--        </p>-->
<!--        <div class="chong-dog-btn">已开始</div>-->
      </div>
      <img src="@/assets/img/dog-gif.gif" alt="" class="dog-gif" />
    </div>
    <div class="chong-dog-txt">
      <h3>参与资格</h3>
      <p>在活动期间满足下列任意条件，即可获得最低1.5U以上 USDT。本次活动对所有用户开放。</p>
      <div class="chong-dog-txt-items">
        <div class="chong-dog-txt-item display-flex align-items-center flex-direction-col">
          <svg-icon name="dog-ido" class="dog-img"></svg-icon>
          <div class="display-flex flex-direction-col align-items-center">
            <strong>条件1</strong>
            <span>平台币IDO参与>1000U以上，可累计需要同一个钱包地址</span>
          </div>
          <div class="participate-btn" @click="router.push('/Ido')">
            <span>去参与</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </div>
        </div>
        <div class="chong-dog-txt-item display-flex align-items-center flex-direction-col">
          <svg-icon name="dog-twitter" class="dog-img"></svg-icon>
          <div class="display-flex flex-direction-col align-items-center">
            <strong>条件2</strong>
            <span>交易额送冲狗基金</span>
          </div>
          <a href="https://hellodex.io" target="_blank" class="participate-btn">
            <span>已开始</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </a>
        </div>
        <div class="chong-dog-txt-item display-flex align-items-center flex-direction-col">
          <svg-icon name="dog-tg" class="dog-img"></svg-icon>
          <div class="display-flex flex-direction-col align-items-center">
            <strong>条件3</strong>
            <span>TG社区抽奖</span>
          </div>
          <a href="https://t.me/HelloDex_cn" target="_blank" class="participate-btn">
            <span>进入社区群组</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </a>
        </div>
        <div class="chong-dog-txt-item display-flex align-items-center flex-direction-col">
          <svg-icon name="dog-top" class="dog-img"></svg-icon>
          <div class="display-flex flex-direction-col align-items-center">
            <strong>条件4</strong>
            <span>推特抽奖或其他活动中奖者</span>
          </div>
          <a href="https://x.com/HelloDex_io" target="_blank" class="participate-btn">
            <span>关注推特</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </a>
        </div>
      </div>
      <div class="rute-txt">
        <h3>活动规则</h3>
        <div class="display-flex flex-direction-col">
          <i>1.平台币IDO参与>1000U以上，可累计需要同一个钱包地址</i>
          <i>2.推特抽奖或其他活动中奖者</i>
          <i>3.盈利的50%归属于冲狗基金，50%归属于个人，扩大基金占比让更多人参与</i>
          <i>4.如有任何疑问，请联系Telegram中文社区。</i>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<style lang="scss" scoped>
.h5-chong-dog-ventures {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  background: #0d0d0d;
  .chong-dog-ventures-head {
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
    .chong-dog-ventures-head-title {
      width: 100%;
      font-size: 0.4267rem;
      font-style: normal;
      font-weight: normal;
      color: #fff;
      text-align: center;
    }
    .chong-dog-ventures-head-right {
      color: #fff;
      font-size: 0.3733rem;
      position: absolute;
      top: 0;
      right: 0.4267rem;
    }
  }
  .txt-main {
    padding: 0 0.4267rem;
    h1 {
      font-size: 0.7467rem;
      color: #fff;
      font-family: 'PingFangSC-Heavy';
    }
    .p-txt1 {
      margin: 0.2667rem 0;
      strong {
        font-size: 0.4267rem;
        font-family: 'PingFangSC-Heavy';
        background: linear-gradient(270deg, #cf0 58.48%, #70f6ff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      span {
        font-size: 0.3733rem;
        color: #f5f5f5;
      }
    }
    .p-txt2 {
      font-size: 0.3733rem;
      font-family: 'PingFangSC-Medium';
      color: #9aa0aa;
      margin-bottom: 0.6667rem;
      text-align: center;
    }
    .chong-dog-btn {
      padding: 0.4533rem 1.68rem;
      border-radius: 0.4267rem;
      background: linear-gradient(270deg, #cf0 0%, #70f6ff 100%);
      color: #000;
      font-size: 0.48rem;
      text-align: center;
    }
  }
  .dog-gif {
    width: 100%;
    margin: 1.3333rem 0 0.6667rem;
  }
  .chong-dog-txt {
    padding: 0.6667rem 0.4267rem;
    h3 {
      text-align: center;
      font-size: 0.48rem;
      color: #f5f5f5;
      font-family: 'PingFangSC-Heavy';
    }
    p {
      font-size: 0.4rem;
      color: #aaa;
      text-align: center;
      margin: 0.2667rem 0 0.9867rem 0;
    }

    .chong-dog-txt-item {
      padding: 0.64rem 0.4rem;
      border-radius: 0.4267rem;
      border: 1px solid #26282c;
      margin-bottom: 0.48rem;
      .dog-img {
        width: 1.3867rem;
        height: 1.3867rem;
        margin-bottom: 0.32rem;
      }
      strong {
        font-size: 0.48rem;
        background: linear-gradient(270deg, #cf0 0%, #70f6ff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.1067rem;
      }
      span {
        display: block;
        color: #f5f5f5;
        font-size: 0.4rem;
        text-align: center;
      }
      .participate-btn {
        display: flex;
        width: 3.2533rem;
        height: 0.9067rem;
        padding: 0.08rem 0px;
        justify-content: center;
        align-items: center;
        border-radius: 0.2133rem;
        background: rgba(245, 245, 245, 0.1);
        cursor: pointer;
        margin-top: 0.8rem;
        span {
          width: auto;
          font-size: 0.3733rem;
          color: #fff;
          font-family: 'PingFangSC-Medium';
        }
        .arrow-up {
          width: 0.48rem;
          height: 0.48rem;
          transform: rotate(90deg);
          color: #fff;
        }
      }
    }
    .rute-txt {
      padding: 0.3467rem 0;
    }
    i {
      margin-top: 0.3733rem;
      font-size: 0.3733rem;
      color: #aaa;
      font-style: normal;
    }
  }
}
</style>
