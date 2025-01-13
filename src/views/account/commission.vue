<template>
  <div class="commission">
    <div class="back-text display-flex align-items-center" @click="router.push('/Account/Rebate')">
      <svg-icon name="chevron-left" class="chevron-left"></svg-icon>
      <span>提现</span>
    </div>
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
          <span class="icon-text">提现金额</span>
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
      <el-skeleton style="width: 100%" :loading="skeleton" animated>
        <template #template>
          <el-skeleton-item
            variant="text"
            style="height: 30px; margin: 4.4px 0"
            v-for="item in 10"
            :key="item"
          />
        </template>
        <template #default>
          <el-table :data="info.detail" style="width: 100%" max-height="500">
            <el-table-column label="网络">
              <template #default="scope">
                <div class="display-flex align-items-center coin-box">
                  <img :src="chainLogoObj[scope.row.chainCode]" alt="" />
                  <span>{{ scope.row.chain || '-' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="交易额">
              <template #default="scope">
                <span>${{ numberFormat(scope.row.transactionAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="返佣的金额">
              <template #default="scope">
                <span>${{ numberFormat(scope.row.totalAmount) }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="已提现金额">
              <template #default="scope">
                <span>${{ numberFormat(scope.row.issuedAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="可提现金额">
              <template #default="scope">
                <span>${{ numberFormat(scope.row.withdrawableAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                <div class="display-flex align-items-center">
                  <span>冻结金额</span>
                  <el-tooltip effect="light" content="已提现，并且正在审核中的余额" placement="top">
                    <van-icon name="question-o" class="question-o-icon" />
                  </el-tooltip>
                </div>
              </template>
              <template #default="scope">
                <span>${{ numberFormat(scope.row.frozenAmount) }}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column prop="date">
              <template #header>
                <div class="display-flex align-items-center">
                  <span>未到账金额</span>
                  <el-tooltip effect="light" content="交易已发出等待链上确认的金额" placement="top">
                    <van-icon name="question-o" class="question-o-icon" />
                  </el-tooltip>
                </div>
              </template>
              <template #default="scope">
                <span>${{ numberFormat(scope.row.pendingAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <span class="withdrawal-btn" @click="handelWithdrawal(scope.row)">提现</span>
              </template>
            </el-table-column> -->
          </el-table>
        </template>
      </el-skeleton>
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
  .back-text {
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 32px;
    .chevron-left {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
  }
  .commission-withdrawal {
    padding: 16px;
  }
  .price-btn {
    display: block;
    border-radius: 16px;
    background-color: var(--font-color-default);
    color: var(--bg-color);
    height: 22px;
    padding: 2px 10px;
    font-size: 12px;
    cursor: pointer;
    margin-left: 12px;
  }

  .txt {
    font-size: 16px;
    margin-right: 12px;
  }
  .price-withdrawable {
    margin-top: 12px;
    span {
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .icon-text {
    font-size: 14px;
  }
  .document-text {
    cursor: pointer;
  }
  .icon-document {
    width: 24px;
    height: 25px;
    margin-left: 4px;
  }
  .price-num {
    margin: 4px 0 16px 0;
    font-weight: 700;
    font-size: 28px;
  }
  .card-box {
    padding: 16px;
    border-radius: 12px;
    background-color: var(--card-bg-color);
    margin-bottom: 16px;
    :deep(.el-table td.el-table__cell),
    :deep(.el-table th.el-table__cell.is-leaf) {
      border-bottom: none !important;
    }
    .coin-box {
      color: var(--font-color-default);
      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 6px;
      }
    }
    .question-o-icon {
      cursor: pointer;
      margin-left: 4px;
    }

    .withdrawal-btn {
      display: inline-block;
      height: 28px;
      padding: 4px 15px;
      background: var(--hover-bg-color);
      border-radius: 16px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }
  }
}
</style>
