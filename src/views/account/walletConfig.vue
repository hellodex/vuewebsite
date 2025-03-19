<template>
  <div class="walletConfig">
    <div class="walletConfig-title display-flex align-items-center justify-content-sp">
      <h1>钱包配置</h1>
      <!-- <span class="wallet-btn">添加钱包</span> -->
    </div>
    <el-collapse accordion v-model="activeCollapse">
      <el-collapse-item v-for="(item, index) in chainConfigs" :key="index" :name="index">
        <template #title>
          <div class="wallet-item display-flex align-items-center">
            <div class="display-flex align-items-center">
              <img :src="item.logo" alt="" class="icon-wallet" />
              <span class="wallet-text">{{ item.chain }}</span>
            </div>
            <!-- <span class="price-num">$0.00</span> -->
          </div>
        </template>
        <template #icon="{ isActive }">
          <div class="icon-ele display-flex align-items-center">
            <svg-icon name="chevron-down" class="icon-chevron" v-if="isActive"></svg-icon>
            <svg-icon name="chevron-right" class="icon-chevron" v-else></svg-icon>
          </div>
        </template>
        <el-table :data="accountInfo.wallets[item.chainCode]" style="width: 100%">
          <el-table-column label="钱包名称">
            <template #default="scope">
              <div class="display-flex align-items-center">
                <span class="wallet-text">{{ scope.row.groupName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="地址" align="right">
            <template #default="scope">
              <div class="display-flex align-items-center justify-content-fd">
                <span>{{ shortifyAddress(scope.row.wallet) }}</span>
                <svg-icon name="copy" class="copy" v-copy="scope.row.wallet"></svg-icon>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="right">
            <template #default>
              <span class="export-btn">导出私钥</span>
            </template>
          </el-table-column> -->
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { shortifyAddress } from '@/utils'

import { useChainConfigsStore } from '@/stores/chainConfigs'
const globalStore = useGlobalStore()

const chainConfigs = useChainConfigsStore().chainConfigs

const accountInfo = computed(() => globalStore.accountInfo)

const customWalletInfo = computed(() => globalStore.customWalletInfo)

const activeCollapse = ref<any>(customWalletInfo.value.index)

watch(customWalletInfo, (newValue) => {
  activeCollapse.value = newValue.index
})
</script>

<style lang="scss" scoped>
.walletConfig {
  .walletConfig-title {
    margin-bottom: 20px;
  }
  h1 {
    font-size: 28px;
    padding: 12px;
  }
  .wallet-btn {
    border-radius: 16px;
    background-color: var(--font-color-default);
    color: var(--bg-color);
    height: 32px;
    line-height: 32px;
    padding: 0 15px;
    font-size: 14px;
    cursor: pointer;
  }

  .wallet-item {
    font-size: 16px;
    color: var(--dex-color-4);
    .price-num {
      margin-left: 40px;
    }
  }
  :deep(.el-collapse),
  :deep(.el-collapse-item__header),
  :deep(.el-collapse-item__wrap) {
    border: none;
  }
  :deep(.el-collapse-item__header) {
    height: 36px;
  }
  :deep(.el-collapse-item) {
    padding: 16px;
    border-radius: 12px;
    background-color: rgba(23, 24, 27, 0.3);
    margin-bottom: 16px;
  }
  :deep(.el-collapse-item__content) {
    padding: 12px 0;
  }
  :deep(.el-table td.el-table__cell),
  :deep(.el-table th.el-table__cell.is-leaf) {
    border-bottom: none !important;
  }
  .icon-chevron {
    width: 18px;
    height: 18px;
    margin-left: 20px;
  }
  .icon-ele {
    margin: 0 8px 0 auto;
  }
  .icon-wallet {
    width: 25px;
    height: 25px;
    margin-right: 12px;
  }
  .copy {
    margin-left: 4px;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  .export-btn {
    display: inline-block;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    background: #292d3a;
    line-height: 32px;
    border-radius: 16px;
    cursor: pointer;
    color: var(--dex-color-4);
  }
}
</style>
