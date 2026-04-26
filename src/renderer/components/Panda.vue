<template>
  <div class="panda-container" :style="containerStyle">
    <!-- 说话气泡 -->
    <transition name="bubble-pop">
      <div v-if="showBubble" class="speech-bubble">
        <div class="bubble-content">
          <p class="bubble-text">{{ bubbleContent }}</p>
        </div>
        <div class="bubble-tail"></div>
      </div>
    </transition>

    <!-- 主熊猫 -->
    <div class="panda-wrapper" :class="`mood-${mood}`">
      <!-- 动画容器 -->
      <div class="panda-animated" :class="[animationClass, `blinking-${isBlinking}`]">
        <!-- 头部（占整体55%高度） -->
        <div class="panda-head">
          <!-- 脑袋圆形 -->
          <div class="face-circle"></div>

          <!-- 左耳 -->
          <div class="ear ear-left">
            <div class="inner-ear"></div>
          </div>

          <!-- 右耳 -->
          <div class="ear ear-right">
            <div class="inner-ear"></div>
          </div>

          <!-- 左眼圈 -->
          <div class="eye-patch eye-left"></div>

          <!-- 右眼圈 -->
          <div class="eye-patch eye-right"></div>

          <!-- 左眼（眼白+瞳孔+高光） -->
          <div class="eye eye-left-pos">
            <div class="eye-white"></div>
            <div class="pupil"></div>
            <div class="shine"></div>
          </div>

          <!-- 右眼 -->
          <div class="eye eye-right-pos">
            <div class="eye-white"></div>
            <div class="pupil"></div>
            <div class="shine"></div>
          </div>

          <!-- 左腮红 -->
          <div class="blush blush-left"></div>

          <!-- 右腮红 -->
          <div class="blush blush-right"></div>

          <!-- 眉毛（mad时显示） -->
          <div v-if="mood === 'mad'" class="eyebrow eyebrow-left"></div>
          <div v-if="mood === 'mad'" class="eyebrow eyebrow-right"></div>

          <!-- 鼻子 -->
          <div class="nose"></div>

          <!-- 嘴巴 -->
          <div class="mouth" :class="`mouth-${mood}`"></div>
        </div>

        <!-- 身体（比头小30%） -->
        <div class="panda-body">
          <!-- 身体圆形 -->
          <div class="body-circle"></div>
          <!-- 肚皮 -->
          <div class="belly"></div>
        </div>

        <!-- 手臂 -->
        <div class="arms-container">
          <div class="arm arm-left" :class="`arm-${mood}-left`">
            <div class="hand"></div>
          </div>
          <div class="arm arm-right" :class="`arm-${mood}-right`">
            <div class="hand"></div>
          </div>
        </div>

        <!-- sleeping时的ZZZ -->
        <div v-if="mood === 'sleeping'" class="zzz-container">
          <div class="zzz zzz-1">Z</div>
          <div class="zzz zzz-2">z</div>
          <div class="zzz zzz-3">z</div>
        </div>

        <!-- celebrating时的星星 -->
        <div v-if="mood === 'celebrating'" class="stars-container">
          <div class="star star-1">✨</div>
          <div class="star star-2">✨</div>
          <div class="star star-3">✨</div>
        </div>

        <!-- working时的小眼镜 -->
        <div v-if="mood === 'working'" class="glasses">
          <div class="glass glass-left"></div>
          <div class="glass glass-right"></div>
          <div class="glass-bridge"></div>
        </div>

        <!-- mad时的脸红背景 -->
        <div v-if="mood === 'mad'" class="mad-blush"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  mood?: 'normal' | 'happy' | 'tired' | 'fishing' | 'sleeping' | 'mad' | 'celebrating' | 'working'
  size?: number
  showBubble?: boolean
  bubbleText?: string
  autoHide?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mood: 'normal',
  size: 100,
  showBubble: false,
  bubbleText: '',
  autoHide: true,
})

const isBlinking = ref(false)
const bubbleContent = ref('')
let blinkTimer: NodeJS.Timeout | null = null
let bubbleTimer: NodeJS.Timeout | null = null
let bubbleHideTimer: NodeJS.Timeout | null = null

const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: 'auto',
}))

const animationClass = computed(() => {
  return `animation-${props.mood}`
})

// 眨眼逻辑
function setupBlink() {
  clearInterval(blinkTimer!)
  blinkTimer = setInterval(() => {
    isBlinking.value = true
    setTimeout(() => {
      isBlinking.value = false
    }, 1000)
  }, 5000)
}

// 气泡文字打字机效果
function typewriterEffect(text: string) {
  bubbleContent.value = ''
  let index = 0
  const timer = setInterval(() => {
    if (index < text.length) {
      bubbleContent.value += text[index]
      index++
    } else {
      clearInterval(timer)
      // 自动隐藏
      if (props.autoHide) {
        if (bubbleHideTimer) clearTimeout(bubbleHideTimer)
        bubbleHideTimer = setTimeout(() => {
          bubbleContent.value = ''
        }, 3000)
      }
    }
  }, 40)
}

onMounted(() => {
  setupBlink()
  if (props.showBubble && props.bubbleText) {
    typewriterEffect(props.bubbleText)
  }
})

onUnmounted(() => {
  if (blinkTimer) clearInterval(blinkTimer)
  if (bubbleTimer) clearTimeout(bubbleTimer)
  if (bubbleHideTimer) clearTimeout(bubbleHideTimer)
})
</script>

<style scoped>
.panda-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family: 'PingFang SC', system-ui, sans-serif;
}

/* ===== 说话气泡 ===== */
.speech-bubble {
  position: absolute;
  top: -60px;
  right: -20px;
  background: white;
  border: 2px solid #FF8C42;
  border-radius: 16px;
  padding: 12px 16px;
  min-width: 80px;
  max-width: 160px;
  animation: bubbleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
}

.bubble-content {
  margin: 0;
}

.bubble-text {
  font-size: 13px;
  color: #3D3530;
  margin: 0;
  line-height: 1.4;
}

.bubble-tail {
  position: absolute;
  bottom: -8px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 0 solid transparent;
  border-top: 8px solid #FF8C42;
}

@keyframes bubbleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bubble-pop-enter-active,
.bubble-pop-leave-active {
  transition: all 0.3s ease;
}

.bubble-pop-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.bubble-pop-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* ===== 主容器 ===== */
.panda-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.panda-animated {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ===== 头部（55%高度） ===== */
.panda-head {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: -15%;
  z-index: 2;
}

/* 脸部基础圆形 */
.face-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 50%;
  box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.04),
              0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 1;
}

/* ===== 耳朵 ===== */
.ear {
  position: absolute;
  width: 28%;
  height: 28%;
  background: #2C2C2C;
  border-radius: 50%;
  z-index: 3;
}

.ear-left {
  top: -8%;
  left: 8%;
}

.ear-right {
  top: -8%;
  right: 8%;
}

.inner-ear {
  position: absolute;
  width: 50%;
  height: 50%;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: inset 0 2px 4px rgba(255, 182, 193, 0.4);
}

/* ===== 眼圈 ===== */
.eye-patch {
  position: absolute;
  width: 30%;
  height: 28%;
  background: #2C2C2C;
  border-radius: 50%;
  z-index: 2;
  top: 28%;
}

.eye-left {
  left: 15%;
}

.eye-right {
  right: 15%;
}

/* ===== 眼睛 ===== */
.eye {
  position: absolute;
  width: 16%;
  height: 16%;
  top: 30%;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-left-pos {
  left: 22%;
}

.eye-right-pos {
  right: 22%;
}

.eye-white {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 50%;
  position: relative;
}

.pupil {
  position: absolute;
  width: 50%;
  height: 50%;
  background: #2C2C2C;
  border-radius: 50%;
  top: 30%;
  left: 25%;
}

.shine {
  position: absolute;
  width: 30%;
  height: 30%;
  background: white;
  border-radius: 50%;
  top: 15%;
  right: 15%;
}

/* 眨眼效果 */
.blinking-true .eye-white {
  height: 3px;
  border-radius: 50%;
}

.blinking-true .pupil,
.blinking-true .shine {
  opacity: 0;
}

/* ===== 腮红 ===== */
.blush {
  position: absolute;
  width: 14%;
  height: 12%;
  background: rgba(255, 182, 193, 0.65);
  border-radius: 50%;
  z-index: 2;
  top: 48%;
}

.blush-left {
  left: 8%;
}

.blush-right {
  right: 8%;
}

/* ===== 鼻子 ===== */
.nose {
  position: absolute;
  width: 8%;
  height: 8%;
  background: #2C2C2C;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
}

/* ===== 嘴巴 ===== */
.mouth {
  position: absolute;
  width: 24%;
  height: 14%;
  top: 58%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
}

/* normal嘴巴 */
.mouth-normal {
  border: 2px solid #2C2C2C;
  border-top: none;
  border-radius: 0 0 20px 20px;
}

/* happy嘴巴 - 更大的弧 */
.mouth-happy {
  border: 2px solid #2C2C2C;
  border-top: none;
  border-radius: 0 0 24px 24px;
  height: 16%;
}

/* tired嘴巴 - 倒弧 */
.mouth-tired {
  border: 2px solid #2C2C2C;
  border-bottom: none;
  border-radius: 20px 20px 0 0;
}

/* fishing嘴巴 - O形 */
.mouth-fishing {
  width: 8%;
  height: 10%;
  border: 2px solid #2C2C2C;
  border-radius: 50%;
}

/* sleeping嘴巴 - 细线 */
.mouth-sleeping {
  border: 2px solid #2C2C2C;
  border-top: none;
  border-radius: 0 0 20px 20px;
  opacity: 0.5;
}

/* mad嘴巴 - 愤怒的线 */
.mouth-mad {
  border: 2px solid #FF3B3B;
  border-top: none;
  border-radius: 0;
  width: 32%;
}

/* celebrating嘴巴 - 大笑 */
.mouth-celebrating {
  border: 2px solid #2C2C2C;
  border-top: none;
  border-radius: 0 0 28px 28px;
  height: 18%;
}

/* working嘴巴 - 正常 */
.mouth-working {
  border: 2px solid #2C2C2C;
  border-top: none;
  border-radius: 0 0 20px 20px;
}

/* ===== 眉毛（mad） ===== */
.eyebrow {
  position: absolute;
  width: 18%;
  height: 6%;
  background: #2C2C2C;
  border-radius: 4px;
  top: 24%;
  z-index: 4;
}

.eyebrow-left {
  left: 18%;
  transform: rotate(-20deg);
}

.eyebrow-right {
  right: 18%;
  transform: rotate(20deg);
}

/* ===== 身体（比头小30%） ===== */
.panda-body {
  position: relative;
  width: 70%;
  aspect-ratio: 0.8;
  margin-top: -8%;
}

.body-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  z-index: 1;
}

.belly {
  position: absolute;
  width: 40%;
  height: 50%;
  background: rgba(200, 200, 200, 0.3);
  border-radius: 50%;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

/* ===== 手臂 ===== */
.arms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.arm {
  position: absolute;
  width: 12%;
  height: 35%;
  background: #2C2C2C;
  border-radius: 8px;
  top: 50%;
  z-index: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transform-origin: top center;
  transition: transform 0.3s ease;
}

.arm-left {
  left: -5%;
}

.arm-right {
  right: -5%;
}

.hand {
  width: 60%;
  height: 35%;
  background: #2C2C2C;
  border-radius: 50%;
  margin-bottom: -15%;
}

/* normal姿势 */
.arm-normal-left {
  transform: translateY(20px) rotate(-10deg);
}

.arm-normal-right {
  transform: translateY(20px) rotate(10deg);
}

/* happy姿势 - 双臂上举 */
.arm-happy-left {
  transform: rotate(-140deg);
}

.arm-happy-right {
  transform: rotate(140deg);
}

/* tired姿势 - 右臂托腮 */
.arm-tired-left {
  transform: translateY(20px) rotate(-10deg);
}

.arm-tired-right {
  transform: rotate(45deg);
}

/* fishing姿势 - 一只手放嘴边 */
.arm-fishing-left {
  transform: rotate(-30deg);
}

.arm-fishing-right {
  transform: rotate(90deg) translateY(-10px);
}

/* sleeping姿势 - 手臂展开 */
.arm-sleeping-left {
  transform: rotate(-90deg);
}

.arm-sleeping-right {
  transform: rotate(90deg);
}

/* mad姿势 - 愤怒的姿态 */
.arm-mad-left {
  transform: rotate(-120deg);
}

.arm-mad-right {
  transform: rotate(120deg);
}

/* celebrating姿势 - 高举 */
.arm-celebrating-left {
  transform: rotate(-150deg);
}

.arm-celebrating-right {
  transform: rotate(150deg);
}

/* working姿势 - 打字 */
.arm-working-left {
  transform: rotate(0deg);
}

.arm-working-right {
  transform: rotate(0deg) translateY(-15px);
}

/* ===== ZZZ（sleeping） ===== */
.zzz-container {
  position: absolute;
  top: -20px;
  right: -30px;
  z-index: 5;
}

.zzz {
  font-size: 16px;
  color: #9E9189;
  font-weight: 700;
  animation: zzz-float 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
  opacity: 0;
}

.zzz-1 {
  animation-delay: 0s;
}

.zzz-2 {
  animation-delay: 0.4s;
}

.zzz-3 {
  animation-delay: 0.8s;
}

@keyframes zzz-float {
  0% {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) translateX(10px);
  }
}

/* ===== 星星（celebrating） ===== */
.stars-container {
  position: absolute;
  top: -40px;
  width: 150%;
  height: 150%;
  left: -25%;
  pointer-events: none;
}

.star {
  position: absolute;
  font-size: 24px;
  animation: star-float 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

.star-1 {
  top: 10%;
  left: 10%;
}

.star-2 {
  top: 20%;
  right: 15%;
}

.star-3 {
  top: 5%;
  right: 5%;
}

@keyframes star-float {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.5) rotate(180deg) translateY(-40px);
  }
}

/* ===== 小眼镜（working） ===== */
.glasses {
  position: absolute;
  top: 28%;
  left: 50%;
  transform: translateX(-50%);
  width: 55%;
  height: 20%;
  z-index: 5;
}

.glass {
  position: absolute;
  width: 35%;
  height: 100%;
  border: 2px solid #9E9189;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

.glass-left {
  left: 0;
}

.glass-right {
  right: 0;
}

.glass-bridge {
  position: absolute;
  width: 15%;
  height: 3px;
  background: #9E9189;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* ===== 脸红背景（mad） ===== */
.mad-blush {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 100, 100, 0.08);
  border-radius: 50%;
  z-index: -1;
}

/* ===== 动画效果 ===== */

/* normal - 轻微呼吸 + 眨眼 */
.animation-normal {
  animation: breath 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

@keyframes breath {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

/* happy - 弹跳 */
.animation-happy {
  animation: bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* happy时腮红加深 */
.mood-happy .blush {
  opacity: 0.9;
}

/* tired - 眼睛半闭 + 头倾 + 摇摆 */
.animation-tired {
  animation: sway 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

.mood-tired .eye-white {
  height: 50%;
}

.mood-tired .panda-head {
  transform: rotate(8deg);
}

@keyframes sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

/* fishing - 一只眼睛半闭 */
.mood-fishing .eye-right-pos .eye-white {
  height: 50%;
}

.mood-fishing .mouth-fishing {
  left: 56%;
}

/* sleeping - 眼睛闭合 + 头倒向一侧 + 飘浮 */
.animation-sleeping {
  animation: float 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

.mood-sleeping .eye-white {
  height: 2px;
}

.mood-sleeping .panda-head {
  transform: rotate(20deg);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* mad - 皱眉 + 脸微红 + 快速抖动 */
.animation-mad {
  animation: shake 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2px);
  }
}

/* celebrating - 快速旋转 + 弹跳 */
.animation-celebrating {
  animation: celebrate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

@keyframes celebrate {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-12px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

/* working - 头微前倾 */
.animation-working {
  animation: work 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}

.mood-working .panda-head {
  transform: rotate(-5deg);
}

@keyframes work {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(-3deg);
  }
}
</style>

