# 🎯 TaskList.vue 组件指南

## 📦 文件位置

`src/renderer/components/TaskList.vue`

---

## 🚀 快速使用

### 基础用法

```vue
<template>
  <TaskList
    @task-completed="handleTaskCompleted"
    @task-added="handleTaskAdded"
    @task-deleted="handleTaskDeleted"
  />
</template>

<script setup>
import TaskList from '@/renderer/components/TaskList.vue'

// 任务完成 → 获得 exp
const handleTaskCompleted = ({ taskId, title, expReward }) => {
  console.log(`完成 ${title}，获得 ${expReward} exp`)
  character.exp += expReward
}

const handleTaskAdded = (task) => {
  console.log('添加新任务:', task.title)
}

const handleTaskDeleted = (task) => {
  console.log('删除任务:', task.title)
}
</script>
```

---

## 📊 数据结构

### Task 对象

```typescript
interface Task {
  id: number                  // 唯一ID
  title: string               // 任务标题
  done: boolean               // 是否完成
  exp: number                 // exp奖励值
}

// 示例
{
  id: 1,
  title: '完成论文绪论',
  done: false,
  exp: 10
}
```

---

## 📡 事件列表

### @task-completed

**触发条件:** 用户勾选 checkbox，标记任务完成

**事件数据:**
```typescript
{
  taskId: number,        // 任务 ID
  title: string,         // 任务标题
  expReward: number      // exp 奖励值
}
```

**示例:**
```vue
@task-completed="({ taskId, expReward }) => {
  character.exp += expReward
}"
```

---

### @task-added

**触发条件:** 用户输入新任务并按 Enter 或点击 ➕ 按钮

**事件数据:**
```typescript
{
  id: number,
  title: string,
  done: false,
  exp: 10
}
```

---

### @task-deleted

**触发条件:** 用户点击任务右侧的 ✕ 删除按钮

**事件数据:**
```typescript
{
  id: number,
  title: string,
  done: boolean,
  exp: number
}
```

---

## 🎨 UI 特性

### 视觉设计

✅ **颜色方案**
- 背景: `#FFFFFF` + `#FFF5E6`（奶油色）
- 强调: `#5BAD7F`（竹叶绿）
- 完成态: `#9E9189`（哑灰色）

✅ **圆角&阴影**
- 卡片圆角: `12px`
- 项目圆角: `8px`
- 轻微阴影使用

✅ **动画**
- 新增任务: 从左滑入
- 删除任务: 向右滑出
- 完成动画: 透明度降低
- Hover 效果: 轻微升起

### 组件结构

```
┌─────────────────────────────┐
│  输入区 (input + 添加按钮)   │
├─────────────────────────────┤
│  空状态/任务列表            │
│  ├─ [ ] 任务1  +10exp ✕     │
│  ├─ [✓] 任务2  +15exp ✕     │
│  └─ [ ] 任务3  +20exp ✕     │
├─────────────────────────────┤
│  统计条 (完成/进度/百分比)   │
└─────────────────────────────┘
```

---

## ⌨️ 交互方式

| 交互 | 效果 |
|-----|------|
| **输入框 Enter** | 添加新任务 |
| **点击 ➕ 按钮** | 添加新任务 |
| **勾选 checkbox** | 标记完成（发送事件） |
| **点击 ✕** | 删除任务 |
| **Hover 任务** | 背景变浅、显示阴影 |
| **Hover ➕** | 按钮上升、阴影加深 |

---

## 📱 响应式设计

| 屏幕宽度 | 适配方案 |
|---------|--------|
| **> 600px** | 完整布局 |
| **< 600px** | 字体缩小，按钮调整 |

---

## 💡 与其他系统的集成

### 与 MyCharacter 联动

```vue
<template>
  <div class="main">
    <MyCharacter :exp="character.exp" :level="character.level" />
    <TaskList @task-completed="handleTaskCompleted" />
  </div>
</template>

<script setup>
const character = reactive({
  level: 1,
  exp: 0,
  mood: 'idle',
})

const handleTaskCompleted = ({ expReward }) => {
  character.exp += expReward
  
  // 检查升级
  if (character.exp >= 100) {
    character.level++
    character.exp = 0
  }
}
</script>
```

### 与 Dashboard 集成

```vue
<!-- Dashboard.vue -->
<template>
  <div class="dashboard">
    <TaskList @task-completed="onTaskCompleted" />
  </div>
</template>

<script setup>
const onTaskCompleted = (data) => {
  // 更新到 Pinia/VueX store
  // 或直接更新本地 state
  updateCharacterExp(data.expReward)
}
</script>
```

---

## 🔧 自定义选项

### 修改默认 exp

在父组件中控制：

```vue
<script setup>
// 每完成一个任务自动加 50 exp（可自定义）
const handleTaskCompleted = ({ expReward }) => {
  const customExp = expReward * 2  // 翻倍
  character.exp += customExp
}
</script>
```

### 修改任务初始数据

修改 `TaskList.vue` 中的：

```typescript
const tasks = ref([
  { id: 1, title: '你的任务', done: false, exp: 10 },
  // ...
])
```

或通过 props 传入（需修改组件）

---

## 🎯 功能清单

✅ **已实现**
- [x] 新增任务
- [x] 完成任务（checkbox）
- [x] 删除任务
- [x] 进度统计（完成数/总数）
- [x] 进度条显示
- [x] 空状态提示
- [x] 事件 emit
- [x] Transition 动画
- [x] 响应式设计
- [x] 可爱风格 UI

🚀 **未来可扩展**
- [ ] 任务分类过滤
- [ ] 任务排序
- [ ] 搜索功能
- [ ] 优先级标记
- [ ] 任务详情编辑
- [ ] 重复任务
- [ ] 本地存储

---

## 🐛 常见问题

**Q: 为什么完成任务后没有看到升级？**  
A: 需要在父组件处理 `@task-completed` 事件，手动累积 exp 并检查升级条件

**Q: 能否修改每个任务的 exp？**  
A: 需要为 TaskList 添加 prop，或在子组件中修改任务数据结构

**Q: 任务数据如何持久化？**  
A: 需要在父组件的 watch 中调用 localStorage 或 electron-store 保存

**Q: 能否排序/过滤任务？**  
A: 当前版本未实现，可在父组件中对事件数据进行处理

---

## 📸 演示页面

查看完整演示：[TaskList.demo.vue](TaskList.demo.vue)

包含：
- TaskList 使用示例
- MyCharacter 集成示例
- 实时事件日志
- 角色状态面板

---

## 🎨 样式变量

如需调整主题色，修改以下变量：

```css
/* 主色 */
--color-main: #5BAD7F;           /* 竹叶绿 */

/* 背景 */
--color-bg: #FFFFFF;             /* 白色 */
--color-bg-warm: #FFF5E6;         /* 暖橘色 */

/* 文字 */
--color-text: #3D3530;            /* 暖棕 */
--color-text-muted: #9E9189;      /* 哑灰 */

/* 强调 */
--color-accent: #FF8C42;          /* 暖橘 */
--color-success: #7AC77F;         /* 成功绿 */
```

---

**最后更新:** 2026-04-14  
**状态:** ✅ 可用于生产环境  
**版本:** v1.0.0
