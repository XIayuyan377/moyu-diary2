# ClockIn 组件集成指南

## 概述
`ClockIn.vue` 是一个完整的打卡界面组件，支持上班打卡和下班打卡两种模式。

## 文件位置
- **组件**: `src/renderer/views/ClockIn.vue`
- **文案管理**: `src/utils/copywriting.ts`

## 功能特性

### 上班打卡页面
- ✨ 顶部滚滚形象（size=130，mood='normal'着陆动画）
- 💬 随机迎接语气泡
- 📅 今日日期显示（大字：2026年X月X日）
- 📆 星期和周末倒计时
- 💡 随机励志文案
- 🎬 打卡按钮（"开始今天的表演 🎬"）
- 🔄 点击后动画序列：
  - 按钮弹性缩放（spring效果，200ms）
  - 滚滚切换为happy状态
  - 全屏彩色纸屑（绿色+橙色+白色）
  - 成功卡片从底部弹入
  - 显示随机毒鸡汤和EXP奖励
  - 2.5秒后回退

### 下班打卡页面
- 🎨 温暖渐变背景（#FAF7F2→#FFF0E6）
- 🐼 滚滚从底部弹跳进入（celebrating状态）
- 📝 大字"今天辛苦了"从上方掉落
- ⌨️ 打字机效果副标题
- 📊 今日数据卡片展示（五张卡片）：
  - 今日在岗时长
  - 完成课题数
  - 最宠软件
  - 学术冥想时长
  - 今日EXP
- 🚪 底部按钮关闭界面

## 使用方法

### 1. 基础使用 - 显示上班打卡页面
```vue
<template>
  <ClockIn ref="clockInRef" />
</template>

<script setup>
import { ref } from 'vue'
import ClockIn from './renderer/views/ClockIn.vue'

const clockInRef = ref(null)
</script>
```

### 2. 切换到下班打卡
```javascript
// 在某个事件（如点击"今天搞完啦"按钮）中调用
clockInRef.value?.switchToClockOut()
```

### 3. 在 App.vue 中集成
```vue
<template>
  <div class="app-container">
    <!-- 选择显示 Home 或 ClockIn 组件 -->
    <Home v-if="!showClockIn" />
    <ClockIn ref="clockInRef" v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Home from './renderer/views/Home.vue'
import ClockIn from './renderer/views/ClockIn.vue'

const showClockIn = ref(false)
const clockInRef = ref(null)

// 切换到打卡界面
const goToClockIn = () => {
  showClockIn.value = true
}

// 从打卡界面返回
const returnFromClockIn = () => {
  showClockIn.value = false
}
</script>
```

## 文案管理

所有文案存储在 `src/utils/copywriting.ts` 中，包括：

### 上班打卡文案
- `copywriting.greetings` - 迎接语数组
- `copywriting.motivations` - 励志文案数组
- `copywriting.successToxic` - 成功时的毒鸡汤数组
- `copywriting.weekdayTips` - 星期提示语
- `copywriting.clockInButton` - 打卡按钮文本
- `copywriting.clockInSubtitle` - 按钮下方小字

### 下班打卡文案
- `copywriting.clockOutGreeting` - 下班问候语
- `copywriting.clockOutTexts` - 下班副标题文案数组
- `copywriting.clockOutButton` - 下班按钮文本
- `copywriting.dataLabels` - 数据卡片标签

### 便利函数
```javascript
// 获取随机文案
getRandomCopywriting(array)

// 获取星期提示
getWeekdayTip(dayOfWeek) // dayOfWeek: 0-6 (0=周日)

// 计算距离周末天数
getDaysToWeekend(dayOfWeek)
```

## 组件属性和方法

### 暴露的方法 (via defineExpose)
```javascript
// 切换到下班打卡模式
switchToClockOut: async () => void
```

### 内部状态管理
- `isClockOutMode` - 当前模式（true=下班，false=上班）
- `pandaMood` - 滚滚心情（'normal' | 'happy' | 'celebrating'）
- `showResultCard` - 结果卡片可见性
- `showConfetti` - 纸屑动画可见性
- `showDataCard` - 数据卡片可见性
- `dailyData` - 每日数据对象

## 样式定制

所有颜色使用 CSS 变量（来自 `theme.css`）：
- `--color-bg` - 背景米白色
- `--color-main` - 竹叶绿主色
- `--color-success` - 成功绿
- `--color-text` - 文字色
- `--color-text-secondary` - 次要文字色
- `--color-text-muted` - 哑光文字色

## 动画和过渡

组件使用 CSS 关键帧和 Vue Transitions 实现：
- `breathe` - 呼吸感动画（背景）
- `bubble-enter` - 气泡弹入
- `btn-bounce` - 按钮弹性缩放
- `fall` - 纸屑下落
- `card-spring-in` - 卡片弹入
- `panda-bounce-in` - 滚滚弹跳进入
- `title-drop-in` - 标题掉落
- `data-card-appear` - 数据卡片依序出现

## 日期和时间处理

组件自动获取当前日期：
```javascript
const currentDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})
```

## 数据模型

### dailyData 结构
```typescript
{
  duration: string          // 在岗时长，如 "8h 32min"
  tasksCompleted: number    // 完成任务数
  tasksRemaining: number    // 未完成任务数
  favoriteApp: string       // 最常用应用
  appDuration: string       // 应用使用时长
  meditation: string        // 冥想/摸鱼时长
  meditationStatus: string  // 状态：'healthy'|'needReview'|'excessive'
  totalExp: number          // 本日获得的EXP值
}
```

## 集成建议

1. **路由集成**: 如果使用 Vue Router，可以为 ClockIn 创建一个独立的路由
2. **状态管理**: 使用 Pinia 或 Vuex 管理全局的打卡状态
3. **数据获取**: 从服务器/数据库获取实际的 `dailyData`
4. **事件回调**: 在打卡成功时发送数据到后端
5. **权限检查**: 确保只有已登录用户才能访问

## 注意事项

- 组件使用 Vue 3 Composition API + TypeScript
- 依赖 `Panda.vue` 组件进行熊猫渲染
- 所有动画都使用 CSS，性能优良
- 支持响应式设计（移动端适配）

## 常见问题

**Q: 如何修改每日数据？**
A: 直接修改 `dailyData` ref 值或从 API 获取后更新

**Q: 如何自定义文案？**
A: 编辑 `src/utils/copywriting.ts` 中的对应字段

**Q: 动画可以关闭吗？**
A: 可以，删除对应的 CSS 动画类或将 animation 属性设置为 none

**Q: 支持深色模式吗？**
A: 当前使用固定的暖色系。可在 `theme.css` 中扩展暗色变量

