<template>
  <div class="character-wrapper">
    <!-- ============================================
         升级提示浮层（彩粒子效果）
         ============================================ -->
    <Transition name="levelup-burst">
      <div v-if="showLevelUpAnimation" class="level-up-popup">
        <div class="levelup-text">
          <div class="levelup-icon">✨</div>
          <div class="levelup-label">LEVEL UP!</div>
          <div class="levelup-numbers">
            <span class="old-level">{{ previousLevel }}</span>
            <span class="arrow">→</span>
            <span class="new-level">{{ level }}</span>
          </div>
        </div>
        <!-- 彩粒子 -->
        <div class="particles-container">
          <div v-for="i in 20" :key="i" class="particle" :style="particleStyles[i]"></div>
        </div>
      </div>
    </Transition>

    <!-- ============================================
         主角色容器（Level 2 + Level 3 布局）
         ============================================ -->
    <div 
      class="character-container"
      :style="{ '--size': size + 'px' }"
      :class="[
        `mood-${mood}`,
        `level-${levelTier}`,
        { 'is-hovered': isHovered, 'is-interactive': interactive }
      ]"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="handleCharacterClick"
    >
      <!-- Layer 2: 角色头像 -->
      <div class="character-avatar">
        <div class="character-body">
          <!-- 头部 -->
          <div class="head">
            <!-- 头发 -->
            <div class="hair"></div>
            
            <!-- 脸部 -->
            <div class="face">
              <!-- 左眼 -->
              <div class="eye eye-left">
                <div class="pupil"></div>
                <div class="eye-shine"></div>
              </div>
              
              <!-- 右眼 -->
              <div class="eye eye-right">
                <div class="pupil"></div>
                <div class="eye-shine"></div>
              </div>
              
              <!-- 腮红 -->
              <div class="blush blush-left"></div>
              <div class="blush blush-right"></div>
              
              <!-- 嘴巴 -->
              <div :class="mouthClass"></div>
            </div>
          </div>

          <!-- 身体/毛衣 -->
          <div class="body">
            <div class="sweater">
              <!-- 爱心装饰 -->
              <div class="heart"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Layer 3: 统计条带 -->
      <div v-if="showStats" class="character-stats">
        <!-- 等级徽章 -->
        <div class="level-badge">
          <div class="badge-number">LV {{ level }}</div>
          <div class="badge-stars">
            <span v-for="i in starsToShow" :key="`star-${i}`" class="star">⭐</span>
          </div>
        </div>

        <!-- 经验条 -->
        <div class="exp-bar-container">
          <div class="exp-bar-background">
            <div 
              class="exp-bar-fill"
              :style="{ 
                width: `${expProgress}%`,
                '--mood-color': getMoodColor()
              }"
            ></div>
            <!-- 即将升级时的脉冲效果 -->
            <div 
              v-if="isNearLevelUp"
              class="exp-bar-pulse"
              :style="{ width: `${expProgress}%` }"
            ></div>
          </div>
          <div class="exp-text">{{ exp }}/{{ nextExpRequired }}</div>
        </div>
      </div>
    </div>

    <!-- 台词气泡（可选） -->
    <Transition name="bubble-fade">
      <div v-if="showBubble" class="speech-bubble">
        {{ bubbleText }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'

// ============================================
// Props 定义
// ============================================
const props = defineProps({
  // 成长系统
  level: {
    type: Number,
    default: 1,
  },
  exp: {
    type: Number,
    default: 0,
  },
  
  // 情绪系统
  mood: {
    type: String,
    default: 'idle',
    validator: (value) => ['happy', 'tired', 'stressed', 'idle'].includes(value),
  },
  
  // 展示控制
  size: {
    type: Number,
    default: 120,
  },
  showStats: {
    type: Boolean,
    default: true,
  },
  showBubble: {
    type: Boolean,
    default: false,
  },
  bubbleText: {
    type: String,
    default: '',
  },
  
  // 交互开关
  interactive: {
    type: Boolean,
    default: false,
  },
})

// ============================================
// Emits 定义
// ============================================
const emit = defineEmits(['level-up', 'character-clicked', 'mood-changed'])

// ============================================
// 常量配置
// ============================================
const CHARACTER_CONFIG = {
  baseExpRequired: 100,
  expGrowthRate: 1.2,
  maxLevel: 10,
}

// ============================================
// 响应式数据
// ============================================
const isHovered = ref(false)
const showLevelUpAnimation = ref(false)
const previousLevel = ref(props.level)
const particleStyles = reactive({})

// ============================================
// Computed 计算属性
// ============================================

// 升级所需经验
const nextExpRequired = computed(() => {
  const base = CHARACTER_CONFIG.baseExpRequired
  const rate = CHARACTER_CONFIG.expGrowthRate
  return Math.round(base * Math.pow(rate, props.level - 1))
})

// 经验进度百分比
const expProgress = computed(() => {
  return Math.min(Math.round((props.exp / nextExpRequired.value) * 100), 100)
})

// 等级颜色分级（用于样式类名）
const levelTier = computed(() => {
  if (props.level <= 3) return 'junior'
  if (props.level <= 6) return 'middle'
  return 'senior'
})

// 星星显示个数（每3级一星，最多5星）
const starsToShow = computed(() => {
  return Math.min(Math.ceil(props.level / 2), 5)
})

// 是否即将升级（经验 > 90%）
const isNearLevelUp = computed(() => expProgress.value >= 90)

// ============================================
// 工具函数
// ============================================

/**
 * 获取心情对应的颜色值
 */
function getMoodColor() {
  const moodColorMap = {
    happy: 'var(--color-success)',
    tired: 'var(--color-warning)',
    stressed: 'var(--color-error)',
    idle: 'var(--color-text-muted)',
  }
  return moodColorMap[props.mood] || moodColorMap.idle
}

/**
 * 获取嘴巴表情类名（基于心情）
 */
const mouthClass = computed(() => {
  const baseClass = 'mouth'
  const moodMap = {
    happy: 'mouth mouth-happy',
    tired: 'mouth mouth-tired',
    stressed: 'mouth mouth-stressed',
    idle: 'mouth mouth-idle',
  }
  return moodMap[props.mood] || baseClass
})

/**
 * 处理角色点击
 */
function handleCharacterClick() {
  if (!props.interactive) return
  
  // 触发弹跳动画
  const container = document.querySelector('.character-container')
  if (container) {
    container.classList.add('click-bounce')
    setTimeout(() => {
      container.classList.remove('click-bounce')
    }, 400)
  }
  
  emit('character-clicked', {
    level: props.level,
    mood: props.mood,
    exp: props.exp,
  })
}

/**
 * 生成彩粒子样式
 */
function generateParticleStyles() {
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2
    const distance = 60 + Math.random() * 40
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    const delay = Math.random() * 0.3
    const duration = 1 + Math.random() * 0.5

    particleStyles[i] = {
      '--tx': `${x}px`,
      '--ty': `${y}px`,
      '--delay': `${delay}s`,
      '--duration': `${duration}s`,
      '--color': ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98'][Math.floor(Math.random() * 4)],
    }
  }
}

/**
 * 触发升级动画
 */
function triggerLevelUpAnimation() {
  generateParticleStyles()
  showLevelUpAnimation.value = true
  
  // 2秒后隐藏升级提示
  setTimeout(() => {
    showLevelUpAnimation.value = false
  }, 2000)
}

// ============================================
// Watch 监听
// ============================================

// 监听等级变化（通过exp间接）
watch(
  () => props.exp,
  (newExp) => {
    if (newExp >= nextExpRequired.value) {
      // 记录前一个等级
      previousLevel.value = props.level
      
      // 触发升级动画
      triggerLevelUpAnimation()
      
      // 发送升级事件
      emit('level-up', {
        newLevel: props.level + 1,
        bonusExp: newExp - nextExpRequired.value,
      })
    }
  }
)

// 监听心情变化
watch(
  () => props.mood,
  (newMood, oldMood) => {
    if (newMood !== oldMood) {
      emit('mood-changed', {
        oldMood,
        newMood,
      })
    }
  }
)
</script>

<style scoped>
/* ============================================
   升级提示浮层 - Layer 1
   ============================================ */
.level-up-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
}

.levelup-text {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: levelup-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.levelup-icon {
  font-size: 48px;
  animation: spin 1s linear infinite;
}

.levelup-label {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(135deg, #FFD700, #FF69B4, #87CEEB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.levelup-numbers {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  color: #5BAD7F;
}

.old-level {
  color: #6B6259;
  font-size: 20px;
}

.arrow {
  color: #FF8C42;
  font-size: 20px;
}

.new-level {
  color: #FF8C42;
  font-size: 28px;
}

/* 彩粒子 */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  pointer-events: none;
  animation: particle-burst var(--duration) ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes particle-burst {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty)) scale(0);
  }
}

@keyframes levelup-bounce {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes spin {
  0% { transform: rotateZ(0deg); }
  100% { transform: rotateZ(360deg); }
}

/* Transition */
.levelup-burst-enter-active {
  transition: all 0.3s ease;
}

.levelup-burst-leave-active {
  transition: all 0.5s ease;
}

.levelup-burst-enter-from,
.levelup-burst-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.5);
}

/* ============================================
   角色容器 - Layer 2 + Layer 3
   ============================================ */
.character-wrapper {
  position: relative;
  display: inline-block;
}

.character-container {
  width: var(--size);
  height: calc(var(--size) + 80px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: default;
  transition: transform 0.3s ease;
}

.character-container.is-interactive {
  cursor: pointer;
  user-select: none;
}

.character-container.is-hovered .character-avatar {
  transform: scale(1.08);
}

.character-container.click-bounce .character-avatar {
  animation: click-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes click-bounce {
  0% { transform: scale(1) translateY(0); }
  25% { transform: scale(0.95) translateY(-10px); }
  50% { transform: scale(1.05) translateY(-15px); }
  75% { transform: scale(0.98) translateY(-5px); }
  100% { transform: scale(1) translateY(0); }
}

/* ============================================
   头像层 - Layer 2
   ============================================ */
.character-avatar {
  flex: 0 0 auto;
  width: var(--size);
  height: var(--size);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  transition: transform 0.2s ease;
}

.character-body {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transform-origin: center;
}

/* ============================================
   心情动画
   ============================================ */
.character-container.mood-happy .character-body {
  animation: bounce-happy 0.6s ease-in-out infinite;
}

.character-container.mood-tired .character-body {
  animation: sway-tired 2s ease-in-out infinite;
}

.character-container.mood-stressed .character-body {
  animation: shake-stressed 0.4s ease-in-out infinite;
}

.character-container.mood-idle .character-body {
  animation: float-idle 3s ease-in-out infinite;
}

@keyframes bounce-happy {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes sway-tired {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-6deg); }
  75% { transform: rotate(6deg); }
}

@keyframes shake-stressed {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@keyframes float-idle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* ============================================
   头部
   ============================================ */
.head {
  position: relative;
  width: calc(var(--size) * 0.6);
  height: calc(var(--size) * 0.65);
  margin-bottom: calc(var(--size) * 0.05);
}

/* 头发 */
.hair {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4A3728 0%, #5A4738 50%, #4A3728 100%);
  border-radius: 50% 50% 45% 45%;
  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 脸部 */
.face {
  position: absolute;
  inset: 20%;
  background: #FFD4B8;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

/* ============================================
   眼睛
   ============================================ */
.eye {
  position: absolute;
  width: calc(var(--size) * 0.12);
  height: calc(var(--size) * 0.14);
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 35%;
  transition: all 0.3s ease;
}

.eye-left {
  left: 25%;
}

.eye-right {
  right: 25%;
}

.pupil {
  width: 50%;
  height: 50%;
  background: #000000;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.eye-shine {
  position: absolute;
  width: 30%;
  height: 30%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  top: 8%;
  left: 15%;
}

/* 不同心情的眼睛 */
.character-container.mood-happy .pupil {
  display: none;
}

.character-container.mood-happy .eye {
  height: calc(var(--size) * 0.08);
  border-radius: 0 0 50% 50%;
  background: #000000;
}

.character-container.mood-tired .eye {
  height: calc(var(--size) * 0.08);
  background: #3D3530;
  border-radius: 50% 50% 20% 20%;
  overflow: hidden;
}

.character-container.mood-tired .pupil {
  opacity: 0.3;
}

.character-container.mood-stressed .pupil {
  transform: scaleY(1.5);
}

/* ============================================
   腮红
   ============================================ */
.blush {
  position: absolute;
  width: calc(var(--size) * 0.15);
  height: calc(var(--size) * 0.12);
  background: rgba(255, 150, 160, 0.4);
  border-radius: 50%;
  top: 50%;
  transition: all 0.3s ease;
}

.blush-left {
  left: 15%;
}

.blush-right {
  right: 15%;
}

.character-container.mood-happy .blush {
  background: rgba(255, 150, 160, 0.6);
  width: calc(var(--size) * 0.18);
  height: calc(var(--size) * 0.15);
}

.character-container.mood-tired .blush {
  background: rgba(150, 150, 150, 0.3);
}

/* ============================================
   嘴巴
   ============================================ */
.mouth {
  position: absolute;
  width: calc(var(--size) * 0.12);
  height: calc(var(--size) * 0.06);
  bottom: 25%;
  border: 2px solid #2C2C2C;
  border-top: none;
  border-radius: 0 0 50% 50%;
  transition: all 0.3s ease;
}

/* happy */
.mouth-happy {
  height: calc(var(--size) * 0.08) !important;
  border-radius: 0 0 60% 60% !important;
}

/* tired */
.mouth-tired {
  border-radius: 50% 50% 0 0 !important;
  border-top: 2px solid #2C2C2C !important;
  border-bottom: none !important;
  transform: scaleY(0.5) !important;
}

/* stressed */
.mouth-stressed {
  border-radius: 50% 50% 0 0 !important;
  border-top: 2px solid #F08080 !important;
  border-bottom: none !important;
  width: calc(var(--size) * 0.1) !important;
}

/* idle */
.mouth-idle {
  opacity: 0.7;
}

/* ============================================
   身体/毛衣
   ============================================ */
.body {
  position: relative;
  width: calc(var(--size) * 0.5);
  height: calc(var(--size) * 0.4);
}

.sweater {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #F5F0EA;
  border-radius: 20% 20% 50% 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08),
              inset 0 1px 2px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* 爱心装饰 */
.heart {
  position: relative;
  width: calc(var(--size) * 0.08);
  height: calc(var(--size) * 0.08);
}

.heart::before,
.heart::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #FFB6C1;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.heart::before {
  left: -25%;
}

.heart::after {
  right: -25%;
}

.heart {
  clip-path: polygon(50% 100%, 0% 60%, 0% 25%, 25% 0%, 50% 25%, 75% 0%, 100% 25%, 100% 60%);
}

.character-container.mood-happy .heart::before,
.character-container.mood-happy .heart::after {
  animation: heart-beat 0.6s ease-in-out infinite;
}

@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* ============================================
   统计条带 - Layer 3
   ============================================ */
.character-stats {
  flex: 0 0 auto;
  width: 100%;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: stats-slide-up 0.4s ease-out;
}

@keyframes stats-slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 等级徽章 */
.level-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.badge-number {
  font-size: 14px;
  font-weight: bold;
  color: #5BAD7F;
  letter-spacing: 0.5px;
}

.badge-stars {
  display: flex;
  gap: 2px;
  justify-content: center;
  font-size: 12px;
}

.star {
  display: inline-block;
  animation: star-twinkle 2s ease-in-out infinite;
}

.star:nth-child(1) { animation-delay: 0s; }
.star:nth-child(2) { animation-delay: 0.2s; }
.star:nth-child(3) { animation-delay: 0.4s; }
.star:nth-child(4) { animation-delay: 0.6s; }
.star:nth-child(5) { animation-delay: 0.8s; }

@keyframes star-twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

/* 等级颜色主题 */
.character-container.level-junior .badge-number {
  color: #5B9FBD;
}

.character-container.level-middle .badge-number {
  color: #9B7EBD;
}

.character-container.level-senior .badge-number {
  color: #FFB74D;
}

/* 经验条 */
.exp-bar-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exp-bar-background {
  position: relative;
  width: 100%;
  height: 12px;
  background: #EDE8E0;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.exp-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #5BAD7F, #7AC77F);
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 8px rgba(91, 173, 127, 0.3);
}

/* 心情颜色变化经验条 */
.character-container.mood-happy .exp-bar-fill {
  background: linear-gradient(90deg, #7AC77F, #98FB98);
}

.character-container.mood-tired .exp-bar-fill {
  background: linear-gradient(90deg, #FFB84D, #FFC700);
}

.character-container.mood-stressed .exp-bar-fill {
  background: linear-gradient(90deg, #F08080, #FF6B6B);
}

/* 脉冲效果（即将升级）*/
.exp-bar-pulse {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  animation: pulse-glow 1s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(91, 173, 127, 0.7);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(91, 173, 127, 0);
  }
}

.exp-text {
  font-size: 11px;
  color: #9E9189;
  text-align: center;
  letter-spacing: 0.3px;
}

/* ============================================
   台词气泡
   ============================================ */
.speech-bubble {
  position: absolute;
  top: calc(var(--size) * -0.5);
  left: 50%;
  transform: translateX(-50%);
  background: #FFFFFF;
  border: 2px solid #5BAD7F;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 12px;
  color: #3D3530;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  pointer-events: none;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #FFFFFF;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #5BAD7F;
}

.bubble-fade-enter-active,
.bubble-fade-leave-active {
  transition: all 0.3s ease;
}

.bubble-fade-enter-from,
.bubble-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* ============================================
   响应式调整
   ============================================ */
@media (max-width: 600px) {
  .character-stats {
    padding-top: 8px;
    gap: 6px;
  }

  .badge-number {
    font-size: 12px;
  }

  .badge-stars {
    font-size: 10px;
  }

  .exp-bar-background {
    height: 10px;
  }

  .exp-text {
    font-size: 10px;
  }
}
</style>
