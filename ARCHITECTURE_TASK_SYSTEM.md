# 🎯 任务系统架构设计

## 📊 一、Task 数据结构

### 1.1 任务模型（核心）

```typescript
interface Task {
  id: string                          // 唯一标识 (uuid 或 时间戳)
  title: string                       // 任务标题
  description?: string                // 任务描述
  category: 'academic' | 'daily' | 'custom'  // 分类
  priority: 'low' | 'normal' | 'high'  // 优先级
  status: 'pending' | 'doing' | 'done'  // 状态
  
  // 奖励系统
  expReward: number                   // 完成奖励经验
  tags?: string[]                     // 标签：['学术', '健身', '生活']
  
  // 时间相关
  createdAt: Date                     // 创建时间
  completedAt?: Date                  // 完成时间
  dueDate?: Date                      // 截止日期
  estimatedTime?: number              // 预计时长（分钟）
  actualTime?: number                 // 实际耗时（分钟）
  
  // 重复相关
  recurring?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    nextDueDate?: Date
  }
  
  // 进度追踪
  progress?: number                   // 进度百分比 (0-100)
  subtasks?: SubTask[]                // 子任务
  
  // 系统字段
  archived: boolean                   // 是否归档
  notes?: string                      // 备注
}

interface SubTask {
  id: string
  title: string
  done: boolean
  order: number
}
```

### 1.2 任务模板库（快速创建）

```typescript
interface TaskTemplate {
  id: string
  name: string                        // 如 "写论文"
  icon: string                        // 如 "📝"
  description: string
  category: string
  defaultExpReward: number
  estimatedTime: number
}

// 预设模板库
const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'write-paper',
    name: '写论文',
    icon: '📝',
    description: '完成论文撰写',
    category: 'academic',
    defaultExpReward: 50,
    estimatedTime: 180,
  },
  {
    id: 'run-experiment',
    name: '跑实验',
    icon: '🔬',
    description: '进行实验操作',
    category: 'academic',
    defaultExpReward: 40,
    estimatedTime: 120,
  },
  // ... 更多模板
]
```

---

## 🎮 二、State 设计（Composition API）

### 2.1 TaskStore（综合状态）

```typescript
// 使用 pinia 或本地 reactive 都可以

interface TaskStore {
  // ====== 任务列表 ======
  tasks: Task[]                       // 所有任务
  
  // ====== 过滤和排序 ======
  filter: {
    category: string | null           // 过滤分类
    status: string | null             // 过滤状态
    priority: string | null           // 过滤优先级
    searchKeyword: string             // 搜索关键词
  }
  
  // ====== UI 状态 ======
  selectedTaskId: string | null       // 当前选中任务
  isEditMode: boolean                 // 是否编辑模式
  showCategoryFilter: boolean         // 显示分类过滤器
  
  // ====== 统计数据 ======
  todayTasks: Task[]                  // 今天的任务
  completedToday: number              // 今天完成数
  totalExpToday: number               // 今天获得 exp
  
  // ====== 快捷操作历史 ======
  recentTemplates: string[]           // 最近使用的模板 ID
}

// 初始化例子
const taskStore = reactive({
  tasks: [],
  filter: {
    category: null,
    status: null,
    priority: null,
    searchKeyword: '',
  },
  selectedTaskId: null,
  isEditMode: false,
  showCategoryFilter: false,
  todayTasks: [],
  completedToday: 0,
  totalExpToday: 0,
  recentTemplates: [],
})
```

### 2.2 Computed 统计属性

```typescript
// 计算属性（自动更新）

// 总任务数
const totalTasks = computed(() => taskStore.tasks.length)

// 已完成任务数
const completedTasks = computed(() => 
  taskStore.tasks.filter(t => t.status === 'done').length
)

// 进行中任务数
const doingTasks = computed(() =>
  taskStore.tasks.filter(t => t.status === 'doing').length
)

// 待处理任务数
const pendingTasks = computed(() =>
  taskStore.tasks.filter(t => t.status === 'pending').length
)

// 完成率
const completionRate = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

// 今日任务进度
const todayProgress = computed(() => {
  if (taskStore.todayTasks.length === 0) return 0
  const completed = taskStore.todayTasks.filter(t => t.status === 'done').length
  return Math.round((completed / taskStore.todayTasks.length) * 100)
})

// 过滤后的任务列表
const filteredTasks = computed(() => {
  let result = taskStore.tasks

  if (taskStore.filter.category) {
    result = result.filter(t => t.category === taskStore.filter.category)
  }
  
  if (taskStore.filter.status) {
    result = result.filter(t => t.status === taskStore.filter.status)
  }
  
  if (taskStore.filter.priority) {
    result = result.filter(t => t.priority === taskStore.filter.priority)
  }
  
  if (taskStore.filter.searchKeyword) {
    result = result.filter(t =>
      t.title.includes(taskStore.filter.searchKeyword) ||
      t.description?.includes(taskStore.filter.searchKeyword)
    )
  }
  
  return result
})

// 按优先级排序
const sortedTasks = computed(() => {
  const priorityOrder = { high: 0, normal: 1, low: 2 }
  return [...filteredTasks.value].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

// 按分类分组
const tasksByCategory = computed(() => {
  const grouped: Record<string, Task[]> = {}
  filteredTasks.value.forEach(task => {
    if (!grouped[task.category]) {
      grouped[task.category] = []
    }
    grouped[task.category].push(task)
  })
  return grouped
})
```

### 2.3 Action 函数库

```typescript
// ====== 创建相关 ======

/**
 * 从模板创建任务
 */
const createTaskFromTemplate = (templateId: string, overrides?: Partial<Task>) => {
  const template = TASK_TEMPLATES.find(t => t.id === templateId)
  if (!template) return null

  const newTask: Task = {
    id: generateId(),
    title: template.name,
    description: template.description,
    category: template.category,
    priority: 'normal',
    status: 'pending',
    expReward: template.defaultExpReward,
    createdAt: new Date(),
    estimatedTime: template.estimatedTime,
    archived: false,
    ...overrides,
  }

  taskStore.tasks.push(newTask)
  taskStore.recentTemplates.unshift(templateId).slice(0, 5)
  
  return newTask
}

/**
 * 创建自定义任务
 */
const createCustomTask = (data: Omit<Task, 'id' | 'createdAt' | 'archived'>): Task => {
  const newTask: Task = {
    id: generateId(),
    createdAt: new Date(),
    archived: false,
    ...data,
  }
  
  taskStore.tasks.push(newTask)
  return newTask
}

// ====== 更新相关 ======

/**
 * 标记任务完成（触发升级逻辑）
 */
const completeTask = (taskId: string): { expGain: number } => {
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (!task) return { expGain: 0 }

  task.status = 'done'
  task.completedAt = new Date()

  const expGain = task.expReward

  // ====== 关键：触发角色升级 ======
  emitTaskCompleted({
    taskId,
    expGain,
    taskTitle: task.title,
  })

  // 统计数据更新
  updateDailyStats()

  // 如果是重复任务，生成下一个
  if (task.recurring?.enabled) {
    generateNextRecurringTask(task)
  }

  return { expGain }
}

/**
 * 更新任务状态
 */
const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (task) {
    task.status = newStatus
    if (newStatus === 'done') {
      task.completedAt = new Date()
    }
  }
}

/**
 * 更新任务进度
 */
const updateTaskProgress = (taskId: string, progress: number) => {
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (task) {
    task.progress = Math.max(0, Math.min(100, progress))
  }
}

// ====== 删除相关 ======

/**
 * 删除任务
 */
const deleteTask = (taskId: string) => {
  const idx = taskStore.tasks.findIndex(t => t.id === taskId)
  if (idx !== -1) {
    taskStore.tasks.splice(idx, 1)
  }
}

/**
 * 归档任务
 */
const archiveTask = (taskId: string) => {
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (task) {
    task.archived = true
  }
}

// ====== 统计相关 ======

/**
 * 更新今日统计
 */
const updateDailyStats = () => {
  const today = new Date().toDateString()
  
  taskStore.todayTasks = taskStore.tasks.filter(t => {
    const createdDate = new Date(t.createdAt).toDateString()
    return createdDate === today
  })

  taskStore.completedToday = taskStore.todayTasks
    .filter(t => t.status === 'done').length

  taskStore.totalExpToday = taskStore.todayTasks
    .filter(t => t.status === 'done')
    .reduce((sum, t) => sum + t.expReward, 0)
}

/**
 * 生成重复任务
 */
const generateNextRecurringTask = (baseTask: Task) => {
  if (!baseTask.recurring?.enabled) return

  const nextTask: Task = {
    ...structuredClone(baseTask),
    id: generateId(),
    createdAt: new Date(),
    completedAt: undefined,
    status: 'pending',
    progress: 0,
  }

  // 计算下一个截止日期
  const nextDue = baseTask.recurring.nextDueDate || new Date()
  if (baseTask.recurring.frequency === 'daily') {
    nextDue.setDate(nextDue.getDate() + 1)
  } else if (baseTask.recurring.frequency === 'weekly') {
    nextDue.setDate(nextDue.getDate() + 7)
  } else if (baseTask.recurring.frequency === 'monthly') {
    nextDue.setMonth(nextDue.getMonth() + 1)
  }

  nextTask.dueDate = nextDue
  taskStore.tasks.push(nextTask)

  return nextTask
}
```

### 2.4 事件系统（与角色联动）

```typescript
// ====== 事件发射 ======

/**
 * 任务完成事件（发送给父组件/角色系统）
 */
const emitTaskCompleted = (data: {
  taskId: string
  expGain: number
  taskTitle: string
}) => {
  // 发送事件给 Dashboard/App
  emit('task-completed', data)
  
  // 或使用事件总线
  EventBus.emit('task:completed', data)
}

/**
 * 监听角色系统的反馈
 */
const onCharacterLevelUp = ({ newLevel, bonusExp }) => {
  // 可以在任务面板显示升级通知
  showNotification(`恭喜升到 LV${newLevel}！`)
  
  // 可以解锁对应的成就
  checkAchievements(newLevel)
}
```

---

## 🏗️ 三、组件拆分建议

### 3.1 组件层级结构

```
TaskManager（容器组件）
├── TaskFilterBar（过滤栏）
│   ├── CategoryFilter
│   ├── StatusFilter
│   ├── PriorityFilter
│   └── SearchBar
│
├── TaskStats（统计面板）
│   ├── ProgressRing
│   ├── CountBadge
│   └── TodayExpDisplay
│
├── TaskList（任务列表）
│   ├── TaskItem（单个任务）
│   │   ├── TaskCheckbox
│   │   ├── TaskTitle
│   │   ├── TaskExpReward
│   │   ├── TaskProgressBar
│   │   └── TaskAction（更多菜单）
│   │
│   ├── TaskGroupByCategory（按分类分组展示）
│   └── EmptyState
│
├── TaskQuickAdd（快速添加条）
│   ├── TemplateGrid（模板快捷按钮）
│   └── CustomTaskInput
│
└── TaskDetail（详情侧栏/模态框）
    ├── TaskEditForm
    ├── SubTaskList
    ├── TimeTracker
    └── NotesPanel
```

### 3.2 核心组件详解

#### **TaskManager.vue** （主容器）
```typescript
<template>
  <div class="task-manager">
    <TaskFilterBar 
      @filter-change="handleFilterChange"
    />
    
    <div class="task-content">
      <TaskStats 
        :completed="completedTasks"
        :total="totalTasks"
        :today-exp="totalExpToday"
        :progress="completionRate"
      />
      
      <TaskList 
        :tasks="sortedTasks"
        @task-complete="completeTask"
        @task-delete="deleteTask"
      />
    </div>
    
    <TaskQuickAdd 
      @create-from-template="createTaskFromTemplate"
      @create-custom="createCustomTask"
    />
  </div>
</template>

Props: (无 - 从 store 获取)
Emits: 
  - task-completed: 向父组件通知任务完成
```

#### **TaskItem.vue** （单个任务卡片）
```typescript
Props:
  - task: Task
  - showExpReward: boolean = true
  - showProgress: boolean = true

Emits:
  - complete: 完成按钮
  - edit: 编辑按钮
  - delete: 删除按钮

特性:
  - 拖拽排序支持
  - 滑动删除（mobile）
  - 快速完成动画
  - 经验值数字飞出
```

#### **TaskStats.vue** （统计面板）
```typescript
Props:
  - completed: number
  - total: number
  - todayExp: number
  - progress: number

展示内容:
  - 完成比例圆环
  - 今日经验值
  - 完成数量
  - 目标进度
```

#### **TaskQuickAdd.vue** （快速添加）
```typescript
- 6 个常用任务模板快捷按钮
- 高亮最常用的
- 自定义任务输入框
- 快速 exp 预估
```

---

## 🔄 四、与角色系统的联动

### 4.1 数据流

```
TaskManager
    ↓
 [完成任务]
    ↓
 emitTaskCompleted({ taskId, expGain })
    ↓
Dashboard (接收事件)
    ↓
character.exp += expGain
    ↓
MyCharacter (watch exp)
    ↓
[自动升级逻辑触发]
    ↓
emit('level-up')
    ↓
Dashboard 显示升级动画
```

### 4.2 集成代码示例

```typescript
// Dashboard.vue
import TaskManager from '@/components/TaskManager.vue'
import MyCharacter from '@/components/MyCharacter.vue'

const character = reactive({
  level: 1,
  exp: 0,
  mood: 'idle',
})

// 监听任务完成事件
const handleTaskCompleted = ({ taskId, expGain, taskTitle }) => {
  character.exp += expGain
  
  // 触发反馈
  userMood.value = 'happy'
  showNotification(`完成了 ${taskTitle}！+${expGain} exp`)
  
  // 2秒后恢复心情
  setTimeout(() => {
    userMood.value = 'idle'
  }, 2000)
}

// 监听升级事件
const handleLevelUp = ({ newLevel, bonusExp }) => {
  character.level = newLevel
  character.exp = bonusExp
  
  // 显示升级庆祝
  showCelebration(`🎉 升到 LV ${newLevel}！`)
}
```

---

## 📱 五、状态持久化

### 5.1 保存到本地

```typescript
/**
 * 保存任务到 localStorage / electron-store
 */
const saveTasksToStorage = () => {
  const serialized = taskStore.tasks.map(t => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    completedAt: t.completedAt?.toISOString(),
    dueDate: t.dueDate?.toISOString(),
  }))
  
  localStorage.setItem('tasks', JSON.stringify(serialized))
}

/**
 * 从本地加载任务
 */
const loadTasksFromStorage = () => {
  const data = localStorage.getItem('tasks')
  if (!data) return

  const parsed = JSON.parse(data)
  taskStore.tasks = parsed.map(t => ({
    ...t,
    createdAt: new Date(t.createdAt),
    completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
    dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
  }))
}

// 自动保存
watch(() => taskStore.tasks, saveTasksToStorage, { deep: true })
```

---

## 🎨 六、UI 展示方案

### 6.1 任务列表视图选项

```
视图1: 简单列表（纵向卡片）
- ☐ 任务名  [exp值]  [优先级标记]

视图2: 分组视图（按分类）
📚 学术类 (3)
  ☐ 写论文
  ☐ 读文献
  
💼 工作类 (2)
  ☐ 回邮件

视图3: 甘特图（时间轴）
- 按截止日期排列

视图4: 看板视图（Trello 风格）
待完成 | 进行中 | 已完成
```

### 6.2 任务卡片交互

```
鼠标悬停:
  - 显示更多菜单
  - 显示经验值
  - 显示预计时长

点击:
  - 打开详情侧栏
  - 编辑任务

右键:
  - 快速菜单（完成/删除/移动）

长按 (mobile):
  - 拖拽排序
```

---

## ✅ 七、实现清单

- [ ] Step 1: 创建 Task 数据模型 + 类型定义
- [ ] Step 2: 创建 TaskManager.vue (容器组件)
- [ ] Step 3: 创建 TaskItem.vue (单个任务)
- [ ] Step 4: 创建 TaskStats.vue (统计面板)
- [ ] Step 5: 创建 TaskFilterBar.vue (过滤栏)
- [ ] Step 6: 创建 TaskQuickAdd.vue (快速添加)
- [ ] Step 7: 集成到 Dashboard
- [ ] Step 8: 与 MyCharacter 联动测试
- [ ] Step 9: 本地存储功能
- [ ] Step 10: 重复任务逻辑
- [ ] Step 11: 成就系统（未来）

---

## 🔗 关键集成点

1. **任务完成 → 角色经验** 通过 emit 事件
2. **角色升级 → 任务反馈** 通过显示通知/动画
3. **心情变化** 基于完成任务进度
4. **每日统计** 显示在 TaskStats 中

---

**设计完成于: 2026-04-14**
**下一步: 开始编码 Step 1 - Task 模型定义**
