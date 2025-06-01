<template>
  <div class="advanced-setting">
    <DoubleCost />
    <div class="setting-item display-flex flex-direction-col">
      <div class="display-flex align-items-center">
        <span>滑点</span>
<!--        <van-icon name="question-o" class="question-o-icon" />-->
      </div>
      <span style="font-size: 9.5px; color: #E14D4DBD; margin-top: 6px;">交易时自动增加交易税，设置滑点时请不要包含!</span>
      <div class="slippage-box display-flex align-items-center justify-content-sp">
        <span
          v-for="(item, index) in slippageRange"
          :key="index"
          :class="advancedSetting.slippageIndex == item.value ? 'active' : ''"
          @click="handelSlippage(item)"
        >
          {{ item.label }}
        </span>
        <el-input
          v-model="advancedSetting.slippageVal"
          style="width: 65px"
          size="small"
          placeholder="自定义"
          onkeyup="value=value.replace(/[^\d||/.]/g,'')"
          oninput="if(value){value=value.replace(/[^\d||/.]/g,'')}if(value<0){value=''}if(value>100){value=100}"
          :maxlength="4"
          :minlength="1"
          @input="handelInput"
          :class="advancedSetting.slippageVal ? 'slippage-input' : ''"
        >
          <template #suffix>%</template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import DoubleCost from '@/components/DoubleCost.vue'

const emit = defineEmits(['slippage'])

const props = defineProps({
  coinInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  mainNetworkCurrencyPrice: {
    type: Number,
    default: 0
  }
})

const sellInfo = ref({
  ...props.coinInfo.sellCoin
})

const timer = ref<any>(null) // 定时器

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

let advancedSetting = reactive<any>({
  antiPinchSwitch: true, // 防夹开关
  autoSlippage: false, // 自动滑点
  slippageVal: '', // 滑点
  slippageIndex: 0.03,
  gasTypeIndex: 1
})

const account: any = localStorage.getItem('accountInfo')
const advancedSettingLocal = localStorage.getItem('advancedSetting')

if (account) {
  const slippage = slippageRange.find((item: any) => item.value == JSON.parse(account).slippage)
  if (slippage) {
    advancedSetting.slippageIndex = parseFloat(JSON.parse(account).slippage)
    advancedSetting.slippageVal = ''
  } else {
    advancedSetting.slippageIndex = 0
    advancedSetting.slippageVal = (JSON.parse(account).slippage * 100).toString()
  }
} else {
  advancedSetting.slippageIndex = 0.03
  advancedSetting.slippageVal = ''
}

if (advancedSettingLocal) {
  const obj = JSON.parse(advancedSettingLocal)
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      advancedSetting[key] = obj[key]
    }
  }
}

const handelSlippage = (item: { value: number }) => {
  advancedSetting.slippageIndex = item.value
  advancedSetting.slippageVal = ''
  emit('slippage', advancedSetting.slippageIndex)
  localStorage.setItem('advancedSetting', JSON.stringify(advancedSetting))
}

const handelInput = () => {
  advancedSetting.slippageIndex = 0
  emit('slippage', parseFloat(advancedSetting.slippageVal) / 100)
  localStorage.setItem('advancedSetting', JSON.stringify(advancedSetting))
}
</script>

<style lang="scss" scoped>
.advanced-setting {
  margin-top: 16px;
  .question-o-icon {
    margin-left: 7px;
  }
  .setting-item {
    margin-bottom: 6px;
    color: #cacad5;
    font-family: 'PingFangSC-Medium';
  }
  .setting-span {
    color: #5c6068;
    font-size: 12px;
  }
  .slippage-box {
    border-radius: 6px;
    border: 1px solid var(-----2, rgba(38, 40, 44, 0.3));
    height: 26px;
    margin-top: 6px;
    span {
      display: flex;
      flex: 1;
      height: 26px;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: transparent;
      font-size: 12px;
      cursor: pointer;
    }
    .active {
      background: var(--hover-bg-color);
    }
    :deep(.el-input__wrapper) {
      box-shadow: none !important;
    }
    .slippage-input {
      background: var(--hover-bg-color);
      border-radius: 6px;
    }
  }
}
</style>
