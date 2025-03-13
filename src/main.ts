import './assets/fonts/font.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// element plus
import ElementPlus from 'element-plus'
// element css
import 'element-plus/dist/index.css'
// element icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// svg icons
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/svg-icon/index.vue'
import EmptyData from '@/components/EmptyData.vue'

// custom directives
import directives from '@/directives/index'

// echarts
import echarts from './utils/echarts'

// flexible
import 'lib-flexible/flexible'

// Vant
import Vant from 'vant'

// Vant css
import 'vant/lib/index.css'

import App from './App.vue'
// vue Router
import router from './router'

// vue i18n
import I18n from '@/languages/index'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// echarts 挂载到 Vue实例中
// 注意：app.config.globalProperties 和 app.provide('$echarts', echarts) 二选一即可
// Vue.prototype.$echarts = echarts; // vue2的挂载方式

// app.config.globalProperties.$echarts = echarts; // vue3的挂载方式（一个用于注册能够被应用内所有组件实例访问到的全局属性的对象。）

app.provide('$echarts', echarts) // vue3采用provide, inject方式使用

app.component('svg-icon', SvgIcon)
app.component('empty-data', EmptyData)

app.use(createPinia())
app.use(ElementPlus)
app.use(Vant)
app.use(directives)
app.use(I18n)
app.use(router)

app.mount('#app')
