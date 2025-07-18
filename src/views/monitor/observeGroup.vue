<template>
  <section class="observe-box">
<!--    <div class="observe-tab display-flex align-items-center">-->
<!--      <div-->
<!--        class="group-btn display-flex align-items-center"-->
<!--        :class="observeTabIndex == item.value ? 'active' : ''"-->
<!--        v-for="item in observeTabList"-->
<!--        :key="item.value"-->
<!--        @click="handelTab(item)"-->
<!--      >-->
<!--        <el-icon class="tab-icon">-->
<!--          <Wallet v-if="item.value === 1" />-->
<!--          <Money v-if="item.value === 2" />-->
<!--        </el-icon>-->
<!--        <span>{{ item.label }}</span>-->
<!--      </div>-->
<!--    </div>-->
    <div class="group-box display-flex align-items-center justify-content-sp">
      <div class="display-flex align-items-center">
        <span
          class="group-btn display-flex align-items-center"
          v-for="group in walletGroups"
          :key="group.id"
          @click="handleGroupClick(group)"
          :class="{
            'group-btn-default': group.type === 2,
            'group-btn-active': activeGroupId === group.id
          }"
        >
          <el-icon class="group-icon" v-if="group.type === 2">
            <Star />
          </el-icon>
          <span>{{ group.name }}</span>
        </span>
        <div
          class="group-btn group-btn-filled display-flex align-items-center"
          @click="showAddGroupDialog"
        >
          <el-icon><Plus /></el-icon>
          <span>添加分组</span>
        </div>
      </div>
      <div class="display-flex align-items-center">
        <div class="group-item display-flex align-items-center" style="position: relative;" @click.stop="toggleDropdown" ref="dropdownRef">
          <el-icon class="group-icon"><Tickets /></el-icon>
          <span>选择分组</span>
          <div v-if="isDropdownVisible" class="dropdown-menu">
            <ul>
              <li
                v-for="group in walletGroups"
                :key="group.id"
                class="dropdown-item"
                @click.stop="selectGroup(group)"
                :class="{'dropdown-item-active': activeGroupId === group.id}"
              >
                {{ group.name }}
                <el-icon v-if="activeGroupId === group.id"><Select /></el-icon>
              </li>
            </ul>
          </div>
        </div>
        <div class="group-item display-flex align-items-center" @click="importDrawer = true">
          <el-icon class="group-icon"><EditPen /></el-icon>
          <span>导入导出</span>
        </div>
        <div class="group-item display-flex align-items-center" @click="showGroupManagement">
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
        <span>导入钱包</span>
      </div>
      <div class="display-flex align-items-center">
        <div class="group-btn" @click="setWalletVisibility">{{isWalletVisibility ? '隐藏' : '显示'}}观察钱包</div>
        <div class="group-btn" :class="{ disable: chooseWalletList.length == 0 }"  @click="deleteWalletList">批量删除({{ chooseWalletList.length}})</div>
      </div>
    </div>

    <!-- 钱包表格 -->
    <el-table v-if="isWalletVisibility"  :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="30"  />
      <el-table-column label="钱包" >
        <template #default="scope">
          <div class="display-flex align-items-center address-text">
            <template v-if="editingRowId !== scope.row.id">
              <span>{{ scope.row.name || shortifyAddress(scope.row.walletAddress) }}</span>
              <el-icon class="edit-icon" @click="handleEditRemark(scope.row)"><EditPen /></el-icon>
            </template>
            <el-input 
              v-if="editingRowId === scope.row.id" 
              v-model="editingName" 
              @keyup.enter="handleSaveRemark(scope.row)"
              @keyup.esc="handleCancelEdit"
              @blur="handleBlurEdit"
              ref="editInput"
              size="small"
              placeholder="输入备注名称"
              style="width: 200px;"
            >
              <template #suffix>
                <div class="input-actions">
                  <el-icon 
                    class="action-icon save-icon" 
                    @mousedown.prevent
                    @click="handleSaveRemark(scope.row)"
                    title="保存"
                  >
                    <Check />
                  </el-icon>
                  <el-icon 
                    class="action-icon cancel-icon" 
                    @mousedown.prevent
                    @click="handleCancelEdit"
                    title="取消"
                  >
                    <Close />
                  </el-icon>
                </div>
              </template>
            </el-input>
            <svg-icon name="copy" class="copy" v-copy="scope.row.walletAddress"></svg-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="24h 交易数">
        <template #default="scope">{{ scope.row.dailyTransactions || '--' }}</template>
      </el-table-column>
      <el-table-column label="24h Pnl">
        <template #default="scope">{{ scope.row.dailyPnl || '--' }}</template>
      </el-table-column>
      <el-table-column label="24h 胜率">
        <template #default="scope">{{ scope.row.dailyWinRate || '--'}}%</template>
      </el-table-column>
      <el-table-column label="7D 交易数">
        <template #default="scope">{{ scope.row.weeklyTransactions || '--' }}</template>
      </el-table-column>
      <el-table-column label="7D Pnl">
        <template #default="scope">{{ scope.row.weeklyPnl || '--' }}</template>
      </el-table-column>
      <el-table-column label="7D 胜率">
        <template #default="scope">{{ scope.row.weeklyWinRate || '--' }}%</template>
      </el-table-column>
    </el-table>

    <!-- 分组管理对话框 -->
    <el-dialog
      v-model="groupManagementDialogVisible"
      title="分组管理"
      width="600px"
    >
      <el-table :data="walletGroups" style="width: 100%">
        <el-table-column prop="name" label="分组名称" />
        <el-table-column prop="type" label="分组类型">
          <template #default="{row}">
            {{ getGroupTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{row}">
            <el-button size="small" @click="handleEditGroup(row)" class="no-hover-button">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDeleteGroup(row)"
              :disabled="row.type === 2"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="primary" @click="showAddGroupDialog">
          添加分组
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑分组对话框 -->
    <el-dialog
      v-model="editGroupDialogVisible"
      :title="isEditing ? '编辑分组' : '添加分组'"
      width="400px"
      :before-close="handleClose"
    >
      <el-form
        :model="currentGroupForm"
        :rules="groupRules"
        ref="groupFormRef"
        label-position="top"
      >
        <el-form-item label="分组名称" prop="name">
          <el-input
            v-model="currentGroupForm.name"
            placeholder="请输入分组名称"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="分组类型" prop="type">
          <el-radio-group v-model="currentGroupForm.type">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">暂停</el-radio>
            <el-radio :label="2" :disabled="isEditing">默认</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
        <el-button @click="editGroupDialogVisible = false" class="no-hover-button">
  取消
</el-button>
          <el-button
            type="primary"
            @click="submitGroupForm"
            :loading="submitting"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入导出抽屉 -->
    <el-drawer v-model="importDrawer" title="导入导出">
      <div class="import-drawer">
        <div class="import-tab display-flex align-items-center">
          <span
            v-for="item in importTabList"
            :key="item.value"
            :class="importTabIndex == item.value ? 'active' : ''"
            @click="handelImportTab(item)"
          >{{ item.label }}</span>
        </div>
        <template v-if="importTabIndex == 0">
          <div class="import-content">
            <el-input v-model="walletOutput" :rows="8" type="textarea" placeholder="暂无钱包" />
            <div class="import-btn" @click="copyWallet">复制({{  tableData.length }})</div>
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

            <!-- 输入框 -->
            <el-input
              v-model="walletInput"
              :rows="8"
              type="textarea"
              placeholder="请输入批量导入的钱包地址，多个钱包使用换行分隔，钱包与别名之间用空格隔开"
              @input="parseInput"
            />

            <!-- 预览列表 -->
            <div class="preview-table" v-if="parsedList.length > 0">
              <table>
                <thead>
                <tr>
                  <th>地址</th>
                  <th>别名</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in parsedList" :key="index">
                  <td :class="{ 'invalid': !item.valid }">{{ item.address }}</td>
                  <td>{{ item.alias }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- 操作按钮 -->
            <div class="preview-actions">
              <el-button type="primary" @click="removeDuplicates" style="width: 100%">一键去重复、去除无效地址</el-button>
              <!-- <el-button type="primary" @click="removeInvalids" style="width: 100%">去除无效地址</el-button> -->

              <!-- 导入钱包按钮（灰色） -->
              <el-button
                style="width: 100%; margin-top: 10px; background-color: #50535a; color: #fff;;"
                 @click="submitWalletList"
                :loading="submitting"
              >
                导入钱包
                <!-- 导入钱包（还可以导入 {{ importableCount }} 个，总共 {{ totalAddresses }} 个） -->
              </el-button>
            </div>
          </div>
        </template>
      </div>
    </el-drawer>
  </section>
  <WalletConnect ref="walletConnectRef" v-if="!accountInfo">
    <div class="display-flex align-items-center add-btn">
      <span>前往登录</span>
    </div>
  </WalletConnect>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Tickets, EditPen, Setting, Select, WarnTriangleFilled, Check, Delete, Close, Wallet, Money, Star } from '@element-plus/icons-vue'
import { addWalletWatchGroup, walletWatchGroupList, updateWalletGroup, deleteWalletGroup, walletWatchList, deleteWalletWatch, addWalletWatch, updateWalletWatchRemark } from '@/api'
import { useGlobalStore } from '@/stores/global'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import { isEvmAddress, isSolanaAddress} from '@/utils/transition'
import { shortifyAddress } from '@/utils'

const globalStore = useGlobalStore()
const accountInfo = computed(() => globalStore.accountInfo)

// 分组相关状态
const groupManagementDialogVisible = ref(false)
const editGroupDialogVisible = ref(false)
const isEditing = ref(false)
const walletGroups = ref<any[]>([{
  id: 0,
  name: '',
  type: 2
}])
const submitting = ref(false)
const activeGroupId = ref<number | null>(0)
const selectedGroup = ref<any>(null)
// 钱包可见状态
const isWalletVisibility = ref(true)
const chooseWalletList = ref<any[]>([])

const walletConnectRef = ref()
const canSumbit = ref(false)

// 是否在加载数据
const isLoadingTableData = ref(false)
// 表单相关
const groupFormRef = ref<FormInstance>()
const currentGroupForm = ref({
  id: 0 as number | null,
  name: '',
  // type: 0 // 0:正常, 1:暂停, 2:默认
})

const groupRules = ref<FormRules>({
  name: [
    { required: true, message: '请输入分组名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择分组类型', trigger: 'change' }
  ]
})

// 表格数据
const tableData = ref()

// 编辑状态管理
const editingRowId = ref(null)
const editingName = ref('')
watch(accountInfo, (newValue) => {
  fetchWalletGroups()
})

// 筛选后的表格数据
const filteredTableData = computed(() => {
  if (!activeGroupId.value) return tableData.value
  return tableData.value.filter((item: any) => item.groupId === activeGroupId.value)
})

const setWalletVisibility = () => {
  isWalletVisibility.value = !isWalletVisibility.value
}

const handleSelectionChange = (val:any[]) => {
  chooseWalletList.value = val
}

// 批量删除钱包
const deleteWalletList = () => {
  if(chooseWalletList.value.length == 0 || !verifyLoginInfo()){
    return
  }
  ElMessageBox.confirm(
    `确定删除这${chooseWalletList.value.length}个钱包吗？`,
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() =>deleteWalletWatch({ ids: JSON.stringify( chooseWalletList.value.map(item => item.id) )}))
  .then((data) => {
    if(!data){
       throw new Error('删除失败，请重试') 
    }
    ElMessage.success('删除成功')
    fetchWalletList()
  })
 
}

// 获取分组类型文本
const getGroupTypeText = (type: number) => {
  const types = ['正常', '暂停', '默认']
  return types[type] || '未知'
}

// 获取分组列表
const fetchWalletGroups = async () => {
  if(!accountInfo.value){
    return
  }
  try {
    const data = await walletWatchGroupList({})
    walletGroups.value = Array.isArray(data) ? data : []

    // 如果有默认分组，自动选中
    const defaultGroup = walletGroups.value.find(g => g.type === 2)
    if (defaultGroup) {
      activeGroupId.value = defaultGroup.id
      selectedGroup.value = defaultGroup
    } else if(walletGroups.value.length > 0){ // 没有默认选第一个
      activeGroupId.value = walletGroups.value[0].id
      selectedGroup.value = walletGroups.value[0]
    }
    fetchWalletList()
  } catch (error) {
    // console.error('获取分组列表错误:', error)
    ElMessage.error('获取分组列表失败，请重试')
  }
}

// 按目前选中的分组获取钱包数据
const fetchWalletList = async () => {
  try {
    isLoadingTableData.value = true
    const params = activeGroupId.value ? {groupId : activeGroupId.value} : {}
    const data = await walletWatchList(params)
    tableData.value = Array.isArray(data) ? data : []
    tableData.value.forEach((item: any) => {
      walletOutput.value = `${walletOutput.value}${item.walletAddress} ${item.name}\n`
    })

    // 

    isLoadingTableData.value = false
  } catch (error) {
    isLoadingTableData.value = false
    console.error('获取钱包列表错误:', error)
    ElMessage.error('获取钱包列表失败，请重试')
  }
}

const verifyLoginInfo = () => {
  if(!accountInfo.value){ 
    walletConnectRef.value.loginRef.click()
    return false
  }
  return true
}

// 显示分组管理
const showGroupManagement = () => {
  if(!verifyLoginInfo()) return
  groupManagementDialogVisible.value = true
}

// 编辑分组
const handleEditGroup = (group: any) => {
  isEditing.value = true
  currentGroupForm.value = {
    id: group.id,
    name: group.name,
    // type: parseInt(group.type)
  }
  editGroupDialogVisible.value = true
}

// 删除分组
const handleDeleteGroup = async (group: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除分组 "${group.name}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    let data = await deleteWalletGroup({id:group.id})
    if(data){
      ElMessage.success('删除分组成功')
      await fetchWalletGroups()
       // 如果删除的是当前选中的分组，则重置选中状态
      if (activeGroupId.value === group.id) {
        activeGroupId.value = null
        selectedGroup.value = null
      }
    }else{
      ElMessage.error('删除分组失败')
    }

   
  } catch (error) {
    console.error('删除分组失败:', error)
  }
}

// 显示添加分组对话框
const showAddGroupDialog = () => {
  if(!verifyLoginInfo()) return
  isEditing.value = false
  currentGroupForm.value = {
    id: null,
    name: '',
    // type: 0
  }
  editGroupDialogVisible.value = true
  groupManagementDialogVisible.value = false
}

// 关闭对话框前的确认
const handleClose = (done: () => void) => {
  if (currentGroupForm.value.name) {
    ElMessageBox.confirm('确定要放弃当前编辑的内容吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      done()
    }).catch(() => {
      // 取消关闭
    })
  } else {
    done()
  }
}

// 提交分组表单
const submitGroupForm = async () => {
  if (!groupFormRef.value) return

  try {
    await groupFormRef.value.validate()
    submitting.value = true

    if (isEditing.value && currentGroupForm.value.id) {
      await updateWalletGroup(currentGroupForm.value)
      ElMessage.success('更新分组成功')
    } else {
      await addWalletWatchGroup(currentGroupForm.value)
      ElMessage.success('添加分组成功')
    }

    editGroupDialogVisible.value = false
    await fetchWalletGroups()
  } catch (error) {
    console.error('操作分组错误:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 分组选择相关
const isDropdownVisible = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value
  if (isDropdownVisible.value && walletGroups.value.length === 0) {
    fetchWalletGroups()
  }
}

const selectGroup = (group: any) => {
  selectedGroup.value = group
  activeGroupId.value = group.id
  isDropdownVisible.value = false
  fetchWalletList()
}

const handleGroupClick = (group: any) => {
  activeGroupId.value = group.id
  selectedGroup.value = group
  fetchWalletList()
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownVisible.value = false
  }
}

// 初始化
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchWalletGroups()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 其他原有代码
// const observeTabList = [
//   { label: '钱包分组', value: 1 },
//    { label: '代币分组', value: 2 }
// ]
const observeTabIndex = ref(1)
const importDrawer = ref(false)
const importTabIndex = ref(1)
const walletInput = ref('')
const walletOutput = ref('')

const handelTab = (item: { value: number }) => {
  observeTabIndex.value = item.value
}

const handelImportTab = (item: { value: number }) => {
  importTabIndex.value = item.value
}

const importTabList = [
  // { label: '导出钱包', value: 0 },
  { label: '导入钱包', value: 1 },
  //{ label: '导入GMGN格式', value: 2 },
  //{ label: '导入Axiom格式', value: 3 }
]


const parsedList = ref<any[]>([])

// 模拟最大限制
const MAX_WALLETS = 50
const CURRENT_COUNT = 20 // 当前已有钱包数

// 解析文本为对象数组
const parseInput = () => {
  console.log(walletInput.value)
  const lines = walletInput.value.trim().split('\n')
  const list: any[] = []

  for (let line of lines) {
    if (!line.trim()) continue
    const [address, alias] = line.trim().split(/\s+/)
    const valid = validateAddress(address)
    list.push({
      address,
      alias: alias || '',
      valid
    })
  }

  parsedList.value = list
  canSumbit.value = false
}

// 地址验证（根据你的实际规则修改）
const validateAddress = (addr: string): boolean => {
  return true // 示例：至少6位字符
}

// 监听 textarea 变化并自动解析
// watch(walletInput, parseInput, { immediate: true })

// 计算总数
const totalAddresses = computed(() => parsedList.value.length)

// 计算可导入数量
const importableCount = computed(() => {
  const available = MAX_WALLETS - CURRENT_COUNT
  return Math.max(0, Math.min(available, parsedList.value.filter(i => i.valid).length))
})

// 一键去重复
const removeDuplicates = () => {
  const seen = new Set()
  const lines: string[] = []
  parsedList.value = parsedList.value.filter(item => {
    const duplicate = seen.has(item.address)
    seen.add(item.address)
    if(!duplicate && (isEvmAddress(item.address) || isSolanaAddress(item.address))){
      lines.push(`${item.address} ${ item.alias || '' }` )
      return true
    } else {
      return false
    }
  })
  if(lines.length > 0 ){

    walletInput.value = lines.join('\n')
  }
  canSumbit.value = true
}

// 去除无效地址
const removeInvalids = () => {
  const solReg = new RegExp('^[1-9A-HJ-NP-Za-km-z]{32,44}$')
  const ethReg = new RegExp('^0x[a-fA-F0-9]{40}$')

  parsedList.value = parsedList.value.filter(item => solReg.test(item.address) || ethReg.test(item.address) )
}

const submitWalletList = () => {
  if(!canSumbit.value){
    ElMessage.error('请先校验地址')
    return
  }
  submitting.value = true
  
  ElMessageBox.confirm(
    `确定导入这 ${parsedList.value.length} 个钱包到 ${selectedGroup.value.name} 分组吗？`,
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() => {
    submitting.value = true
    return addWalletWatch({ 
      addressList: parsedList.value.map(item => {
        return {
          address:item.address,
          name:item.alias
        }
      }),
      groupId: selectedGroup.value.id
    }) 
  })
  .then((data) => {
    if(!data){
       throw new Error('导入失败，请重试') 
    }
    submitting.value = false
    canSumbit.value = false
    importDrawer.value = false
    fetchWalletList()
  })
  .catch(error=>{
    submitting.value = false
  })
}

const handleEditRemark = (row: any) => {
  editingRowId.value = row.id
  editingName.value = row.name || ''
  // 使用 nextTick 确保输入框渲染后再聚焦
  nextTick(() => {
    // 查找当前编辑行的输入框
    const editInputs = document.querySelectorAll('.el-input__inner')
    const editInput = Array.from(editInputs).find(input => 
      (input as HTMLInputElement).value === editingName.value
    ) as HTMLInputElement
    if (editInput) {
      editInput.focus()
      editInput.select()
    }
  })
}

const handleSaveRemark = async (row: any) => {
  if (editingName.value !== row.name) {
    try {
      // 调用 API 保存到服务器
      await updateWalletWatchRemark({ id: row.id, name: editingName.value })
      
      // 更新本地数据
      row.name = editingName.value
      ElMessage.success('备注保存成功')
    } catch (error) {
      console.error('保存备注失败:', error)
      ElMessage.error('备注保存失败，请重试')
      // 保存失败时不退出编辑模式
      return
    }
  }
  
  editingRowId.value = null
  editingName.value = ''
}

const handleCancelEdit = () => {
  editingRowId.value = null
  editingName.value = ''
}

const handleBlurEdit = () => {
  // 当输入框失去焦点时取消编辑
  handleCancelEdit()
}

const handleDeleteRemark = async (row: any) => {
  try {
    // 调用 API 删除备注（设置为空字符串）
    await updateWalletWatchRemark({ id: row.id, name: '' })
    
    // 更新本地数据
    row.name = ''
    ElMessage.success('备注删除成功')
  } catch (error) {
    console.error('删除备注失败:', error)
    ElMessage.error('删除备注失败，请重试')
    // 删除失败时不退出编辑模式
    return
  }
  
  editingRowId.value = null
  editingName.value = ''
}

const copyWallet = () => {
  navigator.clipboard.writeText(walletOutput.value)
  .then(() => {
    ElMessage.success('复制成功')
  })
  .catch(err => {
    console.error('复制失败', err);
  });
}

</script>

<style lang="scss" scoped>

/* 去除按钮的 hover、focus 样式 */
:deep(.no-hover-button),
:deep(.no-hover-button:hover),


/* 选中状态字体颜色 */
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: var(--font-color-default);
}

/* 选中状态背景和边框 */
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #2ebd85;
  border-color: #2ebd85;
}

/* 勾选符号颜色 */
:deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: var(--font-color-default);
}
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
    transition: all 0.3s ease;

    &.group-btn-default {
      background-color: #f5f5f5;
      color: #5c6068;
    }

    &.group-btn-active {
      background-color: white !important;
      color: black !important;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
  .disable {
    cursor: not-allowed;;
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

    .tab-icon {
      font-size: 14px;
      margin-right: 6px;
    }
  }

  .group-box {
    margin-bottom: 8px;

    .group-item {
      margin-left: 12px;
      cursor: pointer;
      position: relative;

      .group-icon {
        font-size: 16px;
        margin-right: 4px;
      }
    }

    .group-btn {
      .group-icon {
        font-size: 14px;
        margin-right: 4px;
        color: #ffd700; // 金色星星图标
      }
    }
  }

  .import-box {
    margin-bottom: 8px;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #222327;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 999;
    min-width: 160px;
    padding: 8px 0;
    margin-top: 4px;
    border-radius: 6px;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .dropdown-item {
      padding: 8px 16px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background-color: #3b3c3e;
      }

      &.dropdown-item-active {
        color: #409eff;
      }
    }
  }

  :deep(.el-dialog) {
    border-radius: 12px;
    background-color: rgb(23, 24, 27);

    .el-dialog__header {
      margin-right: 0;
      padding: 16px 20px;
      border-bottom: 1px solid rgb(57, 60, 67);

      .el-dialog__title {
        color: var(--font-color-default);
        font-size: 16px;
      }
    }

    .el-dialog__body {
      padding: 20px;

      .el-form-item {
        margin-bottom: 20px;

        .el-form-item__label {
          color: var(--font-color-default);
          padding-bottom: 8px;
        }

        .el-input {
          .el-input__wrapper {
            background-color: rgb(57, 60, 67);
            box-shadow: none;
            border: 1px solid rgb(57, 60, 67);

            .el-input__inner {
              color: var(--font-color-default);
            }
          }
        }

        .el-radio-group {
          .el-radio {
            margin-right: 16px;

            .el-radio__label {
              color: var(--font-color-default);
            }

            &.is-checked {
              .el-radio__inner {
                background-color: #409eff;
                border-color: #409eff;

                &::after {
                  background-color: white;
                }
              }

              .el-radio__label {
                color: #409eff;
              }
            }
          }
        }
      }
    }

    .el-dialog__footer {
      padding: 10px 20px 20px;
      text-align: right;

      .el-button {
        border-radius: 6px;
        padding: 8px 16px;
        font-size: 14px;

        &--default {
          background-color: rgb(57, 60, 67);
          border-color: rgb(57, 60, 67);
          color: var(--font-color-default);
        }

        &--primary {
          background-color: var(--el-color-primary);
          border-color: var(--el-color-primary);
        }
      }
    }
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

/****导入导出****/
.preview-table {
  margin-top: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.preview-table table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
}

.preview-table .invalid {
  color: red;
  text-decoration: line-through;
}

.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  :deep(){
    .el-button {
      margin-left: 0;
    }
  }
}

.import-count {
  margin-top: 10px;
  font-size: 14px;
  color: #999;
}

.address-text{
  span {
    color: #ffffff;
    font-weight: bold;
  }

  .copy{
    width: 12px;
    height: 12px;
    margin-left: 8px;
    cursor: pointer;
    flex-shrink: 0; // 防止图标被压缩
    color: #909399;
    transition: color 0.3s ease;

    &:hover {
      color: #409eff;
    }
  }

  .edit{
    margin-left: 4px;
  }

  .edit-icon {
    margin-left: 8px;
    cursor: pointer;
    color: #409eff;
    transition: color 0.3s ease;
    flex-shrink: 0; // 防止图标被压缩

    &:hover {
      color: #66b1ff;
    }
  }

  .el-input {
    .el-input__wrapper {
      background-color: rgba(64, 158, 255, 0.1);
      border: 1px solid #409eff;
      border-radius: 4px;

      .el-input__inner {
        color: var(--font-color-default);
        font-size: 12px;
      }
    }

    &.is-focus .el-input__wrapper {
      box-shadow: 0 0 0 1px #409eff inset;
    }

    .input-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      padding-right: 4px;

      .action-icon {
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 2px;
        border-radius: 2px;

        &.save-icon {
          color: #67c23a;
          &:hover {
            color: #85ce61;
            background-color: rgba(103, 194, 58, 0.1);
          }
        }

        //修改成红色
        &.cancel-icon {
          color: #f56c6c;
          &:hover {
            color: #f78989;
            background-color: rgba(144, 147, 153, 0.1);
          }
        }
      }
    }

  }

}
</style>