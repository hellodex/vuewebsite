<template>
  <van-popup
    v-model:show="popupVisible"
    round
    position="bottom"
    :style="{ height: '45%' }"
    closeable
    @close="handleClose"
  >
    <div class="tarde-setting">
      <div class="setting-txt">交易设置</div>

      <div class="slide-setting">
        <div class="setting-txt">滑点设置</div>

        <div class="slide-content">
          <p>设置高滑点：可以增加交易成功率，但是您可能无法获得最佳的价格</p>
          <div class="slippage-box">
            <span
              v-for="(item, index) in slippageRange"
              :key="index"
              :class="slippageIndex == item.value ? 'active' : ''"
              @click="handelSlippage(item)"
            >
              {{ item.label }}
            </span>
            <el-input
              v-model="slippageVal"
              style="width: 100%"
              size="small"
              placeholder="自定义"
              onkeyup="value=value.replace(/[^\d||/.]/g,'')"
              oninput="if(value){value=value.replace(/[^\d||/.]/g,'')}if(value<0){value=''}if(value>100){value=100}"
              :maxlength="3"
              :minlength="1"
            >
              <template #suffix>%</template>
            </el-input>
          </div>
        </div>
      </div>
      <div class="setting-btn" @click="handelSet">确定修改</div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

/** 弹框逻辑处理 */
const emit = defineEmits(['close', 'slippage'])

const props: any = defineProps({
  slideSettingShowBottom: {
    type: [Boolean],
    default: false
  }
})
const popupVisible: any = computed({
  // getter
  get() {
    return props.slideSettingShowBottom
  },
  // setter
  set(newValue) {
    return newValue
  }
})

const handleClose = () => {
  emit('close', false)
}

const slippageRange = [
  {
    label: '3%',
    value: 0.03
  },
  {
    label: '5%',
    value: 0.05
  },
  {
    label: '8%',
    value: 0.08
  },
  {
    label: '10%',
    value: 0.1
  }
]

const account: any = localStorage.getItem('accountInfo')
const slippageIndex = ref<number>(0)
const slippageVal = ref<any>('') // 滑点
if (account) {
  const slippage = slippageRange.find((item: any) => item.value == JSON.parse(account).slippage)
  if (slippage) {
    slippageIndex.value = JSON.parse(account).slippage
    slippageVal.value = ''
  } else {
    slippageIndex.value = 0
    slippageVal.value = (JSON.parse(account).slippage * 100).toString()
  }
} else {
  slippageIndex.value = 0.03
  slippageVal.value = ''
}

const handelSlippage = (item: { value: number }) => {
  slippageIndex.value = item.value
}

const handelSet = () => {
  emit('slippage', parseFloat(slippageVal.value) / 100 || slippageIndex.value)
  emit('close', false)
}
</script>
<style lang="scss" scoped>
.tarde-setting {
  padding: 0.32rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .setting-txt {
    line-height: 2;
    font-size: 0.4rem;
    color: #202020;
  }
  .slide-setting {
    height: 100%;
    margin-top: 0.32rem;
  }
  .slide-content {
    padding: 0.32rem;
    background-color: #f2f2f2;
    border-radius: 0.1067rem;
    margin-top: 0.32rem;
    p {
      margin-bottom: 0.32rem;
    }
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 0.0267rem #e5e5e5 !important;
      margin-left: 0.16rem;
    }
    :deep(.el-input__inner) {
      color: #202020;
    }
  }
  .slippage-box {
    background-color: #fff;
    padding: 0.16rem 0.32rem;
    border-radius: 0.1067rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    span {
      color: #202020;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      border-radius: 0.1067rem;
    }
    .active {
      background-color: #202020;
      color: #fff;
    }
  }
  .setting-btn {
    width: 100%;
    height: 1.0667rem;
    text-align: center;
    line-height: 1.0667rem;
    background-color: #202020;
    color: #fff;
    font-size: 0.4rem;
    border-radius: 0.1067rem;
  }
}
</style>
