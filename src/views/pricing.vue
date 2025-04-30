<template>
  <section class="pricing-box">
    <div class="pricing-switch display-flex flex-direction-col align-items-center">
      <strong>选择你想要开通的会员</strong>
      <div class="display-flex align-items-center">
        <span>月</span>
        <el-switch
          size="small"
          v-model="value"
          class="ml-2"
          style="--el-switch-on-color: #13ce66"
        />
        <span>季度</span>
      </div>
    </div>
    <div class="pricing-content">
      <div class="pricing-item pricing-item1">
        <div class="pricing-bg1-box">
          <div class="pricing-bg1"></div>
          <div class="pricing-bg2"></div>
          <div class="pricing-bg3"></div>
          <div class="pricing-bg4"></div>
        </div>
        <div class="pricing-item-content">
          <div class="pricing-item-title">
            <div class="tips-box">
              <div class="txt">Free</div>
              <div class="img-box">
                <img src="../assets/img/free-2.webp" alt="" />
              </div>
            </div>
            <div class="text-box">
              <div class="text-box-c">
                <div class="text-t">免费版</div>
              </div>
            </div>
          </div>
          <div class="pricing-item-main">
            <div class="pricing-ul">
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>50个钱包地址监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>50个Token地址监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>2个推特用户监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>2000条消息/小时</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>多钱包同时买入监控 * 1</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleClose /></el-icon>
                <span>更多社区支持 </span>
              </div>
            </div>
            <div class="btn">选择免费版</div>
          </div>
        </div>
      </div>
      <div class="pricing-item pricing-item2">
        <div class="pricing-bg2-box">
          <div class="pricing-bg1"></div>
          <div class="pricing-bg2"></div>
          <div class="pricing-bg3"></div>
          <div class="pricing-bg4"></div>
        </div>
        <div class="pricing-item-content">
          <div class="pricing-item-title">
            <div class="tips-box">
              <div class="txt">Start</div>
              <div class="img-box">
                <img src="../assets/img/start-2.webp" alt="" />
              </div>
            </div>
            <div class="text-box">
              <div class="text-box-c">
                <div class="text-t">$19.9 <span>/mo</span></div>
              </div>
            </div>
          </div>
          <div class="pricing-item-main">
            <div class="pricing-ul">
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>300个钱包地址监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>300个Token地址监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>10个推特用户监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>2000条消息/小时</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>多钱包同时买入监控 * 5</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>更多社区支持</span>
              </div>
            </div>
            <div class="btn">选择基础版</div>
          </div>
        </div>
      </div>
      <div class="pricing-item pricing-item3">
        <div class="pricing-bg3-box">
          <div class="pricing-bg1"></div>
          <div class="pricing-bg2"></div>
          <div class="pricing-bg3"></div>
          <div class="pricing-bg4"></div>
        </div>
        <div class="pricing-item-content">
          <div class="pricing-item-title">
            <div class="tips-box">
              <div class="txt">pro</div>
              <div class="img-box">
                <img src="../assets/img/pro-2.webp" alt="" />
                <div class="fire">🔥</div>
              </div>
            </div>
            <div class="text-box">
              <div class="text-box-c">
                <div class="text-t">$29.9 <span>/mo</span></div>
              </div>
            </div>
          </div>
          <div class="pricing-item-main">
            <div class="pricing-ul">
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>800个钱包地址监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>800个Token地址监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>20个推特用户监控</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>2000条消息/小时</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>多钱包同时买入监控 无限制</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>更多社区支持</span>
              </div>
            </div>
            <div class="btn">选择高级版</div>
          </div>
        </div>
      </div>
      <div class="pricing-item pricing-item4">
        <div class="pricing-bg3-box">
          <div class="pricing-bg1"></div>
          <div class="pricing-bg2"></div>
          <div class="pricing-bg3"></div>
          <div class="pricing-bg4"></div>
        </div>
        <div class="pricing-item-content">
          <div class="pricing-item-title">
            <div class="tips-box">
              <div class="txt">Business</div>
              <div class="img-box">
                <img src="../assets/img/business-2.webp" alt="" />
              </div>
            </div>
            <div class="text-box">
              <div class="text-box-c">
                <div class="text-t">定制版</div>
              </div>
            </div>
          </div>
          <div class="pricing-item-main">
            <div class="pricing-ul">
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>定制钱包监控数量</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>定制token监控数量</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>定制Twitter监控数量</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>定制数据、监控、交易需求</span>
              </div>
              <div class="pricing-li">
                <el-icon><CircleCheck /></el-icon>
                <span>专属1v1客服</span>
              </div>
            </div>
            <div class="btn">联系我们</div>
          </div>
        </div>
      </div>
      <span>
        更多需求或者合作请咨询我们的<a
          href="https://t.me/HelloDex_cn"
          target="_blank"
          style="color: var(--up-color)"
          >Telegram客服</a
        >
      </span>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref<boolean>(false)
</script>

<style scoped lang="scss">
.pricing-box {
  .pricing-switch {
    padding-top: 40px;
    font-size: 14px;
    strong {
      line-height: 2;
      margin-bottom: 16px;
    }
    .ml-2 {
      margin: 0 6px;
    }
  }
  .pricing-content {
    width: 1440px;
    margin: 60px auto 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 32px;
  }
  .pricing-item {
    min-width: 0;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    width: 336px;
  }
  .pricing-bg1 {
    position: absolute;
    width: 116px;
    height: 116px;
    left: 50%;
    top: -70px;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);

    -webkit-filter: blur(50px);
    filter: blur(50px);
  }

  .pricing-bg2 {
    position: absolute;
    width: 150px;
    height: 150px;
    left: 24px;
    top: -120px;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);

    -webkit-filter: blur(100px);
    filter: blur(100px);
  }
  .pricing-bg3 {
    position: absolute;
    width: 150px;
    height: 150px;
    left: 24px;
    top: -120px;

    -webkit-filter: blur(100px);
    filter: blur(100px);
  }
  .pricing-bg4 {
    position: absolute;
    width: 150px;
    height: 150px;
    right: 10px;
    top: -40px;
    -webkit-filter: blur(100px);
    filter: blur(100px);
  }
  .pricing-item-content {
    border-radius: 12px;
    background: #151517;
    border: 1px solid #3f3f46;
    box-shadow:
      inset 0px 6px 8px 0px rgba(255, 255, 255, 0.08),
      inset 0px -8px 22px 0px #0e0e10;
  }
  .pricing-item-title {
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    padding-left: 30px;
    padding-right: 30px;
    background-repeat: no-repeat;
    -webkit-background-position: right top;
    background-position: right top;
    overflow: visible;
    .tips-box {
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
    }
    .txt {
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
      margin-bottom: 16px;
      text-transform: uppercase;
      color: #ffffff;
      position: relative;
      top: 42px;
      left: 12px;
      font-weight: 600;
    }
    .img-box {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .text-box {
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .text-box-c {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .text-t {
      font-size: 48px;
      margin-top: 8px;
      font-weight: 600;
      span {
        font-size: 14px;
        margin-left: -8px;
        color: #5c6068;
        margin-top: 8px;
        margin-bottom: 16px;
      }
    }
  }

  .pricing-item-main {
    padding: 0 30px 24px 30px;
    .pricing-ul {
      position: relative;
      margin-top: 8px;
      padding-top: 8px;
      padding-bottom: 8px;
      min-height: 290px;
    }
    .pricing-li {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      text-decoration: none;
      width: 100%;
      box-sizing: border-box;
      text-align: left;
      padding-bottom: 8px;
      color: #eaecef;
      padding-top: 0px;
      font-size: 15px;
      span {
        margin-left: 6px;
        font-size: 12px;
        line-height: 1.8;
      }
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      min-width: 64px;
      border-radius: 8px;
      padding: 5px 15px;
      background-color: #eaecef;
      color: #18181b;
      height: 48px;
      width: 100%;
      margin-top: 24px;
    }
  }
  .pricing-item1 {
    .pricing-item-title {
      background-image: url('../assets/img/free.png');
    }
    .pricing-item-main {
      .btn {
        background-color: #393c43;
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }
  .pricing-item2 {
    .pricing-bg1 {
      background: rgba(255, 255, 255, 0.7);
    }
    .pricing-bg2 {
      background: #55555f;
    }
    .pricing-bg3 {
      background: #55555f;
    }
    .pricing-bg4 {
      background: #404045;
    }
    .pricing-item-title {
      background-image: url('../assets/img/start.png');
    }
    .pricing-item-main {
      .btn {
        background-color: #eaecef;
        color: #18181b;
      }
    }
  }
  .pricing-item3 {
    .pricing-bg1 {
      background: rgba(146, 187, 255, 0.7);
    }
    .pricing-bg2 {
      background: #377ceb;
    }
    .pricing-bg3 {
      background: #377ceb;
    }
    .pricing-bg4 {
      background: #2f97e7;
    }
    .pricing-item-title {
      background-image: url('../assets/img/pro.png');
      .fire {
        font-size: 20px;
        margin-left: 8px;
      }
    }
    .pricing-item-main {
      .btn {
        background-color: #eaecef;
        color: #18181b;
      }
    }
  }
  .pricing-item4 {
    .pricing-bg1 {
      background: #6469d9;
    }
    .pricing-bg2 {
      background: #7569b2;
    }
    .pricing-bg3 {
      background: #7569b2;
    }
    .pricing-bg4 {
      background: #312d57;
    }
    .pricing-item-title {
      background-image: url('../assets/img/business.png');
    }
    .pricing-item-main {
      .btn {
        background-color: #eaecef;
        color: #18181b;
      }
    }
  }
}
</style>
