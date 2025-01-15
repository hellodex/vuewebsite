<template>
  <el-scrollbar height="calc(100vh - 1.92rem)" class="app-invite">
    <section class="app-invite">
      <van-sticky>
        <div class="invite-head display-flex align-items-center">
          <svg-icon name="chevron-left" class="icon-arrow" @click="handelRouter"></svg-icon>
          <span class="invite-head-title">{{ i18n.t('invite.GetPoints') }}</span>
          <span class="invite-head-right" @click="show = true">{{
            i18n.t('invite.ConvertTo$HelloDex')
          }}</span>
        </div>
      </van-sticky>
      <div class="invite-main">
        <div class="display-flex align-items-center invite-tab-items">
          <div
            :class="
              tabIndex == item.id
                ? 'active tab-item display-flex align-items-center flex-direction-col'
                : 'tab-item display-flex align-items-center flex-direction-col'
            "
            v-for="item in tabList"
            :key="item.id"
            @click="handelTabChange(item)"
          >
            <span>{{ item.name }}</span>
            <strong></strong>
          </div>
        </div>
        <div
          class="address-disconnet display-flex align-items-center"
          @click="handelDisconnect"
          v-if="walletConnectedStatus"
        >
          <span class="address">{{ shortifyAddress(walletAddress) }}</span>
          <svg-icon
            name="log-in-01"
            class="log-in"
            style="color: rgba(246, 70, 93, 0.4)"
          ></svg-icon>
        </div>
        <div class="num-main display-flex align-items-fs justify-content-sp" v-if="tabIndex == 1">
          <div class="num-left display-flex flex-direction-col">
            <span>{{ i18n.t('invite.MyPoints') }}</span>
            <strong>{{ walletConnectedStatus ? initPointsData.invitationPoints : 0 }}</strong>
            <span
              >{{ i18n.t('invite.SignInPoints') }} + {{ i18n.t('invite.InvitationPoints') }}</span
            >
            <div
              class="sign-in"
              v-if="walletConnectedStatus && initPointsData.checkinStatus === '1'"
              @click="handelSignIn"
            >
              <el-button type="primary" class="num-btn">{{ i18n.t('invite.SignIn') }}</el-button>
              <span class="tag">+5</span>
            </div>
            <div
              class="sign-in"
              v-if="walletConnectedStatus && initPointsData.checkinStatus === '0'"
            >
              <el-button type="info" class="num-btn">{{ i18n.t('invite.SignedIn') }}</el-button>
              <span class="tag">+5</span>
            </div>
          </div>
          <svg-icon name="invite-img" class="invite-img"></svg-icon>
        </div>

        <div class="num-main display-flex align-items-fs justify-content-sp" v-if="tabIndex == 2">
          <div class="num-left display-flex flex-direction-col">
            <span>{{ i18n.t('invite.MyPoints') }}</span>
            <strong>{{ walletConnectedStatus ? initPointsData.swapPoints : 0 }}</strong>
            <span>{{ i18n.t('invite.TradingPoints') }}</span>
            <el-button
              type="primary"
              class="num-btn"
              v-if="walletConnectedStatus"
              @click="handelRouter"
              >{{ i18n.t('invite.Trade') }}</el-button
            >
          </div>
          <svg-icon name="invite-img" class="invite-img"></svg-icon>
        </div>

        <div
          class="card-box link-Wallet display-flex flex-direction-col justify-content-sp"
          v-if="!walletConnectedStatus"
        >
          <h3>{{ i18n.t('connect') }}</h3>
          <div class="text display-flex flex-direction-col align-items-center">
            <i>
              <svg-icon name="link-broken-01" class="link-broken"></svg-icon>
            </i>
            <span>{{ i18n.t('invite.connectingWeb3wallet') }}</span>
          </div>

          <el-button type="primary" class="link-btn" @click="open" v-if="tgWebAppData">{{
            i18n.t('connect')
          }}</el-button>
          <H5WalletConnect v-else />
          <!-- <TonConnectButton className="custom-class"> </TonConnectButton> -->
        </div>
        <div
          class="card-box invite-card display-flex flex-direction-col justify-content-sp"
          v-if="walletConnectedStatus && initPointsData.isInvited === '0' && tabIndex == 1"
        >
          <h3 class="display-flex align-items-center">
            <svg-icon name="users-02" class="users-02"></svg-icon>
            <span>{{ i18n.t('invite.EnterInvitationCode') }}</span>
          </h3>
          <p>{{ i18n.t('invite.EnterCode') }}</p>
          <div class="display-flex align-items-center justify-content-sp">
            <van-field
              v-model="code"
              :label="i18n.t('invite.InvitationCode') + '：'"
              :placeholder="i18n.t('invite.EnterInvitationCode')"
              autocomplete="off"
              :border="false"
            />
            <el-button type="primary" class="bind-btn" @click="handelBind">{{
              i18n.t('invite.Bind')
            }}</el-button>
          </div>
        </div>

        <div
          class="invite-content"
          v-if="walletConnectedStatus && initPointsData.isInvited === '1' && tabIndex == 1"
        >
          <div class="card-box invite-friends display-flex flex-direction-col justify-content-sp">
            <h3 class="display-flex align-items-center justify-content-sp">
              <div class="display-flex align-items-center">
                <svg-icon name="users-plus" class="users-plus"></svg-icon>
                <span>{{ i18n.t('invite.InviteFriends') }}</span>
              </div>
              <i v-copy="copyText(url)">
                {{ i18n.t('invite.SharetoEarn') }}
                <svg-icon name="share-07" class="share-07"></svg-icon>
              </i>
            </h3>
            <div
              class="display-flex align-items-center justify-content-sp"
              style="margin-top: 0.4267rem"
            >
              <p>{{ i18n.t('invite.InvitationWebsite') }}</p>
              <div class="display-flex align-items-center invite-friends-text">
                <span>{{ url }}</span>
                <svg-icon name="copy" class="copy" v-copy="copyText(url)"></svg-icon>
              </div>
            </div>
            <div
              class="display-flex align-items-center justify-content-sp"
              style="margin-top: 0.4267rem"
            >
              <p>{{ i18n.t('invite.MyInvitationCode') }}</p>
              <div class="display-flex align-items-center invite-friends-text">
                <span>{{ initPointsData.invitationCode }}</span>
                <svg-icon name="copy" class="copy" v-copy="copyText(url)"></svg-icon>
              </div>
            </div>
          </div>
          <div class="card-box invite-list display-flex flex-direction-col">
            <h3 class="display-flex align-items-center justify-content-sp">
              <div class="display-flex align-items-center">
                <svg-icon name="clock" class="clock"></svg-icon>
                <span>{{ i18n.t('invite.InvitationHistory') }}</span>
              </div>
              <i>{{ i18n.t('invite.equivalent') }}</i>
            </h3>
            <div class="invite-list-head display-flex align-items-center justify-content-sp">
              <span>{{ i18n.t('invite.Invited') }}</span>
              <span
                >{{ numFormat(initPointsData.totalInviteNum || 0) }}
                {{ i18n.t('invite.people') }}</span
              >
            </div>
            <div
              class="invite-list-item display-flex align-items-center justify-content-sp"
              v-for="(item, index) in initPointsData.invitationEvents"
              :key="index"
            >
              <span>{{ formatDate(item.time) }}</span>
              <span>{{ shortifyAddress(item.invitee) }}</span>
              <div class="display-flex align-items-center invite-list-item-right">
                <strong class="down" v-if="item.verify == 0">{{ i18n.t('invite.Trade') }}</strong>
                <strong class="up" v-else-if="item.verify == 1">{{
                  i18n.t('invite.Invite')
                }}</strong>
                <strong class="up" v-if="item.verify == 2">{{ i18n.t('invite.SignIn') }}</strong>
                <span>+{{ item.amount || 0 }}{{ i18n.t('invite.Points') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="transaction-content" v-if="tabIndex == 2">
          <div class="card-box transaction-list display-flex flex-direction-col">
            <h3 class="display-flex align-items-center">
              <svg-icon name="icon-tag" class="icon-tag"></svg-icon>
              <span>{{ i18n.t('invite.TradingHistory') }}</span>
            </h3>
            <div
              class="transaction-list-item display-flex align-items-center justify-content-sp"
              v-for="(item, index) in initPointsData.swapEvents"
              :key="index"
            >
              <span>{{ formatDate(item.time) }}</span>
              <span>{{ item.baseSymbol }}/{{ item.quoteSymbol }}</span>
              <strong>+{{ item.amount || 0 }}{{ i18n.t('invite.Points') }}</strong>
            </div>
          </div>
        </div>
      </div>
      <div
        class="app-invite-footer display-flex align-items-center justify-content-sp"
        v-if="walletConnectedStatus && initPointsData.isInvited === '1'"
      >
        <el-button type="primary" class="invite-btn" v-copy="copyText(url)">{{
          i18n.t('invite.InviteToEarn')
        }}</el-button>
        <a href="https://lnk.bio/HelloDex" target="_blank">
          <svg-icon name="download-01" class="download-01"></svg-icon>
        </a>
      </div>
    </section>
  </el-scrollbar>
  <van-popup v-model:show="show" :style="{ width: '100%' }">
    <div class="rule-text display-flex flex-direction-col">
      <div class="rule-text-title">{{ i18n.t('invite.GovernanceTokensConvertableRules') }}</div>
      <div class="rule-text-items display-flex flex-direction-col">
        <p class="display-flex align-items-fs">
          <i>1、</i>
          <span>{{ i18n.t('invite.ConvertableRules1') }}</span>
        </p>
        <p class="display-flex align-items-fs">
          <i>2、</i>
          <span>{{ i18n.t('invite.ConvertableRules2') }}</span>
        </p>
        <p class="display-flex align-items-fs">
          <i>3、</i>
          <span>{{ i18n.t('invite.ConvertableRules3') }}</span>
        </p>
        <p class="display-flex align-items-fs">
          <i>4、</i>
          <span>{{ i18n.t('invite.ConvertableRules4') }}</span>
        </p>
        <p class="display-flex align-items-fs">
          <i>5、</i>
          <span>{{ i18n.t('invite.ConvertableRules5') }}</span>
        </p>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import H5WalletConnect from '@/components/Wallet/H5WalletConnect.vue'
import { showFailToast } from 'vant'
import { useTonConnectModal, useTonAddress, useTonConnectUI } from '@townsquarelabs/ui-vue'
import { ElMessageBox } from 'element-plus'
import { APIinitPointsPage, APIbindInvitationCode, APIearnCheckinPoints } from '@/api'
import { formatDate, shortifyAddress, numFormat, isAllSpaces } from '@/utils'
import { useGlobalStore } from '@/stores/global'

import { useConnectWallet } from '@/hooks/useConnectWallet'

import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const globalStore = useGlobalStore()

const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const walletType = computed(() => globalStore.walletInfo.walletType)

const { disconnectWallet } = useConnectWallet()

const [tonConnectUI] = useTonConnectUI()
const telegram__initParams = sessionStorage.getItem('__telegram__initParams')
const tgWebAppData = (telegram__initParams && JSON.parse(telegram__initParams)?.tgWebAppData) || ''

const { state, open, close } = useTonConnectModal() // ton链钱包 （Connect Wallet）
const userFriendlyAddress = useTonAddress()
const rawAddress = useTonAddress(false)

const walletAddress = ref<any>(null) // 钱包地址
const walletConnectedStatus = ref<boolean>(false) // 钱包连接状态

const route = useRoute()
const router = useRouter()
const code = ref<any>(route.query.code || '')
const show = ref(false)
const url = ref<string>('')
const tabList = [
  {
    name: i18n.t('invite.InvitationPoints'),
    id: 1
  },
  {
    name: i18n.t('invite.TradingPoints'),
    id: 2
  }
]

const tabIndex = ref<number>(1)

const handelTabChange = (item: { id: number }) => {
  tabIndex.value = item.id
}

const initPointsData = ref<any>({})

// 监听非ton链钱包连接状态
watch(isConnected, () => {
  if (!tgWebAppData) {
    walletConnectedStatus.value = isConnected.value
  }
})

// 监听非ton链钱包地址变化
watch(address, () => {
  if (!tgWebAppData) {
    walletAddress.value = address.value
    address.value && initPoints()
  }
})

// 监听ton链钱包地址变化及连接状态
watch(userFriendlyAddress, (newValue) => {
  if (tgWebAppData) {
    walletAddress.value = userFriendlyAddress.value
    walletConnectedStatus.value = newValue ? true : false
    userFriendlyAddress.value && initPoints()
  }
})

const initPoints = async () => {
  const res: any = await APIinitPointsPage({
    walletAddress: walletAddress.value
  })
  initPointsData.value = res
  if (res?.invitationCode) {
    url.value = tgWebAppData
      ? `https://t.me/HelloDexBot/hellodex?startapp=${res.invitationCode}`
      : `${window.location.origin}/Invite?code=${res.invitationCode}`
  }
}

const copyText = (param: string) => {
  const text = `快来HelloDex，免费送币，来翻身！\n\n一起开创和主导Web3利益分配变革的去中心化交易所！送币地址: ${param} \n\nAve抢走用户一年1亿USDT去买车房嫩模😡并且骂用户是韭菜😡\n\nHelloDex：利润80%分给用户的冲土狗神器🚀`
  return text
}

const handelBind = async () => {
  if (isAllSpaces(code.value)) {
    showFailToast('请填写邀请码')
    return false
  }

  const res: any = await APIbindInvitationCode({
    walletAddress: walletAddress.value,
    inviterCode: code.value
  })
  if (res.code == -1) {
    showFailToast('绑定失败，请联系客服')
    return false
  }
  if (res.code == 0) {
    showFailToast('邀请码不存在')
    return false
  }
  code.value = ''
  initPoints()
}

const handelSignIn = async () => {
  if (initPointsData.value.isInvited === '0') {
    showFailToast('请填写邀请码')
    return false
  }

  await APIearnCheckinPoints({
    walletAddress: walletAddress.value
  })
  initPoints()
}

const handelRouter = () => {
  router.push('/')
}

const addressStatus = () => {
  if (tgWebAppData) {
    if (userFriendlyAddress.value) {
      walletConnectedStatus.value = true
      walletAddress.value = userFriendlyAddress.value
      return false
    }
  } else {
    if (address.value && isConnected.value) {
      walletConnectedStatus.value = isConnected.value
      walletAddress.value = address.value
    }
  }
}

const handelDisconnect = () => {
  if (tgWebAppData) {
    ElMessageBox.confirm(i18n.t('disconnectConfirmText'), i18n.t('Tips'), {
      confirmButtonText: i18n.t('Confirm'),
      cancelButtonText: i18n.t('Cancel'),
      type: 'info'
    })
      .then(() => {
        tonConnectUI.disconnect()
      })
      .catch(() => {})
  } else {
    disconnectWallet()
  }
}
onMounted(() => {
  addressStatus()
  walletConnectedStatus.value && initPoints()
})
</script>

<style lang="scss" scoped>
.app-invite {
  background-color: #f9f9f9;
  .app-invite-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0.4267rem;
    width: 100%;
    border-top: 1px solid #f2f2f2;
    background-color: #fff;
    :deep(.invite-btn) {
      width: 7.7333rem;
      height: 1.0667rem;
      font-size: 0.3733rem;
      font-style: normal;
      font-weight: normal;
    }
    a {
      display: block;
      width: 1.0667rem;
      height: 1.0667rem;
      padding: 0.2133rem;
      border-radius: 0.2133rem;
      background: #f2f2f2;
    }
    .download-01 {
      width: 0.64rem;
      height: 0.64rem;
      color: #000000;
    }
  }
  .invite-head {
    padding: 0 0.24rem;
    height: 1.4933rem;
    background-color: #f9f9f9;
    position: relative;
    .icon-arrow {
      width: 0.64rem;
      height: 0.64rem;
      color: #202020;
      position: absolute;
      top: 0.4267rem;
      left: 0.24rem;
    }
    .invite-head-title {
      width: 100%;
      font-size: 0.4267rem;
      font-style: normal;
      font-weight: normal;
      color: #000;
    }
    .invite-head-right {
      color: #000;
      font-size: 0.3733rem;
      position: absolute;
      top: 0;
      right: 0.4267rem;
    }
  }
  .invite-main {
    padding: 0 0.4267rem;
    position: relative;
  }
  .address-disconnet {
    position: absolute;
    top: 0.2133rem;
    right: 0.4267rem;
    .address {
      font-size: 0.3733rem;
      color: #9c9c9c;
      margin-right: 0.1067rem;
    }
    .log-in {
      width: 0.4267rem;
      height: 0.4267rem;
      color: rgba(246, 70, 93, 1) !important;
    }
  }

  .invite-tab-items {
    padding: 0.2133rem 0;
    .tab-item {
      margin-right: 0.4533rem;
      span {
        font-size: 0.3733rem;
        color: #9c9c9c;
      }
      strong {
        width: 0.56rem;
        height: 0.08rem;
        background-color: #f9f9f9;
        margin-top: 0.16rem;
        font-weight: normal;
      }
    }
    .active {
      span {
        color: #202020;
      }
      strong {
        background-color: #202020;
        font-weight: normal;
      }
    }
  }
  .num-main {
    margin: 0.2133rem 0 0.88rem 0;
    .invite-img {
      width: 5.04rem;
      height: 4.56rem;
      position: relative;
      right: -0.4267rem;
    }
    .num-left {
      flex: 1;
      span {
        color: #9c9c9c;
        font-size: 0.32rem;
      }
      span:first-child {
        color: #202020;
        font-size: 0.3733rem;
      }

      strong {
        font-size: 1.0667rem;
        color: #000;
        font-weight: normal;
      }
    }
    .sign-in {
      position: relative;
      width: 3.6267rem;
      .tag {
        position: absolute;
        top: 0.4667rem;
        right: -0.2133rem;
        padding: 0.0533rem 0.16rem 0.0533rem 0.1333rem;
        border-radius: 0.1067rem;
        background: #d6fe38;
        color: #202020;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: normal;
      }
    }
    :deep(.num-btn) {
      margin-top: 0.8rem;
      width: 3.6267rem;
      height: 0.8533rem;
      font-size: 0.3733rem;
    }
  }
  .card-box {
    padding: 0.4267rem;
    background-color: #fff;
    border-radius: 0.2133rem;
    margin-bottom: 0.4267rem;
  }
  .link-Wallet {
    h3 {
      color: #000;
      font-size: 0.3733rem;
      font-style: normal;
    }
    .text {
      margin: 0.4267rem 0 0.64rem 0;
    }
    i {
      display: block;
      border-radius: 50%;
      background: #f9f9f9;
      width: 1.36rem;
      height: 1.36rem;
      padding: 0.2133rem;
    }
    .link-broken {
      width: 0.9333rem;
      height: 0.9333rem;
      color: #e0e0e0;
    }
    span {
      color: #000;
      font-size: 0.32rem;
      font-weight: 400;
      margin-top: 0.1067rem;
    }
    :deep(.link-btn) {
      width: 100%;
      height: 1.0667rem;
      font-size: 0.3733rem;
      font-weight: normal;
    }
  }
  .invite-card {
    h3 {
      span {
        color: #000;
        font-size: 0.4267rem;
        font-style: normal;
        font-weight: normal;
      }
      .users-02 {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.1067rem;
        color: #000;
      }
    }
    p {
      color: #202020;
      margin: 0.2133rem 0 0.4267rem 0;
      font-size: 0.32rem;
    }
    :deep(.van-field) {
      width: 6rem;
      height: 0.96rem;
      padding: 0.1333rem;
      border-radius: 0.2133rem;
      background: #f2f2f2;
      display: flex;
      align-items: center;
      .van-field__label {
        color: #202020;
        font-size: 0.32rem;
        font-weight: normal;
        white-space: nowrap;
        width: auto;
      }
    }
    :deep(.bind-btn) {
      width: 1.8933rem;
      height: 0.96rem;
      font-size: 0.3733rem;
      font-weight: normal;
    }
  }

  .invite-friends {
    h3 {
      color: #000;
      font-size: 0.4267rem;
      i {
        font-size: 12px;
        font-style: normal;
        font-weight: normal;
        color: #9c9c9c;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      .share-07 {
        width: 14px;
        height: 14px;
        color: #9c9c9c;
        margin-left: 2px;
      }
    }
    .users-plus {
      width: 0.5333rem;
      height: 0.5333rem;
      margin-right: 0.1067rem;
      color: #000;
    }
    p {
      color: #202020;
      font-size: 0.32rem;
    }
    .invite-friends-text {
      padding: 0.1067rem 0.32rem 0.1067rem 0.4267rem;
      border-radius: 2.64rem;
      background: #f2f2f2;
      font-size: 0.2667rem;
      color: #3f3f3f;

      .copy {
        color: #9c9c9c;
        width: 0.4rem;
        height: 0.4rem;
        margin-left: 0.0533rem;
      }
    }
  }
  .invite-list {
    h3 {
      color: #000;
      font-size: 0.4267rem;
      margin-bottom: 0.4267rem;
      span {
        white-space: nowrap;
      }
      i {
        font-size: 12px;
        font-style: normal;
        font-weight: normal;
        color: #9c9c9c;
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-left: 0.1067rem;
      }
    }
    .clock {
      width: 0.5333rem;
      height: 0.5333rem;
      margin-right: 0.1067rem;
      color: #000;
    }

    .invite-list-head {
      padding: 0.2133rem;
      border-radius: 0.2133rem;
      background: #f9f9f9;
      color: #3f3f3f;
      font-size: 0.3733rem;
    }
    .invite-list-item {
      padding: 0.2133rem;
      span {
        color: #9c9c9c;
        font-size: 0.32rem;
      }
      .invite-list-item-right {
        width: 2.4rem;
        justify-content: flex-start;
        strong {
          padding: 0.0267rem 0.0533rem;
          min-width: 1rem;
          width: 1rem;
          border-radius: 0.1067rem;
          font-size: 0.2133rem;
          margin-right: 0.0667rem;
          text-align: center;
          font-weight: normal;
        }
        .down {
          color: #f6465d;
          border: 1px solid #f6465d;
        }
        .up {
          color: #2ebd85;
          border: 1px solid #2ebd85;
        }
        span {
          color: #3f3f3f;
          font-weight: 400;
        }
      }
    }
  }

  .transaction-list {
    h3 {
      color: #000;
      font-size: 0.4267rem;

      margin-bottom: 0.4267rem;
    }
    .icon-tag {
      width: 0.5333rem;
      height: 0.5333rem;
      margin-right: 0.1067rem;
      color: #000;
    }

    .transaction-list-item {
      padding: 0.2133rem;
      span {
        color: #9c9c9c;
        font-size: 0.32rem;
      }

      strong {
        color: #3f3f3f;
        font-weight: normal;
      }
    }
  }
}
.custom-class {
  :deep(button) {
    background-color: #1f2a37;
    border-radius: 8px;
    height: 1.0667rem;
  }
}

.rule-text {
  padding: 0.4rem 0.2667rem;
  .rule-text-title {
    text-align: center;
    font-size: 0.3733rem;
    color: #000;
    margin-bottom: 0.4rem;
  }
  .rule-text-items {
    color: #9c9c9c;
    font-size: 0.32rem;
    i {
      font-style: normal;
    }
    p {
      margin-bottom: 0.2rem;
    }
  }
}
</style>
