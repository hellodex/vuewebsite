<template>
  <div class="advanced-setting">
    <DoubleCost />
    <el-collapse>
      <el-collapse-item name="1">
        <template #title>
          <div class="display-flex align-items-center">
            <span class="setting-txt">高级设置</span>
            <el-icon color="#9AA0AA"><Setting /></el-icon>
          </div>
        </template>
        <template #icon="{ isActive }">
          <span class="icon-ele">
            <svg-icon
              name="chevron-down"
              style="width: 14px; height: 14px; color: #9aa0aa"
              v-if="isActive"
            ></svg-icon>
            <svg-icon
              name="chevron-right"
              style="width: 14px; height: 14px; color: #9aa0aa"
              v-else
            ></svg-icon>
          </span>
        </template>
        <div class="advanced-setting-main">
          <div class="setting-item display-flex align-items-center justify-content-sp">
            <div class="display-flex align-items-center">
              <span>防夹开关</span>
              <van-icon name="question-o" class="question-o-icon" />
            </div>
            <el-switch
              v-model="advancedSetting.antiPinchSwitch"
              @change="handelSwitch"
              size="small"
              style="--el-switch-on-color: #fff; --el-switch-off-color: #43464f"
            />
          </div>
          <div class="setting-item display-flex flex-direction-col">
            <div class="display-flex align-items-center">
              <span>滑点</span>
              <van-icon name="question-o" class="question-o-icon" />
            </div>
            <div class="display-flex align-items-center justify-content-sp">
              <span class="setting-span">自动</span>
              <el-switch
                v-model="advancedSetting.autoSlippage"
                @change="handelSwitch"
                size="small"
                style="--el-switch-on-color: #fff; --el-switch-off-color: #43464f"
              />
            </div>
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
              >
                <template #suffix>%</template>
              </el-input>
            </div>
          </div>
          <div class="setting-item display-flex flex-direction-col">
            <div class="display-flex align-items-center">
              <span>gas费</span>
              <span style="padding: 0 4px"></span>
              <span class="setting-span">{{ sellInfo.chainCode }}</span>
            </div>
            <div class="gas-box display-flex align-items-center justify-content-sp">
              <div
                v-for="(item, index) in gasType"
                :key="index"
                :class="
                  advancedSetting.gasTypeIndex == item.id ? 'active gas-type-item' : 'gas-type-item'
                "
                @click="handelGasType(item)"
              >
                <span>{{ item.label }}</span>
                <span
                  >{{
                    sellInfo.chainCode === 'SOLANA'
                      ? '0.001 SOL ≈ $' + numberFormat(props.mainNetworkCurrencyPrice * 0.001)
                      : numberFormat(item.multiple * gasObj.gasPrice) +
                        'Gwei ≈ $' +
                        numberFormat(
                          decimalsFormat(
                            item.multiple *
                              Number(gasObj.gwei) *
                              300000 *
                              props.mainNetworkCurrencyPrice,
                            mainNetworkCurrency(sellInfo.chainCode).decimals
                          )
                        )
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { mainNetworkCurrency, numberFormat } from '@/utils'
import { decimalsFormat, getEvmGasGwei } from '@/utils/transition'
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

const gasObj = ref<any>({
  gwei: 0,
  gasPrice: 0
}) // Gas费
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

const handelSwitch = (val: boolean) => {
  console.log(val)
  localStorage.setItem('advancedSetting', JSON.stringify(advancedSetting))
}

const gasType = [
  {
    label: '普通',
    id: 1,
    multiple: 1.1
  },
  {
    label: '快速',
    id: 2,
    multiple: 1.2
  },
  {
    label: '极速',
    id: 3,
    multiple: 1.3
  }
]
const handelGasType = (item: { id: number }) => {
  advancedSetting.gasTypeIndex = item.id
  localStorage.setItem('advancedSetting', JSON.stringify(advancedSetting))
}

onMounted(async () => {
  if (sellInfo.value.chainCode != 'SOLANA') {
    gasObj.value = await getEvmGasGwei(mainNetworkCurrency(sellInfo.value.chainCode).rpc)
    timer.value = setInterval(async () => {
      gasObj.value = await getEvmGasGwei(mainNetworkCurrency(sellInfo.value.chainCode).rpc)
    }, 5000)
  }
})

onUnmounted(() => {
  clearInterval(timer.value)
})

defineExpose({
  gasObj,
  gasTypeIndex: advancedSetting.gasTypeIndex,
  gasType
})
</script>

<style lang="scss" scoped>
.advanced-setting {
  margin-top: 16px;
  .txt {
    font-size: 13px;
  }
  .setting-txt {
    margin-right: 5px;
    color: #9aa0aa;
    font-family: 'PingFangSC-Medium';
  }
  :deep(.el-collapse),
  :deep(.el-collapse-item__header),
  :deep(.el-collapse-item__wrap) {
    border: none;
  }
  :deep(.el-collapse-item__header) {
    height: 32px;
    line-height: 32px;
  }
  :deep(.el-collapse-item__content) {
    padding-bottom: 0 !important;
  }
  :deep(.el-collapse-item__arrow) {
    margin-right: 0;
  }

  :deep(.el-switch .el-switch__core .el-switch__action) {
    background-color: #1f232d;
  }

  .question-o-icon {
    margin-left: 7px;
  }
  .setting-item {
    margin-bottom: 6px;
    color: #9aa0aa;
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
  }

  .gas-box {
    margin-top: 6px;
    .gas-type-item {
      width: 82px;
      height: 60px;
      padding: 7px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 6px;
      border: 1px solid rgba(38, 40, 44, 0.3);
      span:first-child {
        font-size: 12px;
        color: #9aa0aa;
      }
      span:last-child {
        color: #8c8c8c;
        font-size: 10px;
      }
    }
    .active {
      background: rgba(58, 60, 64, 0.4);
    }
  }
  .icon-ele {
    margin: 0 0 0 auto;
  }
}
</style>
