<template>
  <div class="floating-ball" @click="togglePanel">
    <!-- 悬浮球 -->
    <div class="ball-container">
      <Panda :size="56" :mood="pandaMood" :outfit="pandaOutfit" :show-bubble="false" />
    </div>

    <!-- 快捷面板（展开时） -->
    <Transition name="panel-slide">
      <div v-if="panelOpen" class="quick-panel">
        <div class="panel-item" @click="quickAction('water')">
          <span class="panel-icon">💧</span>
          <span class="panel-label">喝水</span>
        </div>
        <div class="panel-item" @click="quickAction('stretch')">
          <span class="panel-icon">🏃</span>
          <span class="panel-label">起身</span>
        </div>
        <div class="panel-item" @click="quickAction('pomodoro')">
          <span class="panel-icon">⏱️</span>
          <span class="panel-label">番茄钟</span>
        </div>
        <div class="panel-item" @click="quickAction('mood')">
          <span class="panel-icon">😊</span>
          <span class="panel-label">心情</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Panda from './Panda.vue'

const panelOpen = ref(false)
const pandaMood = ref('happy')

const pandaOutfit = computed(() => {
  return localStorage.getItem('moyu_panda_outfit') || 'normal'
})

const togglePanel = () => {
  panelOpen.value = !panelOpen.value
}

const quickAction = (action) => {
  switch (action) {
    case 'water':
      // 记录喝水时间
      console.log('记录喝水时间')
      break
    case 'stretch':
      // 记录起身活动
      console.log('记录起身活动')
      break
    case 'pomodoro':
      // 启动番茄钟
      console.log('启动番茄钟')
      break
    case 'mood':
      // 打开心情记录
      console.log('打开心情记录')
      break
  }
  panelOpen.value = false
}
</script>

<style scoped>
.floating-ball {
  display: none;
}

/* ===== 悬浮球 ===== */
.ball-container {
  width: 56px;
  height: 56px;
  background: #FF8C42;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(91, 173, 127, 0.3);
  transition: all 200ms ease;
  animation: breathing-ball 3s ease-in-out infinite;
  
  /* 保证Panda组件可见 */
  overflow: visible;
}

.ball-container:hover {
  box-shadow: 0 6px 24px rgba(91, 173, 127, 0.4);
  transform: scale(1.05);
}

@keyframes breathing-ball {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* ===== 快捷面板 ===== */
.quick-panel {
  position: absolute;
  bottom: 72px;
  right: 0;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.panel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms ease;
  user-select: none;
}

.panel-item:hover {
  background-color: var(--color-bg-green);
  transform: translateX(-4px);
}

.panel-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.panel-label {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

/* ===== 过渡动画 ===== */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 300ms ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
