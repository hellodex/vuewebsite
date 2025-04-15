<template>
  <div class="h5-refer-box">
    <div class="h5-refer-content">
      <div class="refer-logo-box display-flex align-items-center">
        <svg-icon name="logo" class="logo"></svg-icon>
        <span>HelloDex</span>
      </div>
      <p class="refer-tip">开创和主导Web3变革,平台利润80%分给用户</p>
      <img src="@/assets/icons/account_login.svg" class="refer-logo" />
      <div class="web-refer-form web-refer-main" v-if="captchaStatus == 1">
        <h3>欢迎您加入HelloDex</h3>
        <h6>{{ route.query.invitationCode }} 邀请您加入HelloDex一起捕获链上Alpha收益</h6>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          :size="formSize"
          class="form-box"
          label-position="top"
          hide-required-asterisk
          style="width: 100%"
        >
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
          <el-form-item style="margin-bottom: 0">
            <div class="form-btn" v-if="loading">
              <el-icon class="is-loading" :size="18">
                <Loading />
              </el-icon>
              <span>注册</span>
            </div>
            <div class="form-btn" v-else @click="handelCaptcha(ruleFormRef)">注册</div>
          </el-form-item>
          <!-- <div class="home-route display-flex align-items-center" @click="router.replace('/')">
            <span>跳过并直接进入网站</span>
            <svg-icon name="arrow-up" class="arrow-up"></svg-icon>
          </div> -->
        </el-form>
      </div>
      <div class="web-refer-code web-refer-main" v-else>
        <h3>输入邮箱验证码</h3>
        <h6>
          验证码发送到您的邮箱(<span>{{ ruleForm.account }}</span
          >)
        </h6>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          :size="formSize"
          class="form-box"
          label-position="top"
          hide-required-asterisk
          style="width: 100%"
        >
          <el-form-item prop="captcha">
            <div class="verification-code-input">
              <VerificationCodeInput v-model="ruleForm.captcha" :captchaStatus="captchaStatus" />
            </div>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <div class="form-btn" v-if="loading">
              <el-icon class="is-loading" :size="18">
                <Loading />
              </el-icon>
              <span>下一步</span>
            </div>
            <div class="form-btn" v-else @click="submitForm(ruleFormRef)">下一步</div>
          </el-form-item>

          <div class="home-route display-flex align-items-center">
            <i>没收到验证码，</i>
            <strong v-if="captchaStatus == 2">重新发送({{ captchaTimes }})s</strong>
            <strong
              v-else-if="captchaStatus == 3"
              @click.prevent="handelCaptchaAgain(ruleFormRef)"
              style="cursor: pointer"
              >重新发送</strong
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { APIsendMessage, APIdologin, APIuserInfo } from '@/api/login'
import { useGlobalStore } from '@/stores/global'
import { aesEncrypt, isAllSpaces } from '@/utils'
import VerificationCodeInput from '@/components/VerificationCodeInput.vue'
import { socketOffMonitor, socketOnMonitor } from '@/utils/socket'

const globalStore = useGlobalStore()

const { setAccountInfo, setWalletInfo } = globalStore

const route = useRoute()
const router = useRouter()

const invitationCode: any = route.query.invitationCode

const loading = ref<boolean>(false)

// 正则表达式
const minLength = /.{8,}/ // 至少8个字符
const containsNumber = /[0-9]/ // 至少一个数字
const containsUpperCase = /[A-Z]/ // 至少一个大写字母

interface RuleForm {
  account: string
  password: string
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
    callback()
  }
}

const formSize = ref<ComponentSize>('large')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  account: '',
  password: '',
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
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      await sendMessage()
      loading.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handelCaptchaAgain = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validateField('account')
  try {
    await formEl.validateField('account')
  } catch (error) {
    return false
  }

  sendMessage()
}

const sendMessage = async () => {
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
      console.log('submit!')
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
        const obj = Object.assign({}, res, userInfo)
        localStorage.setItem('accountInfo', JSON.stringify(obj))

        setAccountInfo(res)
        setWalletInfo({
          address: null,
          isConnected: true,
          chainId: null,
          walletType: 'Email'
        })
        loading.value = false
        socketOffMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
        socketOnMonitor(globalStore.accountInfo.uuid, globalStore.accountInfo.tokenInfo.tokenValue)
        window.location.href = '/'
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
.h5-refer-box {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  padding: 0.5333rem 0.32rem;
  .h5-refer-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .refer-logo-box {
      font-size: 0.5333rem;
      color: #000;
      font-family: 'PingFangSC-Medium';
      .logo {
        width: 1.0933rem;
        height: 1.0933rem;
        margin-right: 0.2933rem;
      }
    }
    .refer-tip {
      font-size: 0.3733rem;
      color: #333;
      font-family: 'PingFangSC-Heavy';
      margin: 0.2133rem 0 0.5333rem;
    }
    .refer-logo {
      width: 6.2987rem;
      margin-bottom: 1.0667rem;
    }
    .web-refer-main {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      h3 {
        font-size: 0.7467rem;
        color: #000;
        font-family: 'PingFangSC-Heavy';
        font-weight: normal;
      }

      h6 {
        font-size: 0.3467rem;
        color: #999;
        font-family: 'PingFangSC-Medium';
        margin: 0.2133rem 0 0.5333rem;
        font-weight: normal;
        span {
          color: #333;
        }
      }
      :deep(input:-webkit-autofill) {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #000;
      }
      :deep(.el-input__wrapper),
      :deep(.el-select__wrapper) {
        box-shadow: 0 0 0 1px #e5e5e5 !important;
      }
      :deep(.el-input__inner) {
        font-size: 0.3733rem;
        color: #333;
      }
      .home-route {
        margin-top: 0.4267rem;
        color: #333;
        font-family: 'PingFangSC-Medium';
        font-size: 0.32rem;
        justify-content: center;
        cursor: pointer;
        .arrow-up {
          width: 0.48rem;
          height: 0.48rem;
          transform: rotate(90deg);
          margin-left: 0.16rem;
        }
        i {
          color: #b8b8b8;
          font-family: 'PingFangSC-Regular';
          font-style: normal;
        }
        strong {
          color: #333;
          font-family: 'PingFangSC-Regular';
          text-decoration: underline;
        }
      }
      .verification-code-input {
        width: 100%;
        :deep(.input-box) {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.2667rem;
          .el-input {
            width: auto !important;
            opacity: 0;
          }
          .el-input__inner {
            text-align: center;
            font-size: 0.4rem;
            font-family: 'PingFangSC-Heavy';
            color: #333;
          }
        }
      }
    }
  }

  .form-btn {
    width: 100%;
    padding: 10px 12px;
    background-color: #000;
    color: #fff;
    height: 40px;
    font-size: 16px;
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
  }
}
</style>
