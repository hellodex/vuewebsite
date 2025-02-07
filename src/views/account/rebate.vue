<template>
  <div class="rebate">
    <h1>我的返佣</h1>
    <div class="card-box rebate-link">
      <h5>邀请链接</h5>
      <div class="display-flex align-items-center">
        <div class="rebate-code-text display-flex flex-direction-col justify-content-sp">
          <div class="display-flex align-items-center justify-content-sp">
            <div class="rebate-code-item display-flex align-items-center justify-content-sp">
              <i>我的邀请码</i>
              <p class="display-flex align-items-center">
                <span>{{ accountInfo.invitationCode }}</span>
                <svg-icon name="copy" class="copy" v-copy="accountInfo.invitationCode"></svg-icon>
              </p>
            </div>
            <div class="rebate-code-item display-flex align-items-center justify-content-sp">
              <i>邀请链接</i>
              <p class="display-flex align-items-center">
                <span>{{ urlRefer }}</span>
                <svg-icon name="copy" class="copy" v-copy="urlRefer"></svg-icon>
              </p>
            </div>
          </div>
          <div class="display-flex align-items-center justify-content-sp">
            <div class="rebate-code-item display-flex align-items-center justify-content-sp">
              <i>我的邮箱</i>
              <p class="display-flex align-items-center">
                <span>{{ accountInfo.account }}</span>
                <svg-icon name="copy" class="copy" v-copy="accountInfo.account"></svg-icon>
              </p>
            </div>
            <div class="rebate-code-item display-flex align-items-center justify-content-sp">
              <i>我的账号</i>
              <p class="display-flex align-items-center">
                <span>{{ accountInfo.nickname }}</span>
                <svg-icon name="copy" class="copy" v-copy="accountInfo.nickname"></svg-icon>
              </p>
            </div>
          </div>
          <div class="rebate-btn">立即邀请</div>
        </div>
        <div class="qrcode">
          <el-skeleton style="width: 100%; height: 100%" :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
            </template>
            <template #default>
              <img :src="info.qrcodeUrl" alt="" />
            </template>
          </el-skeleton>
        </div>
      </div>
    </div>
    <div class="card-box rebate-overview">
      <h5>数据总览</h5>
      <div class="display-flex align-items-center justify-content-sp">
        <div class="rebate-overview-item display-flex flex-direction-col justify-content-sp">
          <svg-icon name="icon-rebate" class="icon-rebate"></svg-icon>
          <div class="display-flex flex-direction-col">
            <span class="price-num">{{ (info.commissionRate || 0) * 100 }}%</span>
            <span class="price-text">返佣比例</span>
          </div>
        </div>
        <div class="rebate-overview-item display-flex flex-direction-col justify-content-sp">
          <svg-icon name="icon-dollar" class="icon-dollar"></svg-icon>
          <div class="display-flex align-items-center justify-content-sp">
            <div class="display-flex flex-direction-col">
              <span class="price-num">${{ numberFormat(info.inviteeTradingAmount) }}</span>
              <span class="price-text">邀请人总交易额</span>
            </div>
          </div>
        </div>
        <div class="rebate-overview-item display-flex flex-direction-col justify-content-sp">
          <svg-icon name="icon-dollar" class="icon-dollar"></svg-icon>
          <span class="price-num">${{ numberFormat(info.totalCommissionAmount) }}</span>
          <div class="display-flex align-items-center justify-content-sp">
            <span class="price-text">总返佣金额</span>
            <span class="price-btn" @click="router.push('/Account/Commission')">提现</span>
          </div>
        </div>
        <div class="rebate-overview-item display-flex flex-direction-col justify-content-sp">
          <svg-icon name="icon-users" class="icon-users"></svg-icon>
          <div class="display-flex align-items-center justify-content-sp">
            <div class="display-flex flex-direction-col">
              <span class="price-num">{{ numberFormat(info.inviteeNum) }}</span>
              <span class="price-text">邀请人数</span>
            </div>
          </div>
        </div>
        <div class="rebate-overview-item display-flex flex-direction-col justify-content-sp">
          <svg-icon name="icon-users" class="icon-users"></svg-icon>
          <div class="display-flex align-items-center justify-content-sp">
            <div class="display-flex flex-direction-col">
              <span class="price-num">{{ numberFormat(info.InviteeTradingNum) }}</span>
              <span class="price-text">总交易人数</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="display-flex align-items-center justify-content-sp">
        <div class="rebate-list">
          <div class="rebate-list-head display-flex flex-direction-col justify-content-sp">
            <svg-icon name="icon-friend" class="icon-friend"></svg-icon>
            <div class="display-flex align-items-center justify-content-sp">
              <div class="display-flex flex-direction-col">
                <span class="price-num">0</span>
                <span class="price-text">总好友人数</span>
              </div>
              <div class="display-flex flex-direction-col">
                <span class="price-num">0</span>
                <span class="price-text">一级好友人数</span>
              </div>
              <div class="display-flex flex-direction-col">
                <span class="price-num">0</span>
                <span class="price-text">二级好友人数</span>
              </div>
            </div>
          </div>
          <div class="rebate-list-title">一级好友列表</div>
          <el-table :data="tableData" style="width: 100%" height="500">
            <el-table-column prop="date" label="ID" />
            <el-table-column prop="date" label="注册时间" />
            <el-table-column prop="name" label="下级交易金额" />
            <el-table-column prop="address" label="下级人数" />
          </el-table>
        </div>
        <div class="rebate-list">
          <div class="rebate-list-head display-flex flex-direction-col justify-content-sp">
            <svg-icon name="icon-top" class="icon-friend"></svg-icon>
            <div class="display-flex align-items-center justify-content-sp">
              <span class="price-num">游民助理电报@youminzhuli</span>
              <span class="price-num">$737.64K </span>
            </div>
            <span class="price-text">24h第一名</span>
          </div>
          <div class="rebate-list-title">24小时排行榜</div>
          <el-table :data="tableData" style="width: 100%" height="500">
            <el-table-column prop="name" label="" width="60" />
            <el-table-column prop="date" label="ID" />
            <el-table-column prop="name" label="返佣金额" align="right" />
          </el-table>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { useGlobalStore } from '@/stores/global'
import { numberFormat } from '@/utils'

import { APIgetMyCommissionSummary } from '@/api'

const router = useRouter()
const globalStore = useGlobalStore()
const accountInfo = computed(() => globalStore.accountInfo)
const origin = window.location.origin
const urlRefer = `${origin}/Refer?invitationCode=${accountInfo.value.invitationCode}`
const info = ref<any>({})
const loading = ref(false)
const getData = async () => {
  loading.value = true
  const res = await APIgetMyCommissionSummary({})
  console.log(res)
  const qrcodeUrl = await QRCode.toDataURL(urlRefer, {
    errorCorrectionLevel: 'H'
  })
  info.value = { ...res, qrcodeUrl }
  loading.value = false
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.rebate {
  h1 {
    font-size: 28px;
    padding: 16px;
  }
  .card-box {
    padding: 16px;
    border-radius: 12px;
    background-color: rgba(23, 24, 27, 0.3);
    margin-bottom: 16px;
  }
  .rebate-link {
    margin-bottom: 40px;
  }
  h5 {
    font-size: 18px;
    padding-bottom: 16px;
  }
  .rebate-proportion {
    padding: 16px;
    border-radius: 8px;
    background: rgba(58, 60, 64, 0.4);
    width: 250px;
    height: 180px;

    span:first-child {
      font-size: 20px;
      color: var(--font-color-default);
    }
    span:last-child {
      font-size: 14px;
      color: var(--dex-color-4);
    }
  }
  .rebate-code-text {
    flex: 1;
    margin: 0 24px;
    height: 180px;
  }
  .qrcode {
    border-radius: 8px;
    background: rgba(58, 60, 64, 0.4);
    padding: 8px;
    width: 180px;
    height: 180px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .rebate-code-item {
    flex: 1;
    height: 48px;
    border-radius: 4px;
    background: rgba(58, 60, 64, 0.4);
    font-size: 14px;
    padding: 8px 16px;
    i {
      color: var(--dex-color-4);
      font-style: normal;
      white-space: nowrap;
    }
    .copy {
      margin-left: 4px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    span {
      white-space: nowrap;
    }
  }
  .rebate-code-item:first-child {
    margin-right: 20px;
  }
  .rebate-btn {
    height: 40px;
    line-height: 40px;
    border-radius: 8px;
    text-align: center;
    background-color: var(--font-color-default);
    color: var(--bg-color);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .rebate-btn:hover {
    background: #a9a9a9;
  }
  .rebate-overview {
    margin-bottom: 40px;
    .icon-dollar {
      width: 25px;
      height: 25px;
    }
    .icon-rebate {
      width: 25px;
      height: 25px;
      color: rgba(0, 194, 120, 1);
    }
    .icon-users,
    .icon-friend {
      width: 25px;
      height: 24px;
    }
  }
  .rebate-overview-item {
    flex: 1;
    height: 110px;
    padding: 16px;
    background: rgba(58, 60, 64, 0.4);
    border-radius: 8px;
    margin-right: 16px;
    .price-btn {
      border-radius: 16px;
      background-color: var(--font-color-default);
      color: var(--bg-color);
      height: 24px;
      line-height: 24px;
      padding: 0 15px;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .rebate-overview-item:last-child {
    margin: 0;
  }
  .price-num {
    font-size: 16px;
    font-weight: 700;
    color: var(--font-color-default);
  }
  .price-text {
    font-size: 14px;
    color: var(--dex-color-4);
  }
  .rebate-list {
    margin-top: 16px;
    flex: 1;
    padding: 16px;
    background: rgba(58, 60, 64, 0.4);
    border-radius: 8px;
    .rebate-list-head {
      padding: 12px;
      background-color: rgba(23, 24, 27, 0.3);
      border-radius: 12px;
      height: 100px;
    }
    .rebate-list-title {
      margin: 16px 0;
      font-size: 18px;
      line-height: 26px;
    }
    :deep(.el-table),
    :deep(.el-table tr),
    :deep(.el-table th.el-table__cell) {
      background-color: var(--hover-bg-color) !important;
    }
    :deep(.el-table td.el-table__cell),
    :deep(.el-table th.el-table__cell.is-leaf) {
      border-bottom: none !important;
    }
    :deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
      background-color: var(--card-bg-color) !important;
    }
  }
  .rebate-list:first-child {
    margin-right: 16px;
  }
}
</style>
