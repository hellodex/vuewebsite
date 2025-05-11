<template>
  <div class="desktop-membership">
    <div class="container">
      <!-- 标题区域 -->
      <div class="header">
        <h1 class="vip-title">请选择你想要开通的会员</h1>
<!--        <div class="period-switch">
          <span>月付</span>
          <label class="switch">
            <input type="checkbox" v-model="isQuarterly">
            <span class="slider"></span>
          </label>
          <span>季付</span>
        </div>-->
      </div>

      <!-- 会员计划网格 -->
      <div class="plans-grid">
        <!-- Free 计划 -->
        <div class="plan-card free" style="background: linear-gradient(to bottom right, #020202, #272829);box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div class="card-content">
            <div class="plan-header">
              <div class="title-container">
                <img class="title-bg" src="@/assets/img/vip/free-2.png" alt="背景">
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
                <li>
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  100个钱包地址监控
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  100个Token地址监控
                </li>
<!--                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    &lt;!&ndash; 透明背景 &ndash;&gt;
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    &lt;!&ndash; 白色对勾 &ndash;&gt;
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  4个推特用户监控
                </li>-->
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  2000条消息/小时
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  多钱包同时买入监控 * 3
                </li>
                <li class="disabled">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 灰色圆圈 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="#808080"  stroke-width="2"/>
                    <!-- 灰色X符号 -->
                    <path d="M10 10l4 4m0 -4l-4 4" stroke="#808080"    stroke-width="2" fill="none"/>
                  </svg>
                  更多社区支持
                </li>
              </ul>
            </div>

<!--            <button class="select-btn" disabled>
              当前使用中
            </button>-->

            <button class="select-btn primary" disabled>
              免费中
            </button>
          </div>
        </div>

        <!-- Start 计划 -->
        <div class="plan-card start highlighted"  style="background: linear-gradient(to bottom right, #2b2929, #141415);box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
<!--          <div class="card-highlight"></div>-->
          <div class="card-content">
            <div class="plan-header">
              <div class="title-container">
                <img class="title-bg" src="@/assets/img/vip/start-2.png" alt="背景">
                <h3 class="title-text">Start</h3>
              </div>
            </div>

            <div class="price-area">
              <span class="price">${{ isQuarterly ? '49.9' : '0' }}</span>
              <span class="period">/{{ isQuarterly ? '季' : '月' }}</span>
            </div>

            <div class="divider-wrapper">
              <div class="gradient-divider"></div>
            </div>

            <div class="features">
              <ul>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  500个钱包地址监控
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  500个Token地址监控
                </li>
<!--                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    &lt;!&ndash; 透明背景 &ndash;&gt;
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    &lt;!&ndash; 白色对勾 &ndash;&gt;
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  10个推特用户监控
                </li>-->
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  2500条消息/小时
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  多钱包同时买入监控 * 10
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  更多社区支持
                </li>
              </ul>
            </div>

<!--            <button class="select-btn primary">
              立即开通
            </button>-->
            <button class="select-btn primary" disabled>
              免费中
            </button>
          </div>
        </div>

        <!-- Pro 计划 -->
        <div class="plan-card pro" style="background: linear-gradient(to bottom right,#1f1f3a, #2b2929);box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div class="card-content">
            <div class="plan-header">
              <div class="title-container">
                <img class="title-bg" src="@/assets/img/vip/pro-2.png" alt="背景">
                <h3 class="title-text">Pro</h3>
              </div>
            </div>

            <div class="price-area">
              <span class="price">${{ isQuarterly ? '79.9' : '0' }}</span>
              <span class="period">/{{ isQuarterly ? '季' : '月' }}</span>
            </div>

            <div class="divider-wrapper">
              <div class="gradient-divider"></div>
            </div>

            <div class="features">
              <ul>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  1000个钱包地址监控
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  1000个Token地址监控
                </li>
<!--                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    &lt;!&ndash; 透明背景 &ndash;&gt;
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    &lt;!&ndash; 白色对勾 &ndash;&gt;
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  20个推特用户监控
                </li>-->
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  3000消息/小时
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  多钱包同时买入监控 无限制
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  更多社区支持
                </li>
              </ul>
            </div>

<!--            <button class="select-btn">
              立即升级
            </button>-->
            <button class="select-btn primary" disabled>
              免费中
            </button>
          </div>
        </div>

        <!-- Business 计划 -->
        <div class="plan-card business" style="background: linear-gradient(to bottom right, #2b2929, #513759);;box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div class="card-content">
            <div class="plan-header">
              <div class="title-container">
                <img class="title-bg" src="@/assets/img/vip/business-2.png" alt="背景">
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
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  定制钱包监控数量
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  定制Token监控数量
                </li>
<!--                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    &lt;!&ndash; 透明背景 &ndash;&gt;
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    &lt;!&ndash; 白色对勾 &ndash;&gt;
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  定制Twitter监控数量
                </li>-->
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  定制数据、监控、交易需求
                </li>
                <li>
                   <svg viewBox="0 0 24 24" width="24" height="24">
                    <!-- 透明背景 -->
                    <circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="2"/>
                    <!-- 白色对勾 -->
                    <path d="M9 12l2 2l4 -4" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                  专属1v1客服
                </li>
              </ul>
            </div>

           <a href="https://t.me/HelloDex_cn" target="_blank" class="contact-btn">
              联系我们
            </a>
<!--            <button class="select-btn primary" disabled>
              免费中
            </button>-->
          </div>
        </div>
      </div>

      <!-- 底部说明 -->
      <div class="footer-note">
        更多需求或者合作请咨询我们的 <a href="https://t.me/HelloDex_cn" target="_blank">Telegram客服</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isQuarterly: false
    }
  }
}
</script>

<style scoped>



.container {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 0.6rem;
  margin-bottom: 16px;
}

.period-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 12px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #5c6068;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4e79ff;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.plan-card {
  position: relative;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
  width: 6rem;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.plan-card.highlighted {
  border: 2px solid #4e79ff;
}

.card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4e79ff, #8a2be2);
}

.card-content {
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.plan-header h3 {
  color: #f5f5f5;
  margin: 0;
}

.plan-badge {
  display: flex;
  align-items: center;
}

.plan-badge img {
  margin-right: 8px;
}

.price-area {
  margin-bottom: 24px;
  font-size: 1rem;
}

.price {

  font-weight: 700;

}

.period {
  font-size: 1rem;
  color: #6c757d;
}

.custom-text {
  font-weight: 700;
}

.features {
  flex-grow: 1;
  margin-bottom: 80px;
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
}

.features li.disabled {
  color: #adb5bd;
}

.features svg {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  flex-shrink: 0;
}

.select-btn, .contact-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.select-btn {
  background: #e9ecef;
  color: #495057;
}

.select-btn.primary {
  background: #4e79ff;
  color: white;
  box-shadow: 0 4px 16px rgba(78, 121, 255, 0.3);
}

.select-btn.primary:hover {
  background: #3a66e6;
}

.select-btn:hover:not(:disabled) {
  background: #dee2e6;
}

.select-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.contact-btn {
  display: block;
  text-align: center;
  background: #20c997;
  color: white;
  text-decoration: none;
}

.contact-btn:hover {
  background: #1aa179;
}

.footer-note {
  text-align: center;
  font-size: 0.4rem;
  color: #6c757d;
}

.footer-note a {
  color: #4e79ff;
  text-decoration: none;
}

/* 不同卡片类型的特殊样式 */
.plan-card.free {
  border: 1px solid rgba(97, 98, 102, 0.2);
}

.plan-card.start {
  border: 1px solid rgba(78, 121, 255, 0.2);
}

.plan-card.pro {
  border: 1px solid rgba(121, 80, 242, 0.2);
}

.plan-card.business {
  border: 1px solid rgba(32, 201, 151, 0.2);
}

.title-container {
  position: relative;
  display: inline-block;
}

.title-bg {
  width: 80px; /* 自定义宽度 */
  height: 30px;
  display: block;
}

.title-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  color: white;
  font-size: 1.2em;
}

.gradient-divider {
  margin: 6px;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(200,200,200,0.2) 20%,
    rgba(150,150,150,0.5) 50%,
    rgba(200,200,200,0.2) 80%,
    rgba(255,255,255,0) 100%
  );
  box-shadow:
    0 1px 0 rgba(255,255,255,0.1),
    0 2px 5px rgba(0,0,0,0.1);
  position: relative;
}

.gradient-divider::after {
  content: "";
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #aaa 50%,
    transparent 100%
  );
  border-radius: 50%;
}

</style>