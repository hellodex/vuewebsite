<template>
  <section class="web-invite-box">
    <!-- <svg-icon name="home_bac" class="home_bac"></svg-icon> -->
    <section class="web-invite">
      <div class="display-flex align-items-center justify-content-center web-invite-title">
        <div class="display-flex align-items-center flex-direction-col">
          <span class="text">利润<i>80%</i>分给所有人的</span>
          <svg-icon name="invite-icon" class="invite-icon"></svg-icon>
        </div>
        <span class="btn">去中心化交易所</span>
      </div>
      <div class="invite-content-box" v-if="!isConnected || initPointsData?.isInvited === '0'">
        <div class="invite-operate display-flex flex-direction-col" v-if="!isConnected">
          <div class="invite-operate-title">{{ i18n.t('connect') }}</div>
          <div class="text display-flex flex-direction-col align-items-center">
            <svg-icon name="link-broken-01" class="link-broken"></svg-icon>
            <span>{{ i18n.t('invite.connectingWeb3wallet') }}</span>
          </div>
          <WalletConnect />
        </div>
        <div
          class="invite-operate display-flex flex-direction-col"
          v-if="isConnected && initPointsData.isInvited === '0'"
        >
          <div class="invite-operate-title display-flex align-items-center justify-content-sp">
            <div class="display-flex align-items-center">
              <svg-icon name="users-02" class="users-02"></svg-icon>
              <span>{{ i18n.t('invite.EnterInvitationCode') }}</span>
            </div>
            <div class="display-flex align-items-center" @click="handelDisconnect">
              <span class="address">{{ shortifyAddress(address) }}</span>
              <svg-icon
                name="log-in-01"
                class="log-in"
                style="color: rgba(246, 70, 93, 0.4)"
              ></svg-icon>
            </div>
          </div>
          <p class="txt">{{ i18n.t('invite.EnterCode') }}</p>
          <van-field
            v-model="code"
            :label="i18n.t('invite.InvitationCode') + '：'"
            :border="false"
            :placeholder="i18n.t('invite.EnterInvitationCode')"
            autocomplete="off"
          />
          <div class="link-btn" @click="handelBind">{{ i18n.t('invite.Bind') }}</div>
        </div>
        <div class="rule-text display-flex flex-direction-col">
          <div class="rule-text-title">{{ i18n.t('invite.GovernanceTokensConvertableRules') }}</div>
          <div class="rule-text-items display-flex flex-direction-col">
            <p class="display-flex align-items-fs">
              <i>1</i>
              <span>{{ i18n.t('invite.ConvertableRules1') }}</span>
            </p>
            <p class="display-flex align-items-fs">
              <i>2</i>
              <span>{{ i18n.t('invite.ConvertableRules2') }}</span>
            </p>
            <p class="display-flex align-items-fs">
              <i>3</i>
              <span>{{ i18n.t('invite.ConvertableRules3') }}</span>
            </p>
            <p class="display-flex align-items-fs">
              <i>4</i>
              <span>{{ i18n.t('invite.ConvertableRules4') }}</span>
            </p>
            <p class="display-flex align-items-fs">
              <i>5</i>
              <span>{{ i18n.t('invite.ConvertableRules5') }}</span>
            </p>
          </div>
        </div>
        <p class="tips">
          {{ i18n.t('invite.ClickWhitePaper') }}：
          <a href="http://lnk.bio/HelloDex" target="_blank">http://lnk.bio/HelloDex</a>
        </p>
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { APIinitPointsPage, APIbindInvitationCode } from '@/api'
import { useGlobalStore } from '@/stores/global'
import { shortifyAddress, isAllSpaces } from '@/utils'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'

import { useConnectWallet } from '@/hooks/useConnectWallet'

const i18n = useI18n()
const globalStore = useGlobalStore()
const route = useRoute()

const code = ref<any>(route.query.code || '')

const { disconnectWallet } = useConnectWallet()

const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const walletType = computed(() => globalStore.walletInfo.walletType)

const initPointsData = ref<any>({})

// 监听连接钱包的

watch(address, (newValue) => {
  if (newValue) {
    initPoints()
  }
})

const initPoints = async () => {
  const res: any = await APIinitPointsPage({
    walletAddress: address.value
  })
  initPointsData.value = res
  globalStore.setInvite(initPointsData.value)
}

const handelBind = async () => {
  if (isAllSpaces(code.value)) {
    ElMessage.error('请填写邀请码')
    return false
  }
  const res: any = await APIbindInvitationCode({
    walletAddress: address.value,
    inviterCode: code.value
  })
  if (res.code == -1) {
    ElMessage.error('绑定失败，请联系客服')
    return false
  }
  if (res.code == 0) {
    ElMessage.error('邀请码不存在')
    return false
  }
  code.value = ''
  initPoints()
}

const handelDisconnect = () => {
  disconnectWallet()
}

onMounted(() => {
  isConnected.value && initPoints()
})
</script>

<style lang="scss" scoped>
.web-invite-box {
  width: 100%;
  position: relative;
  .home_bac {
    width: 95vw;
    height: 70vh;
    position: absolute;
    top: 0vh;
    left: 5vw;
    background-color: var(--bg-color);
  }
}
.web-invite {
  width: 100%;
  background-color: transparent;
  position: absolute;
  top: 0;
  z-index: 2;
  .web-invite-title {
    margin-top: 75px;
    margin-bottom: 150px;
    .text {
      color: var(--font-color-default);
      font-size: 27.107px;
      font-style: normal;
    }
    i {
      color: #2ebd85;
      font-style: normal;
    }
    .invite-icon {
      width: 321px;
      height: 10.2px;
      color: #c1c1c1;
    }
    .btn {
      padding: 6.777px 8.132px;
      border-radius: 10.843px;
      background: var(--font-color-default);
      color: var(--bg-color);
      font-size: 21.686px;
      font-style: normal;
    }
  }
  .invite-content-box {
    width: 480px;
    border-radius: 12px;
    background: var(--card-bg-color);
    padding: 16px;
    margin: 0 auto;
    .invite-operate {
      .invite-operate-title {
        font-size: 16px;
        font-style: normal;
        font-weight: normal;
        color: var(--font-color-default);
      }
      .users-02,
      .log-in {
        width: 18px;
        height: 18px;
      }
      .users-02 {
        color: #fff;
        margin-right: 4px;
      }
      .log-in {
        margin-left: 4px;
        cursor: pointer;
      }
      .address {
        color: var(--dex-color-4);
        font-size: 14px;
      }
      :deep(.van-field) {
        padding: 10px;
        border-radius: 8px;
        background: #242424;
        color: #fff;
        --van-field-placeholder-text-color: #838383;
        .van-field__label {
          color: #838383;
          font-size: 14px;
          font-weight: normal;
          width: auto;
        }
        .van-field__control {
          color: #fff;
        }
      }

      .txt {
        margin: 8px 0 24px 0;
      }
      .text {
        margin-top: 8;
        margin-bottom: 30px;
        .link-broken {
          width: 35px;
          height: 35px;
          color: var(--font-color-default);
          margin-bottom: 12px;
        }
        span {
          color: var(--dex-color-4);
          font-size: 12px;
          font-weight: normal;
        }
      }
      :deep(.connect-wallet-btn) {
        padding: 10px 12px;
      }
      .link-btn {
        width: 100%;
        padding: 10px 12px;
        border-radius: 8px;
        background: var(--font-color-default);
        color: var(--bg-color);
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        margin-top: 24px;
      }
    }
    .rule-text {
      margin: 24px 0;
      .rule-text-title {
        font-size: 16px;
        font-style: normal;
        font-weight: normal;
        color: var(--font-color-default);
        margin-bottom: 16px;
      }
      .rule-text-items {
        font-size: 14px;
        font-style: normal;
        color: var(--font-color-default);
        line-height: 1.1;
        font-weight: 400;
        p {
          margin-bottom: 8px;
        }
        i {
          width: 16px;
          min-width: 16px;
          height: 16px;
          display: block;
          background: var(--font-color-default);
          color: var(--bg-color);
          font-size: 12px;
          text-align: center;
          line-height: 16px;
          border-radius: 50%;
          font-style: normal;
          margin-right: 4px;
        }
      }
    }
    .tips {
      color: #6f6f6f;
      font-size: 12px;
      text-align: center;
      a {
        color: #627eea;
        text-decoration: underline;
      }
    }
  }
}
</style>
