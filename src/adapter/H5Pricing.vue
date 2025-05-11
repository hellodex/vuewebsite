<template>
  <div class="mobile-membership">
    <!-- 顶部导航 -->
    <div class="mobile-nav">
      <h1 class="vip-title">请选择会员类型</h1>
    </div>

    <!-- 会员卡滑动区域 -->
    <swiper class="plan-swiper" :slides-per-view="1.2" :space-between="16" :centered-slides="true">
      <!-- Free 计划 -->
      <swiper-slide>
        <div class="plan-card free" style="background: linear-gradient(to bottom right, #020202, #272829);">
          <div class="card-content">
            <div class="plan-header">
              <div class="title-container">
                <img class="title-bg" src="@/assets/img/vip/free-2.png" alt="Free">
                <h3 class="title-text">Free</h3>
              </div>
            </div>

            <div class="price-area">
              <div class="price-text">免费版</div>
            </div>

            <div class="divider-wrapper">
              <div class="gradient-divider"></div>
            </div>

            <div class="features">
              <ul>
                <li><check-icon/> 100个钱包地址监控</li>
                <li><check-icon/> 100个Token地址监控</li>
                <li><check-icon/> 2000条消息/小时</li>
                <li><check-icon/> 多钱包同时买入监控 * 3</li>
                <li class="disabled"><x-icon/> 更多社区支持</li>
              </ul>
            </div>

            <button class="select-btn primary" disabled>免费中</button>
          </div>
        </div>
      </swiper-slide>

      <!-- Start 计划 -->
      <swiper-slide>
        <div class="plan-card start" style="background: linear-gradient(to bottom right, #2b2929, #141415);">
          <div class="card-content">
            <div class="plan-header">
              <div class="title-container">
                <img class="title-bg" src="@/assets/img/vip/start-2.png" alt="Start">
                <h3 class="title-text">Start</h3>
              </div>
            </div>

            <div class="price-area">
              <span class="price">$0</span>
              <span class="period">/月</span>
            </div>

            <div class="divider-wrapper">
              <div class="gradient-divider"></div>
            </div>

            <div class="features">
              <ul>
                <li><check-icon/> 500个钱包地址监控</li>
                <li><check-icon/> 500个Token地址监控</li>
                <li><check-icon/> 2500条消息/小时</li>
                <li><check-icon/> 多钱包同时买入监控 * 10</li>
                <li><check-icon/> 更多社区支持</li>
              </ul>
            </div>

            <button class="select-btn primary" disabled>免费中</button>
          </div>
        </div>
      </swiper-slide>

      <!-- Pro 计划 -->
      <swiper-slide>
        <div class="plan-card pro" style="background: linear-gradient(to bottom right,#1f1f3a, #2b2929);">
          <div class="card-content">
            <div class="plan-header">
              <div class="title-container">
                <img class="title-bg" src="@/assets/img/vip/pro-2.png" alt="Pro">
                <h3 class="title-text">Pro</h3>
              </div>
            </div>

            <div class="price-area">
              <span class="price">$0</span>
              <span class="period">/月</span>
            </div>

            <div class="divider-wrapper">
              <div class="gradient-divider"></div>
            </div>

            <div class="features">
              <ul>
                <li><check-icon/> 1000个钱包地址监控</li>
                <li><check-icon/> 1000个Token地址监控</li>
                <li><check-icon/> 3000消息/小时</li>
                <li><check-icon/> 多钱包同时买入监控 无限制</li>
                <li><check-icon/> 更多社区支持</li>
              </ul>
            </div>

            <button class="select-btn primary" disabled>免费中</button>
          </div>
        </div>
      </swiper-slide>

      <!-- Business 计划 -->
      <swiper-slide>
        <div class="plan-card business" style="background: linear-gradient(to bottom right, #2b2929, #513759);">
          <div class="card-content">
            <div class="plan-header">
              <div class="title-container">
                <img class="title-bg" src="@/assets/img/vip/business-2.png" alt="Business">
                <h3 class="title-text">Business</h3>
              </div>
            </div>

            <div class="price-area">
              <div class="custom-text">定制方案</div>
            </div>

            <div class="divider-wrapper">
              <div class="gradient-divider"></div>
            </div>

            <div class="features">
              <ul>
                <li><check-icon/> 定制钱包监控数量</li>
                <li><check-icon/> 定制Token监控数量</li>
                <li><check-icon/> 定制数据、监控、交易需求</li>
                <li><check-icon/> 专属1v1客服</li>
              </ul>
            </div>

            <a href="https://t.me/HelloDex_cn" target="_blank" class="contact-btn">联系我们</a>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- 底部说明 -->
    <div class="footer-note">
      更多需求请通过 <a href="https://t.me/HelloDex_cn" target="_blank">Telegram客服</a> 咨询
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

export default {
  components: {
    Swiper,
    SwiperSlide,
    CheckIcon: {
      template: `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
          <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
        </svg>
      `
    },
    XIcon: {
      template: `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="9" fill="none" stroke="#808080" stroke-width="2"/>
          <path d="M10 10l4 4m0 -4l-4 4" stroke="#808080" stroke-width="2" fill="none"/>
        </svg>
      `
    }
  },
  data() {
    return {
      isQuarterly: false
    }
  }
}
</script>

<style scoped>
.mobile-membership {
  padding: 16px;
  background: #121212;
  min-height: 100vh;
}

.mobile-nav {
  text-align: center;
  margin-bottom: 24px;
}

.vip-title {
  font-size: 1.2rem;
  color: #f5f5f5;
  margin: 0;
}

.plan-swiper {
  padding: 8px 0 24px;
  width: 100%;
}

.plan-card {
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  height: 100%;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.plan-header {
  margin-bottom: 16px;
}

.title-container {
  position: relative;
  display: inline-block;
}

.title-bg {
  width: 70px;
  height: 26px;
}

.title-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  color: white;
  font-size: 1rem;
}

.price-area {
  margin-bottom: 16px;
  text-align: center;
}

.price-text, .custom-text {
  font-size: 1.2rem;
  color: #f5f5f5;
  font-weight: 500;
}

.price {
  font-size: 1.5rem;
  color: #f5f5f5;
  font-weight: 700;
}

.period {
  font-size: 0.9rem;
  color: #aaa;
}

.divider-wrapper {
  padding: 8px 0;
}

.gradient-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.2) 30%,
    rgba(255,255,255,0.5) 50%,
    rgba(255,255,255,0.2) 70%,
    transparent 100%
  );
}

.features {
  flex-grow: 1;
  margin-bottom: 20px;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 0.9rem;
  color: #e0e0e0;
}

.features li.disabled {
  color: #757575;
}

.features svg {
  margin-right: 10px;
}

.select-btn, .contact-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
}

.select-btn {
  background: #4e79ff;
  color: white;
}

.select-btn:disabled {
  opacity: 0.7;
}

.contact-btn {
  display: block;
  background: #20c997;
  color: white;
  text-decoration: none;
}

.footer-note {
  text-align: center;
  font-size: 0.8rem;
  color: #9e9e9e;
  padding-top: 16px;
}

.footer-note a {
  color: #4e79ff;
  text-decoration: none;
}

/* 卡片边框颜色 */
.plan-card.free {
  border: 1px solid #5c5d60;
}
.plan-card.start {
  border: 1px solid #4e79ff;
}
.plan-card.pro {
  border: 1px solid #7950f2;
}
.plan-card.business {
  border: 1px solid #20c997;
}
</style>