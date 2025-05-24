<template>
  <div class="strategy">
    <div class="strategy-head display-flex align-items-center justify-content-sp">
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

        <div class="display-flex align-items-center checkout-box">
          <span>推送渠道：</span>
          <WalletConnect v-if="!accountInfo">
            <el-checkbox-group>
              <el-checkbox
                v-for="(item, index) in channels"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </WalletConnect>
          <el-checkbox-group v-model="checkedChannel" @change="handleCheckedChannel" v-else>
            <el-checkbox
              v-for="(item, index) in channels"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="display-flex align-items-center">
        <div style="width: 130px; margin-right: 12px">
          <el-select
            v-model="monitorChainCode"
            :teleported="false"
            placeholder="请选择网络"
            @change="handelChangeChainCode"
          >
            <template #prefix>
              <img
                :src="chainData.find((item: any) => item.chainCode == monitorChainCode)?.logo"
                alt=""
                class="icon-svg"
                v-if="chainData.find((item: any) => item.chainCode == monitorChainCode)?.logo"
              />
              <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
            </template>
            <el-option
              v-for="(item, index) in chainList"
              :key="index"
              :value="item.chainCode"
              :label="item.chainName"
            >
              <div class="display-flex align-items-center">
                <img v-if="item.logo" :src="item.logo" alt="" class="icon-svg" />
                <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
                <span class="span-txt">{{ item.chainName }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <WalletConnect v-if="!accountInfo">
          <div class="display-flex align-items-center add-btn">
            <el-icon size="14"><Plus /></el-icon>
            <span>创建监控</span>
          </div>
        </WalletConnect>
        <div class="display-flex align-items-center add-btn" @click="handelAdd" v-else>
          <el-icon size="14"><Plus /></el-icon>
          <span>创建监控</span>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-skeleton v-if="strategyIndex == 2" style="width: 100%" :loading="skeleton" animated>
        <template #template>
          <el-skeleton-item
            variant="text"
            style="height: 30px; margin: 4.4px 0"
            v-for="item in 12"
            :key="item"
          />
        </template>
        <template #default>
          <el-table :data="walletTableData" style="width: 100%" max-height="calc(100vh - 190px)">
            <el-table-column label="监控名称">
              <template #default="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="钱包数/交易额">
              <template #default="scope">
                <span>{{ scope.row.walletCountInWindow || scope.row.totalAmountInWindow  }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <el-text v-if="scope.row.status == 0" style="font-size: 12px" type="success">监控中</el-text>
                <el-text v-else style="font-size: 12px" type="danger">已暂停</el-text>
              </template>
            </el-table-column>
            <!-- <el-table-column label="通知频率">
              <template #default="scope">
                <span>{{
                  noticeTypeList.find((item: any) => item.value == scope.row.noticeType)?.label
                }}</span>
              </template>
            </el-table-column> -->
          
            <el-table-column label="操作" width="240">
              <template #default="scope">
                <span
                  class="monitor-btn"
                  @click="handelStartOrPause(scope.row,0)"
                  v-if="scope.row.status == 1"
                  >启动监控</span
                >
                <span class="monitor-btn" @click="handelStartOrPause(scope.row,1)" v-else>暂停监控</span>
                <span class="monitor-btn" @click="handelEditWallet(scope.row)">编辑</span>
                <span class="monitor-btn btn-del" @click.stop="handelDelWallet(scope.row)">删除</span>
              </template>
            </el-table-column>
            <template #empty>
              <empty-data></empty-data>
            </template>
          </el-table>
        </template>
      </el-skeleton>
      <el-skeleton v-else style="width: 100%" :loading="skeleton" animated>
        <template #template>
          <el-skeleton-item
            variant="text"
            style="height: 30px; margin: 4.4px 0"
            v-for="item in 12"
            :key="item"
          />
        </template>
        <template #default>
          <el-table :data="tableData" style="width: 100%" max-height="calc(100vh - 190px)">
            <el-table-column label="监控名称">
              <template #default="scope">
                <span>{{ typeList.find((item: any) => item.value == scope.row.type)?.label }}</span>
              </template>
            </el-table-column>
            <el-table-column label="监控币名称">
              <template #default="scope">
                <div class="display-flex align-items-center">
                  <div class="logo">
                    <el-image :src="scope.row.logo" alt="" class="coin-icon">
                      <template #error>
                        <svg-icon name="logo1" class="coin-icon"></svg-icon>
                      </template>
                    </el-image>
                    <img :src="chainLogoObj[scope.row.chainCode]" alt="" class="chainCode" />
                  </div>
                  <span>{{ scope.row.symbol }}</span>
                  <svg-icon name="copy" class="copy" v-copy="scope.row.baseAddress"></svg-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="触发条件">
              <template #default="scope">
                <span v-if="scope.row.type == 'price'"
                  >${{ numberFormat(scope.row.targetPrice || 0) }}</span
                >
                <span v-if="scope.row.type == 'chg'">{{ parseFloat(scope.row.data) * 100 }}%</span>
                <span v-if="scope.row.type == 'buy'">${{ numberFormat(scope.row.data) }}</span>
                <span v-if="scope.row.type == 'sell'">${{ numberFormat(scope.row.data) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="通知频率">
              <template #default="scope">
                <span>{{
                  noticeTypeList.find((item: any) => item.value == scope.row.noticeType)?.label
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最近通知时间">
              <template #default="scope">
                <span>{{
                  scope.row.lastNoticeTime ? timeago(scope.row.lastNoticeTime) : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
              <template #default="scope">
                <span
                  class="monitor-btn"
                  @click="handelPlay(scope.row)"
                  v-if="scope.row.noticeType == 0"
                  >启动监控</span
                >
                <span class="monitor-btn" @click="handelPause(scope.row)" v-else>暂停监控</span>
                <span class="monitor-btn" @click="handelEdit(scope.row)">编辑</span>
                <span class="monitor-btn btn-del" @click.stop="handelDel(scope.row)">删除</span>
              </template>
            </el-table-column>
            <template #empty>
              <empty-data></empty-data>
            </template>
          </el-table>
        </template>
      </el-skeleton>
    </div>
    <MonitorTypeDialog
      :monitorTypeDialogVisible="monitorTypeDialogVisible"
      @monitorType="handelDialog"
      @close="handelMonitorTypeClose"
    />
    <MonitorFormDialog
      :info="formInfo"
      :dialogType="dialogType"
      :monitorFormDialogVisible="monitorFormDialogVisible"
      @close="handelMonitorFormClose"
      @refresh="handelRefresh"
      v-if="monitorFormDialogVisible"
    />
    <MonitorObserveGroupDialog
      :info="currentMonitorObserve"
      :monitorObserveGroupDialogVisible="monitorObserveGroupDialogVisible"
      @close="handelMonitorObserveGroupClose"
      @refresh="handelObserveGroupRefresh"
      v-if="monitorObserveGroupDialogVisible"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import {
  APIlistUserTokenSubscribe,
  APIupdateUserSubscribeSetting,
  APIdeleteUserTokenSubscribe,
  APIpauseUserTokenSubscribe,
  APIresumeUserTokenSubscribe,
  walletWatchStrategyList,
  startWalletWatchStrategy,
  deleteWalletWatchStrategy
} from '@/api'
import { timeago, numberFormat } from '@/utils'
import { useI18n } from 'vue-i18n'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import MonitorTypeDialog from '@/components/Dialogs/MonitorTypeDialog.vue'
import MonitorFormDialog from '@/components/Dialogs/MonitorFormDialog.vue'
import MonitorObserveGroupDialog from '@/components/Dialogs/MonitorObserveGroupDialog.vue'
import { customMessage } from '@/utils/message'
import { typeList, noticeTypeList } from '@/types'
import { socketOnWalletWatch, socketOffWalletWatch } from '@/utils/socket'

const i18n = useI18n()
const globalStore = useGlobalStore()
const { chainLogoObj, chainList } = globalStore
const chainData = chainList.filter((item: any) => item.chainType !== -1)
const accountInfo = computed(() => globalStore.accountInfo)

const channels = [
  { value: 'app', label: 'APP' },
  {
    value: 'web',
    label: '网页'
  },
  {
    value: 'telegram',
    label: 'Telegram'
  }
]

const checkedChannel = ref<any>([])
const handleCheckedChannel = async (val: any) => {
  console.log(val)
  await APIupdateUserSubscribeSetting({
    channels: val
  })

  // 根据推送渠道控制钱包监控socket
  if (!val.includes('web') && accountInfo.value) {
    // 仅当web渠道被取消时，关闭socket
    const { uuid, tokenInfo } = accountInfo.value
    socketOffWalletWatch(uuid, tokenInfo.tokenValue)
    console.log('钱包监控socket已关闭 - 推送渠道变更')
  } else if (val.includes('web') && accountInfo.value) {
    // 当web渠道被选中时，开启socket
    const { uuid, tokenInfo } = accountInfo.value
    socketOnWalletWatch(uuid, tokenInfo.tokenValue)
    console.log('钱包监控socket已开启 - 推送渠道变更')
  }

  getTableData(false)
  customMessage({
    type: 'success',
    title: `渠道设置成功`
  })
}

const strategyList = [
{
    label: '钱包监控',
    value: 2,
    icon: 'icon-coin-strategy'
  },
  {
    label: '代币监控',
    value: 1,
    icon: 'icon-coin-strategy'
  }
  
]

const strategyIndex = ref(2)
const handelTab = (item: any) => {
  strategyIndex.value = item.value
  getTableData()
}

const monitorChainCode = ref<string>('DEX')
const monitorTypeDialogVisible = ref<boolean>(false)
const monitorFormDialogVisible = ref<boolean>(false)

const monitorObserveGroupDialogVisible = ref<boolean>(false)
const currentMonitorObserve = ref<any>({})

const dialogType = ref<string>('add')

const formInfo = ref<any>({
  type: 'price',
  coin: 'Single',
  chainCode: 'SOLANA',
  baseAddress: '',
  symbol: '',
  data: '',
  noticeType: [1],
  startPrice: '',
  targetPrice: '',
  status: 1,
  logo: ''
})
const handelAdd = () => {
  dialogType.value = 'add'
  monitorTypeDialogVisible.value = true
}

const handelMonitorTypeClose = (val: boolean) => {
  monitorTypeDialogVisible.value = val
}

const handelMonitorFormClose = (val: boolean) => {
  monitorFormDialogVisible.value = val
}

const handelMonitorObserveGroupClose = (val: boolean) => {
  monitorObserveGroupDialogVisible.value = val
}

const handelRefresh = () => {
  getTableData()
  monitorFormDialogVisible.value = false
  monitorObserveGroupDialogVisible.value = false
}

const handelObserveGroupRefresh = () => {
  getTableData()
  monitorObserveGroupDialogVisible.value = false
  currentMonitorObserve.value = {}
}

const handelDialog = (type: string) => {
  monitorTypeDialogVisible.value = false
  if (type == 'group') {
    currentMonitorObserve.value = {}
    monitorObserveGroupDialogVisible.value = true
  } else {
    monitorFormDialogVisible.value = true
    formInfo.value = {
      type: type,
      coin: 'Single',
      chainCode: 'SOLANA',
      baseAddress: '',
      symbol: '',
      data: '',
      noticeType: [1],
      startPrice: '',
      targetPrice: '',
      status: 1,
      logo: ''
    }
  }
}

const tableData = ref<any>([])
const walletTableData = ref<any>([])
const skeleton = ref(false)

const getTableData = async (showSkeleton = true) => {
  if(showSkeleton){
    skeleton.value = true
  }

  // 总是获取推送渠道配置
  const channelRes: any = await APIlistUserTokenSubscribe({
    chainCode: monitorChainCode.value == 'DEX' ? '' : monitorChainCode.value
  })
  checkedChannel.value = channelRes?.subscribeSetting || []

  if(strategyIndex.value == 2){
    // 钱包监控：获取钱包监控数据
    const walletRes: any = await walletWatchStrategyList({})
    walletTableData.value = walletRes || []
    // 清空代币监控数据
    tableData.value = []
  }else{
    // 代币监控：使用之前获取的数据
    tableData.value = channelRes?.subscribeList || []
    // 清空钱包监控数据
    walletTableData.value = []
  }

  if(showSkeleton){
    skeleton.value = false
  }
}
const handelEditWallet = (row: any) => {
  monitorObserveGroupDialogVisible.value = true
  currentMonitorObserve.value = row
}
const handelEdit = (row: any) => {
  dialogType.value = 'edit'
  for (const key in formInfo.value) {
    if (Object.prototype.hasOwnProperty.call(formInfo.value, key)) {
      formInfo.value[key] = row[key]
    }
  }
  if (formInfo.value.type == 'chg') {
    formInfo.value.data = formInfo.value.data * 100
  }

  formInfo.value.noticeType = [formInfo.value.noticeType]
  formInfo.value.coin = 'Single'
  monitorFormDialogVisible.value = true
}

const handelDel = async (row: any) => {
  ElMessageBox.confirm('确定要删除此条监控', i18n.t('Tips'), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    type: 'info'
  })
    .then(async () => {
      const params = row
      const res = await APIdeleteUserTokenSubscribe({
        chainCode: params.chainCode,
        baseAddress: params.baseAddress,
        type: params.type
      })
      if (res) {
        getTableData()
        customMessage({
          type: 'success',
          title: `${typeList.find((item) => item.value == params.type)?.label}删除成功`
        })
      }
    })
    .catch(() => {})
}

const handelDelWallet = async (row: any) => {
  ElMessageBox.confirm('确定要删除此条监控', i18n.t('Tips'), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    type: 'info'
  })
    .then(async () => {
      const res = await deleteWalletWatchStrategy({
        id: row.id
      })
      if (res) {
        getTableData()
        customMessage({
          type: 'success',
          title: `删除成功`
        })
      }
    })
    .catch(() => {})
}

const handelPause = async (row: any) => {
  const params = row
  const res = await APIpauseUserTokenSubscribe({
    chainCode: params.chainCode,
    baseAddress: params.baseAddress,
    type: params.type
  })
  if (res) {
    getTableData()
    customMessage({
      type: 'info',
      title: `${typeList.find((item) => item.value == params.type)?.label}已暂停！`
    })
  }
}
const handelStartOrPause = async (row: any,status: number) => {
  const res = await startWalletWatchStrategy({
    id: row.id,
    status:status
  })
  if (res) {
    walletTableData.value = res || []
  }
    
}

const handelPlay = async (row: any) => {
  const params = row

  const res = await APIresumeUserTokenSubscribe({
    chainCode: params.chainCode,
    baseAddress: params.baseAddress,
    type: params.type
  })
  if (res) {
    getTableData()
    customMessage({
      type: 'success',
      title: `${typeList.find((item) => item.value == params.type)?.label}已启动`
    })
  }
}

const handelChangeChainCode = () => {
  initData()
}

// 监听账户状态变化
watch(accountInfo, (newValue) => {
  if (accountInfo.value) {
    getTableData()
  }
})

const initData = async () => {
  if (accountInfo.value) {
    await getTableData()
  }
}

onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.strategy {
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(23, 24, 27, 0.3);
  height: calc(100vh - 120px);
  overflow: hidden;
  .checkout-box {
    margin-left: 12px;
    :deep(.el-checkbox) {
      margin-right: 15px;
    }
    :deep(.el-checkbox__label) {
      font-size: 12px;
    }
    :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
      color: var(--font-color-default);
    }
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: #2ebd85;
      border-color: #2ebd85;
    }
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
      border-color: var(--font-color-default);
    }
  }

  .tab-content {
    padding: 7px 12px;
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
    padding: 7px 12px;
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
  .connect-wallet-btn {
    min-width: 0;
    padding: 0;
    background-color: transparent;
  }
  .table-box {
    margin-top: 12px;
    height: calc(100% - 40px);
    .copy {
      width: 14px;
      height: 14px;
      margin-left: 4px;
      cursor: pointer;
    }
    .logo {
      width: 32px;
      height: 32px;
      position: relative;
      margin-right: 10px;
    }
    .coin-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .chainCode {
      width: 14px;
      height: 14px;
      position: absolute;
      right: -1px;
      bottom: 0px;
    }

    .monitor-btn {
      display: inline-block;
      line-height: 1.2;
      padding: 4px 12px;
      border-radius: 16px;
      border: 1px solid #222;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      margin-right: 8px;
      transition: all 0.2s;
      color: #848e9c;
      transition: all 0.2s;
    }
    .monitor-btn:hover {
      color: #f5f5f5;
    }
    .btn-del {
      background: rgba(246, 70, 93, 0.1);
      color: var(--down-color);
    }
    .btn-del:hover {
      color: red;
    }
  }
  :deep(.el-popper) {
    .el-select-dropdown__item {
      color: var(--dex-color-4);
    }
    .el-select-dropdown__item.is-selected {
      color: var(--font-color-default);
    }
  }
}

.icon-svg {
  width: 20px;
  height: 20px;
  display: block;
  border-radius: 50%;
}
.span-txt {
  margin-left: 6px;
}

/* 水波纹动画 */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
