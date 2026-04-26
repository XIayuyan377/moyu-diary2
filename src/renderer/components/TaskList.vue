<template>
  <div class="task-list-wrapper">
    <!-- ============================================
         新增任务输入区
         ============================================ -->
    <div class="task-input-container">
      <input
        v-model="newTaskTitle"
        type="text"
        class="task-input"
        placeholder="添加新任务... (按 Enter 确认)"
        @keydown.enter="addTask"
      />
      <button class="add-btn" @click="addTask" :disabled="!newTaskTitle.trim()">
        <span class="btn-icon">➕</span>
      </button>
    </div>

    <!-- ============================================
         任务列表
         ============================================ -->
    <div class="task-list-container">
      <Transition name="fade-list">
        <div v-if="tasks.length === 0" class="empty-state">
          <p class="empty-icon">✨</p>
          <p class="empty-text">还没有任务呢，来添加一个吧</p>
        </div>
        <div v-else class="task-list">
          <Transition-group name="task-item" tag="div">
            <div
              v-for="(task, index) in tasks"
              :key="task.id"
              class="task-item"
              :class="{ completed: task.done }"
            >
              <!-- checkbox -->
              <input
                type="checkbox"
                class="task-checkbox"
                :checked="task.done"
                @change="toggleTask(index)"
              />

              <!-- 任务标题 -->
              <span class="task-title">{{ task.title }}</span>

              <!-- exp展示 -->
              <span class="task-exp" v-if="task.exp">+{{ task.exp }} exp</span>

              <!-- 删除按钮 -->
              <button
                class="delete-btn"
                @click="deleteTask(index)"
                title="删除任务"
              >
                ✕
              </button>
            </div>
          </Transition-group>
        </div>
      </Transition>
    </div>

    <!-- ============================================
         统计条
         ============================================ -->
    <div v-if="tasks.length > 0" class="task-stats">
      <div class="stat-item">
        <span class="stat-label">完成:</span>
        <span class="stat-value">{{ completedCount }}/{{ tasks.length }}</span>
      </div>
      <div class="progress-bar-small">
        <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
      </div>
      <div class="stat-item">
        <span class="stat-label">进度:</span>
        <span class="stat-value">{{ progressPercent }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ============================================
// Props & Emits
// ============================================
defineProps({
  initialTasks: {
    type: Array,
    default: () => [],
  },
  defaultExp: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['task-completed', 'task-added', 'task-deleted'])

// ============================================
// 响应式数据
// ============================================
const tasks = ref([
  { id: 1, title: '完成论文绪论', done: false, exp: 10 },
  { id: 2, title: '修改实验数据', done: true, exp: 15 },
  { id: 3, title: '准备演讲内容', done: false, exp: 20 },
])
const newTaskTitle = ref('')
const taskIdCounter = ref(100)

// ============================================
// Computed 计算属性
// ============================================

// 已完成任务数
const completedCount = computed(() => {
  return tasks.value.filter((t) => t.done).length
})

// 进度百分比
const progressPercent = computed(() => {
  if (tasks.value.length === 0) return 0
  return Math.round((completedCount.value / tasks.value.length) * 100)
})

// ============================================
// 函数方法
// ============================================

/**
 * 添加新任务
 */
const addTask = () => {
  const title = newTaskTitle.value.trim()
  if (!title) return

  const newTask = {
    id: ++taskIdCounter.value,
    title,
    done: false,
    exp: 10,
  }

  tasks.value.push(newTask)
  emit('task-added', newTask)
  newTaskTitle.value = ''
}

/**
 * 切换任务完成状态
 */
const toggleTask = (index) => {
  const task = tasks.value[index]
  task.done = !task.done

  // 如果是完成了，发送事件给父组件
  if (task.done) {
    emit('task-completed', {
      taskId: task.id,
      title: task.title,
      expReward: task.exp,
    })
  }
}

/**
 * 删除任务
 */
const deleteTask = (index) => {
  const task = tasks.value[index]
  tasks.value.splice(index, 1)
  emit('task-deleted', task)
}
</script>

<style scoped>
.task-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.08);
}

/* ============================================
   新增任务输入区
   ============================================ */
.task-input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.task-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #EDE8E0;
  border-radius: 8px;
  font-size: 14px;
  color: #3D3530;
  background: #FFF5E6;
  transition: all 0.3s ease;
  font-family: inherit;
}

.task-input:focus {
  outline: none;
  border-color: #5BAD7F;
  background: #FFFAF5;
  box-shadow: 0 0 0 3px rgba(91, 173, 127, 0.1);
}

.task-input::placeholder {
  color: #C4BDB3;
}

.add-btn {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  padding: 0;
  background: linear-gradient(135deg, #5BAD7F, #7AC77F);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(91, 173, 127, 0.2);
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.3);
}

.add-btn:active:not(:disabled) {
  transform: translateY(0);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ============================================
   任务列表
   ============================================ */
.task-list-container {
  flex: 1;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
  background: #FFF5E6;
  padding: 8px;
}

.task-list-container::-webkit-scrollbar {
  width: 6px;
}

.task-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.task-list-container::-webkit-scrollbar-thumb {
  background: #D4BDB3;
  border-radius: 3px;
}

.task-list-container::-webkit-scrollbar-thumb:hover {
  background: #C4BDB3;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: #9E9189;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  animation: float-empty 3s ease-in-out infinite;
}

@keyframes float-empty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.empty-text {
  font-size: 14px;
  color: #9E9189;
  margin: 0;
}

/* 任务项 */
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin: 4px 0;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #5BAD7F;
  transition: all 0.3s ease;
  animation: task-item-enter 0.3s ease-out;
}

@keyframes task-item-enter {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.task-item:hover {
  background: #FFFAF5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border-left-color: #7AC77F;
}

.task-item.completed {
  opacity: 0.65;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #9E9189;
}

/* checkbox */
.task-checkbox {
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #5BAD7F;
  transition: all 0.2s ease;
}

.task-checkbox:hover {
  transform: scale(1.1);
}

.task-checkbox:checked {
  accent-color: #7AC77F;
}

/* 任务标题 */
.task-title {
  flex: 1;
  font-size: 14px;
  color: #3D3530;
  word-break: break-word;
  line-height: 1.4;
}

/* 经验值 */
.task-exp {
  flex: 0 0 auto;
  font-size: 12px;
  color: #FF8C42;
  font-weight: bold;
  background: #FFF0E6;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

/* 删除按钮 */
.delete-btn {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  color: #C4BDB3;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #FFE8E8;
  color: #F08080;
}

.delete-btn:active {
  transform: scale(0.9);
}

/* ============================================
   统计条
   ============================================ */
.task-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #E8F5EE, #FFF0E6);
  border-radius: 8px;
  font-size: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-label {
  color: #6B6259;
  font-weight: 500;
}

.stat-value {
  color: #5BAD7F;
  font-weight: bold;
  font-size: 13px;
}

.progress-bar-small {
  flex: 1;
  height: 6px;
  background: #EDE8E0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5BAD7F, #7AC77F);
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ============================================
   Transition 动画
   ============================================ */
.fade-list-enter-active,
.fade-list-leave-active {
  transition: opacity 0.3s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
}

.task-item-enter-active {
  transition: all 0.3s ease;
}

.task-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.task-item-leave-active {
  transition: all 0.2s ease;
  position: absolute;
}

.task-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* ============================================
   响应式
   ============================================ */
@media (max-width: 600px) {
  .task-list-wrapper {
    padding: 16px;
    gap: 12px;
  }

  .task-input {
    padding: 10px 12px;
    font-size: 13px;
  }

  .task-item {
    padding: 10px;
  }

  .task-title {
    font-size: 13px;
  }

  .task-exp {
    font-size: 11px;
    padding: 3px 6px;
  }

  .delete-btn {
    width: 24px;
    height: 24px;
    font-size: 16px;
  }
}
</style>
