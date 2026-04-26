/* ============================================
   UI 重构所需的核心依赖
   ============================================
   
   在你的 package.json 中确保安装了以下包：
   
*/

{
  "name": "students-diary",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore"
  },
  "dependencies": {
    // ✅ 核心依赖（必须）
    "vue": "^3.3.4",           // Vue 3
    "vue-router": "^4.2.4",    // 路由管理
    "pinia": "^2.1.4",         // 状态管理（UI重构核心）
    
    // ✅ 样式和UI
    "tailwindcss": "^3.3.3",   // TailwindCSS
    
    // 可选但推荐
    "axios": "^1.4.0"          // HTTP 请求
  },
  "devDependencies": {
    // ✅ 构建工具
    "@vitejs/plugin-vue": "^4.2.4",
    "vite": "^4.3.9",
    
    // 样式工具
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    
    // 代码质量
    "@vue/eslint-config-prettier": "^7.1.0",
    "@vue/eslint-config-prettier": "^7.1.0",
    "eslint": "^8.44.0",
    "eslint-plugin-vue": "^9.0.0",
    "prettier": "^2.8.8"
  }
}

/* ============================================
   安装命令
   ============================================
*/

// 如果从零开始：
npm install vue@latest vue-router@latest pinia@latest

// 只安装缺少的：
npm install pinia
npm install -D tailwindcss postcss autoprefixer

// 初始化 TailwindCSS（如果需要）
npx tailwindcss init -p

/* ============================================
   Pinia 配置说明
   ============================================
   
   在 main.js 中：
   
   import { createPinia } from 'pinia'
   
   const app = createApp(App)
   const pinia = createPinia()
   
   app.use(pinia)
   app.use(router)
   app.mount('#app')
   
*/

/* ============================================
   TailwindCSS 配置说明（tailwind.config.js）
   ============================================
*/

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 品牌色
        'moyu-green': '#5BAD7F',
        'moyu-accent': '#FF8C42',
        'moyu-bg': '#FAF7F2',
      },
      fontFamily: {
        sans: ['PingFang SC', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/* ============================================
   CSS 重置（styles/theme.css）
   ============================================
*/

@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义组件类 */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-moyu-green text-white rounded-lg font-semibold hover:bg-opacity-90 transition;
  }
  
  .card {
    @apply bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition;
  }
  
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
}

/* ============================================
   Vite 配置说明（vite.config.js）
   ============================================
*/

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})

/* ============================================
   .env 文件示例（开发环境）
   ============================================
*/

VITE_APP_TITLE=摸鱼日记
VITE_API_BASE_URL=http://localhost:3000
NODE_ENV=development

/* ============================================
   快速检查清单
   ============================================
   
   安装完依赖后，确保：
   
   ✅ npm install 成功
   ✅ pinia 已安装在 node_modules 中
   ✅ main.js 中已配置 Pinia
   ✅ stores/user.js 文件存在
   ✅ 所有组件都在 src/renderer/components/ 中
   ✅ DashboardRefactored.vue 路由已注册
   ✅ npm run dev 能成功启动项目
   
*/
