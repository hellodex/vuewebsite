<template>
  <div class="secure">
    <h1>安全中心</h1>
    <!-- <div class="card-box display-flex align-items-center justify-content-sp">
      <div class="display-flex">
        <svg-icon name="icon-google" class="icon-google"></svg-icon>
        <div class="display-flex flex-direction-col">
          <strong>绑定谷歌验证器</strong>
          <span class="txt">未绑定</span>
        </div>
      </div>
      <span class="btn">去绑定</span>
    </div> -->
    <div class="card-box display-flex align-items-center justify-content-sp">
      <div class="display-flex">
        <svg-icon name="icon-lock" class="icon-lock"></svg-icon>
        <div class="display-flex flex-direction-col">
          <strong>修改密码</strong>
          <span class="txt">保障用户安全</span>
        </div>
      </div>
      <span class="btn" @click="modifyPasswordDialogVisible = true">去修改</span>
    </div>
  </div>
  <el-dialog v-model="modifyPasswordDialogVisible" title="修改密码" width="500" align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" size="large" class="form-box">
      <el-form-item prop="account">
        <el-input v-model="ruleForm.account" placeholder="邮箱" />
      </el-form-item>
      <el-form-item prop="oldPassword">
        <el-input
          v-model="ruleForm.oldPassword"
          type="password"
          placeholder="原密码"
          show-password
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="ruleForm.password" type="password" placeholder="新密码" show-password />
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input
          v-model="ruleForm.checkPassword"
          type="password"
          placeholder="确认新密码"
          show-password
        />
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input v-model="ruleForm.captcha" placeholder="邮箱验证码" autocomplete="off">
          <template #suffix>
            <el-text
              size="small"
              @click.prevent="handelCaptcha(ruleFormRef)"
              style="cursor: pointer"
              v-if="captchaStatus == 1"
              >获取验证码</el-text
            >
            <el-text v-else-if="captchaStatus == 2" size="small">{{ captchaTimes }}s</el-text>
            <el-text
              v-else-if="captchaStatus == 3"
              size="small"
              @click.prevent="handelCaptcha(ruleFormRef)"
              style="cursor: pointer"
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
          <span>修改</span>
        </div>
        <div class="form-btn" v-else @click="submitForm(ruleFormRef)">修改</div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import type { FormInstance, FormRules } from 'element-plus'
import { APIsendMessage, APImodifyPwd } from '@/api/login'
import { isAllSpaces } from '@/utils'
import { customMessage } from '@/utils/message'

const router = useRouter()
const globalStore = useGlobalStore()
const loading = ref<boolean>(false)

// 正则表达式
const minLength = /.{8,}/ // 至少8个字符
const containsNumber = /[0-9]/ // 至少一个数字
const containsUpperCase = /[A-Z]/ // 至少一个大写字母

const modifyPasswordDialogVisible = ref<boolean>(false)
interface RuleForm {
  account: string
  oldPassword: string
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

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  account: '',
  oldPassword: '',
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
  oldPassword: [
    {
      required: true,
      message: '请输入原密码',
      trigger: 'blur'
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
  // console.log(res)
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
      loading.value = true
      const res = await APImodifyPwd({
        account: ruleForm.account,
        password: ruleForm.password,
        captcha: ruleForm.captcha
      })
      console.log(res)
      loading.value = false
      if (res) {
        customMessage({
          type: 'success',
          title: '密码修改成功'
        })
        modifyPasswordDialogVisible.value = false
        localStorage.removeItem('accountInfo')
        localStorage.removeItem('customWalletIndex')
        localStorage.removeItem('customWalletIndex1')
        globalStore.setAccountInfo(null)
        globalStore.setWalletInfo({
          address: null,
          isConnected: false,
          chainId: null,
          walletType: null
        })
        router.replace('/')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<style scoped lang="scss">
.secure {
  h1 {
    font-size: 28px;
    padding: 16px;
  }
  .card-box {
    padding: 16px;
    border-radius: 12px;
    background-color: rgba(23, 24, 27, 0.3);
    margin-bottom: 16px;
    .icon-google,
    .icon-lock {
      width: 28px;
      height: 28px;
      margin-right: 12px;
    }
    strong {
      font-size: 18px;
      font-weight: normal;
    }
    .txt {
      font-size: 12px;
      color: var(--dex-color-4);
      margin-top: 12px;
    }
    .btn {
      border-radius: 16px;
      background-color: var(--font-color-default);
      color: var(--bg-color);
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
.form-btn {
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
}
</style>
