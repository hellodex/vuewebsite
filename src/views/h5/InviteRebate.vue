<template>
  <div class="invite-rebate">
    <van-sticky>
      <div class="invite-rebate-head display-flex align-items-center justify-content-sp">
        <svg-icon name="chevron-left" class="chevron-left" @click="router.back()"></svg-icon>
        <span>我的返佣</span>
        <div></div>
      </div>
    </van-sticky>
    <div class="invite-rebate-content">
      <div class="display-flex justify-content-sp">
        <div class="display-flex flex-direction-col">
          <p class="p-txt">链上代币止盈止损</p>
          <p class="p-txt">一起冲土狗</p>

          <span class="commissionRate-txt">{{ (info.commissionRate || 0) * 100 }}%</span>
          <span class="span-txt">返佣比例</span>
        </div>
        <img src="@/assets/icons/rebateinfo.svg" alt="" class="rebateinfo" />
      </div>
      <div class="invite-code-box">
        <div class="display-flex align-items-center justify-content-sp">
          <span>我的邀请码</span>
          <div class="display-flex align-items-center">
            <span class="code-txt">{{ accountInfo.invitationCode }}</span>
            <svg-icon name="icon-copy" class="icon" v-copy="accountInfo.invitationCode"></svg-icon>
          </div>
        </div>
        <div class="display-flex align-items-center justify-content-sp">
          <span>邀请链接</span>
          <div class="display-flex align-items-center">
            <span class="url-txt"
              >{{ tgWebAppData ? 'https://t.me/HelloDexBot' : origin }}...{{
                accountInfo.invitationCode
              }}</span
            >
            <svg-icon
              name="icon-copy"
              class="icon"
              v-copy="tgWebAppData ? helloDexBotUrl : urlRefer"
            ></svg-icon>
          </div>
        </div>
      </div>
      <div class="display-flex flex-direction-col">
        <p class="p-txt">数据总览</p>
        <div class="data-overview-box">
          <div class="display-flex flex-direction-col data-overview-item">
            <span>${{ numberFormat(info.inviteeTradingAmount) }}</span>
            <span class="span-txt">邀请人总交易额</span>
          </div>
          <div class="display-flex align-items-center justify-content-sp data-overview-item">
            <div class="display-flex flex-direction-col">
              <span>${{ numberFormat(info.totalCommissionAmount) }}</span>
              <span class="span-txt">总返佣金额</span>
            </div>
            <div class="display-flex flex-direction-col align-items-fd">
              <span
                class="see-txt display-flex align-items-center"
                @click="router.push('/h5/commission')"
              >
                查看详情
                <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
              </span>
              <span class="span-btn" @click="router.push('/h5/commission')">提现</span>
            </div>
          </div>
        </div>
        <div class="data-num">
          <div class="display-flex align-items-center justify-content-sp">
            <span>
              <span class="span-txt">邀请人数：</span>{{ numberFormat(info.inviteeNum) }}人</span
            >
            <svg-icon
              name="chevron-right"
              class="chevron-right"
              @click="router.push('/h5/commission')"
            ></svg-icon>
          </div>
          <div class="display-flex align-items-center justify-content-sp">
            <span>
              <span class="span-txt">总交易人数：</span
              >{{ numberFormat(info.InviteeTradingNum) }}人</span
            >
            <svg-icon
              name="chevron-right"
              class="chevron-right"
              @click="router.push('/h5/commission')"
            ></svg-icon>
          </div>
        </div>
        <div class="qccode-box display-flex align-items-center justify-content-sp">
          <div class="display-flex flex-direction-col align-items-center" @click="showPopup = true">
            <van-skeleton class="qrcode-img" :loading="loading">
              <template #template> <van-skeleton-image class="qrcode-img" /> </template>
              <img :src="info.qrcodeUrl" alt="" class="qrcode-img" />
            </van-skeleton>

            <span class="qccode-btn">分享邀请码</span>
          </div>
          <div class="display-flex flex-direction-col align-items-fd">
            <img src="@/assets/icons/rebatelogo.svg" alt="" class="rebatelogo-img" />
            <span>HelloDex：利润80%分给所有人的</span>
            <span class="qccode-btn">链上交易工具</span>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      v-model:show="showPopup"
      class="share-popup"
      round
      position="bottom"
      :style="{ height: '90%' }"
      :close-on-click-overlay="false"
    >
      <div class="share-img-dom" ref="shareImg">
        <img src="@/assets/img/trade_share_bg.png" alt="" class="img" />
        <div class="share-dom display-flex flex-direction-col justify-content-sp">
          <div class="share-title-box">
            <div class="display-flex align-items-center">
              <img src="@/assets/icons/logo.svg" alt="" class="logo" />
              <span class="logo-title">HelloDex</span>
            </div>
            <p class="display-flex align-items-center">
              任何平台都要把<i style="color: #2ebd85; font-style: normal">利润80%</i>分给用户
            </p>
            <span class="tips-txt">开创和主导Web3变革</span>
          </div>
          <div class="share-main-box">
            <p>支持链上挂单止盈，挂单抄底</p>
            <p>一键冲土狗</p>
            <img src="@/assets/icons/share_kchart.svg" alt="" class="share_kchart" />
          </div>
          <div class="share-qccode-box display-flex align-items-center justify-content-sp">
            <div class="display-flex flex-direction-col">
              <span>邀请码：{{ accountInfo.invitationCode }}</span>
              <span>扫码加入和我们一起开创Web3变革</span>
            </div>
            <img :src="info.qrcodeUrl" alt="" />
          </div>
        </div>
      </div>
      <div class="share-content">
        <div class="share-title">
          <span>分享</span>
          <svg-icon name="share_close" class="share_close" @click="showPopup = false"></svg-icon>
        </div>
        <div class="share-btn">
          <div>
            <div class="share-info display-flex align-items-center justify-content-sp">
              <span>我的邀请码</span>
              <div class="display-flex align-items-center">
                <span class="code-txt">{{ accountInfo.invitationCode }}</span>
                <svg-icon
                  name="icon-copy"
                  class="icon"
                  v-copy="accountInfo.invitationCode"
                ></svg-icon>
              </div>
            </div>
            <div class="share-info display-flex align-items-center justify-content-sp">
              <span>邀请链接</span>
              <div class="display-flex align-items-center">
                <span class="url-txt"
                  >{{ tgWebAppData ? 'https://t.me/HelloDexBot' : origin }}...{{
                    accountInfo.invitationCode
                  }}</span
                >
                <svg-icon
                  name="icon-copy"
                  class="icon"
                  v-copy="tgWebAppData ? helloDexBotUrl : urlRefer"
                ></svg-icon>
              </div>
            </div>
          </div>

          <div class="display-flex align-items-center justify-content-sp">
            <div class="btn" @click="dowanLoading ? null : handelSaveImage()">
              <el-icon class="is-loading" :size="14" v-if="dowanLoading">
                <Loading />
              </el-icon>
              保存图片
            </div>
            <div class="btn btn-par">立即分享</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script lang="ts" setup>
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import { numberFormat } from '@/utils'

import { APIgetMyCommissionSummary } from '@/api'

const telegram__initParams = sessionStorage.getItem('__telegram__initParams')
const tgWebAppData = (telegram__initParams && JSON.parse(telegram__initParams)?.tgWebAppData) || ''

const route = useRoute()
const router = useRouter()

const globalStore = useGlobalStore()
const accountInfo = computed(() => globalStore.accountInfo)

const origin = window.location.origin
const urlRefer = `${origin}/Refer?invitationCode=${accountInfo.value?.invitationCode}`
const helloDexBotUrl = `https://t.me/HelloDexBot/hellodex?startapp=Refer_invitationCode_${accountInfo.value?.invitationCode}`

const info = ref<any>({})
const loading = ref(false)
const showPopup = ref(false)
const shareImg = ref()
const dowanLoading = ref(false)

const getData = async () => {
  loading.value = true
  const res = await APIgetMyCommissionSummary({})
  // console.log(res)
  const qrcodeUrl = await QRCode.toDataURL(urlRefer, {
    errorCorrectionLevel: 'H'
  })
  info.value = { ...res, qrcodeUrl }
  loading.value = false
}

const handelSaveImage = async () => {
  dowanLoading.value = true
  await html2canvas(shareImg.value, {
    backgroundColor: '#171717'
  }).then((canvas) => {
    dowanLoading.value = false
    let url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'share_img.png'
    a.click()
  })
}

onMounted(() => {
  getData()
})
</script>
<style scoped lang="scss">
.invite-rebate {
  .invite-rebate-head {
    color: var(--bg-color);
    padding: 0.32rem 0.4rem 0.32rem 0.2133rem;
    font-size: 0.4267rem;
    background-color: #fff;
    .chevron-left {
      width: 0.64rem;
      height: 0.64rem;
      color: var(--bg-color);
    }
  }
  .icon {
    width: 0.3467rem;
    height: 0.3467rem;
    margin-left: 0.0533rem;
  }
  .invite-rebate-content {
    padding: 0.4rem;
    color: #202020;
    .p-txt {
      font-size: 0.3467rem;
    }
    .commissionRate-txt {
      font-size: 0.4rem;
      margin-top: 0.32rem;
    }
    .span-txt {
      color: #9c9c9c;
      font-size: 0.32rem;
    }
    .rebateinfo {
      width: 3.2rem;
    }
    .invite-code-box {
      padding: 0.2667rem 0.2133rem;
      border: 0.0267rem solid #e5e5e5;
      border-radius: 0.16rem;
      margin: 0.64rem 0;
      line-height: 1.8;
      font-size: 0.3467rem;
      .code-txt,
      .url-txt {
        white-space: nowrap;
      }
    }
    .chevron-right {
      width: 0.3467rem;
      height: 0.3467rem;
      margin-left: 0.0533rem;
      background-color: #202020;
      color: #fff;
      border-radius: 50%;
    }
    .data-overview-box {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5333rem;
    }
    .data-overview-item {
      margin-top: 0.32rem;
      padding: 0.2667rem 0.2133rem;
      border: 0.0267rem solid #e5e5e5;
      border-radius: 0.16rem;
      line-height: 1.8;
      font-size: 0.3467rem;
      .see-txt {
        font-size: 0.32rem;
      }
      .span-btn {
        border-radius: 0.4267rem;
        background-color: #202020;
        color: #fff;
        height: 0.5333rem;
        line-height: 0.5333rem;
        padding: 0 0.2667rem;
        font-size: 0.2667rem;
      }
    }
    .data-num {
      margin: 0.64rem 0;
      line-height: 2;
    }
    .qrcode-img {
      width: 2.1333rem;
      height: 2.1333rem;
      margin-bottom: 0.5333rem;
      padding: 0;
    }
    .rebatelogo-img {
      width: 3.2rem;
    }
    .qccode-box {
      font-weight: 900;
      font-size: 0.3467rem;
    }
    .qccode-btn {
      padding: 0.0533rem 0.1067rem;
      background-color: #202020;
      color: #fff;
      border-radius: 0.1067rem;
      font-size: 0.2667rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: normal;
    }
  }
  .share-popup {
    background-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 0.32rem;
    .share-img-dom {
      width: 92%;
      height: 65%;
      background-color: #171717;
      border-radius: 0.2667rem;
      position: relative;
      overflow: hidden;
      font-size: 0.32rem;
      .img {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }
      .share-dom {
        width: 100%;
        height: 100%;
        padding: 0.32rem;
        position: relative;
        z-index: 1;
      }
      .share-title-box {
        .logo {
          width: 0.6933rem;
          height: 0.6933rem;
          border: 0.0267rem solid #9c9c9c;
          border-radius: 0.1067rem;
        }
        .logo-title {
          font-size: 0.48rem;
          margin-left: 0.1333rem;
        }
        p {
          margin: 0.16rem 0;
        }
        .tips-txt {
          padding: 0.0533rem;
          border-radius: 0.1067rem;
          border: 0.0267rem solid #9c9c9c;
          font-size: 0.2133rem;
        }
      }
      .share-main-box {
        p {
          font-size: 0.3467rem;
          margin-top: 0.1067rem;
          line-height: 1;
        }
        .share_kchart {
          width: 60%;
          margin-top: 0.2133rem;
          position: relative;
          left: 20%;
        }
      }
      .share-qccode-box {
        line-height: 2;
        img {
          width: 1.3333rem;
          height: 1.3333rem;
        }
      }
    }
    .share-content {
      width: 100%;
      height: 32%;
      background-color: #fff;
      border-radius: 0.2667rem 0.2667rem 0 0;
      padding: 0.2667rem 0.5333rem;
      color: #202020;
      font-size: 0.32rem;
      .share-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.4267rem;
      }
      .share_close {
        width: 0.4267rem;
        height: 0.4267rem;
        display: block;
      }
      .share-btn {
        margin-top: 0.2667rem;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .share-info {
        padding: 0.2667rem;
        background-color: #f9f9f9;
        border-radius: 0.1067rem;
        margin-bottom: 0.2667rem;
        line-height: 1.2;
        color: #9c9c9c;
        .code-txt,
        .url-txt {
          white-space: nowrap;
          color: #202020;
        }
      }
      .btn {
        flex: 1;
        height: 0.8rem;
        border: 0.0267rem solid #202020;
        border-radius: 0.1067rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0.4267rem;
      }
      .btn:last-child {
        margin: 0;
      }
      .btn-par {
        background-color: #202020;
        color: #fff;
      }
    }
  }
}
</style>
