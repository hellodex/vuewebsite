<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="market_content">
    <div class="market_content_tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="自选" name="first">
          <el-table :data="coinLists" :default-sort="{ prop: 'date' }" height="calc(100vh - 86px)">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column label="币种">
              <template #default="scope">
                <div class="display-flex align-items-center">
                  <img :src="scope.row.icon" class="coin-icon" />
                  <span>{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" sortable />
            <el-table-column label="24h涨跌幅">
              <template #default="scope">
                <PercentageChange :value="scope.row.percentage" />
              </template>
            </el-table-column>
            <el-table-column prop="volume" label="24H交易额" />
            <el-table-column prop="times" label="24h交易次数" />
            <el-table-column prop="pool" label="24h 交易量" />
            <el-table-column prop="holder" label="holder" />
            <el-table-column prop="pool" label="池子" />
            <el-table-column prop="market" label="市值" />
            <el-table-column prop="price" label="合约检测">
              <template #default="scope">
                <span class="text-on-container-green">非貔貅</span>
                <span class="text-on-container-green">开源</span>
                <span class="text-on-container-green">锁池子</span>
                <span class="text-on-container-red">丢权限</span>
              </template>
            </el-table-column>

            <el-table-column prop="times" label="上线时间" />
            <el-table-column label="操作" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="热门榜" name="second"> </el-tab-pane>
        <el-tab-pane label="涨幅榜" name="third">Role</el-tab-pane>
        <el-tab-pane label="跌幅榜" name="fourth">Task</el-tab-pane>
        <el-tab-pane label="新币榜" name="fourth">Task</el-tab-pane>
        <el-tab-pane label="铭文榜" name="fourth">Task</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'

const activeName = ref('first')

const getMockData = () => {
  const result: any = []
  for (let index = 0; index < 40; index++) {
    result.push({
      id: 1,
      icon: 'https://www.dextools.io/resources/tokens/logos/3/bsc/0x570a5d26f7765ecb712c0924e4de545b89fd43df.jpg?1696520989',
      name: 'SOL',
      price: '$74000',
      percentage: '+23.3%',
      volume: '345M',
      amount: '3453M',
      times: '2343434',
      holder: '23423',
      pool: '$2342B',
      market: '$234M',
      solidityDetect: '',
      time: '2023.12.11 15:30'
    })
  }
  return result
}
const coinLists = ref(getMockData())
</script>
<style lang="scss" scoped>
.market_content {
  width: 100%;
  min-width: 1080px;
  .market_content_tabs {
    height: calc(100vh - 32px);
  }
  :deep(.el-tabs__nav-scroll),
  :deep(.el-tabs__content) {
    padding: 0 8px !important;
  }
  .coin-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .text-on-container-green {
    color: green;
  }
  .text-on-container-red {
    color: red;
  }
}
</style>
