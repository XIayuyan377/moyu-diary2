<template>
  <div class="advisor-radar-widget">
    <!-- ═══════════════════════════════════════════════════════════
         导师信息卡片
         ═══════════════════════════════════════════════════════════ -->
    <div class="radar-card">
      <!-- 标题行 -->
      <div class="radar-header">
        <span class="radar-title">导师雷达</span>
        <button
          class="radar-edit-btn"
          @click="showEditModal = true"
          title="编辑导师昵称"
        >
          ⚙️
        </button>
      </div>

      <!-- 导师昵称显示 -->
      <div class="advisor-name">
        <span class="name-label">{{ advisorName }}</span>
      </div>

      <!-- 状态指示区 -->
      <div class="radar-status" :class="`status-${statusType}`">
        <div class="status-text">
          <span v-if="statusType === 'safe'" class="status-emoji">✨</span>
          <span v-else-if="statusType === 'warning'" class="status-emoji">⚠️</span>
          <span v-else class="status-emoji">🔴</span>

          <span class="status-message">{{ statusMessage }}</span>
        </div>

        <!-- 距离计时器 -->
        <div class="days-counter">
          <span v-if="daysSinceContact > 0" class="days-number">
            {{ daysSinceContact }} 天
          </span>
          <span v-else class="days-number">今日</span>
        </div>
      </div>

      <!-- 操作按钮区 -->
      <div class="radar-actions">
        <button class="action-btn btn-contact" @click="recordContact">
          📞 老板出现了！
        </button>
        <button class="action-btn btn-message" @click="recordMessage">
          💬 收到消息
        </button>
        <button class="action-btn btn-check" @click="openLastContact">
          🔍 查看记录
        </button>
      </div>

      <!-- 上次联系时间显示 -->
      <div class="last-contact-info">
        <span class="info-label">上次联系：</span>
        <span class="info-value">{{ lastContactTimeDisplay }}</span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         编辑导师名称的模态框
         ═══════════════════════════════════════════════════════════ -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑导师昵称</h3>
          <button class="modal-close" @click="showEditModal = false">✕</button>
        </div>
        <div class="modal-body">
          <input
            v-model="editAdvisorName"
            type="text"
            class="input-field"
            placeholder="输入导师昵称（默认：老板）"
            @keyup.enter="saveAdvisorName"
          />
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showEditModal = false">
            取消
          </button>
          <button class="btn-confirm" @click="saveAdvisorName">
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         吓一跳动画的滚滚（收到消息时）
         ═══════════════════════════════════════════════════════════ -->
    <div v-if="showScareAnimation" class="scare-animation">
      <div class="panda-scared">( ◕ 益 ◕ )</div>
      <transition name="fade-out">
        <div v-if="scareTimeLeft" class="scare-bubble">
          加油，装作很努力的样子
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ═══════════════════════════════════════════════════════════
// 数据状态
// ═══════════════════════════════════════════════════════════

// 导师信息
const advisorName = ref('老板')
const editAdvisorName = ref('')
const lastContactTime = ref(null)

// UI状态
const showEditModal = ref(false)
const showScareAnimation = ref(false)
const scareTimeLeft = ref(0)

// ═══════════════════════════════════════════════════════════
// 计算属性
// ═══════════════════════════════════════════════════════════

/**
 * 计算距离最后联系过去了多少天
 */
const daysSinceContact = computed(() => {
  if (!lastContactTime.value) return -1
  const lastDate = new Date(lastContactTime.value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  lastDate.setHours(0, 0, 0, 0)
  return Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
})

/**
 * 状态类型判断（safe / warning / danger）
 */
const statusType = computed(() => {
  if (daysSinceContact.value < 0) return 'safe'
  if (daysSinceContact.value === 0) return 'safe'
  if (daysSinceContact.value <= 3) return 'warning'
  return 'danger'
})

/**
 * 状态提示信息
 */
const statusMessage = computed(() => {
  if (daysSinceContact.value < 0) return '尚未记录'
  if (daysSinceContact.value === 0) return `今日收到${advisorName.value}消息 · 保命模式激活`
  if (daysSinceContact.value <= 7) {
    return `${advisorName.value}消失第 ${daysSinceContact.value} 天 · 保持警惕`
  }
  return `${advisorName.value}已失踪 ${daysSinceContact.value} 天！要主动汇报吗？`
})

/**
 * 最后联系时间的显示格式
 */
const lastContactTimeDisplay = computed(() => {
  if (!lastContactTime.value) return '尚未记录'
  const date = new Date(lastContactTime.value)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// ═══════════════════════════════════════════════════════════
// 方法
// ═══════════════════════════════════════════════════════════

/**
 * 保存导师名称
 */
const saveAdvisorName = () => {
  const newName = editAdvisorName.value.trim()
  if (newName) {
    advisorName.value = newName
    localStorage.setItem('advisorName', newName)
  }
  showEditModal.value = false
}

/**
 * 记录导师最后联系时间（主动打给导师）
 */
const recordContact = () => {
  const now = new Date()
  lastContactTime.value = now.toISOString()
  localStorage.setItem('lastAdvisorContact', lastContactTime.value)
  
  // 弹出反馈气泡
  showRewardBubble('已记录联系时间！')
}

/**
 * 记录收到导师消息（导师主动联系）
 */
const recordMessage = () => {
  const now = new Date()
  lastContactTime.value = now.toISOString()
  localStorage.setItem('lastAdvisorContact', lastContactTime.value)
  
  // 触发吓一跳动画
  triggerScareAnimation()
}

/**
 * 吓一跳动画
 */
const triggerScareAnimation = () => {
  showScareAnimation.value = true
  scareTimeLeft.value = 3
  
  const interval = setInterval(() => {
    scareTimeLeft.value--
    if (scareTimeLeft.value <= 0) {
      clearInterval(interval)
      showScareAnimation.value = false
    }
  }, 1000)
}

/**
 * 查看详细记录
 */
const openLastContact = () => {
  if (lastContactTime.value) {
    alert(`上次联系时间：${lastContactTimeDisplay.value}`)
  } else {
    alert('还未记录过联系时间')
  }
}

/**
 * 显示奖励气泡（暂时）
 */
const showRewardBubble = (message) => {
  // TODO: 可以调用父组件的方法或事件来显示全局气泡
  console.log('奖励信息:', message)
}

// ═══════════════════════════════════════════════════════════
// 生命周期
// ═══════════════════════════════════════════════════════════

onMounted(() => {
  // 从本地存储加载数据
  const savedAdvisorName = localStorage.getItem('advisorName')
  if (savedAdvisorName) {
    advisorName.value = savedAdvisorName
  }

  const savedLastContact = localStorage.getItem('lastAdvisorContact')
  if (savedLastContact) {
    lastContactTime.value = savedLastContact
  }
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   导师雷达卡片 - 主样式
   ═══════════════════════════════════════════════════════════ */

.advisor-radar-widget {
  position: relative;
}

.radar-card {
  background: linear-gradient(135deg, #fff5e6 0%, #fffbf0 100%);
  border: 2px solid #e8d4b8;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(240, 180, 100, 0.15);
  transition: all 0.3s ease;
}

.radar-card:hover {
  box-shadow: 0 6px 16px rgba(240, 180, 100, 0.25);
}

/* 标题行 */
.radar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.radar-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c2416;
  letter-spacing: 1px;
}

.radar-edit-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.radar-edit-btn:hover {
  background: rgba(232, 212, 184, 0.5);
  transform: scale(1.1);
}

/* 导师昵称 */
.advisor-name {
  background: rgba(255, 255, 255, 0.6);
  border-left: 4px solid #f0b464;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 6px;
}

.name-label {
  font-size: 14px;
  color: #666;
}

.name-label::before {
  content: '🎯 ';
  margin-right: 6px;
}

/* 状态指示区 */
.radar-status {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border: 2px solid #e8d4b8;
}

.radar-status.status-safe {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border-color: #81c784;
}

.radar-status.status-warning {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-color: #ffb74d;
}

.radar-status.status-danger {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-color: #ef5350;
}

.status-text {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.status-emoji {
  font-size: 18px;
  margin-right: 8px;
}

.status-message {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.days-counter {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.days-number {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

/* 操作按钮 */
.radar-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.action-btn {
  background: white;
  border: 1px solid #e8d4b8;
  border-radius: 6px;
  padding: 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}

.action-btn:hover {
  background: #f5f5f5;
  border-color: #f0b464;
  transform: translateY(-2px);
}

.action-btn.btn-contact {
  grid-column: 1;
}

.action-btn.btn-message {
  grid-column: 2;
}

.action-btn.btn-check {
  grid-column: 1 / -1;
}

/* 最后联系信息 */
.last-contact-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 8px;
  background: rgba(240, 180, 100, 0.05);
  border-radius: 6px;
  border-left: 3px solid #f0b464;
}

.info-label {
  color: #999;
}

.info-value {
  font-weight: 600;
  color: #333;
}

/* ═══════════════════════════════════════════════════════════
   编辑模态框
   ═══════════════════════════════════════════════════════════ */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  min-width: 300px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 16px;
}

.input-field {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: #f0b464;
  box-shadow: 0 0 0 3px rgba(240, 180, 100, 0.1);
}

.modal-footer {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #eee;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
}

.btn-cancel:hover {
  background: #efefef;
}

.btn-confirm {
  background: #f0b464;
  color: white;
}

.btn-confirm:hover {
  background: #e8a850;
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════════════════════════
   吓一跳动画
   ═══════════════════════════════════════════════════════════ */

.scare-animation {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  pointer-events: none;
}

.panda-scared {
  font-size: 64px;
  animation: scarePulse 0.5s ease-in-out;
}

.scare-bubble {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 2px solid #e8d4b8;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: bubbleFloat 3s ease-out forwards;
}

/* ═══════════════════════════════════════════════════════════
   动画定义
   ═══════════════════════════════════════════════════════════ */

@keyframes scarePulse {
  0% {
    transform: scale(0.8) rotate(-5deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes bubbleFloat {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-50px) scale(0.9);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-out-enter-active,
.fade-out-leave-active {
  transition: opacity 0.3s ease;
}

.fade-out-enter-from,
.fade-out-leave-to {
  opacity: 0;
}
</style>
