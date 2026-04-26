# ⚡ TaskList + MyCharacter 联动 - 3步快速集成

## 📋 目录

- [1️⃣ 状态管理](#1️⃣-状态管理核心)
- [2️⃣ Props 和 Emit 连接](#2️⃣-props-和-emit-连接纽带)
- [3️⃣ 完整示例](#3️⃣-完整代码示例)
- [🧪 测试清单](#🧪-测试清单)

---

## 1️⃣ 状态管理（核心）

> 💡 **关键概念**：Dashboard 是状态中心，两个子组件通过它通信

### 在 Dashboard.vue 中添加

```typescript
<script setup>
import { reactive, computed } from 'vue'

// ⭐ 角色状态 - 在这里管理
const character = reactive({
  level: 1,
  exp: 0,
  mood: 'idle',  // idle / happy / tired / stressed
})

// 下一级所需经验
const nextExpRequired = computed(() => {
  return Math.round(100 * Math.pow(1.2, character.level - 1))
})

// 经验进度百分比
const expProgress = computed(() => {
  return Math.min(Math.round((character.exp / nextExpRequired.value) * 100), 100)
})
</script>
```

---

## 2️⃣ Props 和 Emit 连接（纽带）

### 子组件1：MyCharacter（接收 Props）

```vue
<MyCharacter
  :level="character.level"        <!-- ← 传入等级 -->
  :exp="character.exp"            <!-- ← 传入经验 -->
  :mood="character.mood"          <!-- ← 传入心情 -->
  :size="140"
  :show-stats="true"
/>
```

### 子组件2：TaskList（发送 Events）

```vue
<TaskList
  @task-completed="handleTaskCompleted"  <!-- ← 接收事件 -->
  @task-added="handleTaskAdded"
  @task-deleted="handleTaskDeleted"
/>
```

### 事件处理函数（连接逻辑）

```typescript
const handleTaskCompleted = ({ taskId, title, expReward }) => {
  // 1️⃣ exp 增加
  character.exp += expReward

  // 2️⃣ 心情改为高兴
  character.mood = 'happy'

  // 3️⃣ 检查升级
  if (character.exp >= nextExpRequired.value) {
    character.level++
    character.exp = character.exp - nextExpRequired.value
    showCelebration(`🎊 升到 LV${character.level}！`)
  }

  // 4️⃣ 2秒后恢复心情
  setTimeout(() => {
    character.mood = 'idle'
  }, 2000)
}
```

---

## 3️⃣ 完整代码示例

### Template 部分

```vue
<template>
  <div class="dashboard">
    <!-- 角色展示 -->
    <div class="character-section">
      <MyCharacter
        :level="character.level"
        :exp="character.exp"
        :mood="character.mood"
        :size="140"
        :show-stats="true"
      />
      
      <!-- 经验显示 -->
      <div class="exp-info">
        <p>LV {{ character.level }}</p>
        <p>EXP: {{ character.exp }} / {{ nextExpRequired }}</p>
        <div class="exp-bar">
          <div class="bar-fill" :style="{ width: expProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="task-section">
      <TaskList @task-completed="handleTaskCompleted" />
    </div>
  </div>
</template>
```

### Script 部分

```typescript
<script setup>
import { reactive, computed, ref } from 'vue'
import MyCharacter from '@/components/MyCharacter.vue'
import TaskList from '@/components/TaskList.vue'

// 角色状态
const character = reactive({
  level: 1,
  exp: 0,
  mood: 'idle',
})

// 下一级经验
const nextExpRequired = computed(() => {
  return Math.round(100 * Math.pow(1.2, character.level - 1))
})

// 经验进度
const expProgress = computed(() => {
  return Math.min(Math.round((character.exp / nextExpRequired.value) * 100), 100)
})

// 通知消息
const celebrationVisible = ref(false)
const celebrationText = ref('')

const showCelebration = (text) => {
  celebrationText.value = text
  celebrationVisible.value = true
  setTimeout(() => { celebrationVisible.value = false }, 2000)
}

// ⭐⭐⭐ 关键函数：任务完成处理
const handleTaskCompleted = ({ taskId, title, expReward }) => {
  console.log(`✅ 完成任务: ${title}`)

  // Step 1: exp 增加
  character.exp += expReward
  console.log(`📊 经验 +${expReward}`)

  // Step 2: 心情改为高兴
  character.mood = 'happy'
  console.log(`😊 心情: happy`)

  // Step 3: 显示消息
  showCelebration(`🎉 ${title} +${expReward} exp`)

  // Step 4: 检查升级
  if (character.exp >= nextExpRequired.value) {
    character.level++
    character.exp = 0
    console.log(`🎊 升到 LV${character.level}`)
    showCelebration(`✨ 升到 LV${character.level}！`)
  }

  // Step 5: 2秒后恢复
  setTimeout(() => {
    character.mood = 'idle'
  }, 2000)
}
</script>
```

---

## 🎯 数据流图解

```
用户界面
  ↓
[添加任务] → TaskList 组件 → 勾选完成
  ↓
emit('task-completed', {
  taskId: 1,
  title: '写论文',
  expReward: 10
})
  ↓
Dashboard 的 handleTaskCompleted() 接收
  ↓
character.exp += 10
character.mood = 'happy'
  ↓
MyCharacter 的 props 自动更新
  ↓
显示更新后的 exp 条和高兴表情
  ↓
2秒后 mood 恢复 idle
  ↓
检查 exp >= 100？
  ├─ YES: character.level++, 显示升级动画
  └─ NO: 保持当前级别
```

---

## 🧪 测试清单

### ✅ 单元测试

- [ ] **创建任务**
  ```
  在 TaskList 中输入 "完成论文"
  按 Enter
  验证: 任务出现在列表中
  ```

- [ ] **完成任务 - exp 增加**
  ```
  勾选 "完成论文" checkbox
  验证: 
    - character.exp 从 0 → 10
    - MyCharacter exp 条更新
    - 通知显示 "🎉 完成论文 +10 exp"
  ```

- [ ] **心情改变**
  ```
  完成任务后立即观察 MyCharacter
  验证:
    - 表情变笑脸 😊
    - 爱心💖跳动
    - 2秒后恢复
  ```

- [ ] **升级**
  ```
  完成 10 个任务（10 × 10 = 100 exp）
  验证:
    - character.level 从 1 → 2
    - exp 重置为 0
    - 显示升级动画 "🎊 升到 LV2"
    - MyCharacter 显示新等级
  ```

### ⚡ 集成测试

- [ ] 启动应用：`npm run dev:vite`
- [ ] 导航到 Dashboard 页面
- [ ] 执行上述所有测试
- [ ] 检查浏览器控制台无错误
- [ ] 刷新页面后状态保存（如启用持久化）

---

## 📝 常见问题解答

**Q: exp 满了不升级怎么办？**  
A: 检查 `handleTaskCompleted` 中的升级条件：
```typescript
if (character.exp >= nextExpRequired.value) {
  // 应该在这里触发
}
```

**Q: 心情不改变怎么办？**  
A: 确保 MyCharacter 组件接收了 `:mood` props
```vue
<MyCharacter :mood="character.mood" />
```

**Q: 为什么升级后 exp 变 0？**  
A: 这是设计，可改为保留剩余 exp：
```typescript
const bonus = character.exp - nextExpRequired.value
character.exp = bonus  // 而不是 0
```

**Q: 如何调整每个任务的 exp 值？**  
A: 在 TaskList 中修改任务的 `exp` 字段：
```typescript
{ id: 1, title: '写论文', exp: 20 }  // 改成 20
```

**Q: 升级所需经验太多/太少？**  
A: 修改计算公式中的参数：
```typescript
const base = 100    // 第一级需要的 exp
const rate = 1.2    // 增长率（1.2 = 20% 增长）
```

---

## 📦 文件对照表

| 文件 | 职责 | 状态 |
|------|------|------|
| **Dashboard.vue** | 管理 character 状态 | ✏️ 需要修改 |
| **MyCharacter.vue** | 接收 props 显示 | ✅ 已完成 |
| **TaskList.vue** | 发送 task-completed 事件 | ✅ 已完成 |

---

## 🚀 立即开始

### 方案A：完全替换（推荐用于新项目）
1. 用 `Dashboard.NEW.vue` 的代码替换现有 Dashboard.vue
2. 调整样式和其他卡片内容
3. 运行测试

### 方案B：增量修改（推荐用于现有项目）
1. 在现有 Dashboard.vue 顶部添加 character 状态
2. 在 template 中添加 MyCharacter 和 TaskList
3. 添加 handleTaskCompleted 函数
4. 调整样式

### 现在选择：

**A. 完整替换** → 拷贝 Dashboard.NEW.vue 的全部代码  
**B. 增量添加** → 参考上面的代码片段逐个添加

准备好了吗？👉 告诉我你的选择！
