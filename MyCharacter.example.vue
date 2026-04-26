<template>
  <div class="test-wrapper">
    <h2>🎮 MyCharacter 组件测试</h2>

    <!-- 测试1: 基础展示 -->
    <div class="test-section">
      <h3>📍 基础展示（等级5，50% exp）</h3>
      <MyCharacter 
        :level="5"
        :exp="103"
        :mood="currentMood"
        :size="120"
        :show-stats="true"
        :interactive="true"
        @character-clicked="handleClick"
        @mood-changed="handleMoodChange"
        @level-up="handleLevelUp"
      />
      <div class="control-buttons">
        <button @click="currentMood = 'happy'">😊 Happy</button>
        <button @click="currentMood = 'tired'">😴 Tired</button>
        <button @click="currentMood = 'stressed'">😰 Stressed</button>
        <button @click="currentMood = 'idle'">😐 Idle</button>
      </div>
    </div>

    <!-- 测试2: 升级演示 -->
    <div class="test-section">
      <h3>⬆️ 升级演示（手动升级）</h3>
      <MyCharacter 
        :level="testLevel"
        :exp="testExp"
        mood="happy"
        :size="120"
        :show-stats="true"
      />
      <div class="control-buttons">
        <button @click="addExp">+50 EXP</button>
        <button @click="testLevel++; testExp = 0">立即升级</button>
        <button @click="testLevel = 1; testExp = 0">重置</button>
      </div>
      <p>当前等级：{{ testLevel }}，当前经验：{{ testExp }}</p>
    </div>

    <!-- 测试3: 不同尺寸 -->
    <div class="test-section">
      <h3>📏 不同尺寸</h3>
      <div class="size-grid">
        <div class="size-item">
          <MyCharacter :level="3" :exp="50" mood="happy" :size="80" :show-stats="true" />
          <p>80px</p>
        </div>
        <div class="size-item">
          <MyCharacter :level="5" :exp="75" mood="idle" :size="120" :show-stats="true" />
          <p>120px</p>
        </div>
        <div class="size-item">
          <MyCharacter :level="7" :exp="100" mood="tired" :size="160" :show-stats="true" />
          <p>160px</p>
        </div>
      </div>
    </div>

    <!-- 测试4: 所有心情 -->
    <div class="test-section">
      <h3>🎭 所有心情状态</h3>
      <div class="mood-grid">
        <div v-for="mood in moods" :key="mood" class="mood-item">
          <MyCharacter :level="5" :exp="100" :mood="mood" :size="100" :show-stats="false" />
          <p>{{ mood }}</p>
        </div>
      </div>
    </div>

    <!-- 测试事件日志 -->
    <div class="test-section">
      <h3>📋 事件日志</h3>
      <div class="event-log">
        <div v-for="(log, idx) in eventLogs" :key="idx" class="log-item">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MyCharacter from '@/renderer/components/MyCharacter.vue'

const currentMood = ref('idle')
const testLevel = ref(1)
const testExp = ref(0)
const eventLogs = ref([])
const moods = ['happy', 'tired', 'stressed', 'idle']

const nextExpRequired = computed(() => {
  const base = 100
  const rate = 1.2
  return Math.round(base * Math.pow(rate, testLevel.value - 1))
})

function addExp() {
  testExp.value += 50
  if (testExp.value >= nextExpRequired.value) {
    testLevel.value++
    testExp.value = 0
  }
}

function handleClick(payload) {
  addLog(`[点击] 等级${payload.level}，心情${payload.mood}`)
}

function handleMoodChange(payload) {
  addLog(`[心情变化] ${payload.oldMood} → ${payload.newMood}`)
}

function handleLevelUp(payload) {
  addLog(`[升级🎉] 升到等级${payload.newLevel}，剩余经验${payload.bonusExp}`)
}

function addLog(message) {
  eventLogs.value.unshift(`${new Date().toLocaleTimeString()}: ${message}`)
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}
</script>

<style scoped>
.test-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #FAF7F2;
}

h2 {
  color: #5BAD7F;
  text-align: center;
  margin-bottom: 30px;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-section h3 {
  color: #3D3530;
  margin-bottom: 20px;
  font-size: 16px;
}

.control-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

button {
  padding: 8px 16px;
  background: #5BAD7F;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

button:hover {
  background: #4A9B6F;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

.size-grid,
.mood-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.size-item,
.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #F5F0EA;
  border-radius: 8px;
}

.size-item p,
.mood-item p {
  font-size: 12px;
  color: #6B6259;
  margin: 0;
}

.event-log {
  background: #F5F0EA;
  border-radius: 6px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-item {
  padding: 6px;
  border-bottom: 1px solid #EDE8E0;
  color: #3D3530;
}

.log-item:last-child {
  border-bottom: none;
}

p {
  margin: 10px 0;
  color: #6B6259;
}
</style>
