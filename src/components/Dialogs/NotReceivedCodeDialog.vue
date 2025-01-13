<template>
  <el-dialog
    v-model="notReceivedCodeDialogVisible"
    align-center
    center
    width="380"
    :before-close="handleClose"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">未收到验证码？</h4>
    </template>
    <span class="span-txt">
      如您没有找到验证码邮件，请检查邮箱的垃圾邮件及垃圾桶分类，以确保验证码邮件没有被误标为垃圾邮件。长时间无法收到验证码邮件，请前往Telegram社区联系客服进行处理。
    </span>
    <template #footer>
      <div class="footer-btn">
        <img src="@/assets/img/img-tg.png" alt="" />
        <span>前往Telegram</span>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

const { setDialogVisible } = globalStore

const notReceivedCodeDialogVisible = computed(
  () => globalStore.dialogVisible.notReceivedCodeDialogVisible
)

const handleClose = () => {
  setDialogVisible({
    registerDialogVisible: false,
    logOnDialogVisible: false,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: false
  })
}
</script>
<style scoped lang="scss">
.footer-btn {
  width: 100%;
  padding: 12px 19px;
  background-color: var(--font-color-default);
  color: var(--bg-color);
  height: 40px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  line-height: 1.2;
  outline: none;
  text-align: center;
  transition: 0.1s;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  align-items: center;
}

.footer-btn img {
  margin-right: 6px;
  width: 16px;
  height: 16px;
}
.span-txt {
  font-family: 'PingFangSC-Regular';
}
</style>
