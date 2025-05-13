<template>
  <section class="observe-box">
    <div class="observe-tab display-flex align-items-center">
      <div
        class="group-btn display-flex align-items-center"
        :class="observeTabIndex == item.value ? 'active' : ''"
        v-for="item in observeTabList"
        :key="item.value"
        @click="handelTab(item)"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>
    <div class="group-box display-flex align-items-center justify-content-sp">
      <div class="display-flex align-items-center">
        <span class="group-btn">默认分组</span>
        <div class="group-btn group-btn-filled display-flex align-items-center">
          <el-icon><Plus /></el-icon>
          <span>添加分组</span>
        </div>
      </div>
      <div class="display-flex align-items-center">
        <div class="group-item display-flex align-items-center">
          <el-icon class="group-icon"><Tickets /></el-icon>
          <span>选择分组</span>
        </div>
        <div class="group-item display-flex align-items-center" @click="importDrawer = true">
          <el-icon class="group-icon"><EditPen /></el-icon>
          <span>导入导出</span>
        </div>
        <div class="group-item display-flex align-items-center">
          <el-icon class="group-icon"><Setting /></el-icon>
          <span>分组管理</span>
        </div>
      </div>
    </div>
    <div class="import-box display-flex align-items-center justify-content-sp">
      <div
        class="group-btn group-btn-filled display-flex align-items-center"
        @click="importDrawer = true"
      >
        <el-icon><Plus /></el-icon>
        <span>导入导出钱包</span>
      </div>
      <div class="display-flex align-items-center">
        <div class="group-btn">隐藏观察钱包</div>
        <div class="group-btn">批量删除(0)</div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="address" label="钱包" />
      <el-table-column label="24h 交易数" sortable sort-by="date">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="24h Pnl" sortable sort-by="date">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="24h 胜率" sortable sort-by="date">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="7D 交易数" sortable sort-by="date">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="7D Pnl" sortable sort-by="date">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="7D 胜率" sortable sort-by="date">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
    </el-table>

    <el-drawer v-model="importDrawer" title="导入导出">
      <div class="import-drawer">
        <div class="import-tab display-flex align-items-center">
          <span
            v-for="item in importTabList"
            :key="item.value"
            :class="importTabIndex == item.value ? 'active' : ''"
            @click="handelImportTab(item)"
            >{{ item.label }}</span
          >
        </div>
        <template v-if="importTabIndex == 0">
          <div class="import-content">
            <el-input v-model="textarea" :rows="8" type="textarea" placeholder="暂无钱包" />
            <div class="import-btn">复制(0)</div>
          </div>
        </template>
        <template v-if="importTabIndex == 1">
          <div class="import-content">
            <div class="import-tips display-flex align-items-center">
              <el-icon class="icon-tips"><WarnTriangleFilled /></el-icon>
              <p>
                支持钱包地址与别名一起导入，例如：<br />
                Efbbh*****AW4WE KOL大佬 <br />
                71CPX*****rQBABC 胜率高钱包
              </p>
            </div>
            <el-input
              v-model="textarea"
              :rows="8"
              type="textarea"
              placeholder="请输入批量导入的钱包地址，多个钱包使用换行分隔，钱包与别名之间用空格隔开"
            />
            <div class="import-btn">预览</div>
          </div>
        </template>
        <template v-if="importTabIndex == 2">
          <div class="import-content">
            <div class="import-tips display-flex align-items-center">
              <el-icon class="icon-tips"><WarnTriangleFilled /></el-icon>
              <p>使用教程</p>
            </div>
            <el-input
              v-model="textarea"
              :rows="8"
              type="textarea"
              placeholder="请在GMGN网站导出地址，然后粘贴到此处"
            />
            <div class="import-btn">预览</div>
          </div>
        </template>
        <template v-if="importTabIndex == 3">
          <div class="import-content">
            <div class="import-tips display-flex align-items-center">
              <el-icon class="icon-tips"><WarnTriangleFilled /></el-icon>
              <p>使用教程</p>
            </div>
            <el-input
              v-model="textarea"
              :rows="8"
              type="textarea"
              placeholder="请在Axiom网站导出地址，然后粘贴到此处"
            />
            <div class="import-btn">预览</div>
          </div>
        </template>
      </div>
    </el-drawer>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const observeTabList = [
  {
    label: '钱包分组',
    value: 1,
    icon: ''
  },
  {
    label: '代币分组',
    value: 2,
    icon: ''
  }
]

const observeTabIndex = ref<number>(1)
const importDrawer = ref<boolean>(true)
const importTabIndex = ref<number>(1)
const handelTab = (item: { value: number }) => {
  observeTabIndex.value = item.value
}

const tableData = [
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland'
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois'
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho'
  }
]

const importTabList = [
  {
    label: '导出钱包',
    value: 0
  },
  {
    label: '导入钱包',
    value: 1
  },
  {
    label: '导入GMGN格式',
    value: 2
  },
  {
    label: '导入Axiom格式',
    value: 3
  }
]

const handelImportTab = (item: { value: number }) => {
  importTabIndex.value = item.value
}

const textarea = ref('')
</script>
<style lang="scss" scoped>
.observe-box {
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(23, 24, 27, 0.3);
  height: calc(100vh - 120px);
  overflow: hidden;
  .group-btn {
    background-color: rgb(57, 60, 67);
    color: rgb(234, 236, 239);
    height: 28px;
    line-height: 1.5;
    font-size: 12px;
    padding: 5px 15px;
    border-radius: 6px;
    white-space: nowrap;
    margin-right: 8px;
    cursor: pointer;
  }
  .group-btn-filled {
    background-color: #f5f5f5;
    color: #5c6068;
  }
  .observe-tab {
    margin-bottom: 8px;
    .active {
      background-color: #f5f5f5;
      color: #5c6068;
    }
  }
  .group-box {
    margin-bottom: 8px;
    .group-item {
      margin-left: 12px;
      cursor: pointer;
      .group-icon {
        font-size: 16px;
        margin-right: 4px;
      }
    }
  }
  .import-box {
    margin-bottom: 8px;
  }
  :deep(.el-drawer__header) {
    margin-bottom: 8px;
  }
  .import-drawer {
    .import-tab {
      font-size: 14px;
      margin-left: 8px;
      span {
        color: rgb(92, 96, 104);
        margin-right: 8px;
        cursor: pointer;
      }
      .active {
        color: var(--font-color-default);
      }
    }
    .import-content {
      margin-top: 20px;
    }
    :deep(.el-textarea) {
      font-size: 12px;
    }
    .import-btn {
      background-color: rgb(57, 60, 67);
      color: rgb(234, 236, 239);
      line-height: 40px;
      font-size: 14px;
      text-align: center;
      border-radius: 4px;
      margin-top: 12px;
      cursor: pointer;
    }
    .import-tips {
      font-weight: 500;
      line-height: 1.2;
      padding: 8px 16px;
      border-radius: 8px;
      background: rgba(145, 115, 22, 0.2);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      p {
        font-size: 12px;
        color: #9aa0aa;
      }
      .icon-tips {
        font-size: 28px;
        color: rgb(233, 176, 0);
      }
    }
  }
}
</style>
