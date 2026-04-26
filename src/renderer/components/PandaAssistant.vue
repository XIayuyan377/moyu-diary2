<template>
  <Teleport to="body">
    <div class="panda-assistant">
      <!-- 熊猫容器 -->
      <div
        class="panda-body"
        :class="[
          `state-${pandaState}`,
          { 'is-breathing': isPandaBreathing },
        ]"
        @click="handlePandaClick"
        @mouseenter="handlePandaHover(true)"
        @mouseleave="handlePandaHover(false)"
      >
        <!-- 熊猫头部 -->
        <div class="panda-head">
          <!-- 左耳 -->
          <div class="panda-ear left" />
          <!-- 右耳 -->
          <div class="panda-ear right" />
          <!-- 脸 -->
          <div class="panda-face">
            <!-- 左眼 -->
            <div class="panda-eye left">
              <div class="pupil" :class="{ 'looking-away': isLookingAway }" />
            </div>
            <!-- 右眼 -->
            <div class="panda-eye right">
              <div class="pupil" :class="{ 'looking-away': isLookingAway }" />
            </div>
            <!-- 鼻子 -->
            <div class="panda-nose" />
            <!-- 嘴 -->
            <div class="panda-mouth" :class="`mouth-${pandaState}`" />
          </div>
        </div>

        <!-- 熊猫身体 -->
        <div class="panda-body-main">
          <!-- 左臂 -->
          <div class="panda-arm left" />
          <!-- 右臂 -->
          <div class="panda-arm right" />
          <!-- 肚子 -->
          <div class="panda-belly" />
        </div>
      </div>

      <!-- 状态提示 -->
      <div
        v-show="isHovering"
        class="panda-tooltip"
        :class="`state-${pandaState}`"
      >
        <div class="tooltip-text">{{ stateText }}</div>
        <div class="tooltip-subtext">{{ stateSubtext }}</div>
      </div>

      <!-- 快速按钮组 -->
      <transition name="quick-buttons-fade">
        <div v-show="isHovering" class="quick-buttons">
          <button
            v-for="btn in quickButtons"
            :key="btn.action"
            class="quick-btn"
            :title="btn.tooltip"
            @click="handleQuickAction(btn.action)"
          >
            {{ btn.icon }}
          </button>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../../stores/user'

// =====================================
// 状态管理
// =====================================
const userStore = useUserStore()

const pandaState = ref('idle') // idle, happy, tired, angry
const isHovering = ref(false)
const isPandaBreathing = ref(true)
const isLookingAway = ref(false)
const clickCount = ref(0)

// =====================================
// 计算属性
// =====================================

const stateText = computed(() => {
  const textMap = {
    idle: '摸鱼助手待命中...',
    happy: '嘿呀，又在摸鱼呢！',
    tired: '我也累了...',
    angry: '该起身活动活动了！',
  }
  return textMap[pandaState.value]
})

const stateSubtext = computed(() => {
  const textMap = {
    idle: '点击我互动',
    happy: '继续加油 🎉',
    tired: '注意休息时间',
    angry: '久坐有害健康',
  }
  return textMap[pandaState.value]
})

const quickButtons = [
  { icon: '💧', action: 'water', tooltip: '提醒喝水' },
  { icon: '🏃', action: 'stretch', tooltip: '起身活动' },
  { icon: '😊', action: 'mood', tooltip: '记录心情' },
  { icon: '🎯', action: 'focus', tooltip: '番茄钟' },
]

// =====================================
// 方法
// =====================================

const handlePandaClick = () => {
  clickCount.value++
  
  if (clickCount.value % 3 === 0) {
    pandaState.value = 'happy'
  } else if (clickCount.value % 3 === 1) {
    pandaState.value = 'tired'
  } else {
    pandaState.value = 'idle'
  }
  
  // 3秒后恢复空闲状态
  setTimeout(() => {
    pandaState.value = 'idle'
    clickCount.value = 0
  }, 3000)
}

const handlePandaHover = (hover) => {
  isHovering.value = hover
  if (hover) {
    isLookingAway.value = true
  } else {
    isLookingAway.value = false
  }
}

const handleQuickAction = (action) => {
  console.log(`执行快速动作: ${action}`)
  
  switch (action) {
    case 'water':
      console.log('💧 提醒喝水')
      userStore.addExp(5)
      break
    case 'stretch':
      console.log('🏃 起身活动')
      userStore.addExp(10)
      break
    case 'mood':
      console.log('😊 记录心情')
      break
    case 'focus':
      console.log('🎯 启动番茄钟')
      userStore.addExp(15)
      break
  }
  
  // 触发熊猫状态变化
  pandaState.value = 'happy'
  setTimeout(() => {
    pandaState.value = 'idle'
  }, 2000)
}

// =====================================
// 生命周期
// =====================================

let breathingTimer = null

onMounted(() => {
  // 定期改变呼吸状态
  breathingTimer = setInterval(() => {
    isPandaBreathing.value = !isPandaBreathing.value
  }, 2000)
  
  // 定期变更状态（模拟）
  setInterval(() => {
    if (!isHovering.value) {
      const states = ['idle', 'tired']
      const randomState = states[Math.floor(Math.random() * states.length)]
      pandaState.value = randomState
    }
  }, 8000)
})

onUnmounted(() => {
  if (breathingTimer) {
    clearInterval(breathingTimer)
  }
})
</script>

<style scoped>
.panda-assistant {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  user-select: none;
  animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* ===== 熊猫主体 ===== */
.panda-body {
  position: relative;
  width: 120px;
  height: 140px;
  cursor: pointer;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.15));
  transition: transform 0.2s ease;
}

.panda-body:hover {
  transform: scale(1.05);
}

.panda-body.is-breathing {
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

/* ===== 熊猫头部 ===== */
.panda-head {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
}

/* 脸 */
.panda-face {
  position: absolute;
  inset: 0;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 耳朵 */
.panda-ear {
  position: absolute;
  width: 28px;
  height: 28px;
  background: #000;
  border-radius: 50%;
  top: 6px;
}

.panda-ear.left {
  left: 6px;
}

.panda-ear.right {
  right: 6px;
}

/* 眼睛 */
.panda-eye {
  position: absolute;
  width: 24px;
  height: 24px;
  background: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 28px;
}

.panda-eye.left {
  left: 14px;
}

.panda-eye.right {
  right: 14px;
}

.pupil {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
}

.pupil::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: #000;
  border-radius: 50%;
  top: 2px;
  left: 2px;
}

.pupil.looking-away::after {
  top: 4px;
  left: 4px;
}

/* 鼻子 */
.panda-nose {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #000;
  border-radius: 50%;
  bottom: 24px;
}

/* 嘴 */
.panda-mouth {
  position: absolute;
  width: 12px;
  height: 6px;
  bottom: 12px;
  border: 2px solid #000;
  border-top: none;
  border-radius: 0 0 12px 12px;
  transition: all 0.3s ease;
}

.panda-mouth-idle {
  border-radius: 0 0 12px 12px;
}

.panda-mouth-happy {
  height: 8px;
  border-radius: 0 0 12px 12px;
  background: #000;
}

.panda-mouth-tired {
  border-radius: 12px 12px 0 0;
  border-top: 2px solid #000;
  border-bottom: none;
}

.panda-mouth-angry {
  width: 16px;
  height: 2px;
  background: #000;
  border: none;
  border-radius: 2px;
}

/* ===== 熊猫身体 ===== */
.panda-body-main {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 60px;
}

.panda-belly {
  position: absolute;
  inset: 0;
  background: white;
  border-radius: 50%;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid #f5f5f5;
}

.panda-arm {
  position: absolute;
  width: 16px;
  height: 40px;
  background: #000;
  border-radius: 12px;
  top: 10px;
  transition: transform 0.3s ease;
}

.panda-arm.left {
  left: 4px;
  transform: rotate(-25deg);
}

.panda-arm.right {
  right: 4px;
  transform: rotate(25deg);
}

.state-happy .panda-arm {
  animation: arm-raise 0.6s ease-in-out infinite;
}

@keyframes arm-raise {
  0%, 100% {
    transform: rotate(-25deg);
  }
  50% {
    transform: rotate(-60deg);
  }
}

.state-happy .panda-arm.right {
  animation: arm-raise-right 0.6s ease-in-out infinite;
}

@keyframes arm-raise-right {
  0%, 100% {
    transform: rotate(25deg);
  }
  50% {
    transform: rotate(60deg);
  }
}

/* ===== 提示框 ===== */
.panda-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-12px);
  background: #2d3748;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  pointer-events: none;
  animation: tooltip-fade-in 0.2s ease;
}

@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(-12px);
  }
}

.panda-tooltip::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #2d3748;
}

.panda-tooltip.state-happy {
  background: #48bb78;
}

.panda-tooltip.state-happy::after {
  border-top-color: #48bb78;
}

.panda-tooltip.state-tired {
  background: #ed8936;
}

.panda-tooltip.state-tired::after {
  border-top-color: #ed8936;
}

.panda-tooltip.state-angry {
  background: #f56565;
}

.panda-tooltip.state-angry::after {
  border-top-color: #f56565;
}

.tooltip-text {
  font-weight: 700;
}

.tooltip-subtext {
  font-size: 10px;
  opacity: 0.8;
  font-weight: 400;
  margin-top: 2px;
}

/* ===== 快速按钮组 ===== */
.quick-buttons {
  position: absolute;
  bottom: 100%;
  right: 0;
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  animation: buttons-slide-up 0.3s ease;
}

@keyframes buttons-slide-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #5BAD7F;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(91, 173, 127, 0.2);
}

.quick-btn:hover {
  background: #5BAD7F;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.4);
}

.quick-btn:active {
  transform: scale(0.95);
}

/* 过渡动画 */
.quick-buttons-fade-enter-active,
.quick-buttons-fade-leave-active {
  transition: opacity 0.2s ease;
}

.quick-buttons-fade-enter-from,
.quick-buttons-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .panda-assistant {
    bottom: 16px;
    right: 16px;
  }

  .panda-body {
    width: 90px;
    height: 110px;
  }

  .panda-head {
    width: 80px;
    height: 80px;
  }

  .panda-ear {
    width: 22px;
    height: 22px;
  }

  .quick-buttons {
    gap: 6px;
  }

  .quick-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>
