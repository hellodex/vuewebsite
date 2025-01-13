<template>
  <section class="transaction-box">
    <van-sticky>
      <div class="transaction-head display-flex align-items-center justify-content-sp">
        <div class="transaction-tab display-flex align-items-center">
          <span
            v-for="item in tabList"
            :key="item.id"
            :class="tabIndex == item.id ? 'active' : ''"
            @click="handelTabChange(item)"
            >{{ item.name }}</span
          >
        </div>
        <div class="transaction-icon display-flex align-items-center">
          <svg-icon name="h5-search-md" class="icon" @click="handelSearch"></svg-icon>
        </div>
      </div>
    </van-sticky>
    <AccountTransaction v-if="tabIndex == 4" />
    <div class="transaction-main" v-if="tabIndex == 1">
      <div class="transaction-main-tab display-flex align-items-center justify-content-sp">
        <span
          v-for="item in transactionTabList"
          :key="item.id"
          @click="handelTransactionTaChange(item)"
          :class="transactionTabIndex == item.id ? 'cur' : ''"
          >{{ item.name }}</span
        >
      </div>
      <div class="no-data" v-if="transactionTabIndex == 3">
        <svg-icon name="nodata" class="nodata"></svg-icon>
        <span class="next_version">{{ i18n.t('h5.ComingSoon') }}</span>
      </div>
      <Transaction v-else />
    </div>
    <template v-if="tabIndex == 2">
      <img src="@/assets/icons/futures.svg" alt="" class="img" />
    </template>
    <template v-if="tabIndex == 3">
      <img src="@/assets/icons/copy-trading.svg" alt="" class="img" />
    </template>
  </section>
  <Tabbar :active="2" />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Tabbar from '@/components/SideBar/Tabbar.vue'
import AccountTransaction from '@/components/AppTransaction/AccountTransaction.vue'
import Transaction from '@/components/AppTransaction/Transaction.vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'

const i18n = useI18n()
const router = useRouter()

const globalStore = useGlobalStore()
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const walletType = computed(() => globalStore.walletInfo.walletType)
const tabIndex = ref<number>(
  !isConnected.value || (isConnected.value && walletType.value == 'Email') ? 4 : 1
)

const tabList = computed(() => {
  if (isConnected.value) {
    return walletType.value == 'Email'
      ? [
          {
            name: '交易',
            id: 4
          },
          {
            id: 2,
            name: i18n.t('h5.Futures')
          },
          {
            id: 3,
            name: i18n.t('h5.Copy')
          }
        ]
      : [
          {
            name: '兑换/跨链',
            id: 1
          },
          {
            id: 2,
            name: i18n.t('h5.Futures')
          },
          {
            id: 3,
            name: i18n.t('h5.Copy')
          }
        ]
  } else {
    return [
      {
        id: 4,
        name: '交易'
      },
      {
        id: 1,
        name: '兑换/跨链'
      },
      {
        id: 2,
        name: i18n.t('h5.Futures')
      },
      {
        id: 3,
        name: i18n.t('h5.Copy')
      }
    ]
  }
})

const handelTabChange = (item: { id: number }) => {
  tabIndex.value = item.id
}

const transactionTabList = [
  {
    id: 1,
    name: i18n.t('home.swap')
  },
  {
    id: 2,
    name: i18n.t('home.314')
  },
  {
    id: 3,
    name: i18n.t('home.HelloDexBot')
  }
]
const transactionTabIndex = ref<number>(1)

const handelTransactionTaChange = (item: { id: number }) => {
  transactionTabIndex.value = item.id
}

const handelSearch = () => {
  router.push('/Search')
}
</script>

<style lang="scss" scoped>
.transaction-box {
  padding-bottom: var(--van-tabbar-height);

  .transaction-head {
    padding: 0.32rem 0.4267rem;
    background-color: var(--font-color-default);
  }
  .transaction-tab {
    span {
      color: #9c9c9c;
      font-size: 0.4267rem;
      font-style: normal;
      margin-left: 0.3733rem;
    }
    span:first-child {
      margin-left: 0;
    }
    .active {
      color: #202020;
    }
  }
  .transaction-icon {
    .icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-left: 0.32rem;
      color: #9c9c9c;
    }
  }
  .transaction-main {
    padding: 0.2133rem 0.4267rem;
    .transaction-main-tab {
      padding: 0.1067rem;
      border-radius: 0.2133rem;
      background: #f2f2f2;
      margin-bottom: 0.4267rem;
      span {
        display: block;
        width: 2.8267rem;
        height: 0.4267rem;
        height: 0.7467rem;
        text-align: center;
        line-height: 0.7467rem;
        font-size: 0.3733rem;
        color: #9c9c9c;
        background-color: #f2f2f2;
        border-radius: 0.2133rem;
      }
      .cur {
        color: #202020;
        background-color: #fff;
      }
    }
  }
  .img {
    width: 100%;
  }
}
</style>
