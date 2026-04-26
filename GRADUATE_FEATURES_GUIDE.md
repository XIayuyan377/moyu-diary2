# 研究生专属功能模块 - 集成指南

欢迎使用研究生日记的完整功能扩展！本指南将帮助你快速集成所有新增功能到主应用。

---

## 📦 新增文件列表

### 组件文件
- ✅ `src/renderer/components/AdvisorRadar.vue` - 导师雷达系统
- ✅ `src/renderer/components/PaperProgress.vue` - 论文进度可视化
- ✅ `src/renderer/components/MeditationMonitor.vue` - 学术冥想监测

### 数据&配置文件
- ✅ `src/renderer/data/achievements.config.ts` - 研究生成就体系
- ✅ `src/renderer/data/meditationStats.ts` - 学术冥想数据管理
- ✅ `src/main/lateNightGuard.ts` - 熬夜守护系统

---

## 🚀 快速集成步骤

### 第一步：在 `Home.vue` 中导入新组件

在 `src/renderer/views/Home.vue` 顶部的脚本部分添加导入：

```javascript
<script setup>
import Home from './renderer/views/Home.vue'
import AdvisorRadar from './renderer/components/AdvisorRadar.vue'
import PaperProgress from './renderer/components/PaperProgress.vue'
import MeditationMonitor from './renderer/components/MeditationMonitor.vue'
</script>
```

### 第二步：在主布局中添加新组件

在 `Home.vue` 的右侧栏（或适当位置）添加这些组件：

```vue
<template>
  <div class="home-container">
    <!-- 现有内容... -->

    <!-- 新增：右侧专属功能栏 -->
    <aside class="home-column column-features">
      <!-- 导师雷达系统 -->
      <AdvisorRadar />

      <!-- 论文进度可视化 -->
      <PaperProgress />

      <!-- 学术冥想监测 -->
      <MeditationMonitor />
    </aside>
  </div>
</template>
```

### 第三步：在主进程中初始化熬夜守护系统

编辑 `src/electron.js`，在创建窗口后添加：

```javascript
import { initLateNightGuard, destroyLateNightGuard } from './main/lateNightGuard.ts'

function createWindow() {
  // ... 现有代码 ...

  // 在创建窗口后调用
  initLateNightGuard(mainWindow)

  mainWindow.on('closed', () => {
    destroyLateNightGuard()
    mainWindow = null
  })
}
```

### 第四步：设置主进程通信

在渲染进程中监听熬夜提醒事件，编辑 `src/main.js`：

```javascript
// 监听主进程的提醒事件
window.electron?.onLateNightReminder?.((data) => {
  console.log('熬夜提醒:', data)
  // 可在此显示通知或弹窗
})

window.electron?.onAchievementUnlocked?.((data) => {
  console.log('成就解锁:', data)
  // 可在此显示成就视觉效果
})
```

---

## 📖 功能详解

### 1️⃣ 导师雷达系统（AdvisorRadar.vue）

**功能特性：**
- 自定义导师昵称（默认"老板"）
- 记录导师最后联系时间
- 实时显示导师"消失天数"
- 收到导师消息时触发吓一跳动画

**使用示例：**
```vue
<AdvisorRadar />
```

**数据存储：**
- `advisorName` - 导师昵称（localStorage）
- `lastAdvisorContact` - 最后联系时间（localStorage）

**关键事件：**
- `recordContact()` - 记录主动联系导师
- `recordMessage()` - 记录收到导师消息（触发动画）
- `triggerScareAnimation()` - 吓一跳动画

---

### 2️⃣ 论文进度可视化（PaperProgress.vue）

**功能特性：**
- 设置论文目标字数（默认3万字）
- 每日记录写作字数
- 显示进度条和剩余字数
- 预测完成日期
- 停滞3天自动警告

**使用示例：**
```vue
<PaperProgress />
```

**数据结构：**
```javascript
{
  targetWords: 30000,      // 目标字数
  currentWords: 15000,     // 当前字数
  dailyRecords: {          // 每日记录
    '2024-01-01': 500,
    '2024-01-02': 750,
  }
}
```

**关键方法：**
- `recordTodayProgress()` - 记录今日进度
- `checkStagnationWarning()` - 检查是否停滞
- `exportReport()` - 导出进度报告

---

### 3️⃣ 学术冥想统计（MeditationMonitor.vue + meditationStats.ts）

**功能特性：**
- 支持4个冥想等级：青铜/白银/黄金/钻石
- 生成个性化冥想评语
- 周报和月报统计
- 快捷按钮记录常见时长

**使用示例：**
```vue
<MeditationMonitor />
```

**等级划分：**
- 🥉 青铜冥想家：0-1小时
- 🥈 白银冥想家：1-3小时
- 🥇 黄金冥想家：3-6小时
- 💎 钻石冥想家：6小时以上

**API 方法：**
```javascript
import { MeditationTracker } from './data/meditationStats.ts'

const tracker = new MeditationTracker()

// 记录冥想
tracker.recordMeditation('2024-01-01', 120) // 120分钟

// 获取统计
const weekly = tracker.getWeeklyStats()
const monthly = tracker.getMonthlyStats()

// 生成报告
const summary = tracker.generateWeeklySummary()
```

---

### 4️⃣ 熬夜守护系统（lateNightGuard.ts）

**功能特性：**
- 22:00 - 担忧表情提醒
- 23:00 - 换睡衣装扮
- 00:00 - 全屏提醒卡片
- 凌晨2:00+ - 解锁"不眠学者"成就

**主进程事件：**
```javascript
// 监听熬夜提醒
ipcMain.handle('set-work-start-time', (event, time) => {
  // 设置工作开始时间
})

ipcMain.handle('get-current-overtime', () => {
  // 获取当前加班时间
})

ipcMain.handle('reset-daily-reminders', () => {
  // 重置每日提醒（午夜0点）
})
```

**渲染进程通信：**
```javascript
// 发送事件到主进程
window.ipcRenderer.invoke('set-work-start-time', new Date().toISOString())

// 监听来自主进程的提醒
window.ipcRenderer.on('late-night-reminder', (event, data) => {
  console.log(data.message) // "今天能按时走吗？" 等
})

window.ipcRenderer.on('achievement-unlocked', (event, data) => {
  console.log(data.id) // 成就ID
})
```

---

### 5️⃣ 成就体系（achievements.config.ts）

**包含的成就（15+）：**

| ID | 名称 | 条件 |
|----|------|------|
| `first_clock` | 入学报到 | 完成第一次打卡 |
| `early_bird` | 早八战士 | 8点前打卡 |
| `midnight_scholar` | 不眠学者 | 凌晨2点后工作 |
| `streak_7` | 7天不摆烂 | 连续打卡7天 |
| `streak_30` | 月度卷王 | 连续打卡30天 |
| `fish_master` | 冥想大师 | 单日冥想超3小时 |
| `overtime_30` | 秃头预备役 | 累计加班30小时 |
| `paper_1000` | 千字达人 | 单日论文推进超1000字 |
| `advisor_survive` | 导师克星 | 连续30天未被导师催 |
| `panda_chat_50` | 滚滚铁粉 | 对话超50次 |
| `mood_week` | 情绪稳定人 | 连续7天记录心情 |
| `all_task_done` | 今日无愧 | 完成当天所有课题 |

**使用成就系统：**
```javascript
import { ACHIEVEMENTS, getAchievementById } from './achievements.config.ts'

// 获取特定成就
const achievement = getAchievementById('midnight_scholar')

// 获取所有成就
ACHIEVEMENTS.forEach(ach => {
  console.log(`${ach.emoji} ${ach.title} - ${ach.desc}`)
})
```

---

## 🎨 样式指南

所有新组件都采用一致的设计语言：

- **主色调**：自然绿色（`#81c784`）
- **背景**：温暖米黄色（`#f5f1e8`）
- **卡片样式**：圆角+阴影+渐变背景
- **交互**：hover 时浮起 + 颜色加深

---

## 💾 数据存储方案

所有数据均存储在浏览器 localStorage：

```javascript
// 导师雷达
localStorage.getItem('advisorName')              // 导师昵称
localStorage.getItem('lastAdvisorContact')       // 最后联系时间

// 论文进度
localStorage.getItem('paperProgress')            // 论文统计JSON

// 学术冥想
localStorage.getItem('meditationStats')          // 冥想记录JSON

// 成就解锁
localStorage.getItem('unlockedAchievements')     // 解锁成就数组
```

---

## 🔌 与现有功能的集成

### 结合"日报"功能
在生成日报时，可以调用：
```javascript
import { MeditationTracker } from './data/meditationStats.ts'

const tracker = new MeditationTracker()
const summary = tracker.generateWeeklySummary()
// 在日报中显示：summary.content
```

### 结合"成就系统"
在各功能触发时，检查成就条件：
```javascript
import { ACHIEVEMENTS } from './achievements.config.ts'

// 检查"论文大师"成就（5万字）
if (currentWords >= 50000) {
  unlockAchievement('thesis_master')
}
```

### 集成到"心情记录"
在心情记录中也显示当日的学术冥想时长：
```javascript
const meditation = tracker.getDailyMeditation()
console.log(`今天冥想了${meditation.hours}小时`)
```

---

## 🐞 故障排除

### 问题：导师雷达组件没有显示
**解决**：确保导入路径正确，检查 localStorage 是否被禁用

### 问题：论文进度计算不准确
**解决**：检查 `targetWords` 和 `currentWords` 是否正确初始化

### 问题：熬夜提醒没有出现
**解决**：
1. 确保在 `electron.js` 中调用了 `initLateNightGuard()`
2. 检查 IPC 通信是否正确设置
3. 查看控制台错误信息

### 问题：成就不能解锁
**解决**：确保在相应位置调用了成就解锁逻辑，检查 localStorage

---

## 🌟 高级定制

### 自定义冥想评语
编辑 `meditationStats.ts` 中的 `MEDITATION_COMMENTS` 对象：

```javascript
export const MEDITATION_COMMENTS = {
  BRONZE: [
    '你的自定义评语1',
    '你的自定义评语2',
    // ...
  ],
  // ...
}
```

### 自定义成就
在 `achievements.config.ts` 中添加新成就：

```javascript
{
  id: 'custom_achievement',
  title: '我的成就',
  desc: '完成某个条件',
  emoji: '🎯',
  exp: 100,
  rarity: 'rare',
  category: 'custom',
}
```

### 自定义熬夜提醒时间
编辑 `lateNightGuard.ts` 中的 `LATE_NIGHT_REMINDERS`：

```javascript
const LATE_NIGHT_REMINDERS = {
  22: { /* 22:00 的提醒 */ },
  23: { /* 23:00 的提醒 */ },
  0: { /* 00:00 的提醒 */ },
  // 添加更多时间点...
}
```

---

## 📱 响应式布局建议

建议的布局结构：

```vue
<div class="home-container">
  <!-- 左侧：滚滚状态和信息（28%） -->
  <aside class="column-left">
    <!-- 现有的滚滚卡片 -->
  </aside>

  <!-- 中间：主要功能（44%） -->
  <main class="column-center">
    <!-- 现有的主体内容 -->
  </main>

  <!-- 右侧：新增功能（28%） -->
  <aside class="column-right">
    <AdvisorRadar />
    <PaperProgress />
    <MeditationMonitor />
  </aside>
</div>
```

---

## 🚦 下一步建议

1. **集成通知系统**：为熬夜提醒和成就解锁添加系统通知
2. **数据备份**：添加 JSON 导出功能，允许用户导出所有数据
3. **统计仪表盘**：创建综合数据展示页面
4. **导出报告**：生成漂亮的周报/月报 PDF
5. **移动适配**：优化小屏幕显示

---

## 📞 反馈与改进

如果遇到任何问题或有改进建议，欢迎提交反馈！

**祝你使用愉快！🎉**
