<template>
  <div class="task-manager">
    <div class="page-header">
      <h1 class="page-title">📋 今日课题</h1>
      <p class="page-subtitle">把你的论文和工作分步骤拆解吧</p>
    </div>

    <div class="task-content">
      <div class="card">
        <div class="add-task">
          <input
            v-model="newTask"
            type="text"
            placeholder="输入新课题..."
            class="task-input"
            @keyup.enter="addTask"
          />
          <button class="btn-add" @click="addTask">➕ 添加</button>
        </div>

        <div class="tasks-container">
          <div v-if="tasks.length === 0" class="empty-state">
            <Panda :size="60" mood="happy" :outfit="pandaOutfit" :show-bubble="false" />
            <p class="empty-text">今天没有课题？那就去摸鱼吧！</p>
          </div>
          <div v-else class="tasks-list">
            <div v-for="(task, idx) in tasks" :key="idx" class="task-item-full" :class="{ done: task.done }">
              <input type="checkbox" :checked="task.done" @change="tasks[idx].done = !tasks[idx].done" />
              <span class="task-text">{{ task.text }}</span>
              <button class="btn-delete" @click="deleteTask(idx)">🗑️</button>
            </div>
          </div>
        </div>

        <div class="task-stats">
          <p>已完成：<strong>{{ completedCount }}</strong> / {{ tasks.length }}</p>
          <p>完成度：<strong>{{ Math.round((completedCount / tasks.length) * 100) || 0 }}</strong>%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Panda from '../components/Panda.vue'

const tasks = ref([
  { text: '完成论文绪论部分', done: false },
  { text: '数据分析', done: true },
])

const newTask = ref('')

const pandaOutfit = computed(() => {
  return localStorage.getItem('moyu_panda_outfit') || 'normal'
})

const completedCount = computed(() => tasks.value.filter((t) => t.done).length)

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({ text: newTask.value, done: false })
    newTask.value = ''
  }
}

const deleteTask = (idx) => {
  tasks.value.splice(idx, 1)
}
</script>

<style scoped>
.task-manager {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.page-subtitle {
  margin: 8px 0 0 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: 20px;
  box-shadow: var(--shadow-card);
}

.add-task {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.task-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--font-size-base);
  transition: border-color 200ms ease;
}

.task-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
}

.btn-add {
  padding: 8px 16px;
  background: var(--color-main);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.tasks-container {
  margin-bottom: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
}

.empty-text {
  margin: 0;
  color: var(--color-text-muted);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item-full {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-light);
  border-radius: 8px;
  transition: all 200ms ease;
}

.task-item-full:hover {
  background: var(--color-bg-green);
}

.task-item-full.done .task-text {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-item-full input {
  accent-color: var(--color-main);
  cursor: pointer;
}

.task-text {
  flex: 1;
  font-size: var(--font-size-base);
}

.btn-delete {
  padding: 4px 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: transform 200ms ease;
}

.btn-delete:hover {
  transform: scale(1.2);
}

.task-stats {
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.task-stats p {
  margin: 4px 0;
}

.task-stats strong {
  color: var(--color-main);
  font-weight: var(--font-weight-semibold);
}
</style>
