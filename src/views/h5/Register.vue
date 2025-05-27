<template>
  <div class="register-box">
    <van-sticky>
      <div class="register-head display-flex align-items-center justify-content-sp">
        <svg-icon name="chevron-left" class="chevron-left" @click="router.back()"></svg-icon>
        <span>注册</span>
        <div></div>
      </div>
    </van-sticky>
    <div class="register-content">
      <div class="register-title">欢迎使用HelloDex</div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :size="formSize"
        class="form-box"
        label-position="top"
        hide-required-asterisk
      >
        <el-form-item label="邮箱" prop="account">
          <el-input v-model="ruleForm.account" autocomplete="new-password" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
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
            autocomplete="new-password"
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
          <span class="code-text" @click="visible = true">未收到验证码？</span>
        </el-form-item>
        <el-form-item prop="invitationCode">
          <el-input
            v-model="ruleForm.invitationCode"
            placeholder="邀请码（选填）"
            :disabled="invitationCode"
          />
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
        <el-form-item style="margin-bottom: 0">
          <div class="form-btn" v-if="loading">
            <el-icon class="is-loading" :size="18">
              <Loading />
            </el-icon>
            <span>注册</span>
          </div>
          <div class="form-btn" v-else @click="submitForm(ruleFormRef)">注册</div>

          <div class="login-txt display-flex align-items-center">
            <span>已有账号？</span>
            <strong @click="router.push('/h5/signIn')">去登录</strong>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog v-model="visible" align-center center width="350" class="dialog-register">
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { APIsendMessage, APIdologin, APIuserInfo } from '@/api/login'
import { useGlobalStore } from '@/stores/global'
import { aesEncrypt, isAllSpaces } from '@/utils'
import { showLoadingToast, showSuccessToast } from 'vant'
import { socketOffMonitor, socketOnMonitor } from '@/utils/socket'

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()

const { setAccountInfo, setWalletInfo } = globalStore

const invitationCode: any = route.query.invitationCode

const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
// 正则表达式
const minLength = /.{8,}/ // 至少8个字符
const containsNumber = /[0-9]/ // 至少一个数字
const containsUpperCase = /[A-Z]/ // 至少一个大写字母

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

const formSize = ref<ComponentSize>('large')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  account: '',
  password: '',
  checkPassword: '',
  captcha: '',
  invitationCode: invitationCode || '',
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
      showLoadingToast({
        message: `账户注册登录中...`,
        forbidClick: true
      })
      loading.value = true
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
        showSuccessToast('账户注册登录成功')
        const obj = Object.assign({}, res, userInfo)
        localStorage.setItem('accountInfo', JSON.stringify(obj))

        setAccountInfo(res)
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
</script>

<style scoped lang="scss">
.register-box {
  width: 100vw;
  height: 100vh;
  .register-head {
    color: var(--bg-color);
    padding: 12px 15px 12px 8px;
    font-size: 16px;
    .chevron-left {
      width: 24px;
      height: 24px;
      color: var(--bg-color);
    }
    .signin-btn {
      border-radius: 4px;
      border: 1px solid #e5e5e5;
      padding: 3px 10px;
      font-size: 12px;
    }
  }
  .register-content {
    max-width: 1000px;
    height: calc(100vh - 50px);
    margin: 0 auto;
    padding: 12px 15px;
    border-radius: 12px;
    overflow: hidden;
    overflow-y: auto;
    .register-logo {
      font-size: 18px;
      font-style: normal;
      color: var(--bg-color);
      .logo {
        width: 40px;
        height: 40px;
        margin-right: 11px;
      }
    }
    .register-title {
      color: #000;
      font-size: 0.8rem;
      font-weight: 600;
      line-height: normal;
      margin: 0.4rem 0 0.8rem;
    }
    .register-tip {
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
    bottom: -18px;
    font-size: 10px;
    font-style: normal;
    color: var(--bg-color);
    line-height: 1.6;
    cursor: pointer;
  }
  .form-btn,
  .footer-btn {
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
  .login-txt {
    width: 100%;
    color: #999;
    font-size: 0.3733rem;
    justify-content: center;
    margin-top: 0.2667rem;
    strong {
      color: #000;
    }
  }
}
:deep(.dialog-register) {
  background-color: var(--font-color-default);
  .el-dialog__title,
  .el-dialog__body {
    color: var(--dex-color-4);
  }
}
</style>
