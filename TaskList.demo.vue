<template>
  <div class="demo-wrapper">
    <h1>🎯 TaskList 组件演示</h1>

    <!-- 分成两列：任务列表 + 角色 -->
    <div class="demo-container">
      <!-- 左列：任务列表 -->
      <div class="left-panel">
        <h2>📋 任务管理</h2>
        <TaskList
          @task-completed="handleTaskCompleted"
          @task-added="handleTaskAdded"
          @task-deleted="handleTaskDeleted"
        />
      </div>

      <!-- 右列：角色系统 + 反馈 -->
      <div class="right-panel">
        <h2>👤 角色成长</h2>

        <!-- 角色展示 -->
        <div class="character-display">
          <MyCharacter
            :level="character.level"
            :exp="character.exp"
            :mood="character.mood"
            :size="150"
            :show-stats="true"
            :interactive="true"
            @character-clicked="handleCharacterClick"
          />
        </div>

        <!-- 状态面板 -->
        <div class="status-panel">
          <div class="status-item">
            <span class="label">等级:</span>
            <span class="value">{{ character.level }}</span>
          </div>
          <div class="status-item">
            <span class="label">经验:</span>
            <span class="value">{{ character.exp }}/{{ nextExpRequired }}</span>
          </div>
          <div class="status-item">
            <span class="label">心情:</span>
            <span class="value mood" :class="`mood-${character.mood}`">
              {{ moodEmoji[character.mood] }} {{ character.mood }}
            </span>
          </div>
        </div>

        <!-- 事件日志 -->
        <div class="event-log">
          <h3>📝 事件日志</h3>
          <div class="log-list">
            <div v-for="(log, idx) in eventLogs" :key="idx" class="log-item">
              {{ log }}
            </div>
            <div v-if="eventLogs.length === 0" class="log-empty">
              等待事件...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import TaskList from '@/renderer/components/TaskList.vue'
import MyCharacter from '@/renderer/components/MyCharacter.vue'

// ============================================
// 角色状态
// ============================================
const character = reactive({
  level: 1,
  exp: 0,
  mood: 'idle',
})

const eventLogs = ref([])

const moodEmoji = {
  happy: '😊',
  tired: '😴',
  stressed: '😰',
  idle: '😐',
}

// ============================================
// Computed 计算属性
// ============================================

/**
 * 下一级所需经验值
 */
const nextExpRequired = computed(() => {
  const base = 100
  const rate = 1.2
  return Math.round(base * Math.pow(rate, character.level - 1))
})

// ============================================
// 事件处理
// ============================================

/**
 * 任务完成处理
 */
const handleTaskCompleted = ({ taskId, title, expReward }) => {
  // 1. 增加经验值
  character.exp += expReward

  // 2. 更新心情
  character.mood = 'happy'

  // 3. 记录日志
  addLog(`✅ 完成任务: "${title}" +${expReward} exp`)

  // 4. 检查升级
  if (character.exp >= nextExpRequired.value) {
    character.level++
    character.exp = 0
    character.mood = 'happy'
    addLog(`🎉 升到 LV${character.level}！`)
  }

  // 5. 2秒后恢复心情
  setTimeout(() => {
    character.mood = 'idle'
  }, 2000)
}

/**
 * 任务添加处理
 */
const handleTaskAdded = (task) => {
  addLog(`📝 新增任务: "${task.title}"`)
}

/**
 * 任务删除处理
 */
const handleTaskDeleted = (task) => {
  addLog(`🗑️ 删除任务: "${task.title}"`)
}

/**
 * 角色点击处理
 */
const handleCharacterClick = ({ level, mood, exp }) => {
  addLog(`👉 你点了一下角色！`)
}

/**
 * 添加日志
 */
const addLog = (message) => {
  const time = new Date().toLocaleTimeString('zh-CN')
  eventLogs.value.unshift(`[${time}] ${message}`)
  if (eventLogs.value.length > 15) {
    eventLogs.value.pop()
  }
}

// 初始化日志
addLog('👋 欢迎使用任务系统！')
addLog('💡 完成任务获得经验，积累经验可升级！')
</script>

<style scoped>
.demo-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #FAF7F2;
  min-height: 100vh;
}

h1 {
  color: #5BAD7F;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  letter-spacing: 1px;
}

.demo-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* ============================================
   左列：任务列表
   ============================================ */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.left-panel h2 {
  color: #3D3530;
  font-size: 18px;
  margin: 0;
}

/* ============================================
   右列：角色系统
   ============================================ */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-panel h2 {
  color: #3D3530;
  font-size: 18px;
  margin: 0;
}

/* 角色展示 */
.character-display {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 状态面板 */
.status-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: linear-gradient(135deg, #E8F5EE, #FFF0E6);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.status-item:last-child {
  border-bottom: none;
}

.status-item .label {
  font-weight: 600;
  color: #5BAD7F;
  font-size: 13px;
}

.status-item .value {
  color: #3D3530;
  font-weight: bold;
  font-size: 14px;
}

.status-item .mood {
  padding: 4px 12px;
  border-radius: 6px;
  background: white;
  display: inline-block;
}

.status-item .mood-happy {
  background: #E8F5EE;
  color: #7AC77F;
}

.status-item .mood-tired {
  background: #FFF3E0;
  color: #FFB84D;
}

.status-item .mood-stressed {
  background: #FFE8E8;
  color: #F08080;
}

.status-item .mood-idle {
  background: #F5F0EA;
  color: #9E9189;
}

/* 事件日志 */
.event-log {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  flex: 1;
  min-height: 200px;
}

.event-log h3 {
  margin: 0;
  color: #3D3530;
  font-size: 14px;
  font-weight: 600;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow-y: auto;
  max-height: 250px;
}

.log-list::-webkit-scrollbar {
  width: 4px;
}

.log-list::-webkit-scrollbar-thumb {
  background: #D4BDB3;
  border-radius: 2px;
}

.log-item {
  padding: 8px 12px;
  background: #FFF5E6;
  border-radius: 6px;
  font-size: 12px;
  color: #3D3530;
  border-left: 3px solid #5BAD7F;
  font-family: 'Courier New', monospace;
  line-height: 1.4;
  word-break: break-word;
}

.log-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9E9189;
  font-size: 12px;
}

/* ============================================
   响应式设计
   ============================================ */
@media (max-width: 1000px) {
  .demo-container {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
}

@media (max-width: 600px) {
  .demo-wrapper {
    padding: 12px;
  }

  h1 {
    font-size: 20px;
  }

  .demo-container {
    gap: 12px;
  }

  .left-panel h2,
  .right-panel h2 {
    font-size: 16px;
  }

  .character-display {
    padding: 16px;
  }

  .status-panel,
  .event-log {
    padding: 12px;
  }

  .event-log {
    min-height: auto;
  }

  .log-list {
    max-height: 150px;
  }
}
</style>
