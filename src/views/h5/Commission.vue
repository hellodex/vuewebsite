<template>
  <div class="commission">
    <van-sticky>
      <div class="commission-head display-flex align-items-center justify-content-sp">
        <svg-icon name="chevron-left" class="chevron-left" @click="router.back()"></svg-icon>
        <span>提现</span>
        <div></div>
      </div>
    </van-sticky>
    <div class="commission-withdrawal">
      <div class="display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center">
          <span class="txt">总返佣金额：</span>
          <p class="display-flex align-items-center">
            <span class="txt">${{ numberFormat(info.totalCommissionAmount) }}</span>
            <span class="price-btn" @click="handelWithdrawal">提现</span>
          </p>
        </div>
        <div
          class="document-text display-flex align-items-center"
          @click="router.push('/Account/Withdrawal')"
        >
          <svg-icon name="icon-document" class="icon-document"></svg-icon>
        </div>
      </div>
      <div class="price-withdrawable display-flex align-items-center justify-content-sp">
        <p class="display-flex align-items-center">
          <span>已提现金额：</span>
          <span>${{ numberFormat(info.issuedCommissionAmount) }}</span>
        </p>
        <p class="display-flex align-items-center">
          <span>审核中金额：</span>
          <span>${{ numberFormat(info.frozenCommissionAmount) }}</span>
        </p>
      </div>
    </div>
    <div class="card-box">
      <div
        v-for="(item, index) in info.detail"
        :key="index"
        class="chain-item display-flex align-items-center justify-content-sp"
      >
        <div class="display-flex align-items-center coin-box">
          <img :src="chainLogoObj[item.chainCode]" alt="" />
          <span>{{ item.chain || '-' }}</span>
        </div>
        <div class="display-flex align-items-center">
          <span class="span-txt">已返佣：</span>
          <span>${{ numberFormat(item.totalAmount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { numberFormat } from '@/utils'
import { useGlobalStore } from '@/stores/global'

import { APIgetCommissionDetail, APIwithdraw } from '@/api'

const i18n = useI18n()
const router = useRouter()
const globalStore = useGlobalStore()

const { chainLogoObj } = globalStore
const info = ref<any>({})
const skeleton = ref<boolean>(false)
const withdrawInfo = ref<any>({})

const getData = async () => {
  skeleton.value = true
  const res = await APIgetCommissionDetail({})
  console.log(res)
  info.value = res || {}
  skeleton.value = false
}

const handelWithdrawal = (row: any) => {
  withdrawInfo.value
  ElMessageBox.confirm('是否进行提现操作', i18n.t('Tips'), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    type: 'info'
  })
    .then(async () => {
      // const res = await APIwithdraw({
      //   chainCode: row.chainCode,
      //   walletAddress: '',
      //   amount: row.withdrawableAmount
      // })
      // console.log(res)
    })
    .catch(() => {})
}

onMounted(() => {
  getData()
})
</script>
<style scoped lang="scss">
.commission {
  .commission-head {
    color: #202020;
    padding: 0.32rem 0.4rem 0.32rem 0.2133rem;
    font-size: 0.4267rem;
    background-color: #fff;
    .chevron-left {
      width: 0.64rem;
      height: 0.64rem;
      color: #202020;
    }
  }
  .back-text {
    font-size: 0.5333rem;
    cursor: pointer;
    margin-bottom: 0.8533rem;
    .chevron-left {
      width: 0.5333rem;
      height: 0.5333rem;
      margin-right: 0.16rem;
    }
  }
  .commission-withdrawal {
    padding: 0.4267rem;
    color: #202020;
  }
  .price-btn {
    display: block;
    border-radius: 0.4267rem;
    background-color: #202020;
    color: #fff;
    height: 0.5867rem;
    padding: 0.0533rem 0.2667rem;
    font-size: 0.32rem;
    cursor: pointer;
    margin-left: 0.32rem;
  }

  .txt {
    font-size: 0.4rem;
    margin-right: 0.32rem;
  }
  .price-withdrawable {
    margin-top: 0.32rem;
    span {
      font-size: 0.32rem;
      margin-right: 0.2667rem;
    }
  }
  .icon-text {
    font-size: 0.3733rem;
  }
  .document-text {
    cursor: pointer;
  }
  .icon-document {
    width: 0.5333rem;
    height: 0.5333rem;
    margin-left: 0.1067rem;
  }
  .price-num {
    margin: 0.1067rem 0 0.4267rem 0;
    font-weight: 700;
    font-size: 0.7467rem;
  }
  .card-box {
    padding: 0 0.4267rem;
    color: #202020;
    .chain-item {
      padding: 0.32rem 0;
      font-size: 0.3733rem;
    }
    img {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      margin-right: 0.16rem;
    }
    .span-txt {
      color: #9c9c9c;
      font-size: 0.32rem;
    }
  }
}
</style>
