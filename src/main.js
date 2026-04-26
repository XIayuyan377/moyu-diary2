import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './renderer/router'
import './styles/theme.css'

// =====================================
// 创建应用实例
// =====================================
const app = createApp(App)

// =====================================
// 注册插件
// =====================================

// 1. 注册 Pinia 状态管理
const pinia = createPinia()
app.use(pinia)

// 2. 注册路由
app.use(router)

// =====================================
// 挂载应用
// =====================================
app.mount('#app')

// =====================================
// 初始化用户数据
// =====================================
import { useUserStore } from './stores/user'

const userStore = useUserStore()
userStore.loadSettings()

// 开发环境下暴露调试接口
if (process.env.NODE_ENV === 'development') {
  window.__userStore__ = userStore
  console.log('✨ 用户状态管理已初始化')
  console.log('💡 开发提示: 可通过 window.__userStore__ 访问用户状态')
}
