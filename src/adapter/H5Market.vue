<template>
  <section class="h5-market">
    <van-sticky>
      <div class="market-head display-flex align-items-center justify-content-sp">
        <div class="market-head-item display-flex align-items-center">
          <span
            v-for="item in marketTabList"
            :key="item.id"
            :class="marketTabIndex == item.id ? 'active' : ''"
            @click="handelMarketTab(item)"
            >{{ item.name }}</span
          >
        </div>
        <svg-icon name="h5-search-md" class="search-md" @click="handelSearch"></svg-icon>
      </div>
    </van-sticky>
    <div class="market-chain" v-if="marketTabIndex == 8">
      <div class="chain-tab display-flex align-items-center">
        <span
          :class="chainTabIndex == item.chainType ? 'cur' : ''"
          v-for="item in chainTabList"
          :key="item.chainType"
          @click="handelChainTab(item)"
          >{{ item.chainName }}</span
        >
      </div>
      <CoinItem :list="listData" @handelItemClick="handelJump" v-if="listData?.length > 0" />
      <div class="nodata-main" v-else-if="listData?.length == 0">
        <svg-icon name="nodata" class="nodata"></svg-icon>
        <span>{{ i18n.t('h5.Nodata') }}</span>
      </div>
    </div>
    <div class="market-stream" v-if="marketTabIndex == 10">
      <CoinItem :list="listData" @handelItemClick="handelJump" v-if="listData?.length > 0" />
      <div class="nodata-main" v-else-if="listData?.length == 0">
        <svg-icon name="nodata" class="nodata"></svg-icon>
        <span>{{ i18n.t('h5.Nodata') }}</span>
      </div>
    </div>
    <div class="market-value" v-if="marketTabIndex == 11">
      <CoinItem :list="listData" @handelItemClick="handelJump" v-if="listData?.length > 0" />
      <div class="nodata-main" v-else-if="listData?.length == 0">
        <svg-icon name="nodata" class="nodata"></svg-icon>
        <span>{{ i18n.t('h5.Nodata') }}</span>
      </div>
    </div>
    <div class="market-launchpad" v-if="marketTabIndex == 99">
      <div class="launchpad-periods">
        <h3 class="periods-h3">{{ i18n.t('h5.NO1') }}</h3>
        <div class="periods-title display-flex align-items-center">
          <svg-icon name="logo1" class="img"></svg-icon>
          <strong>Ave</strong>
          <span>{{ i18n.t('h5.Upcoming') }}</span>
        </div>
        <p class="periods-p display-flex align-items-center justify-content-sp">
          <span>{{ i18n.t('h5.StartTime') }}</span>
          <span>{{ i18n.t('h5.LaunchSoon') }}</span>
        </p>
        <p class="periods-p display-flex align-items-center justify-content-sp">
          <span>{{ i18n.t('h5.MiningDuration') }}</span>
          <span>7{{ i18n.t('h5.day') }}</span>
        </p>
        <p class="periods-p display-flex align-items-center justify-content-sp">
          <span>{{ i18n.t('h5.EndTime') }}</span>
          <span>{{ i18n.t('h5.TBD') }}</span>
        </p>
      </div>
      <div class="launchpad-pond">
        <div class="pond-title display-flex align-items-center">
          <svg-icon name="logo1" class="img"></svg-icon>
          <strong>HelloDex {{ i18n.t('h5.RewardPool') }}</strong>
        </div>
        <p class="pond-p display-flex align-items-center">
          <span>{{ i18n.t('h5.Participants') }}：</span>
          <strong>{{ numberFormat(1000000) }}</strong>
        </p>
      </div>
    </div>
    <div class="no-data" v-if="marketTabIndex == 999">
      <svg-icon name="nodata" class="nodata"></svg-icon>
      <span class="next_version">{{ i18n.t('h5.ComingSoon') }}</span>
    </div>
  </section>
  <Tabbar :active="1" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showLoadingToast, closeToast } from 'vant'
import { getAppRankings, getAppPriceListByPairAddress } from '@/api'
import { dataAssembly, numberFormat } from '@/utils'

import CoinItem from '@/adapter/components/H5CoinItem.vue'
import Tabbar from '@/components/SideBar/Tabbar.vue'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const globalStore = useGlobalStore()
const { chainList } = globalStore

const router = useRouter()
const listRes = ref<any>([])
const listData = ref<any>(null)

const marketTabList = [
  {
    id: 8,
    name: i18n.t('h5.Chain')
  },
  {
    id: 10,
    name: i18n.t('h5.Mainstream')
  },
  {
    id: 11,
    name: i18n.t('h5.Capital')
  },
  {
    id: 99,
    name: 'Launchpad'
  },
  {
    id: 999,
    name: 'NFT'
  }
]
const marketTabIndex = ref<number>(8)
const handelMarketTab = (item: { id: number }) => {
  marketTabIndex.value = item.id
  if ([8, 10, 11].includes(marketTabIndex.value)) {
    listData.value = null
    getRanking()
  }
}

const chainTabList = ref<any>([])
const chainTabIndex = ref<number>(1)
const handelChainTab = (item: { chainType: number }) => {
  chainTabIndex.value = item.chainType
  listData.value = null
  if (chainTabIndex.value !== 0) {
    getRanking()
  } else {
    listData.value = []
  }
}

const getChain = async () => {
  const arr =
    chainList
      .map((item: any) => {
        return {
          chainName: item.chainName,
          chainType: item.chainType,
          chainCode: item.chainCode
        }
      })
      .filter((item: any) => item.chainType !== -1) || []
  chainTabList.value = [
    {
      chainName: i18n.t('h5.Favorite'),
      chainType: 0,
      chainCode: 'Optional'
    },
    ...arr
  ]
}
const getRanking = async () => {
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: i18n.t('h5.loading')
  })
  const res = await getAppRankings({
    type: marketTabIndex.value,
    chainCode:
      marketTabIndex.value == 8
        ? chainTabList.value.find(
            (item: { chainType: number }) => item.chainType == chainTabIndex.value
          ).chainCode
        : null
  })
  listRes.value = res || []
  if (listRes.value.length == 0) {
    listData.value = []
    closeToast()
    return false
  }
  getPriceList()
}

const getPriceList = async () => {
  const res: any = await getAppPriceListByPairAddress({
    ids: listRes.value.map(
      (item: { pairAddress: string; chainCode: string }) => `${item.pairAddress}-${item.chainCode}`
    )
  })
  listData.value = dataAssembly(listRes.value, res).map((item) => {
    return {
      logo: item.logo,
      chainCode: item.chainCode,
      baseTokenSymbol: item.baseToken?.symbol || '-',
      quoteTokenSymbol: item.quoteToken?.symbol || '-',
      pairAddress: item.pairAddress,
      tradeTvl: item.priceByPairAddress.tradeTvl,
      tvl: item.priceByPairAddress.tvl,
      price: item.priceByPairAddress.price,
      chg: item.priceByPairAddress.chg
    }
  })
  closeToast()
}

const handelSearch = () => {
  router.push('/Search')
}

const handelJump = (item: any) => {
  router.push(`/k/${item.pairAddress}?chainCode=${item.chainCode}`)
}

onMounted(async () => {
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: i18n.t('h5.loading')
  })
  await getChain()
  getRanking()
})
</script>

<style lang="scss" scoped>
.h5-market {
  padding-bottom: var(--van-tabbar-height);

  .market-head {
    padding: 0.32rem 0.4267rem;
    background-color: #fff;
    .market-head-item {
      overflow: hidden;
      overflow-x: scroll;
    }
    span {
      color: #9c9c9c;
      font-size: 0.4267rem;
      font-style: normal;
      cursor: pointer;
      margin-left: 0.4rem;
    }
    span:first-child {
      margin-left: 0;
    }
    .active {
      color: #202020;
    }
    .search-md {
      width: 0.5333rem;
      height: 0.5333rem;
      color: #9c9c9c;
      cursor: pointer;
    }
  }
  .market-stream .tabs-content,
  .market-value .tabs-content {
    padding-top: 0;
  }
  .market-nft,
  .nodata-main {
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .next_version {
      width: 4rem;
      height: 2rem;
    }
    span {
      color: #202020;
      font-size: 0.3733rem;
    }
  }
  .market-launchpad {
    padding: 0.32rem 0.4267rem;
    .periods-h3 {
      font-size: 0.4267rem;
      color: #9c9c9c;
    }
    .periods-title {
      margin: 0.3333rem 0 0.8rem;
      .img {
        width: 0.8533rem;
        height: 0.8533rem;
      }
      strong {
        font-size: 0.48rem;
        color: #202020;
        margin: 0 0.2667rem;
        font-weight: normal;
      }
      span {
        padding: 0.04rem 0.08rem;
        border-radius: 0.04rem;
        background-color: #f5f5f5;
        color: #9c9c9c;
      }
    }
    .periods-p {
      font-size: 0.3733rem;
      margin-top: 0.3333rem;
      color: #202020;
    }
  }
  .launchpad-pond {
    border: 1px solid #f5f5f5;
    border-radius: 0.2667rem;
    padding: 0.3333rem;
    margin-top: 0.5333rem;
    .pond-title {
      margin-bottom: 0.5333rem;
      .img {
        width: 0.64rem;
        height: 0.64rem;
      }
      strong {
        font-size: 0.3733rem;
        color: #202020;
        margin: 0 0.2667rem;
        font-weight: normal;
      }
    }
    .pond-p {
      font-size: 0.32rem;
      span {
        color: #9c9c9c;
      }
      strong {
        color: #202020;
        font-weight: normal;
      }
    }
  }
  .chain-tab {
    padding: 0 0.4267rem;
    overflow: hidden;
    overflow-x: scroll;
    span {
      color: #9c9c9c;
      font-size: 0.4267rem;
      line-height: 0.5333rem;
      padding-bottom: 0.16rem;
      border-bottom: 0.0533rem solid #fff;
      margin-left: 0.4rem;
      white-space: nowrap;
      cursor: pointer;
    }
    span:first-child {
      margin-left: 0;
    }
    .cur {
      color: #202020;
      border-bottom: 0.0533rem solid #202020;
    }
  }
}
</style>
