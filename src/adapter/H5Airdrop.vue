<template>
  <div class="mobile-airdrop-container">
    <!-- Header -->
    <div class="mobile-header">
      <h1 class="title">空投查询</h1>
      <a href="https://hellodex.gitbook.io/hellodex/lian-shang-jiao-yi-suo-he-bian-ge/1.3-ping-tai-bi-yu-shou-zhong" target="_blank" class="white-paper-link">
        详情查看白皮书
        <el-icon><ArrowRight /></el-icon>
      </a>
    </div>

    <!-- Query Input -->
    <div class="query-section">
      <el-input
        v-model="walletAddress"
        placeholder="请输入钱包地址"
        clearable
        class="address-input"
      >
        <template #prefix>
          <el-icon><Wallet /></el-icon>
        </template>
      </el-input>

      <el-button
        type="primary"
        class="query-btn"
        @click="handleQuery"
        :loading="loading"
      >
        查询
      </el-button>
    </div>

    <!-- Results -->
    <div class="result-section" v-if="showResult">
      <div class="result-card">
        <div class="wallet-info">
          <el-icon><User /></el-icon>
          <span class="address">{{ walletAddress }}</span>
          <span class="time">即将发放</span>
        </div>

        <el-divider />

        <div class="airdrop-results">
          <!-- Type 1 Result -->
<!--          <div class="result-item" v-if="airdropResults.type1">-->
<!--            <el-icon class="icon"><Present /></el-icon>-->
<!--            <div class="details">-->
<!--              <span class="title">抽奖奖励</span>-->
<!--              <span class="amount">{{ airdropResults.type1 }} 份</span>-->
<!--            </div>-->
<!--          </div>-->

          <!-- Type 2 Result -->
          <div class="result-item" v-if="airdropResults.type2">
            <el-icon class="icon"><Coin /></el-icon>
            <div class="details">
              <span class="title">代币奖励</span>
              <span class="amount">{{ airdropResults.type2 }} 个</span>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-result" v-if="!airdropResults.type1 && !airdropResults.type2">
            <el-icon><Box /></el-icon>
            <span>该地址暂无空投记录</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Milestone Image -->
    <div class="milestone-section">
      <h2>里程碑事件</h2>
      <img src="@/assets/icons/ido-img.svg" alt="Milestones" class="milestone-img" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Wallet, User, Present, Coin, Box, ArrowRight } from '@element-plus/icons-vue'

const walletAddress = ref('')
const loading = ref(false)
const showResult = ref(false)
const airdropResults = ref({
  type1: null,
  type2: null
})

const handleQuery = async () => {
  if (!walletAddress.value.trim()) {
    ElMessage.warning('请输入钱包地址')
    return
  }

  try {
    loading.value = true
    showResult.value = false

    // Reset results
    airdropResults.value = { type1: null, type2: null }

    // Mock API call - replace with your actual API
    const resultData = await mockAirdropQuery(walletAddress.value.trim())

    if (!Array.isArray(resultData)) {
      console.warn('Invalid API response format')
      showResult.value = true
      return
    }

    // Process results
    resultData.forEach(item => {
      if (item.type === 1) {
        airdropResults.value.type1 = item.amount
      } else if (item.type === 2) {
        airdropResults.value.type2 = item.amount
      }
    })

    showResult.value = true
  } catch (error) {
    ElMessage.error('查询失败: ' + (error.message || '网络错误'))
  } finally {
    loading.value = false
  }
}

// Mock API function - replace with your actual API call
const mockAirdropQuery = async (address) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 111,
          walletAddress: address,
          amount: 1000,
          type: 1,
          createTime: "2023-07-01"
        },
        {
          id: 112,
          walletAddress: address,
          amount: 500,
          type: 2,
          createTime: "2023-07-01"
        }
      ])
    }, 800)
  })
}
</script>

<style scoped lang="scss">
.mobile-airdrop-container {
  padding: 16px;
  background: var(--card-bg-color);
  min-height: 100vh;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .title {
    font-size: 20px;
    font-weight: 500;
    color: var(--font-color-default);
    margin: 0;
  }

  .white-paper-link {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--font-color-default);
    text-decoration: none;

    .el-icon {
      margin-left: 4px;
      font-size: 14px;
    }
  }
}

.query-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;

  .address-input {
    :deep(.el-input__wrapper) {
      background-color: var(--hover-bg-color);
      box-shadow: none;
      border-radius: 8px;
      padding: 12px 16px;
    }
  }

  .query-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    border-radius: 8px;
    background: var(--primary-color);
    color: white;
    border: none;
  }
}

.result-section {
  margin-top: 16px;

  .result-card {
    background: var(--hover-bg-color);
    border-radius: 12px;
    padding: 16px;
  }

  .wallet-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--font-color-default);

    .address {
      font-family: monospace;
      word-break: break-all;
      flex: 1;
    }

    .time {
      color: var(--text-color-secondary);
      font-size: 12px;
    }
  }

  .el-divider {
    margin: 12px 0;
    background-color: var(--divider-color);
  }

  .airdrop-results {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--result-item-bg);
    border-radius: 8px;

    .icon {
      font-size: 24px;
      color: var(--primary-color);
    }

    .details {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 14px;
        color: var(--text-color-secondary);
      }

      .amount {
        font-size: 16px;
        font-weight: 600;
        color: var(--font-color-default);
      }
    }
  }

  .empty-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: var(--text-color-secondary);

    .el-icon {
      font-size: 40px;
      margin-bottom: 8px;
      color: var(--text-color-secondary);
    }
  }
}

.milestone-section {
  margin-top: 32px;

  h2 {
    font-size: 18px;
    color: var(--font-color-default);
    margin-bottom: 12px;
  }

  .milestone-img {
    width: 100%;
    border-radius: 8px;
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .mobile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .white-paper-link {
      align-self: flex-end;
    }
  }
}
</style>