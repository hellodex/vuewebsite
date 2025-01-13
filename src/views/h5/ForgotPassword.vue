<template>
  <div class="forgotPassword-box">
    <van-sticky>
      <div class="forgotPassword-head display-flex align-items-center justify-content-sp">
        <svg-icon name="chevron-left" class="chevron-left" @click="router.back()"></svg-icon>
        <span>忘记密码</span>
        <div></div>
      </div>
    </van-sticky>
    <div class="forgotPassword-content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :size="formSize"
        class="form-box"
        label-position="top"
        hide-required-asterisk
      >
        <el-form-item prop="account" label="邮箱">
          <el-input v-model="ruleForm.account" placeholder="邮箱" autocomplete="new-password" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="new-password"
            placeholder="密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input
            v-model="ruleForm.checkPassword"
            type="password"
            placeholder="确认密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input v-model="ruleForm.captcha" placeholder="邮箱验证码" autocomplete="off">
            <template #suffix>
              <el-text
                size="small"
                @click.prevent="handelCaptcha(ruleFormRef)"
                style="cursor: pointer; color: var(--bg-color)"
                v-if="captchaStatus == 1"
                >获取验证码</el-text
              >
              <el-text v-else-if="captchaStatus == 2" size="small" style="color: var(--bg-color)"
                >{{ captchaTimes }}s</el-text
              >
              <el-text
                v-else-if="captchaStatus == 3"
                size="small"
                @click.prevent="handelCaptcha(ruleFormRef)"
                style="cursor: pointer; color: var(--bg-color)"
                >重新获取</el-text
              >
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="form-btn" v-if="loading">
            <el-icon class="is-loading" :size="18">
              <Loading />
            </el-icon>
            <span>确定</span>
          </div>
          <div class="form-btn" v-else @click="submitForm(ruleFormRef)">确定</div>
        </el-form-item>
        <div
          class="display-flex align-items-center justify-content-sp"
          style="position: relative; top: -15px; color: var(--dex-color-4)"
        >
          <span></span>
          <span>已有账号，<i class="log-on" @click="router.push('/h5/signIn')">去登录</i></span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import { useRoute, useRouter } from 'vue-router'
import { APIsendMessage, APImodifyPwd } from '@/api/login'
import { isAllSpaces } from '@/utils'
import { showLoadingToast, showSuccessToast } from 'vant'

const route = useRoute()
const router = useRouter()
// 正则表达式
const minLength = /.{8,}/ // 至少8个字符
const containsNumber = /[0-9]/ // 至少一个数字
const containsUpperCase = /[A-Z]/ // 至少一个大写字母

const globalStore = useGlobalStore()

interface RuleForm {
  account: string
  password: string
  checkPassword: string
  captcha: string
}

const validatePassword = (rule: any, value: any, callback: any) => {
  if (isAllSpaces(value)) {
    callback(new Error('请输入密码'))
  } else if (!minLength.test(value)) {
    callback(new Error('密码必须至少8个字符'))
  } else if (!containsNumber.test(value)) {
    callback(new Error('密码必须包含至少一个数字'))
  } else if (!containsUpperCase.test(value)) {
    callback(new Error('密码必须包含至少一个大写字母'))
  } else {
    if (!isAllSpaces(ruleForm.checkPassword)) {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPassword')
    }
    callback()
  }
}

const validateCheckPassword = (rule: any, value: any, callback: any) => {
  if (isAllSpaces(value)) {
    callback(new Error('请确认密码'))
  } else if (value !== ruleForm.checkPassword) {
    callback(new Error('密码不一致'))
  } else {
    callback()
  }
}

const validCaptcha = (rule: any, value: any, callback: any) => {
  if (/^[A-Za-z0-9]+$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确验证码'))
  }
}

const loading = ref<boolean>(false)
const formSize = ref<ComponentSize>('large')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  account: '',
  password: '',
  checkPassword: '',
  captcha: ''
})

const rules = reactive<FormRules<RuleForm>>({
  account: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '请输入正确的邮件地址',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {
      required: true,
      validator: validatePassword,
      trigger: 'blur'
    }
  ],
  checkPassword: [
    {
      required: true,
      validator: validateCheckPassword,
      trigger: 'blur'
    }
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    },
    {
      validator: validCaptcha,
      trigger: ['blur', 'change']
    }
  ]
})

const captchaStatus = ref<number>(1)
const captchaTimes = ref<number>(60)

const timer = ref<any>(null)

const handelCaptcha = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validateField('account')
  try {
    await formEl.validateField('account')
  } catch (error) {
    return false
  }

  const res: any = await APIsendMessage({
    account: ruleForm.account,
    accountType: 1,
    type: 2
  })
  console.log(res)
  if (res == 'success') {
    captchaCountDown()
    captchaStatus.value = 2
  }
}

const captchaCountDown = () => {
  captchaTimes.value = 60
  timer.value = setInterval(() => {
    if (captchaTimes.value === 1) {
      captchaStatus.value = 3
      captchaTimes.value = 60
      clearInterval(timer.value)
    }
    captchaTimes.value--
  }, 1000)
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!')
      showLoadingToast({
        message: `密码设置中...`,
        forbidClick: true
      })
      loading.value = true
      const res = await APImodifyPwd({
        account: ruleForm.account,
        password: ruleForm.password,
        captcha: ruleForm.captcha
      })
      console.log(res)
      if (res) {
        showSuccessToast('密码设置成功')
        loading.value = false
        router.back()
        return
      }
      loading.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped lang="scss">
.forgotPassword-box {
  width: 100vw;
  height: 100vh;
  .forgotPassword-head {
    color: var(--bg-color);
    padding: 12px 15px 12px 8px;
    font-size: 16px;
    .chevron-left {
      width: 24px;
      height: 24px;
      color: var(--bg-color);
    }
  }
  .forgotPassword-content {
    max-width: 1000px;
    height: calc(100vh - 50px);
    margin: 0 auto;
    padding: 12px 15px;
    border-radius: 12px;
    overflow: hidden;
    overflow-y: auto;
    .forgotPassword-logo {
      font-size: 18px;
      font-style: normal;
      color: var(--bg-color);
      .logo {
        width: 40px;
        height: 40px;
        margin-right: 11px;
      }
    }
    .forgotPassword-title {
      margin: 20px 0 10px 0;
      span {
        font-size: 16px;
        color: var(--bg-color);
      }
      i {
        color: #14c784;
        font-style: normal;
      }
      strong {
        padding: 1px 8px;
        border-radius: 6px;
        background: var(--bg-color);
        color: var(--font-color-default);
        font-size: 12px;
        font-style: normal;
        margin-left: 15px;
        font-weight: normal;
      }
    }
    .forgotPassword-tip {
      font-size: 14px;
      color: var(--dex-color-4);
      margin-bottom: 20px;
    }
  }
  .checked-text {
    color: var(--font-color-default);
    a {
      color: var(--up-color);
    }
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: var(--up-color);
  }
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #e5e5e5 !important;
    .el-input__inner {
      color: var(--bg-color);
    }
  }
  :deep(input:-webkit-autofill) {
    box-shadow: 0 0 0px 1000px #fff inset !important;
    -webkit-text-fill-color: var(--bg-color);
  }
  :deep(.el-form-item__label) {
    color: var(--bg-color);
  }
  .code-text {
    position: absolute;
    right: 0;
    bottom: -16px;
    font-size: 10px;
    font-style: normal;
    color: var(--bg-color);
    line-height: 1.6;
    cursor: pointer;
  }
  .form-btn {
    width: 100%;
    padding: 12px 19px;
    background-color: var(--bg-color);
    color: var(--font-color-default);
    height: 40px;
    font-size: 14px;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    line-height: 1;
    outline: none;
    text-align: center;
    transition: 0.1s;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    align-items: center;
    span {
      margin-left: 6px;
    }
    .icon {
      width: 18px;
      height: 18px;
    }
  }
  .log-on {
    font-style: normal;
  }
}
</style>
