<template>
  <div class="clock-in-container" :class="{ 'clock-out-mode': isClockOutMode }">
    <!-- ═══════════════════════════════════════════════════════════
         上班打卡模式
         ═══════════════════════════════════════════════════════════ -->
    <template v-if="!isClockOutMode">
      <div class="clock-in-wrapper">
        <!-- 顶部：滚滚 + 气泡 -->
        <div class="panda-section">
          <Panda
            :size="130"
            :mood="pandaMood"
            :outfit="pandaOutfit"
            :showBubble="false"
          />
          <!-- 气泡提示 -->
          <div class="greeting-bubble" :class="{ 'show': showGreeting }">
            <div class="bubble-content">{{ bubbleText }}</div>
            <div class="bubble-tail"></div>
          </div>
        </div>

        <!-- 中部信息区 -->
        <div class="info-section">
          <!-- 日期 -->
          <div class="date-display">
            <h1 class="date-text">{{ currentDate }}</h1>
          </div>

          <!-- 星期 + 倒计时 -->
          <div class="weekday-info">
            <p class="weekday-text">{{ weekdayText }}</p>
            <p class="countdown-text">{{ countdownText }}</p>
          </div>

          <!-- 励志一句 -->
          <div class="motivation-box">
            <p class="motivation-text">{{ motivationText }}</p>
          </div>
        </div>

        <!-- 打卡按钮区 -->
        <div class="button-section">
          <button class="clock-in-btn active" @click="handleClockIn">
            {{ clockInText }}
          </button>
          <p class="btn-subtitle">{{ clockInSubtitle }}</p>
        </div>
      </div>

      <!-- 成功卡片 -->
      <Transition name="result-card-fade">
        <div v-if="showResultCard" class="result-card-overlay">
          <div class="result-card">
            <!-- 成功标题 -->
            <div class="result-header">
              <h2 class="result-title">打卡成功 ✓</h2>
            </div>

            <!-- 毒鸡汤 -->
            <div class="result-content">
              <p class="result-toxic">{{ resultToxic }}</p>
              <p class="result-exp-label">{{ expLabel }}</p>
            </div>

            <!-- 滚滚小头像 -->
            <div class="result-panda">
              <Panda
                :size="60"
                :mood="'happy'"
                :outfit="pandaOutfit"
                :showBubble="false"
              />
            </div>
          </div>
        </div>
      </Transition>

      <!-- 彩色纸屑 -->
      <div v-show="showConfetti" class="confetti-container">
        <div
          v-for="(particle, index) in confettiParticles"
          :key="index"
          class="confetti"
          :style="{
            left: particle.x + '%',
            top: particle.y + '%',
            backgroundColor: particle.color,
            animationDelay: particle.delay + 's',
            animationDuration: particle.duration + 's'
          }"
        ></div>
      </div>
    </template>

    <!-- ═══════════════════════════════════════════════════════════
         下班打卡模式
         ═══════════════════════════════════════════════════════════ -->
    <template v-else>
      <div class="clock-out-wrapper">
        <!-- 背景渐变 -->
        <div class="warm-gradient-bg"></div>

        <!-- 滚滚跑出来 -->
        <div class="panda-entrance">
          <Panda
            :size="150"
            :mood="'celebrating'"
            :outfit="pandaOutfit"
            :showBubble="false"
          />
        </div>

        <!-- 大字从上方掉落 -->
        <Transition name="title-drop">
          <div v-if="showClockOutTitle" class="clock-out-title-container">
            <h1 class="clock-out-title">{{ clockOutGreeting }}</h1>
          </div>
        </Transition>

        <!-- 副标题打字机效果 -->
        <Transition name="subtitle-fade">
          <div v-if="showClockOutSubtitle" class="clock-out-subtitle-container">
            <p class="clock-out-subtitle">{{ typingText }}</p>
          </div>
        </Transition>

        <!-- 数据卡片 -->
        <Transition name="data-card-fade">
          <div v-if="showDataCard" class="data-cards-container">
            <div class="data-card">
              <div class="data-label">{{ dataLabels.duration }}</div>
              <div class="data-value">{{ dailyData.duration }}</div>
            </div>

            <div class="data-card">
              <div class="data-label">{{ dataLabels.tasksCompleted }}</div>
              <div class="data-value">{{ dailyData.tasksCompleted }}项</div>
              <div class="data-secondary">未完成：{{ dailyData.tasksRemaining }}项</div>
            </div>

            <div class="data-card">
              <div class="data-label">{{ dataLabels.favoriteApp }}</div>
              <div class="data-value">{{ dailyData.favoriteApp }}</div>
              <div class="data-secondary">陪伴{{ dailyData.appDuration }}</div>
            </div>

            <div class="data-card">
              <div class="data-label">{{ dataLabels.meditation }}</div>
              <div class="data-value">{{ dailyData.meditation }}</div>
              <div class="data-status" :class="dailyData.meditationStatus">
                {{ meditationStatusText }}
              </div>
            </div>

            <div class="data-card exp-card">
              <div class="data-label">{{ dataLabels.dailyExp }}</div>
              <div class="data-value exp-value">+{{ dailyData.totalExp }}</div>
            </div>
          </div>
        </Transition>

        <!-- 底部按钮 -->
        <div class="clock-out-button-section">
          <button class="clock-out-btn" @click="handleCloseClockOut">
            {{ clockOutButton }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Panda from '../components/Panda.vue'
import {
  copywriting,
  getRandomCopywriting,
  getWeekdayTip,
  getDaysToWeekend
} from '../../utils/copywriting'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 页面模式切换
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const isClockOutMode = ref(false)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 上班打卡 - 数据
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const pandaMood = ref<'normal' | 'happy' | 'celebrating'>('normal')
const pandaOutfit = computed(() => {
  return localStorage.getItem('moyu_panda_outfit') || 'normal'
})
const showGreeting = ref(true)
const bubbleText = ref('')
const showResultCard = ref(false)
const showConfetti = ref(false)

// 当前时间
const currentDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})

// 星期和倒计时
const weekdayText = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[dayOfWeek]
})

const countdownText = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  return getDaysToWeekend(dayOfWeek).text
})

// 励志文案
const motivationText = ref('')

// 打卡按钮文案
const clockInText = ref(copywriting.clockInButton)
const clockInSubtitle = ref(copywriting.clockInSubtitle)

// 结果卡片
const resultToxic = ref('')
const expLabel = computed(() => copywriting.expTitle)

// 彩色纸屑
const confettiParticles = ref<Array<{
  x: number
  y: number
  color: string
  delay: number
  duration: number
}>>([])

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 下班打卡 - 数据
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const showClockOutTitle = ref(false)
const showClockOutSubtitle = ref(false)
const showDataCard = ref(false)
const typingText = ref('')
const typingIndex = ref(0)

const clockOutGreeting = copywriting.clockOutGreeting
const clockOutButton = copywriting.clockOutButton
const dataLabels = copywriting.dataLabels

// 每日数据（实际应该从API获取）
const dailyData = ref({
  duration: '8h 32min',
  tasksCompleted: 5,
  tasksRemaining: 2,
  favoriteApp: 'VS Code',
  appDuration: '4h 15min',
  meditation: '25min',
  meditationStatus: 'healthy',
  totalExp: 285
})

const meditationStatusText = computed(() => {
  const statusMap = {
    healthy: '合理范围',
    needReview: '需反思',
    excessive: '过度了'
  }
  return statusMap[dailyData.value.meditationStatus as keyof typeof statusMap] || '合理范围'
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 方法
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 处理上班打卡
 */
const handleClockIn = async () => {
  // 1. 按钮弹性缩放
  const btn = document.querySelector('.clock-in-btn') as HTMLElement
  btn?.classList.add('bounce')

  await new Promise(resolve => setTimeout(resolve, 200))

  // 2. 滚滚切换为happy，创建彩色纸屑
  pandaMood.value = 'happy'
  createConfetti()
  showConfetti.value = true

  // 3. 显示结果卡片
  resultToxic.value = getRandomCopywriting(copywriting.successToxic)
  await new Promise(resolve => setTimeout(resolve, 400))
  showResultCard.value = true

  // 4. 2.5秒后回退
  await new Promise(resolve => setTimeout(resolve, 2500))
  transitionToHome()
}

/**
 * 创建彩色纸屑
 */
const createConfetti = () => {
  const colors = ['#5BAD7F', '#FF8C42', '#FFFFFF']
  const particles: typeof confettiParticles.value = []

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 1
    })
  }

  confettiParticles.value = particles
}

/**
 * 处理下班打卡动画序列
 */
const playClockOutAnimation = async () => {
  // 1. 滚滚弹跳进入
  await new Promise(resolve => setTimeout(resolve, 200))

  // 2. 标题掉落
  showClockOutTitle.value = true
  await new Promise(resolve => setTimeout(resolve, 400))

  // 3. 打字机效果
  showClockOutSubtitle.value = true
  const text = getRandomCopywriting(copywriting.clockOutTexts)
  await typeText(text)
  await new Promise(resolve => setTimeout(resolve, 300))

  // 4. 数据卡片弹入
  showDataCard.value = true
}

/**
 * 打字机效果
 */
const typeText = async (text: string) => {
  typingText.value = ''
  for (let i = 0; i < text.length; i++) {
    typingText.value += text[i]
    await new Promise(resolve => setTimeout(resolve, 50))
  }
}

/**
 * 过渡到主界面
 */
const transitionToHome = () => {
  // 这里应该导航回主界面
  // router.push('/')
  // 或者发出事件给父组件
}

/**
 * 关闭下班打卡
 */
const handleCloseClockOut = () => {
  isClockOutMode.value = false
  resetClockOut()
}

/**
 * 重置下班状态
 */
const resetClockOut = () => {
  showClockOutTitle.value = false
  showClockOutSubtitle.value = false
  showDataCard.value = false
  typingText.value = ''
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 初始化
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
onMounted(() => {
  // 初始化随机文案
  bubbleText.value = getRandomCopywriting(copywriting.greetings)
  motivationText.value = getRandomCopywriting(copywriting.motivations)

  // 模拟：检查是否应该显示下班界面
  // 实际应该从状态管理或API获取
})

// 外部可调用的方法：切换到下班模式
const switchToClockOut = async () => {
  isClockOutMode.value = true
  await new Promise(resolve => setTimeout(resolve, 100))
  playClockOutAnimation()
}

// 暴露方法给父组件
defineExpose({
  switchToClockOut
})
</script>

<style scoped lang="scss">
.clock-in-container {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  &.clock-out-mode {
    background: linear-gradient(135deg, #FAF7F2 0%, #FFF0E6 100%);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 上班打卡样式
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.clock-in-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  max-width: 600px;
  width: 100%;
  animation: breathe 6s ease-in-out infinite;
}

// 呼吸感动画
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.98);
    opacity: 0.95;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 顶部滚滚区
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.panda-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;

  .greeting-bubble {
    position: absolute;
    top: -40px;
    right: -60px;
    background: var(--color-bg-white, white);
    border: 2px solid var(--color-main);
    border-radius: 20px 20px 20px 5px;
    padding: 12px 16px;
    font-size: 14px;
    color: var(--color-text);
    max-width: 160px;
    white-space: nowrap;
    box-shadow: 0 4px 12px var(--color-shadow);
    opacity: 0;
    transform: translateY(-10px);
    animation: bubble-enter 0.6s ease-out forwards;

    &.show {
      animation: bubble-enter 0.6s ease-out forwards;
    }

    .bubble-tail {
      position: absolute;
      bottom: -8px;
      left: 15px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-top: 8px solid var(--color-main);
    }
  }
}

@keyframes bubble-enter {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 中部信息区
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

.date-display {
  .date-text {
    font-size: 48px;
    font-weight: bold;
    color: var(--color-text);
    margin: 0;
    letter-spacing: 2px;
  }
}

.weekday-info {
  .weekday-text {
    font-size: 20px;
    color: var(--color-text);
    margin: 0 0 8px 0;
    font-weight: 600;
  }

  .countdown-text {
    font-size: 16px;
    color: var(--color-text-secondary);
    margin: 0;
  }
}

.motivation-box {
  .motivation-text {
    font-size: 18px;
    color: var(--color-text-secondary);
    margin: 0;
    padding: 16px 24px;
    background: rgba(91, 173, 127, 0.08);
    border-left: 4px solid var(--color-main);
    border-radius: 8px;
    line-height: 1.6;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 打卡按钮
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.button-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .clock-in-btn {
    width: 260px;
    height: 60px;
    border-radius: 30px;
    background: var(--color-main);
    color: white;
    border: none;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(91, 173, 127, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(91, 173, 127, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    &.bounce {
      animation: btn-bounce 0.6s ease;
    }
  }
}

@keyframes btn-bounce {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
  }
  75% {
    transform: scale(0.97);
  }
}

.btn-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
  font-style: italic;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 成功卡片
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.result-card-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(61, 53, 48, 0.3);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.result-card {
  background: var(--color-bg-card);
  border-radius: 24px;
  padding: 40px 32px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 20px 60px var(--color-shadow-dark);
  position: relative;
  animation: card-spring-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes card-spring-in {
  0% {
    transform: translateY(100px) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.result-header {
  text-align: center;
  margin-bottom: 24px;

  .result-title {
    font-size: 32px;
    color: var(--color-success);
    margin: 0;
    font-weight: bold;
  }
}

.result-content {
  text-align: center;
  margin-bottom: 24px;

  .result-toxic {
    font-size: 18px;
    color: var(--color-text);
    margin: 0 0 16px 0;
    line-height: 1.6;
  }

  .result-exp-label {
    font-size: 14px;
    color: var(--color-success);
    margin: 0;
    font-weight: 600;
  }
}

.result-panda {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 彩色纸屑
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 500;
}

.confetti {
  position: fixed;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  pointer-events: none;
  animation: fall 3s ease-in forwards;
}

@keyframes fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 下班打卡样式
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.clock-out-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 40px 20px;
  z-index: 2000;
}

.warm-gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #FAF7F2 0%, #FFF0E6 100%);
  z-index: -1;
}

.panda-entrance {
  animation: panda-bounce-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes panda-bounce-in {
  0% {
    transform: translateY(200%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.clock-out-title-container {
  .clock-out-title {
    font-size: 56px;
    font-weight: bold;
    color: var(--color-text);
    margin: 0;
    letter-spacing: 2px;
  }
}

.clock-out-subtitle-container {
  .clock-out-subtitle {
    font-size: 20px;
    color: var(--color-text-secondary);
    margin: 0;
    max-width: 500px;
    text-align: center;
    line-height: 1.6;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 数据卡片
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.data-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 700px;
}

.data-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  animation: data-card-appear 0.6s ease-out forwards;

  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }

  &:nth-child(4) {
    animation-delay: 0.3s;
  }

  &:nth-child(5) {
    animation-delay: 0.4s;
  }
}

.exp-card {
  background: linear-gradient(135deg, rgba(124, 199, 127, 0.1), rgba(91, 173, 127, 0.1));
  border-color: rgba(91, 173, 127, 0.3);
}

@keyframes data-card-appear {
  0% {
    transform: translateY(20px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.data-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-value {
  font-size: 28px;
  color: var(--color-main);
  font-weight: bold;
  margin-bottom: 8px;
}

.exp-value {
  font-size: 32px;
  color: var(--color-success);
}

.data-secondary {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.data-status {
  font-size: 13px;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  display: inline-block;

  &.healthy {
    background: rgba(124, 199, 127, 0.15);
    color: var(--color-success);
  }

  &.needReview {
    background: rgba(255, 184, 77, 0.15);
    color: var(--color-warning);
  }

  &.excessive {
    background: rgba(240, 128, 128, 0.15);
    color: var(--color-error);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 下班按钮
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.clock-out-button-section {
  margin-top: 40px;

  .clock-out-btn {
    padding: 16px 48px;
    border-radius: 24px;
    background: var(--color-main);
    color: white;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(91, 173, 127, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(91, 173, 127, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 过渡动画
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
.result-card-fade-enter-active {
  animation: result-fade-in 0.4s ease-out;
}

.result-card-fade-leave-active {
  animation: result-fade-out 0.3s ease-in;
}

@keyframes result-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes result-fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.title-drop-enter-active {
  animation: title-drop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes title-drop-in {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.subtitle-fade-enter-active {
  animation: subtitle-fade-in 0.5s ease-out;
}

@keyframes subtitle-fade-in {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.data-card-fade-enter-active {
  animation: data-cards-fade-in 0.6s ease-out;
}

@keyframes data-cards-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
