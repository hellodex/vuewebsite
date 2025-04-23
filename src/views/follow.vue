<template>
  <div class="follow-box">
    <div class="follow-filter-box display-flex align-items-center justify-content-sp">
      <div class="follow-filter-items display-flex align-items-center">
        <span
          v-for="(item, index) in filterOptions"
          :class="filterIndex == item.value ? 'follow-active' : ''"
          @click="handelFilterItem(item)"
          :key="index"
          >{{ item.label }}</span
        >
        <div class="input-box">
          <el-input v-model="input" :prefix-icon="Search" placeholder="搜索钱包" />
        </div>
        <a
          href="https://t.me/HelloDex_cn"
          target="_blank"
          class="display-flex align-items-center follow-active"
        >
          <img src="@/assets/img/img-tg.png" class="follow-icon" />
          TG通知教程
        </a>
        <a
          href="https://t.me/HelloDex_cn"
          target="_blank"
          class="display-flex align-items-center follow-active"
        >
          <img src="@/assets/img/img-tg.png" class="follow-icon" />
          0 延时通知
        </a>
      </div>
    </div>
    <div class="follow-content">
      <div class="follow-list">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="钱包" />
          <el-table-column prop="name" label="余额" />
          <el-table-column prop="address" label="SOL 余额" />
          <el-table-column prop="address" label="总利润" />
          <el-table-column prop="address" label="30D 交易数" />
          <el-table-column prop="address" label="最近时间" />
          <el-table-column prop="name" label="通知">
            <template #default>
              <svg-icon name="icon-bell" class="icon-notification"></svg-icon>
              <svg-icon name="icon-mute-notification" class="icon-notification"></svg-icon>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const input = ref('')
const filterIndex = ref<number>(0)

const filterOptions = [
  {
    label: '关注',
    value: 0
  },
  {
    label: '收藏',
    value: 1
  },
  {
    label: '活动',
    value: 2
  },
  {
    label: '备注',
    value: 3
  }
]

const handelFilterItem = (item: { value: number }) => {
  filterIndex.value = item.value
}

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
</script>

<style lang="scss" scoped>
.follow-box {
  padding: 0 20px 20px;
  width: 100%;
  background-color: var(--bg-color);
  .follow-filter-box {
    padding: 10px 0;
  }
  .follow-filter-items {
    flex-wrap: nowrap;
    span,
    a {
      padding: 5.5px 10px;
      border-radius: 4px;
      background: rgba(33, 33, 33, 0.3);
      margin-right: 10px;
      cursor: pointer;
      font-size: 14px;
      font-family: 'PingFangSC-Medium';
      color: #5c6068;
      white-space: nowrap;
    }
    span:last-child {
      margin: 0;
    }
    .input-box {
      width: 165px;
      margin-right: 10px;
    }
    .follow-active {
      color: #f5f5f5;
      background: rgba(58, 60, 64, 0.4);
    }
    .follow-icon {
      width: 15px;
      height: 15px;
      margin-right: 4px;
      display: block;
    }
  }
  .follow-list {
    padding: 12px;
  }
  .icon-notification {
    width: 16px;
    height: 16px;
  }
}
</style>
