# 🔗 TaskList + MyCharacter 联动指南

## 📊 一、状态管理方案

### 核心原则：集中式状态管理

```
Dashboard.vue (父组件 - 状态管理中心)
    ↓                                    ↓
  TaskList.vue                    MyCharacter.vue
  (发送事件)                      (接收 props)
    @task-completed                 :level
    ↑                                :exp
    │                                :mood
    └──────→ handleTaskCompleted ←────┘
             (state 更新)
```

---

## 🎮 二、State 设计（Dashboard 中）

### 2.1 角色状态对象

```typescript
// Dashboard.vue 中
const character = reactive({
  level: 1,           // 当前等级
  exp: 0,             // 当前经验值
  mood: 'idle',       // 当前心情：idle / happy / tired / stressed
})
```

### 2.2 计算升级所需经验

```typescript
const nextExpRequired = computed(() => {
  const base = 100
  const rate = 1.2
  return Math.round(base * Math.pow(rate, character.level - 1))
})

// 示例：
// Lv1→2: 100 exp
// Lv2→3: 120 exp
// Lv3→4: 144 exp
```

---

## 📡 三、事件流程

### 完整流程图

```
用户在 TaskList 勾选完成任务
         ↓
TaskList emit('task-completed', {
  taskId: 1,
  title: '写论文',
  expReward: 10
})
         ↓
Dashboard 中的 handleTaskCompleted() 接收
         ↓
1. character.exp += expReward
2. character.mood = 'happy'
3. 检查是否升级
   if (character.exp >= nextExpRequired.value) {
     character.level++
     character.exp = 0
     showCelebration('🎉 升到 LV' + character.level)
   }
         ↓
4秒后恢复心情到 idle
         ↓
MyCharacter 监听 props 变化自动更新显示
```

---

## 💻 四、代码实现

### 4.1 Dashboard.vue 完整代码框架

```vue
<template>
  <div class="dashboard-container">
    <!-- 顶部：角色系统 -->
    <div class="character-section">
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
    </div>

    <!-- 中部：任务系统 -->
    <div class="task-section">
      <TaskList
        @task-completed="handleTaskCompleted"
        @task-added="handleTaskAdded"
        @task-deleted="handleTaskDeleted"
      />
    </div>

    <!-- 底部：其他卡片 -->
    <div class="other-sections">
      <!-- 原有的卡片... -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import MyCharacter from '@/renderer/components/MyCharacter.vue'
import TaskList from '@/renderer/components/TaskList.vue'

// ============================================
// 1️⃣ 角色状态（核心）
// ============================================
const character = reactive({
  level: 1,
  exp: 0,
  mood: 'idle',  // idle / happy / tired / stressed
})

// ============================================
// 2️⃣ 计算升级所需经验
// ============================================
const nextExpRequired = computed(() => {
  const base = 100
  const rate = 1.2
  return Math.round(base * Math.pow(rate, character.level - 1))
})

// 经验进度百分比
const expProgress = computed(() => {
  if (nextExpRequired.value === 0) return 0
  return Math.min(
    Math.round((character.exp / nextExpRequired.value) * 100),
    100
  )
})

// ============================================
// 3️⃣ 任务完成处理（关键函数）⭐
// ============================================
const handleTaskCompleted = ({ taskId, title, expReward }) => {
  // Step 1: 增加经验
  character.exp += expReward
  console.log(`✅ 完成 "${title}" 获得 ${expReward} exp`)

  // Step 2: 改变心情为高兴
  character.mood = 'happy'
  console.log(`😊 心情变为 happy`)

  // Step 3: 显示通知
  showCelebration(`🎉 ${title} +${expReward} exp`)

  // Step 4: 检查升级 ⭐⭐⭐ 关键逻辑
  if (character.exp >= nextExpRequired.value) {
    const oldLevel = character.level
    const bonusExp = character.exp - nextExpRequired.value

    character.level++
    character.exp = bonusExp

    console.log(`🎊 升到 LV${character.level}！`)
    showCelebration(
      `✨ 升到 LV${character.level}！\n获得奖励...`,
      3000
    )
  }

  // Step 5: 2秒后恢复到空闲心情
  setTimeout(() => {
    character.mood = 'idle'
  }, 2000)
}

// ============================================
// 4️⃣ 其他事件处理
// ============================================

const handleTaskAdded = (task) => {
  console.log(`📝 添加任务: ${task.title}`)
}

const handleTaskDeleted = (task) => {
  console.log(`🗑️ 删除任务: ${task.title}`)
}

const handleLevelUp = ({ newLevel, bonusExp }) => {
  console.log(`角色升级事件: LV${newLevel}`)
  // 可选：显示额外的升级特效
}

const handleCharacterClick = ({ level, mood }) => {
  console.log(`👉 点击了角色！当前 LV${level}`)
}

// ============================================
// 5️⃣ UI 反馈
// ============================================

const celebrationVisible = ref(false)
const celebrationText = ref('')

const showCelebration = (text, duration = 2000) => {
  celebrationText.value = text
  celebrationVisible.value = true

  setTimeout(() => {
    celebrationVisible.value = false
  }, duration)
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: #FAF7F2;
  min-height: 100vh;
}

.character-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.task-section {
  max-width: 1000px;
  margin: 0 auto 30px;
}

.other-sections {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
```

---

## 🔄 五、完整数据流示例

### 场景：用户完成任务

```
[Timeline]

T0: 用户界面
    └─ TaskList 显示任务列表
       [ ] 完成论文   +10 exp
       [ ] 读文献     +15 exp

T1: 用户点击 checkbox
    └─ toggleTask(index)
    └─ task.done = true
    └─ emit('task-completed', {
         taskId: 1,
         title: '完成论文',
         expReward: 10
       })

T2: Dashboard 接收事件
    └─ handleTaskCompleted({ taskId, title, expReward })
    
T3: 状态更新
    ├─ character.exp += 10  (0 → 10)
    ├─ character.mood = 'happy'
    └─ showCelebration('🎉 完成论文 +10 exp')

T4: MyCharacter 自动更新
    ├─ :mood="happy" → 表情变笑脸
    ├─ :exp="10" → 经验条更新
    ├─ 爱心💖自动跳动
    └─ 经验条填充 10% (假设需要100)

T5: 2秒后恢复心情
    └─ character.mood = 'idle'
    └─ MyCharacter 表情恢复正常

[升级场景]

If character.exp >= 100:
  ├─ character.level = 2
  ├─ character.exp = 0
  ├─ character.mood = 'happy'
  ├─ showCelebration('✨ 升到 LV2！')
  └─ MyCharacter:
     ├─ 显示升级浮层
     ├─ 彩粒子爆炸 ✨
     ├─ 等级徽章从 LV1 → LV2
     └─ 2秒后恢复
```

---

## 📋 六、Props 和 Emits 对照表

### MyCharacter 需要接收

| Prop | 类型 | 来自 | 作用 |
|------|------|------|------|
| `:level` | number | `character.level` | 显示当前等级 |
| `:exp` | number | `character.exp` | 显示当前经验 |
| `:mood` | string | `character.mood` | 改变表情和心情 |
| `:size` | number | 固定 | 角色尺寸 |
| `:show-stats` | boolean | 固定 true | 显示等级条带 |

### TaskList 需要发送

| Event | 载荷 | 何时发送 |
|-------|------|--------|
| `task-completed` | `{ taskId, title, expReward }` | 勾选完成 |
| `task-added` | `{ task }` | 新增任务 |
| `task-deleted` | `{ task }` | 删除任务 |

---

## 🧪 七、测试检查清单

✅ **功能测试**

- [ ] 添加任务 → 任务列表出现
- [ ] 勾选任务 → exp 增加 ✓
- [ ] 角色头像 exp 条更新 ✓
- [ ] 心情变为 happy ✓
- [ ] 2秒后恢复 idle ✓
- [ ] exp 满 100 → level 升级 ✓
- [ ] 升级显示彩粒子效果 ✓
- [ ] 删除任务 → 任务消失

✅ **UI 测试**

- [ ] 角色居中显示
- [ ] TaskList 在下方
- [ ] 动画流畅
- [ ] 响应式适配

---

## 🎯 八、常见问题

**Q: 如何修改经验值奖励？**  
A: TaskList 中的每个任务有 `exp: 10` 字段，修改即可

**Q: 如何修改升级所需经验？**  
A: 修改 `nextExpRequired` 中的 `base` 和 `rate`

**Q: 升级后 exp 为什么变 0？**  
A: 这是设计逻辑，可改为：`character.exp = bonusExp`

**Q: 如何保存进度？**  
A: 在 Dashboard watch character，保存到 localStorage 或 electron-store

**Q: 能否同时多个任务完成？**  
A: 可以，每次完成都会触发一次 handleTaskCompleted

---

## 💾 九、持久化保存（可选）

```typescript
// 监听角色状态变化，自动保存
watch(
  () => character,
  (newCharacter) => {
    localStorage.setItem('character', JSON.stringify(newCharacter))
  },
  { deep: true }
)

// 页面加载时恢复
onMounted(() => {
  const saved = localStorage.getItem('character')
  if (saved) {
    const loaded = JSON.parse(saved)
    character.level = loaded.level
    character.exp = loaded.exp
    character.mood = loaded.mood
  }
})
```

---

## 🚀 十、集成步骤

### 快速集成（5分钟）

1. ✅ 拷贝 MyCharacter.vue 到 components/
2. ✅ 拷贝 TaskList.vue 到 components/
3. ✅ 在 Dashboard.vue 顶部导入两个组件
4. ✅ 复制上面的 `<script setup>` 代码
5. ✅ 复制 Template 中的角色和任务部分
6. ✅ 运行测试

### 验证集成

```bash
npm run dev
# 打开 Dashboard 页面
# 添加任务 → 勾选完成 → 查看 exp 增加 ✓
```

---

**总结：Dashboard 是中心，TaskList 发事件，MyCharacter 看状态**

现在可以立即开始集成了！👀

需要我帮你修改 Dashboard.vue 吗？
