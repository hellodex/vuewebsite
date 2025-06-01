<template>
  <el-dialog
    v-model="logOnDialogVisible"
    :before-close="handleClose"
    append-to-body
    align-center
    class="connect-wallet-dialog"
  >
    <div class="connect-wallet-box display-flex flex-direction-col">
      <div class="logo-title display-flex align-items-center justify-content-center">
        <svg-icon name="logo" class="icon-logo"></svg-icon>
        <span>HelloDex</span>
      </div>
      <div class="describe-txt display-flex align-items-center justify-content-sp">
        <div class="display-flex flex-direction-col">
          <strong>欢迎来到HelloDex</strong>
          <span style="font-size: 12px; margin-top: 6px;" >平台自身盈利全部销毁平台币</span>
        </div>
      </div>
      <div class="connect-wallet-tab display-flex align-items-center justify-content-sp">
        <div
          class="tab-item display-flex align-items-center justify-content-center"
          v-for="(item, index) in tabList"
          :key="index"
          @click="handelTab(item)"
        >
          <svg-icon :name="item.icon" :class="item.icon" v-if="item.icon"></svg-icon>
          <img src="../../assets/img/img-tg.png" alt="" class="icon-tg" v-else />
          <span>{{ item.label }}</span>
          <div class="checkmark-container" v-if="tabIndex == item.value">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" class="checkmark">
              <path class="checkmark-path" d="M10 25 L20 35 L40 15" />
            </svg>
          </div>
        </div>
      </div>
      <el-divider> 登录 </el-divider>
      <div class="tab-content">
        <transition name="fade">
          <template v-if="tabIndex == 1">
            <div class="display-flex flex-direction-col align-items-center" style="margin-top: 60px;" >

              <a
                :href="`${tgUrl}?start=TS_${new Date().getTime()}_P_Web`"
                target="_blank"
                class="form-btn"
              >
                <svg-icon name="telegram-pump" class="telegram-pump"></svg-icon>
                <span >连接 Telegram </span>
              </a>
            </div>
          </template>
        </transition>
        <transition name="fade">
          <template v-if="tabIndex == 2">
            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              :size="formSize"
              class="form-box"
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
              <el-form-item prop="captcha">
                <div class="captcha-box display-flex align-items-center justify-content-sp">
                  <VerificationCodeInput
                    v-model="ruleForm.captcha"
                    :captchaStatus="captchaStatus"
                  />
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
              <el-form-item>
                <template v-if="checklogin">
                  <div class="form-btn" v-if="loading">
                    <el-icon class="is-loading" :size="18">
                      <Loading />
                    </el-icon>
                    <span>确认登录</span>
                  </div>
                  <div class="form-btn" v-else @click="submitForm(ruleFormRef)">确认登录</div>
                </template>
                <template v-else>
                  <div class="form-btn" @click="handelCaptcha(ruleFormRef)">获取验证码</div>
                </template>
                <div class="display-flex align-items-center justify-content-sp" style="width: 100%">
                  <span class="tips-operate" @click="handelForgotPassword">忘记密码？</span>
                  <span class="tips-operate" @click="handelNotReceivedCode">未收到验证码？</span>
                </div>
              </el-form-item>
              <div class="register-txt display-flex align-items-center justify-content-center">
                <strong>还没有账号？</strong>
                <span @click="handelRegister">注册</span>
              </div>
            </el-form>
          </template>
        </transition>
        <transition name="fade">
          <template v-if="tabIndex == 3">
            <div class="web3-connect-wallet">
              <div
                class="connect-wallet-item display-flex align-items-center"
                @click="handelWalletConnect"
              >
                <svg-icon name="icon-metamask" class="icon-logo"></svg-icon>
                <div class="display-flex flex-direction-col">
                  <span>MetaMask</span>
                  <span>使用 WalletConnect 连接</span>
                </div>
              </div>
              <div
                class="connect-wallet-item display-flex align-items-center"
                @click="handelWalletConnect"
              >
                <svg-icon name="icon-sol" class="icon-sol"></svg-icon>
                <div class="display-flex flex-direction-col">
                  <span>Solana Wallet</span>
                  <span>使用 WalletConnect 连接</span>
                </div>
              </div>
              <div
                class="connect-wallet-item display-flex align-items-center"
                @click="handelWalletConnect"
              >
                <svg-icon name="icon-okx" class="icon-logo"></svg-icon>
                <div class="display-flex flex-direction-col">
                  <span>OKX Wallet</span>
                  <span>使用 WalletConnect 连接</span>
                </div>
              </div>
              <div
                class="connect-wallet-item display-flex align-items-center"
                @click="handelWalletConnect"
              >
                <svg-icon name="icon-walletconnect" class="icon-logo"></svg-icon>
                <div class="display-flex flex-direction-col">
                  <span>Wallet Connect</span>
                  <span>支持 WalletConnect 钱包</span>
                </div>
              </div>
            </div>
          </template>
        </transition>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useGlobalStore } from '@/stores/global'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import VerificationCodeInput from '@/components/VerificationCodeInput.vue'

import { isAllSpaces, aesEncrypt } from '@/utils'
import { APIdologin, APIuserInfo, APIsendMessage, APIdologinCheck } from '@/api/login'
import { socketOffMonitor, socketOnMonitor } from '@/utils/socket'
import { customMessage } from '@/utils/message'

// 正则表达式
const minLength = /.{8,}/ // 至少8个字符
const containsNumber = /[0-9]/ // 至少一个数字
const containsUpperCase = /[A-Z]/ // 至少一个大写字母

const tgUrl = ref(import.meta.env.VITE_TG_URL)

const tabList = [
  {
    label: 'Telegram',
    value: 1
  },
  {
    label: '邮箱登录',
    value: 2,
    icon: 'icon-google'
  },
  {
    label: 'WalletConnect',
    value: 3,
    icon: 'walletconnect'
  }
]

const tabIndex = ref<number>(1)

const handelTab = (item: any) => {
  tabIndex.value = item.value
}

const globalStore = useGlobalStore()

const { setDialogVisible, setAccountInfo, setWalletInfo } = globalStore

const { connectWallet } = useConnectWallet()

const logOnDialogVisible = computed(() => globalStore.dialogVisible.logOnDialogVisible)

const handleClose = () => {
  setDialogVisible({
    registerDialogVisible: false,
    logOnDialogVisible: false,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: false
  })
}

const handelForgotPassword = () => {
  setDialogVisible({
    registerDialogVisible: false,
    logOnDialogVisible: false,
    forgotPasswordDialogVisible: true,
    notReceivedCodeDialogVisible: false
  })
}

const handelRegister = () => {
  setDialogVisible({
    registerDialogVisible: true,
    logOnDialogVisible: false,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: false
  })
}

const handelNotReceivedCode = () => {
  setDialogVisible({
    registerDialogVisible: false,
    logOnDialogVisible: true,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: true
  })
}

const handelWalletConnect = () => {
  setDialogVisible({
    registerDialogVisible: false,
    logOnDialogVisible: false,
    forgotPasswordDialogVisible: false,
    notReceivedCodeDialogVisible: false
  })
  setTimeout(() => {
    connectWallet()
  }, 100)
}

interface RuleForm {
  account: string
  password: string
  captcha: string
  checked: boolean | null
}

const loading = ref<boolean>(false)
const checklogin = ref<boolean>(false)
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
  formEl.validateField('password')
  try {
    await formEl.validateField('account')
    await formEl.validateField('password')
  } catch (error) {
    return false
  }

  const result: any = await APIdologinCheck({
    account: ruleForm.account,
    password: ruleForm.password,
    type: '0'
  })

  if (result == 'success') {
    checklogin.value = true
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
        type: '0'
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
          title: '账户登录成功'
        })
        const obj = Object.assign({}, res, userInfo)
        localStorage.setItem('accountInfo', JSON.stringify(obj))

        setAccountInfo(obj)
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

        /******  登录成功 表单数据及状态重置 *******/
        clearInterval(timer.value)
        captchaStatus.value = 1
        captchaTimes.value = 60
        checklogin.value = false
        ruleForm.account = ''
        ruleForm.password = ''
        ruleForm.captcha = ''
        ruleForm.checked = null
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

<style lang="scss">
@use './logon.scss';
</style>
