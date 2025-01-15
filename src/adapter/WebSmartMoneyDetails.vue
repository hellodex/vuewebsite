<template>
  <el-scrollbar height="calc(100vh - 120px)">
    <div class="smartMoneyDetails-view">
      <div class="smartMoneyDetails-info display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center">
          <img src="https://ipfs.io/ipfs/QmZqMneqDQ6dkFSq7SHtWtcT8BaBLoupQUksxsS4UTsnyD" alt="" />
          <div class="info">
            <div class="edit-address display-flex align-items-center">
              <span class="shortifyAddress">{{
                shortifyAddress('0x9003c0aedc4b6cb70c12761e1461a4d9727037fc')
              }}</span>
              <el-icon size="22"><EditPen /></el-icon>
            </div>
            <div class="address display-flex align-items-center">
              <span>0x9003c0aedc4b6cb70c12761e1461a4d9727037fc</span>
              <svg-icon
                name="copy"
                class="copy"
                v-copy="'0x9003c0aedc4b6cb70c12761e1461a4d9727037fc'"
              ></svg-icon>
            </div>
            <div class="display-flex align-items-center">
              <svg-icon name="icon-money" class="icon-money"></svg-icon>
              <el-icon size="16" style="margin-right: 4px; cursor: pointer"
                ><RefreshRight
              /></el-icon>
              <span>更新于: 1h 以前</span>
            </div>
          </div>
        </div>
        <div class="display-flex align-items-fd flex-direction-col">
          <div class="display-flex align-items-center">
            <div class="display-flex align-items-center btn justify-content-center">
              <svg-icon name="h5-wallet-cur" class="icon-user"></svg-icon>
              <span>钱包跟单</span>
            </div>
            <div class="display-flex align-items-center btn justify-content-center">
              <svg-icon name="icon-add-user" class="icon-user"></svg-icon>
              <span>关注</span>
            </div>
            <div class="display-flex align-items-center btn btn-defa justify-content-center">
              <svg-icon name="share-04" class="icon-user"></svg-icon>
              <span>分享</span>
            </div>
          </div>
          <div class="timeTab">
            <span
              v-for="(item, index) in timeTabList"
              :key="index"
              :class="timeTabIndex == item.value ? 'active' : ''"
              @click="handelTimeTab(item)"
              >{{ item.label }}</span
            >
          </div>
        </div>
      </div>

      <div class="smartMoneyDetails-items display-flex align-items-center justify-content-sp">
        <div class="smartMoneyDetails-item">
          <h6 class="display-flex align-items-center justify-content-sp">
            <span>最近7D盈亏</span>
            <strong>胜率</strong>
          </h6>
          <h3 class="display-flex align-items-center justify-content-sp">
            <span class="up-color">+1384.13%</span>
            <span>100%</span>
          </h3>
          <p class="display-flex align-items-center justify-content-sp up-color">+$177.65</p>

          <div class="line-chart-box display-flex justify-content-fd">
            <div class="line-chart">
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 1%;
                    background-color: var(--down-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 74%;
                    background-color: var(--up-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 74px;
                    background-color: var(--up-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 84%;
                    background-color: var(--up-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 94%;
                    background-color: var(--up-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 3%;
                    background-color: var(--down-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
              <div class="line-chart-item">
                <div
                  style="
                    width: 8px;
                    height: 6%;
                    background-color: var(--down-color);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="smartMoneyDetails-item">
          <h6 class="display-flex align-items-center justify-content-sp">
            <span>利润</span>
            <div>7D 交易数 0/<i>2</i></div>
          </h6>
          <p class="display-flex align-items-center justify-content-sp">
            <span>总盈亏</span>
            <strong class="up-color">+$4,424.65 (+94.83%)</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span>未实现利润</span>
            <strong class="down-color">-$0.234</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span>7D 买入总成本</span>
            <strong>$12.82</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span>7D 代币平均买入成本</span>
            <strong>$6.41</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span>7D 代币平均实现利润</span>
            <strong class="up-color">+$44.41</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span>ETH 余额</span>
            <strong>0 ETH ($0)</strong>
          </p>
        </div>
        <div class="smartMoneyDetails-item">
          <h6 class="display-flex align-items-center justify-content-sp">
            <span>盈利分布 (4)</span>
          </h6>
          <p class="display-flex align-items-center justify-content-sp">
            <span class="display-flex align-items-center">
              <i style="background-color: rgba(46, 189, 133, 1)"></i>
              &gt;500%
            </span>
            <strong style="color: rgba(46, 189, 133, 1)">2 (50%)</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span class="display-flex align-items-center">
              <i style="background-color: rgba(46, 189, 133, 0.7)"></i>
              200% ~ 500%
            </span>
            <strong>0</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span class="display-flex align-items-center">
              <i style="background-color: rgba(46, 189, 133, 0.5)"></i>
              0% ~ 200%
            </span>
            <strong style="color: rgba(46, 189, 133, 0.5)">2 (50%)</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span class="display-flex align-items-center">
              <i style="background-color: rgba(246, 70, 93, 0.5)"></i>
              0% ~ -50%
            </span>
            <strong>0</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp">
            <span class="display-flex align-items-center">
              <i style="background-color: rgba(246, 70, 93, 1)"></i>
              &lt;-50%
            </span>
            <strong>0</strong>
          </p>
          <p class="display-flex align-items-center justify-content-sp progress-p">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </p>
        </div>
      </div>
      <div class="smartMoneyDetails-list">
        <div class="display-flex align-items-center justify-content-sp filter-box">
          <div class="list-tab display-flex align-items-center">
            <span
              v-for="(item, index) in listTab"
              :key="index"
              :class="listTabIndex == item.value ? 'active' : ''"
              @click="handelListTab(item)"
              >{{ item.label }}</span
            >
          </div>
        </div>
        <div class="table-box">
          <template v-if="listTabIndex == 1">
            <el-table :data="tableData" scrollbar-always-on>
              <el-table-column prop="date" label="币种/最后活跃" sortable sort-by="date" />
              <el-table-column prop="name" label="未实现利润" sortable sort-by="date" />
              <el-table-column prop="name" label="30D 已实现利润" sortable sort-by="date" />
              <el-table-column prop="name" label="总利润" sortable sort-by="date" />
              <el-table-column prop="name" label="余额" sortable sort-by="date" />
              <el-table-column prop="name" label="持仓" sortable sort-by="date" />
              <el-table-column prop="address" label="总买入" />
              <el-table-column prop="address" label="已卖出" />
              <el-table-column prop="address" label="30D 交易数" />
              <el-table-column>
                <template #default>
                  <div class="display-flex align-items-center justify-content-center">
                    <svg-icon name="share-04" class="icon-user"></svg-icon>
                    <span>分享</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else-if="listTabIndex == 2">
            <el-table :data="tableData" scrollbar-always-on>
              <el-table-column prop="date" label="币种/最后活跃" sortable sort-by="date" />
              <el-table-column prop="name" label="未实现利润" sortable sort-by="date" />
              <el-table-column prop="name" label="总利润" sortable sort-by="date" />
              <el-table-column prop="name" label="余额" sortable sort-by="date" />
              <el-table-column prop="name" label="持仓" sortable sort-by="date" />
              <el-table-column prop="address" label="总买入" />
              <el-table-column prop="address" label="已卖出" />
              <el-table-column prop="address" label="30D 交易数" />
              <el-table-column>
                <template #default>
                  <div class="display-flex align-items-center justify-content-center">
                    <svg-icon name="share-04" class="icon-user"></svg-icon>
                    <span>分享</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else-if="listTabIndex == 3">
            <el-table :data="tableData" scrollbar-always-on>
              <el-table-column prop="date" label="类型" />
              <el-table-column prop="name" label="币种" />
              <el-table-column prop="name" label="总额" />
              <el-table-column prop="name" label="数量" />
              <el-table-column prop="name" label="价格" />
              <el-table-column prop="name" label="利润" />
              <el-table-column prop="address" label="时长" />
            </el-table>
          </template>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { numberFormat, shortifyAddress } from '@/utils'

const route = useRoute()

const timeTabIndex = ref<number>(7)
const timeTabList = [
  {
    label: '7d',
    value: 7
  },
  {
    label: '30d',
    value: 30
  }
]

const handelTimeTab = (item: any) => {
  timeTabIndex.value = item.value
}

const listTab = [
  {
    label: '最近盈亏',
    value: 1
  },
  {
    label: '持有代币',
    value: 2
  },
  {
    label: '活动',
    value: 3
  }
]

const listTabIndex = ref(1)

const handelListTab = (item: any) => {
  listTabIndex.value = item.value
}
console.log(route.params)
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
  },
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
  },
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
  },
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
.smartMoneyDetails-view {
  padding: 16px 24px 24px;
  width: 100%;
  .icon-user {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  .smartMoneyDetails-info {
    color: var(--dex-color-4);
    font-size: 14px;
    line-height: 1.2;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .copy,
    .icon-money {
      width: 14px;
      height: 14px;
    }
    .copy {
      margin-left: 6px;
    }
    .icon-money {
      margin-right: 6px;
    }
    .shortifyAddress {
      color: var(--font-color-default);
      font-size: 24px;
      margin-right: 6px;
    }
    .address {
      margin-bottom: 8px;
    }
    .btn {
      border-radius: 35px;
      cursor: pointer;
      min-width: 104px;
      height: 40px;
      padding: 0 12px;
      background-color: var(--font-color-default);
      cursor: pointer;
      color: var(--bg-color);
      margin-left: 12px;
    }
    .btn-defa {
      background-color: var(--hover-bg-color);
      color: var(--dex-color-4);
    }
    .timeTab {
      padding: 2px;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      margin-top: 15px;
      span {
        display: inline-flex;
        border-radius: 8px;
        padding: 4px 12px;
        background-color: transparent;
        color: var(--dex-color-4);
        cursor: pointer;
        transition: all 0.1s;
      }
      span.active {
        color: var(--font-color-default);
        background-color: var(--hover-bg-color);
      }
    }
  }
  .smartMoneyDetails-items {
    margin: 16px 0;
    .smartMoneyDetails-item {
      flex: 1;
      height: 282px;
      padding: 24px 24px 12px;
      border-radius: 10px;
      background: var(--card-bg-color);
      font-size: 14px;
      strong {
        font-weight: normal;
      }
      h6 {
        margin-bottom: 15px;
        font-size: 14px;
        span {
          color: var(--font-color-default);
          font-size: 16px;
        }
        i {
          color: var(--down-color);
          font-style: normal;
        }
      }
      h3 {
        font-size: 32px;
        margin-bottom: 4px;
      }
      p {
        margin-bottom: 15px;
        span {
          color: var(--dex-color-4);
        }
        i {
          display: flex;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-right: 4px;
        }
      }
      p:last-child {
        margin: 0;
      }
      .progress-p {
        span {
          width: 20%;
          display: block;
          height: 8px;
        }
        span:nth-child(1) {
          background-color: rgba(46, 189, 133, 1);
          border-top-left-radius: 16px;
          border-bottom-left-radius: 16px;
        }
        span:nth-child(2) {
          background-color: rgba(46, 189, 133, 0.7);
        }
        span:nth-child(3) {
          background-color: rgba(46, 189, 133, 0.5);
        }
        span:nth-child(4) {
          background-color: rgba(246, 70, 93, 0.5);
        }
        span:nth-child(5) {
          background-color: rgba(246, 70, 93, 1);
          border-top-right-radius: 16px;
          border-bottom-right-radius: 16px;
        }
      }
    }
    .smartMoneyDetails-item:nth-child(2) {
      margin: 0 16px;
    }
    .line-chart-box {
      margin-top: 35px;
    }
    .line-chart {
      height: 100px;
      display: flex;
      .line-chart-item {
        height: 100%;
        display: flex;
        align-items: flex-end;
        padding: 3px 2px;
        border-radius: 4px;
        margin-left: 2px;
        transition: all 0.3s;
      }
      .line-chart-item:hover {
        background-color: var(--hover-bg-color);
      }
    }
  }
  .filter-box {
    padding-bottom: 15px;
    position: sticky;
    top: 0;
    z-index: 9;
    background-color: var(--bg-color);
  }
  :deep(.el-table) {
    overflow: initial;
  }
  :deep(.el-table .el-table__header-wrapper) {
    position: sticky;
    top: 43px;
    z-index: 8;
  }
  .list-tab {
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      padding: 0 10px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      margin-right: 10px;
      line-height: 1.2;
      cursor: pointer;
      transition: all 0.1s;
      background-color: transparent;
      color: #828282;
      white-space: nowrap;
    }
    span.active {
      color: var(--font-color-default);
      background-color: var(--hover-bg-color);
    }
  }
  .table-box {
    padding: 12px;
    border-radius: 10px;
    background-color: var(--card-bg-color);
  }
}
</style>
