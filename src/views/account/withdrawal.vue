<template>
  <div class="withdrawal">
    <div
      class="back-text display-flex align-items-center"
      @click="router.push('/Account/Commission')"
    >
      <svg-icon name="chevron-left" class="chevron-left"></svg-icon>
      <span>提现记录</span>
    </div>
    <div class="card-box">
      <div class="applyTab display-flex align-items-center">
        <span
          v-for="(item, index) in applyTabList"
          :key="index"
          :class="applyTabIdex == item.value ? 'active' : ''"
          @click="handelApplyTab(item)"
          >{{ item.label }}</span
        >
      </div>
      <template v-if="applyTabIdex == 1">
        <div class="subTab">
          <span
            v-for="(item, index) in stateTabList"
            :key="index"
            :class="stateTabIndex == item.value ? 'active' : ''"
            @click="handelStateTab(item)"
            >{{ item.label }}</span
          >
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="网络" />
          <el-table-column prop="name" label="申请金额" />
          <el-table-column prop="address" label="申请地址" />
          <el-table-column prop="address" label="申请时间" />
        </el-table>
      </template>
      <template v-if="applyTabIdex == 2">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="网络" />
          <el-table-column prop="name" label="申请金额" />
          <el-table-column prop="address" label="申请地址" />
          <el-table-column prop="name" label="提现Hash" />
          <el-table-column prop="address" label="申请时间" />
        </el-table>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { APIgetWithdrawDetail } from '@/api'

const router = useRouter()

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

const applyTabList = [
  {
    label: '申请记录',
    value: 1
  },
  {
    label: '发放记录',
    value: 2
  }
]

const applyTabIdex = ref<number>(1)

const handelApplyTab = (item: any) => {
  applyTabIdex.value = item.value
}

const stateTabList = [
  {
    label: '成功',
    value: 1
  },
  {
    label: '失败',
    value: 2
  },
  {
    label: '审核中',
    value: 3
  }
]

const stateTabIndex = ref<number>(1)

const handelStateTab = (item: any) => {
  stateTabIndex.value = item.value
}
</script>

<style scoped lang="scss">
.withdrawal {
  height: 100%;
  .back-text {
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 32px;
    .chevron-left {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
  .card-box {
    padding: 16px;
    border-radius: 12px;
    background-color: var(--card-bg-color);
    margin-top: 16px;
    .applyTab {
      margin-bottom: 16px;
      span {
        color: var(--dex-color-4);
        font-size: 14px;
        margin-right: 16px;
        border-bottom: 2px solid transparent;
        cursor: pointer;
      }

      span.active {
        border-bottom: 2px solid var(--font-color-default);
        color: var(--font-color-default);
      }
    }
    .subTab {
      display: inline-block;
      border-radius: 8px;
      background: var(--bg-color);
      padding: 4px;
      margin-bottom: 4px;
      span {
        display: inline-block;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 12px;
        background-color: transparent;
        color: var(--dex-color-4);
        cursor: pointer;
      }
      span.active {
        background-color: var(--tab-bg-color);
        color: var(--font-color-default);
      }
    }
    :deep(.el-table td.el-table__cell),
    :deep(.el-table th.el-table__cell.is-leaf) {
      border-bottom: none !important;
    }
  }
}
</style>
