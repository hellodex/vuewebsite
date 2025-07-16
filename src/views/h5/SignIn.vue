<template>
  <div class="signIn-box">
    <van-sticky>
      <div class="signIn-head display-flex align-items-center justify-content-sp">
        <svg-icon name="chevron-left" class="chevron-left" @click="router.back()"></svg-icon>
        <span>登录</span>
        <div></div>
      </div>
    </van-sticky>
    <div class="signIn-content">
      <div class="signIn-title">欢迎使用HelloDex</div>
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
          <el-input v-model="ruleForm.account" autocomplete="new-password" placeholder="邮箱" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="ruleForm.password"
            type="password"
            placeholder="密码"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
        <div
          class="display-flex align-items-center justify-content-sp"
          style="position: relative; top: -15px"
        >
          <span
            style="color: var(--dex-color-4); text-decoration: underline"
            @click="router.push('/h5/forgotPassword')"
            >忘记密码？</span
          >
          <span></span>
        </div>
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
            <span>登录</span>
          </div>
          <div class="form-btn" v-else @click="submitForm(ruleFormRef)">登录</div>
        </el-form-item>
        <el-form-item>
          <div class="login-txt display-flex align-items-center">
            <span>还没有账号？</span>
            <strong @click="router.replace('/h5/register')">立即注册</strong>
          </div>
        </el-form-item>
      </el-form>
      <div class="other-login">
        <van-divider>其他登录方式</van-divider>
        <a :href="`${tgUrl}?start=TS_${new Date().getTime()}_P_Web`" target="_blank" class="img-tg">
          <img src="@/assets/img/img-tg.png" alt="" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import { useRoute, useRouter } from 'vue-router'
import { aesEncrypt, isAllSpaces } from '@/utils'
import { APIdologin, APIuserInfo, APIsendMessage } from '@/api/login'
import { showLoadingToast, showSuccessToast } from 'vant'
import { socketOffMonitor, socketOnMonitor } from '@/utils/socket'

const route = useRoute()
const router = useRouter()

const tgUrl = ref(import.meta.env.VITE_TG_URL)

// 正则表达式
const minLength = /.{8,}/ // 至少8个字符
const containsNumber = /[0-9]/ // 至少一个数字
const containsUpperCase = /[A-Z]/ // 至少一个大写字母

const globalStore = useGlobalStore()

const { setAccountInfo, setWalletInfo } = globalStore

interface RuleForm {
  account: string
  password: string
  captcha: string
  checked: boolean | null
}

const loading = ref<boolean>(false)
const formSize = ref<ComponentSize>('large')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  account: '',
  password: '',
  captcha: '',
  checked: null
})

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
  checked: [
    {
      required: true,
      message: '请勾选服务条款和隐私政策',
      trigger: 'change'
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
      // console.log('submit!')
      loading.value = true
      showLoadingToast({
        message: `账户登录中...`,
        forbidClick: true
      })
      const res: any = await APIdologin({
        account: ruleForm.account,
        password: ruleForm.password,
        captcha: ruleForm.captcha,
        type: '0'
      })
      if (res) {
        // console.log('原始数据', JSON.parse(JSON.stringify(res)))
        for (const key in res.wallets) {
          if (Object.prototype.hasOwnProperty.call(res.wallets, key)) {
            const element = res.wallets[key]
            element.forEach((item: { walletKey: string; uuid: string }) => {
              item.walletKey = aesEncrypt(item.walletKey, item.uuid)
            })
          }
        }
        // console.log('加密后数据', res)

        localStorage.setItem('accountInfo', JSON.stringify(res))
        const userInfo: any = await APIuserInfo()
        showSuccessToast('账户登录成功')
        const obj = Object.assign({}, res, userInfo)
        localStorage.setItem('accountInfo', JSON.stringify(obj))

        setAccountInfo(obj)
        setWalletInfo({
          address: null,
          isConnected: true,
          chainId: null,
          walletType: 'Email'
        })
        socketOffMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
        socketOnMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
        loading.value = false
        router.back()
        return
      }
      loading.value = false
      // console.log(res)
    } else {
      // console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped lang="scss">
.signIn-box {
  width: 100vw;
  height: 100vh;
  .signIn-head {
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
  .signIn-content {
    max-width: 1000px;
    height: calc(100vh - 50px);
    margin: 0 auto;
    padding: 12px 15px;
    border-radius: 12px;
    overflow: hidden;
    overflow-y: auto;
    .signIn-logo {
      font-size: 18px;
      font-style: normal;
      color: var(--bg-color);
      .logo {
        width: 40px;
        height: 40px;
        margin-right: 11px;
      }
    }
    .signIn-title {
      color: #000;
      font-size: 0.8rem;
      font-weight: 600;
      line-height: normal;
      margin: 0.4rem 0 0.8rem;
    }
    .signIn-tip {
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
  .login-txt {
    width: 100%;
    color: #999;
    font-size: 0.3733rem;
    justify-content: center;
    strong {
      color: #000;
    }
  }

  .other-login {
    margin-top: 1.0667rem;
    .img-tg {
      display: flex;
      width: 1.1733rem;
      height: 1.1733rem;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid #e5e5e5;
      margin: 0 auto;
      img {
        width: 0.4267rem;
        height: 0.4267rem;
      }
    }
  }
}
</style>
