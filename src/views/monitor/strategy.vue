<template>
  <div class="strategy">
    <div class="display-flex align-items-center justify-content-sp">
      <div class="display-flex align-items-center">
        <div
          v-for="(item, index) in strategyList"
          :key="index"
          @click="handelTab(item)"
          :class="strategyIndex == item.value ? 'active' : ''"
          class="display-flex align-items-center tab-content"
        >
          <svg-icon :name="item.icon" class="icon"></svg-icon>
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="display-flex align-items-center">
        <div class="display-flex align-items-center add-btn">
          <el-icon size="14"><Plus /></el-icon>
          <span>创建监控</span>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%" max-height="100%">
        <el-table-column prop="date" label="监控名称" />
        <el-table-column prop="name" label="触发条件" />
        <el-table-column prop="address" label="监控币数量" />
        <el-table-column prop="date" label="状态" />
        <el-table-column prop="name" label="到期时间" />

        <template #empty>
          <empty-data></empty-data>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const strategyList = [
  {
    label: '代币监控',
    value: 1,
    icon: 'icon-coin-strategy'
  }
]

const strategyIndex = ref(1)

const handelTab = (item: any) => {
  strategyIndex.value = item.value
}

const tableData = ref<any>([])
</script>

<style scoped lang="scss">
.strategy {
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(23, 24, 27, 0.3);
  height: 100%;
  .tab-content {
    padding: 5px 12px;
    font-size: 12px;
    font-family: 'PingFangSC-Medium';
    color: #5c6068;
    background: rgba(33, 33, 33, 0.3);
    border-radius: 4px;
    cursor: pointer;
    .icon {
      width: 14px;
      height: 14px;
      margin-right: 6px;
    }
  }
  .active {
    color: #f5f5f5;
    background-color: rgba(58, 60, 64, 0.4);
  }

  .add-btn {
    padding: 5px 12px;
    font-size: 12px;
    border-radius: 4px;
    font-family: 'PingFangSC-Medium';
    background-color: #f5f5f5;
    color: #5c6068;
    cursor: pointer;
    span {
      margin-left: 6px;
    }
  }
  .table-box {
    margin-top: 12px;
    height: calc(100% - 40px);
  }
}
</style>
