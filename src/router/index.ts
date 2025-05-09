import { createRouter, createWebHistory } from 'vue-router'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { APIgetChainConfigs } from '@/api/coinWalletDetails'
import { APIgetChain } from '@/api'
import { APIuserInfo } from '@/api/login'
import { useGlobalStore } from '@/stores/global'
import { useFavoriteData } from '@/hooks/useFavoriteData'

import Home from '@/views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        keepAlive: true // 设置需要缓存的组件
      },
      component: Home
    },
    {
      path: '/k/:pairAddress',
      name: 'CoinWalletDetails',
      component: () => import('@/views/coinWalletDetails.vue')
    },
    {
      path: '/kline/:language/:chainCode/:baseAddress',
      name: 'kline',
      component: () => import('@/views/kline.vue')
    },
    {
      path: '/Smartmoney',
      name: 'SmartMoney',
      component: () => import('@/views/smartMoney.vue')
    },
    {
      path: '/:chain/address/:address',
      name: 'SmartMoneyDetails',
      component: () => import('@/views/smartMoneyDetails.vue')
    },
    {
      path: '/Market',
      name: 'Market',
      component: () => import('@/views/market.vue')
    },
    {
      path: '/Tools',
      name: 'Tools',
      component: () => import('@/views/tools.vue')
    },
    {
      path: '/ChongDogVentures',
      name: 'ChongDogVentures',
      meta: {
        title: 'HelloDex-冲狗基金',
        description: '免费每天送U、欢迎加入'
      },
      component: () => import('@/views/chongDogVentures.vue')
    },
    {
      path: '/Account',
      name: 'Account',
      component: () => import('@/views/account/index.vue'),
      redirect: '/Account/Property',
      children: [
        {
          path: 'Property',
          name: 'Property',
          meta: {
            title: 'HelloDex-我的资产'
          },
          component: () => import('@/views/account/property.vue')
        },
        {
          path: 'WalletConfig',
          name: 'WalletConfig',
          meta: {
            title: 'HelloDex-钱包配置'
          },
          component: () => import('@/views/account/walletConfig.vue')
        },
        {
          path: 'Rebate',
          name: 'Rebate',
          meta: {
            title: 'HelloDex-我的返佣'
          },
          component: () => import('@/views/account/rebate.vue')
        },
        {
          path: 'Secure',
          name: 'Secure',
          meta: {
            title: 'HelloDex-安全中心'
          },
          component: () => import('@/views/account/secure.vue')
        },
        {
          path: 'Commission',
          name: 'AccontCommission',
          meta: {
            title: 'HelloDex-佣金'
          },
          component: () => import('@/views/account/commission.vue')
        },
        {
          path: 'Withdrawal',
          name: 'Withdrawal',
          meta: {
            title: 'HelloDex-提现记录'
          },
          component: () => import('@/views/account/withdrawal.vue')
        }
      ]
    },
    {
      path: '/Monitor',
      name: 'Monitor',
      component: () => import('@/views/monitor/index.vue'),
      redirect: '/Monitor/Strategy',
      children: [
        {
          path: 'Strategy',
          name: 'Strategy',
          meta: {
            title: 'HelloDex-AI监控',
            description: '可添加代币、钱包、推特帖子任何异动第一时间推送给用户'
          },
          component: () => import('@/views/monitor/strategy.vue')
        },
        {
          path: 'ObserveGroup',
          name: 'ObserveGroup',
          meta: {
            title: 'HelloDex-AI监控',
            description: '可添加代币、钱包、推特帖子任何异动第一时间推送给用户'
          },
          component: () => import('@/views/monitor/observeGroup.vue')
        }
      ]
    },
    {
      path: '/Search',
      name: 'Search',
      component: () => import('@/views/h5/Search.vue')
    },
    {
      path: '/trade/:pairAddress',
      name: 'Transaction',
      component: () => import('@/views/h5/Transaction.vue')
    },
    {
      path: '/Inscription',
      name: 'Inscription',
      component: () => import('@/views/h5/Inscription.vue')
    },
    {
      path: '/Wallet',
      name: 'Wallet',
      component: () => import('@/views/h5/Wallet.vue')
    },
    {
      path: '/WalletOperation',
      name: 'WalletOperation',
      component: () => import('@/views/h5/WalletOperation.vue')
    },
    {
      path: '/Setting',
      name: 'Setting',
      component: () => import('@/views/h5/Setting.vue')
    },
    {
      path: '/Refer',
      name: 'Refer',
      component: () => import('@/views/refer.vue')
    },
    {
      path: '/Ido',
      name: 'IDO',
      component: () => import('@/views/ido.vue')
    },
    {
      path: '/Download',
      name: 'Download',
      meta: {
        title: 'HelloDex-下载',
        description: '支持iOS、安卓、Telegram bot、网页点击下载'
      },
      component: () => import('@/views/download.vue')
    },
    {
      path: '/h5/register',
      name: 'Register',
      component: () => import('@/views/h5/Register.vue')
    },
    {
      path: '/h5/signIn',
      name: 'SignIn',
      component: () => import('@/views/h5/SignIn.vue')
    },
    {
      path: '/h5/forgotPassword',
      name: 'ForgotPassword',
      component: () => import('@/views/h5/ForgotPassword.vue')
    },
    {
      path: '/h5/inviteRebate',
      name: 'InviteRebate',
      component: () => import('@/views/h5/InviteRebate.vue')
    },
    {
      path: '/h5/commission',
      name: 'H5Commission',
      component: () => import('@/views/h5/Commission.vue')
    },
    {
      path: '/TelegramLogin',
      name: 'TelegramLogin',
      component: () => import('@/views/TelegramLogin.vue')
    },
    {
      path: '/Follow',
      name: 'Follow',
      component: () => import('@/views/follow.vue')
    },
    {
      path: '/Pricing',
      name: 'Pricing',
      component: () => import('@/views/pricing.vue')
    }
  ]
})

// 路由拦截
router.beforeEach(async (to, from, next) => {
  console.log(to)

  document.title = to.meta?.title ? (to.meta.title as string) : 'HelloDex:交易快人一步'
  if (to.meta?.description) {
    // 假设我们要修改description meta标签
    const descriptionMeta = document.querySelector('meta[name="description"]')
    const descriptionMeta1 = document.querySelector('meta[http-equiv="description"]')
    const keywordsMeta = document.querySelector('meta[name="keywords"]')
    const keywordsMeta1 = document.querySelector('meta[http-equiv="keywords"]')

    // 更新content属性
    descriptionMeta?.setAttribute('content', to.meta?.description as string)
    descriptionMeta1?.setAttribute('content', to.meta?.description as string)
    keywordsMeta?.setAttribute('content', to.meta?.description as string)
    keywordsMeta1?.setAttribute('content', to.meta?.description as string)
  }
  if (to.query.channel == 'okx') {
    import('@/utils/firebaseOkx').then((module) => {
      const analytics = module.default
      console.warn(analytics)
    })
  } else {
    import('@/utils/firebase').then((module) => {
      const analytics = module.default
      console.warn(analytics)
    })
  }
  const globalStore = useGlobalStore()

  const account: any = localStorage.getItem('accountInfo')
  if (account) {
    APIuserInfo().then((res) => {
      if (res) {
        const obj = Object.assign({}, JSON.parse(account), res)
        localStorage.setItem('accountInfo', JSON.stringify(obj))
        globalStore.setAccountInfo(obj)
      }
    })
  }
  const chainConfigs = useChainConfigsStore()

  if (globalStore.chainLogoObj == null) {
    const res: any = await APIgetChain({})
    const chainList = [
      {
        chainCode: 'DEX',
        chainName: globalStore.language == 'zh' ? '全部公链' : 'All Chains',
        chainType: -1
      },
      ...res
    ]
    globalStore.setChain(chainList)
  }
  if (chainConfigs.chainConfigs == null) {
    const res: any = await APIgetChainConfigs({})
    res?.forEach((item: any) => {
      item.wrapped = item.wrapped.toLowerCase()
    })
    chainConfigs.createChainConfigs(res || null)
    useFavoriteData()
  }

  if (!account && to.fullPath.indexOf('/Account/') !== -1) {
    next('/')
  }
  next() // 继续
})

export default router
