<template>
  <van-popup
    v-model:show="popupShow"
    position="bottom"
    :style="{ height: '60%', background: type == 'detail' ? '#333' : '#fff' }"
    @close="handleClose"
  >
    <section class="popup-search">
      <van-sticky>
        <div class="search-box">
          <van-field
            v-model="query"
            left-icon="search"
            autocomplete="off"
            :placeholder="i18n.t('enterTokenNameContract')"
            clearable
            @update:model-value="handelInput"
          />
        </div>
      </van-sticky>
      <CoinItem :list="list" @handelItemClick="handelItem" />
    </section>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAppSearch } from '@/api'
import { debounce, isAllSpaces } from '@/utils'
import { showLoadingToast, closeToast } from 'vant'
import CoinItem from '@/adapter/components/H5CoinItem.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const emit = defineEmits(['close'])

const props: any = defineProps({
  popupShow: {
    type: [Boolean],
    default: false
  },
  type: {
    type: String,
    default: 'detail'
  }
})
const popupShow: any = computed({
  // getter
  get() {
    return props.popupShow
  },
  // setter
  set(newValue) {
    return newValue
  }
})

const handleClose = () => {
  emit('close', false)
}

const router = useRouter()
const query = ref<string>('')
const list = ref<any>([])

async function getAppSearchList() {
  const res: any = await getAppSearch({
    query: query.value
  })
  list.value =
    res?.map((item: any) => {
      return {
        logo: item.logo,
        chainCode: item.chainCode,
        baseTokenSymbol: item.baseToken?.symbol || '-',
        quoteTokenSymbol: item.quoteToken?.symbol || '-',
        pairAddress: item.pairAddress,
        tradeTvl: item.volumeUsd,
        tvl: item.tvl,
        price: item.price,
        chg: item.chg
      }
    }) || []
  closeToast()
}

const handelInput = () => {
  if (isAllSpaces(query.value)) {
    return false
  }
  debounce(() => {
    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: i18n.t('h5.loading')
    })
    getAppSearchList()
  }, 300)
}

const handelItem = (params: any) => {
  handelJump(params)
}

const handelJump = (item: any) => {
  if (props.type == 'detail') {
    router.push(`/k/${item.pairAddress}?chainCode=${item.chainCode}`)
  } else {
    router.push(`/trade/${item.pairAddress}?chainCode=${item.chainCode}`)
  }
}

onMounted(() => {
  // getAppSearchList()
})
</script>

<style scoped lang="scss">
.popup-search {
  width: 100%;

  .search-box {
    padding: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #333;
    :deep(.van-field) {
      border-radius: 0.2133rem;
      background: #444;
      padding: 0.2133rem 0.2667rem 0.2133rem 0.2133rem;
      color: #fff;
    }
    :deep(.van-field__control) {
      color: #fff;
    }
  }
  .tabs-content {
    padding-right: calc(0.4267rem - 5px);
  }
  :deep(.tabs-content-item) {
    color: #fff !important;
  }
}
</style>
