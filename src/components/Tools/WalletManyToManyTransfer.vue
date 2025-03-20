<template>
  <div class="batchTokenImputation walletManyToManyTransfer">
    <div class="title display-flex align-items-center justify-content-sp">
      <span>{{ i18n.t('tool.TokenContractAddress') }}</span>
    </div>
    <div class="chain-select display-flex align-items-center justify-content-sp">
      <div class="chain-btn">
        <el-input v-model="rpcnode" :placeholder="i18n.t('tool.PleaseEnterTokenContractAddress')" />
      </div>
      <el-popover
        placement="bottom"
        :width="400"
        :visible="popperVisible"
        popper-class="table-network-popper"
        ref="popoverRef"
      >
        <template #reference>
          <div
            class="rpc-select-text display-flex align-items-center justify-content-sp"
            @click="popperVisible = !popperVisible"
          >
            <div class="display-flex align-items-center">
              <img
                v-if="chainLogoObj?.[chainCode]"
                :src="chainLogoObj[chainCode]"
                alt=""
                class="icon-svg"
              />
              <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
              <span>{{ chainName }}</span>
            </div>
            <el-icon color="#fff" v-if="!popperVisible"><ArrowDownBold /></el-icon>
            <el-icon color="#fff" v-else><ArrowUpBold /></el-icon>
          </div>
        </template>
        <div class="display-flex flex-direction-col">
          <span
            v-for="item in chainData"
            :key="item.id"
            @click="handelChain(item)"
            v-click-outside="onClickOutside"
            :class="
              chainId == item.chainType
                ? 'display-flex align-items-center active'
                : 'display-flex align-items-center'
            "
          >
            <img v-if="item.logo" :src="item.logo" alt="" class="icon-svg" />
            <img src="@/assets/icons/coinDEX.svg" alt="" class="icon-svg" v-else />
            {{ item.chainName }}
          </span>
        </div>
      </el-popover>
    </div>
    <div class="title display-flex align-items-center justify-content-sp">
      <span class="display-flex align-items-center">
        {{ i18n.t('tool.RPCNode') }}
        <el-tooltip
          effect="light"
          content="自动获取链ID"
          popper-class="tooltip-item"
          placement="right"
        >
          <el-icon color="#828282" class="icon-doubt"><QuestionFilled /></el-icon>
        </el-tooltip>
      </span>
      <strong class="underline">{{ i18n.t('tool.MoreRPC') }}</strong>
    </div>
    <div class="rpc-node">
      <el-input v-model="rpcnode" :placeholder="i18n.t('tool.PleaseEnterRPCNode')" />
    </div>
    <div class="thread-box display-flex align-items-center justify-content-sp">
      <div class="thread-item display-flex flex-direction-col">
        <div class="title display-flex align-items-center justify-content-sp">
          <span class="display-flex align-items-center">
            {{ i18n.t('tool.Threads') }}
            <el-tooltip
              effect="light"
              :content="i18n.t('tool.ThreadsTxt')"
              placement="right"
              popper-class="tooltip-item"
            >
              <el-icon color="#828282" class="icon-doubt"><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </div>
        <el-input-number v-model="num1" />
      </div>
      <div class="thread-item display-flex flex-direction-col">
        <div class="title display-flex align-items-center justify-content-sp">
          <span class="display-flex align-items-center">
            {{ i18n.t('tool.CollectionInterval') }}
            <el-tooltip
              effect="light"
              :content="i18n.t('tool.ThreadsTxt')"
              placement="right"
              popper-class="tooltip-item"
            >
              <el-icon color="#828282" class="icon-doubt"><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </div>
        <el-input-number v-model="num1" />
      </div>
    </div>
    <div class="display-flex align-items-center justify-content-sp">
      <div class="address-item display-flex flex-direction-col">
        <div class="title display-flex align-items-center justify-content-sp">
          <span class="display-flex align-items-center">
            {{ i18n.t('tool.PrivateKeyList') }}
            <i class="safety-tips display-flex align-items-center">
              <svg-icon name="auth-check" class="auth-check" style="color: #17b26a"></svg-icon>
              {{ i18n.t('tool.SecurityTips') }}
            </i>
          </span>
          <strong class="underline">{{ i18n.t('tool.Example') }}</strong>
        </div>
        <div class="coin-token">
          <el-input
            v-model="address"
            :rows="6"
            type="textarea"
            :placeholder="i18n.t('tool.PleaseEnterPrivateKeyAddress')"
          />
          <div class="coin-btn display-flex align-items-center justify-content-sp">
            <span>{{ i18n.t('tool.Upload') }}</span>
          </div>
        </div>
      </div>
      <div class="address-item display-flex flex-direction-col">
        <div class="title display-flex align-items-center justify-content-sp">
          <span class="display-flex align-items-center">{{ i18n.t('tool.AddressList') }}</span>
          <strong class="underline">{{ i18n.t('tool.Example') }}</strong>
        </div>
        <div class="coin-token">
          <el-input
            v-model="address"
            :rows="6"
            type="textarea"
            :placeholder="i18n.t('tool.PleaseEnterPrivateKeyAddress')"
          />
          <div class="coin-btn display-flex align-items-center justify-content-sp">
            <span>{{ i18n.t('tool.Upload') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tips display-flex align-items-center">
      <svg-icon name="alert-circle" class="alert-circle" style="color: #828282"></svg-icon>
      <span>{{ i18n.t('tool.EnterOneAddressPerLine') }}</span>
    </div>
    <div class="btn">{{ i18n.t('tool.SendToken') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import { ClickOutside as vClickOutside } from 'element-plus'

const i18n = useI18n()

const globalStore = useGlobalStore()
const { chainLogoObj, chainList } = globalStore
const chainData = chainList.filter((item: any) => item.chainType !== -1)
const rpcnode = ref<string | null>(null)

const num1 = ref<number>(1)

const address = ref<string | null>(null)

const popperVisible = ref<boolean>(false)
const chainId = ref<number | string>(chainData[0].chainType) // 公链ID
const chainCode = ref<string>(chainData[0].chainCode) // 公链code
const chainName = ref<string>(chainData[0].chainName) // 公链name
const popoverRef = ref()

const handelChain = async (item: any) => {
  chainId.value = item.chainType
  chainCode.value = item.chainCode
  chainName.value = item.chainName
  popperVisible.value = false
}

/**点击空白处隐藏 */
const onClickOutside = (e: any) => {
  if (popperVisible.value && !unref(popoverRef).popperRef.contentRef.contains(e.target)) {
    popperVisible.value = false
  }
}
</script>

<style lang="scss" scoped>
@use './tools.scss';
</style>
