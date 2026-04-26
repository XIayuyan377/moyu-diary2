/**
 * 研究生功能集成示例
 * 这个文件展示了如何在现有项目中集成全部新功能
 * 使用说明：参照 GRADUATE_FEATURES_GUIDE.md
 */

// ═══════════════════════════════════════════════════════════
// 例子1：在 Home.vue 中集成所有组件
// ═══════════════════════════════════════════════════════════

/*
<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="home-header">
      <!-- 现有代码... -->
    </header>

    <!-- 主体三列布局 -->
    <main class="home-main">
      <!-- 【左列 28%】- 滚滚状态栏 -->
      <aside class="home-column column-left">
        <!-- 现有的滚滚卡片... -->
      </aside>

      <!-- 【中间列 44%】- 主要内容 -->
      <div class="home-column column-center">
        <!-- 现有的主要内容... -->
      </div>

      <!-- 【右列 28%】- 新增研究生功能 -->
      <aside class="home-column column-features">
        <!-- 导师雷达系统 -->
        <AdvisorRadar />

        <!-- 论文进度可视化 -->
        <PaperProgress />

        <!-- 学术冥想监测 -->
        <MeditationMonitor />
      </aside>
    </main>
  </div>
</template>

<script setup>
import Home from './views/Home.vue'
import AdvisorRadar from './components/AdvisorRadar.vue'
import PaperProgress from './components/PaperProgress.vue'
import MeditationMonitor from './components/MeditationMonitor.vue'
</script>
*/

// ═══════════════════════════════════════════════════════════
// 例子2：在 electron.js 中初始化熬夜守护系统
// ═══════════════════════════════════════════════════════════

/*
import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initLateNightGuard, destroyLateNightGuard } from './main/lateNightGuard.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, 'preload.js')
    }
  })

  // 开发环境
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // 【新增】初始化熬夜守护系统
  initLateNightGuard(mainWindow)

  mainWindow.on('closed', () => {
    // 【新增】清理熬夜守护系统
    destroyLateNightGuard()
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
*/

// ═══════════════════════════════════════════════════════════
// 例子3：在 preload.js 中暴露 IPC 方法
// ═══════════════════════════════════════════════════════════

/*
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  // IPC 调用方法
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),

  // 【新增】IPC 监听方法
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  },

  // 【新增】移除监听
  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func)
  },
})
*/

// ═══════════════════════════════════════════════════════════
// 例子4：简单的 Vue 组件中同时使用多个新功能
// ═══════════════════════════════════════════════════════════

/*
<template>
  <div class="dashboard">
    <h1>研究生日记仪表板</h1>

    <!-- 显示导师状态 -->
    <div class="advisor-status">
      <p v-if="advisorDaysAgo <= 7" class="warning">
        ⚠️ 导师已消失 {{ advisorDaysAgo }} 天
      </p>
      <p v-else class="safe">
        ✨ 最近与导师保持沟通
      </p>
    </div>

    <!-- 显示论文进度 -->
    <div class="paper-status">
      <h3>论文进度</h3>
      <div class="progress-bar">
        <div class="progress" :style="{ width: paperPercentage + '%' }"></div>
      </div>
      <p>{{ paperCurrent }} / {{ paperTarget }} 字</p>
    </div>

    <!-- 显示本周冥想 -->
    <div class="meditation-status">
      <h3>本周冥想</h3>
      <p>{{ weeklyMeditationHours }} 小时 - {{ meditationTier }}</p>
    </div>

    <!-- 今日加班时长 -->
    <div class="overtime-status">
      <p>今日已工作：{{ todayOvertime }} 小时</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MeditationTracker } from './data/meditationStats.ts'

// 导师信息
const advisorDaysAgo = ref(0)

// 论文信息
const paperCurrent = ref(0)
const paperTarget = ref(30000)
const paperPercentage = computed(() => (paperCurrent.value / paperTarget.value) * 100)

// 冥想信息
const tracker = ref(new MeditationTracker())
const weeklyMeditationHours = computed(() => 
  tracker.value.getWeeklyStats().totalHours
)
const meditationTier = computed(() => 
  tracker.value.calculateTier(weeklyMeditationHours.value).name
)

// 加班时长
const todayOvertime = ref(0)

onMounted(() => {
  // 加载导师信息
  const lastContact = localStorage.getItem('lastAdvisorContact')
  if (lastContact) {
    const days = Math.floor(
      (new Date() - new Date(lastContact)) / (1000 * 60 * 60 * 24)
    )
    advisorDaysAgo.value = days
  }

  // 加载论文进度
  const paperData = JSON.parse(localStorage.getItem('paperProgress') || '{}')
  paperCurrent.value = paperData.currentWords || 0
  paperTarget.value = paperData.targetWords || 30000

  // 加载冥想数据
  tracker.value.loadFromStorage()

  // 获取加班时长
  window.ipcRenderer?.invoke('get-current-overtime').then(data => {
    todayOvertime.value = data.hours
  })
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.dashboard h1 {
  grid-column: 1 / -1;
}

.advisor-status,
.paper-status,
.meditation-status,
.overtime-status {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #66bb6a, #43a047);
  transition: width 0.5s ease;
}

.warning {
  color: #d32f2f;
  font-weight: bold;
}

.safe {
  color: #388e3c;
  font-weight: bold;
}
</style>
*/

// ═══════════════════════════════════════════════════════════
// 例子5：获取所有功能的状态快照
// ═══════════════════════════════════════════════════════════

export function getFullStatusSnapshot() {
  return {
    // 导师信息
    advisor: {
      name: localStorage.getItem('advisorName') || '老板',
      lastContact: localStorage.getItem('lastAdvisorContact'),
      daysSince: calculateDaysSinceContact(),
    },

    // 论文进度
    paper: JSON.parse(localStorage.getItem('paperProgress') || '{}'),

    // 冥想统计
    meditation: JSON.parse(localStorage.getItem('meditationStats') || '{}'),

    // 时间戳
    timestamp: new Date().toISOString(),
  }
}

function calculateDaysSinceContact() {
  const lastContact = localStorage.getItem('lastAdvisorContact')
  if (!lastContact) return null

  const days = Math.floor(
    (new Date() - new Date(lastContact)) / (1000 * 60 * 60 * 24)
  )
  return days
}

// ═══════════════════════════════════════════════════════════
// 例子6：生成完整的周报
// ═══════════════════════════════════════════════════════════

export function generateGraduateWeeklyReport() {
  const snapshot = getFullStatusSnapshot()
  const tracker = new (require('./data/meditationStats.ts').MeditationTracker)()

  const meditation = tracker.generateWeeklySummary()
  const paper = snapshot.paper

  const report = `
╔════════════════════════════════════════════════════════════╗
║           📚 研究生周综合报告                              ║
╚════════════════════════════════════════════════════════════╝

📅 报告时间：${new Date().toLocaleDateString('zh-CN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 导师沟通
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

导师：${snapshot.advisor.name}
上次联系：${snapshot.advisor.lastContact || '未记录'}
已失踪：${snapshot.advisor.daysSince || '?'} 天

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 论文进度
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

目标：${paper.targetWords?.toLocaleString() || '未设置'} 字
完成：${paper.currentWords?.toLocaleString() || '0'} 字
剩余：${(paper.targetWords - paper.currentWords)?.toLocaleString() || '？'} 字
进度：${paper.targetWords ? Math.round((paper.currentWords / paper.targetWords) * 100) : 0}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧘 学术冥想
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${meditation.content}

╚════════════════════════════════════════════════════════════╝
  `.trim()

  return report
}

// ═══════════════════════════════════════════════════════════
// 例子7：初始化成就系统
// ═══════════════════════════════════════════════════════════

export class AchievementManager {
  constructor() {
    this.loadUnlockedAchievements()
  }

  loadUnlockedAchievements() {
    const data = localStorage.getItem('unlockedAchievements')
    this.unlockedIds = data ? JSON.parse(data) : []
  }

  unlockAchievement(achievementId) {
    if (!this.unlockedIds.includes(achievementId)) {
      this.unlockedIds.push(achievementId)
      this.save()
      return true
    }
    return false
  }

  save() {
    localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedIds))
  }

  getProgress() {
    const { ACHIEVEMENTS } = require('./data/achievements.config.ts')
    return {
      unlocked: this.unlockedIds.length,
      total: ACHIEVEMENTS.length,
      percentage: Math.round((this.unlockedIds.length / ACHIEVEMENTS.length) * 100),
    }
  }
}
