<template>
  <el-dialog
    v-model="registerDialogVisible"
    append-to-body
    align-center
    class="connect-wallet-dialog"
    :before-close="handleClose"
  >
    <div class="connect-wallet-box display-flex flex-direction-col">
      <div class="logo-title display-flex align-items-center justify-content-center">
        <svg-icon name="logo" class="icon-logo"></svg-icon>
        <span>HelloDex</span>
      </div>
      <div class="describe-txt display-flex align-items-center justify-content-sp">
        <div class="display-flex flex-direction-col">
          <strong>欢迎来到HelloDex</strong>
          <span>平台盈利全部销毁平台币</span>
        </div>
      </div>
      <el-divider> 注册 </el-divider>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :size="formSize">
        <el-form-item prop="account">
          <el-input v-model="ruleForm.account" placeholder="邮箱" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            placeholder="密码"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input
            v-model="ruleForm.checkPassword"
            type="password"
            placeholder="确认密码"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-box display-flex align-items-center justify-content-sp">
            <VerificationCodeInput v-model="ruleForm.captcha" :captchaStatus="captchaStatus" />
            <div class="captcha-txt">
              <el-text
                @click.prevent="handelCaptcha(ruleFormRef)"
                style="cursor: pointer"
                v-if="captchaStatus == 1"
                >获取验证码</el-text
              >
              <el-text v-else-if="captchaStatus == 2">{{ captchaTimes }}s</el-text>
              <el-text
                v-else-if="captchaStatus == 3"
                @click.prevent="handelCaptcha(ruleFormRef)"
                style="cursor: pointer"
                >重新获取</el-text
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="invitationCode">
          <el-input v-model="ruleForm.invitationCode" placeholder="邀请码（选填）" />
        </el-form-item>
        <!-- <el-form-item prop="checked">
        <el-checkbox v-model="ruleForm.checked">
          <span class="checked-text">
            点击即表示您同意我们的
            <a
              href="https://img.apihellodex.lol/TermsAndPrivacy/TermsAndPrivacy.html"
              target="_blank"
              rel="noopener noreferrer"
              >服务条款</a
            >和<a
              href="https://img.apihellodex.lol/TermsAndPrivacy/TermsAndPrivacy.html"
              target="_blank"
              rel="noopener noreferrer"
              >隐私政策</a
            >。
          </span>
        </el-checkbox>
      </el-form-item> -->
        <el-form-item>
          <div class="form-btn" v-if="loading">
            <el-icon class="is-loading" :size="18">
              <Loading />
            </el-icon>
            <span>确认注册</span>
          </div>
          <div class="form-btn" v-else @click="submitForm(ruleFormRef)">确认注册</div>
        </el-form-item>
        <div class="display-flex align-items-center justify-content-sp" style="width: 100%">
          <span class="tips-operate"></span>
          <span class="tips-operate" @click="handelNotReceivedCode">未收到验证码？</span>
        </div>
        <div class="register-txt display-flex align-items-center justify-content-center">
          <strong>已有账号？</strong>
          <span @click="handleLogon">登录</span>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <el-dialog v-model="visible" align-center center width="380">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">未收到验证码？</h4>
    </template>
    <span>
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
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import { APIsendMessage, APIdologin, APIuserInfo } from '@/api/login'
import { aesEncrypt, isAllSpaces } from '@/utils'
import VerificationCodeInput from '@/components/VerificationCodeInput.vue'
import { socketOffMonitor, socketOnMonitor } from '@/utils/socket'
import { customMessage } from '@/utils/message'

// 正则表达式
const minLength = /.{8,}/ // 至少8个字符
const containsNumber = /[0-9]/ // 至少一个数字
const containsUpperCase = /[A-Z]/ // 至少一个大写字母

const globalStore = useGlobalStore()

const { setDialogVisible, setAccountInfo, setWalletInfo } = globalStore

const registerDialogVisible = computed(() => globalStore.dialogVisible.registerDialogVisible)

const visible = ref<boolean>(false)

const handleClose = () => {
  setDialogVisible({
    registerDialogVisible: false,
    logOnDialogVisible: false,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: false
  })
}

const handleLogon = () => {
  setDialogVisible({
    registerDialogVisible: false,
    logOnDialogVisible: true,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: false
  })
}

const handelNotReceivedCode = () => {
  setDialogVisible({
    registerDialogVisible: true,
    logOnDialogVisible: false,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: true
  })
}

interface RuleForm {
  account: string
  password: string
  checkPassword: string
  captcha: string
  invitationCode: string
  checked: boolean | null
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
  captcha: '',
  invitationCode: '',
  checked: null
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
  ],
  invitationCode: [
    {
      required: false,
      message: '请输入邀请码',
      trigger: 'blur'
    }
  ],
  checked: [
    {
      required: true,
      message: '请勾选服务条款和隐私政策',
      trigger: ['change', 'blur']
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
    type: 3
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
      loading.value = true
      console.log('submit!')
      const res: any = await APIdologin({
        account: ruleForm.account,
        password: ruleForm.password,
        captcha: ruleForm.captcha,
        invitationCode: ruleForm.invitationCode,
        type: '1'
      })
      if (res) {
        console.log('原始数据', JSON.parse(JSON.stringify(res)))
        for (const key in res.wallets) {
          if (Object.prototype.hasOwnProperty.call(res.wallets, key)) {
            const element = res.wallets[key]
            element.forEach((item: { walletKey: string; uuid: string }) => {
              item.walletKey = aesEncrypt(item.walletKey, item.uuid)
            })
          }
        }
        console.log('加密后数据', res)

        localStorage.setItem('accountInfo', JSON.stringify(res))
        const userInfo: any = await APIuserInfo()
        customMessage({
          type: 'success',
          title: '账户注册登录成功'
        })
        const obj = Object.assign({}, res, userInfo)
        localStorage.setItem('accountInfo', JSON.stringify(obj))

        setAccountInfo(res)
        setDialogVisible({
          registerDialogVisible: false,
          logOnDialogVisible: false,
          forgotPasswordDialogVisible: false,
          notReceivedCodeDialogVisible: false
        })
        setWalletInfo({
          address: null,
          isConnected: true,
          chainId: null,
          walletType: 'Email'
        })
        socketOffMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
        socketOnMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
        loading.value = false

        return
      }
      loading.value = false
      console.log(res)
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
@use './logon.scss';
.checked-text {
  color: var(--font-color-default);
  a {
    color: var(--up-color);
  }
}
</style>
