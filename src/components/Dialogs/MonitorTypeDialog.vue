<template>
  <el-dialog 
    v-model="dialogVisible" 
    :before-close="handleClose" 
    title="创建监控" 
    width="510"
    :modal="true"
    :modal-class="'custom-modal-transparent'"
    :lock-scroll="false"
    :append-to-body="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true">
    <div class="monitorType-dialog-content">
      <div
        v-if="showGroupMonitor"
        class="display-flex align-items-center justify-content-sp monitorType-dialog-content-item"
        @click="handelDialog('group')"
      >
        <div class="display-flex align-items-center title-txt">
          <svg-icon name="price-monitor" class="price-monitor icon"></svg-icon>
          <div>
            <span>钱包分组行为监控</span>
            <p class="description-txt">当观察的钱包分组内有同时买入或卖出某一个币时您会收到通知</p>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>
      <div
        class="display-flex align-items-center justify-content-sp monitorType-dialog-content-item"
        @click="handelDialog('price')"
      >
        <div class="display-flex align-items-center title-txt">
          <svg-icon name="price-monitor" class="price-monitor icon"></svg-icon>
          <div>
            <span>价格监控</span>
            <p class="description-txt">设置代币到达指定价格时通知。</p>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>
      <div
        class="display-flex align-items-center justify-content-sp monitorType-dialog-content-item"
        @click="handelDialog('chg')"
      >
        <div class="display-flex align-items-center title-txt">
          <svg-icon name="chg-monitor" class="chg-monitor icon"></svg-icon>
          <div>
            <span>涨跌幅监控</span>
            <p class="description-txt">设置代币到达指定涨跌幅知。</p>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>
      <div
        class="display-flex align-items-center justify-content-sp monitorType-dialog-content-item"
        @click="handelDialog('buy')"
      >
        <div class="display-flex align-items-center title-txt">
          <svg-icon name="buy-monitor" class="icon buy-monitor"></svg-icon>
          <div>
            <span>大单买入监控</span>
            <p class="description-txt">设置代币每笔买入交易额通知。</p>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>
      <div
        class="display-flex align-items-center justify-content-sp monitorType-dialog-content-item"
        @click="handelDialog('sell')"
      >
        <div class="display-flex align-items-center title-txt">
          <svg-icon name="sell-monitor" class="icon sell-monitor"></svg-icon>
          <div>
            <span>大单卖出监控</span>
            <p class="description-txt">设置代币每笔卖出交易额通知。</p>
          </div>
        </div>
        <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
      </div>

    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits(['close', 'monitorType'])

const props: any = defineProps({
  monitorTypeDialogVisible: {
    type: [Boolean],
    default: false
  },
  showGroupMonitor: {
    type: [Boolean],
    default: false
  }
})

const dialogVisible: any = computed({
  // getter
  get() {
    return props.monitorTypeDialogVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})

const handelDialog = (val: string) => {
  emit('monitorType', val)
}

const handleClose = () => {
  emit('close', false)
}
</script>
<style scoped lang="scss">
.monitorType-dialog-content {
  .monitorType-dialog-content-item {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: rgba(37, 37, 37, 0.2);
    padding: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
    margin-bottom: 12px;
    .title-txt {
      color: #ffffff; /* 改为纯白色 */
      span {
        color: #ffffff; /* 标题文字纯白色 */
        font-weight: 500;
      }
    }
    .icon {
      width: 25px;
      height: 25px;
      margin-right: 8px;
      transition: transform 0.3s ease; /* 添加过渡效果 */
    }
    .price-monitor {
      color: #ffc107; /* 更亮的黄色 */
      opacity: 1;
    }
    .chg-monitor,
    .sell-monitor {
      color: var(--down-color);
      opacity: 1;
    }
    .buy-monitor {
      color: var(--up-color);
      opacity: 1;
    }

    .description-txt {
      font-size: 12px;
      margin-top: 4px;
      color: #b0b0b0; /* 使用更亮的灰色 */
    }
    .chevron-right {
      width: 24px;
      height: 24px;
      color: #666;
      transition: all 0.3s ease; /* 添加过渡效果 */
    }
  }
  
  /* 鼠标滑动时的效果 */
  .monitorType-dialog-content-item:hover {
    background: rgba(37, 37, 37, 0.4); /* 背景稍微加深 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 添加阴影 */
    
    .chevron-right {
      color: #999; /* 箭头颜色变亮 */
    }
    
    .title-txt {
      span {
        color: #ffffff; /* 确保标题保持白色 */
      }
    }
    
    .icon {
      transform: scale(1.1); /* 图标轻微放大 */
    }
  }
}
</style>

<style lang="scss">
/* 设置透明但可点击的遮罩层 */
.el-overlay {
  background-color: rgba(0, 0, 0, 0.05) !important; /* 几乎透明的遮罩层，但保留可点击性 */
}

.custom-modal-transparent {
  background-color: transparent !important;
}

:deep(.el-dialog) {
  background-color: #1a1a1a !important; /* 确保弹窗背景是深色的 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important; /* 更强的阴影效果 */
  border: 1px solid #333; /* 添加边框增强对比 */
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #333;
  padding-bottom: 16px;
}

:deep(.el-dialog__title) {
  color: #fff !important;
  font-size: 18px;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
}
</style>
