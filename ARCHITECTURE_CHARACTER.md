# 🎮 MyCharacter 角色系统架构设计

## 📊 一、数据结构设计

### 1.1 Character State（角色状态 - Reactive）

```typescript
// 核心数据模型
interface CharacterState {
  // 成长系统
  level: number                    // 当前等级 (1-10+)
  exp: number                      // 当前经验值 (0 - expRequired)
  expRequired: number              // 升级所需经验值 (随等级递增：需要在计算函数中)
  
  // 情绪系统
  mood: 'happy' | 'tired' | 'stressed' | 'idle'  // 四种基础情绪
  
  // 成就追踪
  totalTasksCompleted: number      // 累计完成任务数
  totalWorkedHours: number         // 累计工作时长
  lastLevelUpTime: Date | null     // 最后升级时间（用于显示升级提示）
  
  // UI 反馈
  showLevelUpAnimation: boolean    // 是否显示升级动画
}

// 支撑数据（非响应式，或在 computed 中计算）
const CHARACTER_CONFIG = {
  baseExpRequired: 100,            // 1级升2级需要100经验
  expGrowthRate: 1.2,              // 每级所需经验增长率
  maxLevel: 10,                    // 当前最高等级
}
```

### 1.2 Props（父组件传入）

```typescript
interface MyCharacterProps {
  // 状态数据
  level?: number                   // 默认1
  exp?: number                     // 默认0
  mood?: 'happy' | 'tired' | 'stressed' | 'idle'  // 默认'idle'
  
  // 展示尺寸（继承现有逻辑）
  size?: number                    // 默认120px
  
  // 是否显示详细信息
  showStats?: boolean              // 默认true - 显示等级+经验条
  showBubble?: boolean             // 默认false - 台词
  bubbleText?: string              // 气泡文字
  
  // 交互开关
  interactive?: boolean            // 默认false - 能否点击
}
```

---

## 🎨 二、可视化设计（Template 结构）

### 2.1 整体分层架构

```
<div class="character-container">
  ┌─────────────────────────────────┐
  │   第3层：台词气泡（可选）        │ showBubble
  │   ┌─────────────────────────┐   │
  │   │   经验升级提示（可选）   │   │ showLevelUpAnimation
  │   └─────────────────────────┘   │
  │   ┌─────────────────────────┐   │
  │   │    主角色/头像           │   │ <-- 大头像区域
  │   │ (SVG 绘制 or emoji)      │   │
  │   └─────────────────────────┘   │
  │   ┌─────────────────────────┐   │
  │   │  等级徽章  │ 经验进度条   │   │ showStats（下方条带）
  │   └─────────────────────────┘   │
  └─────────────────────────────────┘
```

### 2.2 Template 分区规划

**区域1：头像区（中心）**
- 继承现有的 `.character-body` SVG
- 添加 `:class` 动态类绑定情绪+等级
- 添加 `@click` 交互响应

**区域2：等级徽章（左下/右下 浮点）**
```
UI示例:
  LV. 5
  ⭐⭐⭐⭐⭐ (星星视觉强化)
```
- 数字显示 + 星星装饰
- 颜色随等级变化（1-3级蓝，4-6级紫，7-10级金）

**区域3：经验条（底部条带）**
```
UI示例:
  [████████░░░░░░░░] 75/100 exp
  颜色配合当前心情
```
- 包含进度数值文本
- 背景色随mood变化

**区域4：升级提示（中心浮出）**
```
UI示例:
  ✨ LEVEL UP ✨
  5 → 6
  (动画：缩放+旋转+淡出)
```

---

## 🔄 三、响应式逻辑设计

### 3.1 Computed 属性

```typescript
// 计算升级所需经验
const nextExpRequired = computed(() => {
  const base = CHARACTER_CONFIG.baseExpRequired
  const rate = CHARACTER_CONFIG.expGrowthRate
  return Math.round(base * Math.pow(rate, props.level - 1))
})

// 经验进度百分比 (0-100)
const expProgress = computed(() => {
  return Math.round((props.exp / nextExpRequired.value) * 100)
})

// 等级对应的颜色主题
const levelColor = computed(() => {
  if (props.level <= 3) return 'level-junior'    // 蓝色
  if (props.level <= 6) return 'level-middle'     // 紫色
  return 'level-senior'                           // 金色
})

// 情绪对应的颜色
const moodColor = computed(() => {
  const moodMap = {
    'happy': '--color-success',
    'tired': '--color-warning',
    'stressed': '--color-error',
    'idle': '--color-text-muted'
  }
  return moodMap[props.mood]
})

// 是否即将升级（经验 > 90%）
const isNearLevelUp = computed(() => expProgress.value >= 90)
```

### 3.2 Watch 监听

```typescript
// 当经验达到上限时触发升级
watch(
  () => props.exp,
  (newExp) => {
    if (newExp >= nextExpRequired.value) {
      // 发送升级事件到父组件
      emit('level-up', { 
        newLevel: props.level + 1,
        bonusExp: newExp - nextExpRequired.value 
      })
      // 显示升级动画（2秒后隐藏）
      showLevelUpAnimation.value = true
      setTimeout(() => {
        showLevelUpAnimation.value = false
      }, 2000)
    }
  }
)

// 当心情改变时的视觉反馈
watch(
  () => props.mood,
  (newMood) => {
    // 可在这里触发额外动画
    triggerMoodChangeAnimation(newMood)
  }
)
```

---

## 🎬 四、动画效果设计

### 4.1 CSS 动画清单

| 动画名称 | 触发条件 | 效果 | 时长 |
|---------|--------|------|------|
| `level-up-pop` | 升级时 | 中心弹出 + 缩放 + 旋转 | 2s |
| `exp-fill` | 经验增加 | 进度条填充 | 0.6s |
| `mood-fade` | 心情切换 | 淡入淡出 + 微动 | 0.3s |
| `pulse` | 即将升级 | 脉冲发光 | 1s 循环 |
| `head-tilt` | 点击响应 | 头部摇晃 | 0.4s |
| `exp-bounce` | 获得经验 | 经验条反弹 | 0.3s |

### 4.2 过渡策略

- 情绪变化 → Transition 组件包裹
- 升级动画 → 独立浮层 + z-index
- 经验条更新 → CSS transition（平滑过渡）

---

## 📡 五、事件与父组件通信

### 5.1 Emit 事件

```typescript
// 向父组件（Dashboard）发送的事件
emit('level-up', { newLevel, bonusExp })     // 升级时
emit('character-clicked', { level, mood })   // 点击角色
emit('mood-changed', { oldMood, newMood })   // 心情改变
```

### 5.2 父组件用法示例

```vue
<MyCharacter 
  :level="character.level"
  :exp="character.exp"
  :mood="character.mood"
  :size="120"
  :show-stats="true"
  :interactive="true"
  @level-up="handleLevelUp"
  @character-clicked="handleCharacterClick"
/>

<script setup>
const handleLevelUp = ({ newLevel, bonusExp }) => {
  // 更新全局状态
  character.level = newLevel
  character.exp = bonusExp
  // 触发庆祝动画
  showCelebration()
}
</script>
```

---

## 🔌 六、后续扩展点

### 6.1 与任务系统集成

```typescript
// MyCharacter 接收的数据来源
{
  taskProgressToday: 3/5,       // 今日完成进度
  workedMinutes: 180,            // 今天工作分钟数
  
  // 自动计算增加的 exp
  dailyExp = calculateExp({
    taskBonus: completedTasks * 10,
    timeBonus: workedMinutes / 60 * 5,
    moodMultiplier: moodMap[currentMood]
  })
}
```

### 6.2 装扮系统（未来）

```typescript
// 预留位置：角色装饰物（帽子、衣服、饰品）
interface CharacterAppearance {
  skinTone: string              // 肤色
  outfit: string                // 服装ID
  accessories: string[]         // 饰品列表
  background: string            // 背景主题
}
```

### 6.3 等级奖励系统

```typescript
// 每5级里程碑
const MILESTONE_REWARDS = {
  5: { icon: '🎨', reward: '解锁背景皮肤' },
  10: { icon: '👑', reward: '升级为高级研究员' },
  15: { icon: '🎭', reward: '解锁特殊表情' },
}
```

---

## 🏗️ 七、组件内部状态管理

### 7.1 Reactive 局部状态

```typescript
// 仅在组件内使用的响应式数据
const state = reactive({
  showLevelUpAnimation: false,
  isHovered: false,             // hover 状态
  lastClickTime: 0,             // 防止过快点击
  animationQueue: [],           // 待执行动画队列
})
```

### 7.2 函数库

```typescript
// 工具函数 (纯函数)
function calculateExpForTasks(count) { /* ... */ }
function calculateExpForTime(minutes) { /* ... */ }
function getLevelColor(level) { /* ... */ }
function getMoodEmoji(mood) { /* ... */ }

// 行为函数
function handleCharacterClick() { /* ... */ }
function triggerClickAnimation() { /* ... */ }
```

---

## 📐 八、样式层次结构

```css
/* 1. 容器基础 */
.character-container { /* 布局、尺寸 */ }

/* 2. 分层样式 */
.character-avatar { /* 头像层 */ }
.character-stats { /* 统计信息层 */ }
  .level-badge { /* 等级徽章 */ }
  .exp-bar { /* 经验条 */ }
.character-animation { /* 动画层 */ }
  .level-up-popup { /* 升级通知 */ }

/* 3. 状态样式 */
.character-container.mood-happy { /* 高兴时 */ }
.character-container.mood-tired { /* 疲劳时 */ }
.character-container.level-senior { /* 高等级时 */ }
.character-container.is-near-levelup { /* 即将升级时 */ }

/* 4. 交互样式 */
.character-avatar:hover { /* 悬停效果 */ }
.character-avatar.active { /* 激活效果 */ }
```

---

## ✅ 九、实现清单（逐步）

- [ ] Step 1: 核心 State + Props 定义
- [ ] Step 2: Template 基础布局（3个区域）
- [ ] Step 3: Computed 属性实现
- [ ] Step 4: 样式 + 颜色系统
- [ ] Step 5: 升级动画实现
- [ ] Step 6: 点击交互 + 事件发送
- [ ] Step 7: 与 Dashboard 整合测试
- [ ] Step 8: 装扮/奖励扩展

---

## 🎯 关键设计原则

1. **单一职责** → MyCharacter 只负责展示 + 状态反馈，数据逻辑在父组件
2. **可组合性** → Props 灵活，支持不同大小/详略度的展示
3. **可扩展性** → 预留装扮、奖励、排行榜等扩展点
4. **性能考虑** → 使用 computed 缓存计算，避免频繁 DOM 更新
5. **用户体验** → 微动画反馈每个状态变化，但不过度动画化
