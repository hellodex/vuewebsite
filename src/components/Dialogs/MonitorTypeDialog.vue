<template>
  <el-dialog v-model="dialogVisible" :before-close="handleClose" title="创建监控" width="510">
    <div class="monitorType-dialog-content">
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
      <div
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
      color: #cfd3dc;
    }
    .icon {
      width: 25px;
      height: 25px;
      margin-right: 8px;
    }
    .price-monitor {
      color: #bf8c00;
    }
    .chg-monitor,
    .sell-monitor {
      color: var(--down-color);
    }
    .buy-monitor {
      color: var(--up-color);
    }

    .description-txt {
      font-size: 12px;
      margin-top: 4px;
      color: var(--dex-color-4);
    }
    .chevron-right {
      width: 24px;
      height: 24px;
      color: #666;
    }
  }
  /* 水波纹效果 */
  .monitorType-dialog-content-item::after {
    content: '';
    position: absolute;
    background: rgba(37, 37, 37, 0.6);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 0;
    transform: translate(-50%, -50%); /* 居中 */
    transition:
      width 1s,
      height 1s; /* 平滑过渡 */
    pointer-events: none; /* 防止影响点击 */
  }

  .monitorType-dialog-content-item:hover::after {
    opacity: 1;
    width: 500px; /* 宽度增加到原来的两倍 */
    height: 500px; /* 高度增加到原来的两倍 */
  }
}
</style>
