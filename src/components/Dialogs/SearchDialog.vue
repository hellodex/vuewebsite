<template>
  <div class="search-dialog">
    <div class="search-content">
      <div class="search-label display-flex align-items-center justify-content-sp">
        <span>{{ i18n.t('searchResult') }}</span>
        <div class="search-switch display-flex align-items-center">
          <span style="margin-right: 4px">搜索记录底部</span>
          <el-switch
            v-model="searchSwitch"
            @change="handelSearchSwitch"
            size="small"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #26282c"
          />
        </div>
      </div>
      <div class="search-result">
        <el-table
          :data="tokenList"
          height="400px"
          :header-cell-style="{ background: '#f9f9f9' }"
          @row-click="handelTableRow"
        >
          <el-table-column label="#" type="index" width="50" />
          <el-table-column prop="chainCode" :label="i18n.t('home.token')">
            <template #default="scope">
              <div class="display-flex align-items-center">
                <div class="logo">
                  <el-image :src="scope.row.logo" alt="" class="logo-img">
                    <template #error>
                      <svg-icon name="logo1" class="logo-img"></svg-icon>
                    </template>
                  </el-image>
                  <img
                    :src="chainLogoObj[scope.row.chainCode]"
                    alt=""
                    class="chainCode"
                    v-if="scope.row.chainCode"
                  />
                </div>
                <div class="display-flex flex-direction-col">
                  <span class="sub-txt"
                    >{{ scope.row.baseToken }}<i>/{{ scope.row.quoteToken }}</i></span
                  >
                  <span class="txt">{{
                    scope.row.baseAddress ? shortifyAddress(scope.row.baseAddress) : '-'
                  }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="i18n.t('home.price')" align="right">
            <template #default="scope">
              <div class="display-flex flex-direction-col">
                <span class="sub-txt">${{ numberFormat(scope.row.price ?? 0) }}</span>
                <PercentageNotbg class="txt" :value="scope.row.chg1d ?? '0'" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="池子大小/交易额" align="right">
            <template #default="scope">
              <div class="display-flex flex-direction-col">
                <span class="sub-txt">${{ numberFormat(scope.row.tvl ?? 0) }}</span>
                <span class="txt">${{ numberFormat(scope.row.volume ?? 0) }}</span>
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <empty-data class="empty-data"></empty-data>
          </template>
        </el-table>
      </div>
    </div>
    <div class="search-history" v-if="searchSwitch">
      <div class="search-history-title display-flex align-items-center justify-content-sp">
        <span>搜索记录</span>
        <el-icon @click.stop="handelDelHistory" color="#848E9C" class="trash-icon"
          ><Delete
        /></el-icon>
      </div>
      <div class="display-flex align-items-center search-history-items">
        <div
          class="display-flex align-items-center search-history-item"
          v-for="(token, index) in historyList"
          :key="index"
          @click.stop="handleHistory(token)"
        >
          <el-image :src="token.logo" alt="" class="coin-icon">
            <template #error>
              <svg-icon name="logo1" class="coin-icon"></svg-icon>
            </template>
          </el-image>
          <span>{{ token.baseToken }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import Favorite from '@/components/Favorite.vue'
import { numberFormat, shortifyAddress } from '@/utils'
import { useGlobalStore } from '@/stores/global'

import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const router = useRouter()

const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore

defineProps({
  tokenList: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits(['close'])

const historyList = ref<any>([])
const searchSwitch = ref<boolean>(eval(localStorage.getItem('searchSwitch') || 'false'))

const handelTableRow = (row: any) => {
  const token = {
    pairAddress: row.pairAddress,
    chainCode: row.chainCode,
    baseAddress: row.baseAddress,
    baseToken: row.baseToken,
    logo: row.logo
  }
  const searchHistory: any = localStorage.getItem('searchHistory')
  if (searchHistory) {
    const history = JSON.parse(searchHistory)
    if (!history.some((item: { baseAddress: any }) => item.baseAddress == token.baseAddress)) {
      history.push(token)
    }
    localStorage.setItem('searchHistory', JSON.stringify(history))
  } else {
    localStorage.setItem('searchHistory', JSON.stringify([token]))
  }

  if (window.location.href.indexOf('/k/') !== -1) {
    router.push(`/k/${token.pairAddress}?chainCode=${token.chainCode}`)
  } else {
    window.open(`/k/${row.pairAddress}?chainCode=${row.chainCode}`)
  }
  handelClose()
}
const handelDelHistory = () => {
  historyList.value = []
  localStorage.removeItem('searchHistory')
}

function handleHistory(token: any) {
  if (window.location.href.indexOf('/k/') !== -1) {
    router.push(`/k/${token.pairAddress}?chainCode=${token.chainCode}`)
  } else {
    window.open(`/k/${token.pairAddress}?chainCode=${token.chainCode}`)
  }

  handelClose()
}

const handelClose = () => {
  emit('close', false)
}

const handelSearchSwitch = (val: boolean) => {
  searchSwitch.value = val
  localStorage.setItem('searchSwitch', String(searchSwitch.value))
}

onMounted(() => {
  const searchHistory: any = localStorage.getItem('searchHistory')
  searchHistory
    ? (historyList.value = JSON.parse(searchHistory).reverse())
    : (historyList.value = [])
})
</script>
<style lang="scss">
.search-dialog {
  font-style: normal;
  border-radius: 8px;
  color: #f5f5f5;
  background-color: #121316;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 8px 0px;
  position: absolute;
  left: 0;
  top: 50px;
  z-index: 9999;
  width: 100%;
  padding: 17px;
  .search-label {
    font-size: 14px;
    margin-bottom: 12px;
    color: #f5f5f5;
    font-family: 'PingFangSC-Medium';
  }

  .search-history {
    font-size: 14px;

    .search-history-title {
      color: #9aa0aa;
      font-family: 'PingFangSC-Medium';
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 4px;
    }
    .coin-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    .trash-icon {
      cursor: pointer;
      font-size: 16px;
    }

    .search-history-items {
      margin-top: 12px;
      flex-wrap: wrap;
    }

    .search-history-item {
      padding: 4px 12px;
      border-radius: 100px;
      background: rgba(23, 24, 27, 0.3);
      color: #616161;
      margin-right: 10px;
      margin-bottom: 10px;
      flex-wrap: wrap;
      cursor: pointer;
      font-family: 'PingFangSC-Heavy';
    }

    .coin-icon {
      margin-right: 4px;
    }
  }

  .search-content {
    padding-bottom: 8px;

    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
      cursor: pointer;
    }
  }

  .logo {
    position: relative;
    margin-right: 8px;
  }

  .logo,
  .logo-img {
    width: 30px;
    height: 30px;
  }
  .logo-img {
    border-radius: 50%;
  }

  .chainCode {
    width: 12px;
    height: 12px;
    position: absolute;
    right: 0px;
    bottom: 1px;
  }

  .txt {
    color: #9aa0aa;
    font-family: 'PingFangSC-Medium';
    font-size: 14px;
    line-height: 1.5;
  }

  .sub-txt {
    font-size: 14px;
    color: #eaecef;
    line-height: 1.5;
    font-family: 'PingFangSC-Heavy';
    i {
      font-style: normal;
    }
  }
  .el-table__header {
    font-size: 14px;
    color: #9aa0aa;
  }
  .el-table,
  .el-table tr,
  .el-table th.el-table__cell {
    background-color: #121316 !important;
    font-size: 14px !important;
  }
  .empty-data {
    .el-empty__image {
      width: 70px !important;
    }
    .el-empty__description {
      line-height: 1.5;
      margin-top: 12px;
    }
  }
}
</style>
