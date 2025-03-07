<template>
  <section class="h5-search">
    <van-sticky>
      <div class="search-box">
        <van-field
          v-model="query"
          left-icon="search"
          autocomplete="off"
          :placeholder="i18n.t('enterTokenNameContract')"
          clearable
          @update:model-value="handelInput"
        />
        <span @click="router.back()">{{ i18n.t('Cancel') }}</span>
      </div>
    </van-sticky>
    <div class="search-history">
      <div class="search-history-head">
        <span>{{ i18n.t('searchHistory') }}</span>
        <van-icon name="delete-o" size="16" class="delete-icon" @click="handelDelHistory" />
      </div>
      <div class="search-history-list">
        <div
          class="search-history-item"
          v-for="(item, index) in historyList"
          :key="index"
          @click="handelJump(item)"
        >
          <el-image :src="item.logo" alt="" class="img">
            <template #error>
              <svg-icon name="logo1" class="img"></svg-icon>
            </template>
          </el-image>
          <span>{{ item.baseTokenSymbol || '-' }}</span>
        </div>
      </div>
    </div>
    <CoinItem :list="list" @handelItemClick="handelItem" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAppSearch } from '@/api'

import { debounce, isAllSpaces } from '@/utils'
import { showLoadingToast, closeToast } from 'vant'
import CoinItem from '@/adapter/components/H5CoinItem.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const router = useRouter()

const query = ref<string>('')
const list = ref<any>([])

const historyList = ref<any>([])

async function getAppSearchList() {
  const res: any = await getAppSearch({
    query: query.value
  })
  list.value =
    res?.map((item: any) => {
      return {
        logo: item.logo,
        chainCode: item.chainCode,
        baseTokenSymbol: item.baseToken?.symbol || '-',
        quoteTokenSymbol: item.quoteToken?.symbol || '-',
        pairAddress: item.pairAddress,
        tradeTvl: item.volumeUsd,
        tvl: item.tvl,
        price: item.price,
        chg: item.chg
      }
    }) || []
  closeToast()
}

const handelInput = () => {
  if (isAllSpaces(query.value)) {
    return false
  }
  debounce(() => {
    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: i18n.t('h5.loading')
    })
    getAppSearchList()
  }, 500)
}

const handelItem = (params: any) => {
  const searchHistory: any = localStorage.getItem('searchAppHistory')
  if (searchHistory) {
    const history = JSON.parse(searchHistory)
    if (!history.some((item: { pairAddress: any }) => item.pairAddress == params.pairAddress)) {
      history.push(params)
    }
    localStorage.setItem('searchAppHistory', JSON.stringify(history))
  } else {
    localStorage.setItem('searchAppHistory', JSON.stringify([params]))
  }
  handelJump(params)
}

const handelJump = (item: any) => {
  router.push(`/k/${item.pairAddress}?chainCode=${item.chainCode}`)
}

const handelDelHistory = () => {
  localStorage.removeItem('searchAppHistory')
  historyList.value = []
}

onMounted(() => {
  // showLoadingToast({
  //   duration: 0,
  //   forbidClick: true,
  //   message: i18n.t('h5.loading')
  // })
  const searchHistory: any = localStorage.getItem('searchAppHistory')
  searchHistory
    ? (historyList.value = JSON.parse(searchHistory).reverse())
    : (historyList.value = [])
  // getAppSearchList()
})
</script>

<style scoped lang="scss">
.h5-search {
  .search-box {
    padding: 0.32rem 0.4267rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    :deep(.van-field) {
      width: 7.8933rem;
      border-radius: 9999px;
      background: #f2f2f2;
      padding: 0.2133rem 0.2667rem 0.2133rem 0.2133rem;
    }
    span {
      color: #3f3f3f;
      font-size: 0.3733rem;
      font-style: normal;
      font-weight: normal;
      cursor: pointer;
    }
  }
  .search-history {
    padding: 0.2133rem 0.4267rem;
    .search-history-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #3f3f3f;
      span {
        color: #3f3f3f;
        font-size: 0.3733rem;
        font-weight: normal;
      }
      .delete-icon {
        cursor: pointer;
      }
    }
    .search-history-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .search-history-item {
      border-radius: 0.9333rem;
      border: 1px solid #f2f2f2;
      background: #fff;
      color: #9c9c9c;
      font-size: 0.32rem;
      display: flex;
      align-items: center;
      padding: 0.1067rem;
      margin-top: 0.32rem;
      margin-right: 0.4267rem;
      .img {
        width: 0.4267rem;
        height: 0.4267rem;
        margin-right: 0.1067rem;
        border-radius: 50%;
      }
    }
  }
  .searc-list {
    padding: 0.4267rem;
    .tabs-content-head {
      span {
        color: #9c9c9c;
        font-size: 0.3733rem;
        text-align: right;
      }
      span:first-child {
        width: 4.3733rem;
        text-align: left;
      }
      span:last-child {
        width: 2.3467rem;
      }
    }
    .tabs-content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.2133rem 0;
      color: #202020;
      .logo {
        width: 0.8533rem;
        height: 0.8533rem;
        position: relative;
        margin-right: 0.2667rem;
      }
      .img {
        width: 0.8533rem;
        height: 0.8533rem;
        border-radius: 50%;
      }
      .chainCode {
        width: 0.32rem;
        height: 0.32rem;
        position: absolute;
        right: -1px;
        bottom: -1px;
      }
      .tabs-first {
        width: 4.3733rem;
        justify-content: flex-start;
      }
      .tabs-center,
      .tabs-last {
        width: 2.3467rem;
        justify-content: center;
        align-items: flex-end;
      }
      .symbol {
        font-size: 0.3733rem;
        span:last-child {
          color: #9c9c9c;
        }
      }
      .address {
        font-size: 0.32rem;
        color: #9c9c9c;
      }
      .tabs-center {
        font-size: 0.3733rem;
        span:last-child {
          font-size: 0.32rem;
          color: #9c9c9c;
        }
      }
      .tabs-last {
        span:first-child {
          font-size: 0.3733rem;
        }
        span:last-child {
          font-size: 0.32rem;
          padding: 0.0533rem 0.1333rem;
          border-radius: 0.1067rem;
        }
        .red {
          background-color: rgba(246, 70, 93, 0.16);
          color: var(--down-color);
        }
        .green {
          background-color: rgba(46, 189, 133, 0.16);
          color: var(--up-color);
        }
      }
    }
  }
}
</style>
