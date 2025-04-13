<template>
  <section class="chong-dog-ventures">
    <div class="chong-dog-content display-flex align-items-center justify-content-sp">
      <div class="display-flex flex-direction-col txt-main">
        <h1>冲狗基金 - 第一期</h1>
        <p class="display-flex align-items-center p-txt1">
          <strong>每天随机免费获得1-5U&nbsp;&nbsp;</strong>
          <span>冲狗基金(亏损至0.5U后获得)</span>
        </p>
        <p class="p-txt2">
          普通用户撑起整个Web3、却被明里暗里抢钱、没有普通用户就没有Web3<br />开创和主导Web3变革、任何平台从用户身上赚的钱要80%分给用户
        </p>
        <div class="chong-dog-btn">已开始</div>
      </div>
      <img src="@/assets/img/dog-gif.gif" alt="" class="dog-gif" />
    </div>
    <div class="chong-dog-txt">
      <h3>参与资格</h3>
      <p>在活动期间满足下列任意条件，即可获得 1-5 USDT 奖励。本次活动对所有用户开放。</p>
      <div class="chong-dog-txt-items">
        <div class="chong-dog-txt-item display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <svg-icon name="dog-ido" class="dog-img"></svg-icon>
            <div class="display-flex flex-direction-col">
              <strong>条件1</strong>
              <span>平台币IDO参与>1000U以上，可累计需要同一个钱包地址</span>
            </div>
          </div>
          <div class="participate-btn" @click="router.push('/Ido')">
            <span>去参与</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </div>
        </div>
        <div class="chong-dog-txt-item display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <svg-icon name="dog-twitter" class="dog-img"></svg-icon>
            <div class="display-flex flex-direction-col">
              <strong>条件2</strong>
              <span>推特抽奖或其他活动中奖者</span>
            </div>
          </div>
          <a href="https://x.com/HelloDex_io" target="_blank" class="participate-btn">
            <span>关注Twitter</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </a>
        </div>
        <div class="chong-dog-txt-item display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <svg-icon name="dog-tg" class="dog-img"></svg-icon>
            <div class="display-flex flex-direction-col">
              <strong>条件3</strong>
              <span>TG社区抽奖</span>
            </div>
          </div>
          <a href="https://t.me/HelloDex_cn" target="_blank" class="participate-btn">
            <span>进入社区群组</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </a>
        </div>
        <div class="chong-dog-txt-item display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <svg-icon name="dog-top" class="dog-img"></svg-icon>
            <div class="display-flex flex-direction-col">
              <strong>条件4</strong>
              <span>每日交易排名前三</span>
            </div>
          </div>
          <a href="https://t.me/HelloDex_cn" target="_blank" class="participate-btn">
            <span>即将开始</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </a>
        </div>
      </div>
    </div>
    <div class="chong-dog-txt">
      <h3>活动规则</h3>
      <div class="display-flex flex-direction-col">
        <i>1.平台币IDO参与>1000U以上，可累计需要同一个钱包地址</i>
        <i>2.推特抽奖或其他活动中奖者</i>
        <i>3.盈利的60%归属于冲狗基金，40%归属于个人，扩大基金占比让更多人参与</i>
        <i>4.如有任何疑问，请联系Telegram中文社区。</i>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss" scoped>
.chong-dog-ventures {
  width: 1200px;
  margin: 0 auto;
  padding: 70px 0 40px 0;
  .chong-dog-content {
    .txt-main {
      width: 527px;
    }
    .dog-gif {
      width: 450px;
    }
    h1 {
      font-size: 40px;
      color: #fff;
      font-family: 'PingFangSC-Heavy';
    }
    .p-txt1 {
      margin: 16px 0;
      strong {
        font-size: 20px;
        font-family: 'PingFangSC-Heavy';
        background: linear-gradient(270deg, #cf0 58.48%, #70f6ff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      span {
        font-size: 20px;
        color: #f5f5f5;
      }
    }
    .p-txt2 {
      font-size: 14px;
      font-family: 'PingFangSC-Medium';
      color: #9aa0aa;
      margin-bottom: 35px;
    }
    .chong-dog-btn {
      width: 160px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(270deg, #cf0 0%, #70f6ff 100%);
      color: #000;
      font-size: 18px;
      text-align: center;
      line-height: 56px;
    }
  }
  .chong-dog-txt {
    margin-top: 60px;
    h3 {
      text-align: center;
      font-size: 18px;
      color: #f5f5f5;
      font-family: 'PingFangSC-Heavy';
    }
    p {
      font-size: 14px;
      color: #aaa;
      text-align: center;
      margin: 10px 0 37px 0;
    }
    .chong-dog-txt-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    .chong-dog-txt-item {
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #26282c;
      .dog-img {
        width: 52px;
        height: 52px;
        margin-right: 12px;
      }
      strong {
        font-size: 16px;
        background: linear-gradient(270deg, #cf0 0%, #70f6ff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 4px;
      }
      span {
        display: block;
        width: 294px;
        color: #f5f5f5;
        font-size: 14px;
        font-family: 'PingFangSC-Heavy';
        line-height: 1.2;
      }
      .participate-btn {
        display: flex;
        width: 134px;
        height: 40px;
        padding: 3px 0px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: #f5f5f5;
        cursor: pointer;
        span {
          width: auto;
          font-size: 14px;
          color: #26282c;
          font-family: 'PingFangSC-Medium';
        }
        .arrow-up {
          width: 18px;
          height: 18px;
          transform: rotate(90deg);
          color: #26282c;
        }
      }
    }
    i {
      margin-top: 22px;
      font-size: 14px;
      color: #aaa;
      font-style: normal;
    }
  }
}
</style>
