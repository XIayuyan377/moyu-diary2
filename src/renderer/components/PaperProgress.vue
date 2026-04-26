<template>
  <div class="paper-progress-widget">
    <!-- ═══════════════════════════════════════════════════════════
         论文进度卡片
         ═══════════════════════════════════════════════════════════ -->
    <div class="paper-card">
      <!-- 标题 -->
      <div class="paper-header">
        <h3 class="paper-title">📝 论文进度</h3>
        <button class="header-action-btn" @click="showSettings = true" title="编辑目标">
          ⚙️
        </button>
      </div>

      <!-- 目标字数设置提示 -->
      <div v-if="targetWords === 0" class="setup-prompt">
        <p>还未设置论文目标，请先配置</p>
        <button class="btn-setup" @click="showSettings = true">
          设置目标字数 →
        </button>
      </div>

      <!-- 进度信息区（当已设置目标时显示）-->
      <template v-else>
        <!-- 进度条 -->
        <div class="progress-section">
          <div class="progress-info">
            <span class="current-words">{{ currentWords.toLocaleString() }}</span>
            <span class="progress-slash">/</span>
            <span class="target-words">{{ targetWords.toLocaleString() }}</span>
            <span class="unit">字</span>
          </div>

          <!-- 进度条 -->
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: progressPercentage + '%' }">
              <span v-if="progressPercentage > 20" class="progress-text">
                {{ progressPercentage }}%
              </span>
            </div>
          </div>

          <!-- 进度统计 -->
          <div class="progress-stats">
            <span class="stat-item">
              <span class="stat-label">剩余：</span>
              <span class="stat-value">{{ remainingWords.toLocaleString() }}</span>
              <span class="stat-unit">字</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">日均：</span>
              <span class="stat-value">{{ dailyAverageWords }}</span>
              <span class="stat-unit">字/天</span>
            </span>
          </div>
        </div>

        <!-- 预测完成信息 -->
        <div class="prediction-section" :class="`status-${statusType}`">
          <span class="prediction-emoji">{{ predictionEmoji }}</span>
          <div class="prediction-text">
            <p>{{ predictionMessage }}</p>
            <p v-if="estimatedCompletionDate" class="prediction-date">
              预计完成：{{ estimatedCompletionDate }}
            </p>
          </div>
        </div>

        <!-- 日常记录行 -->
        <div class="daily-record-section">
          <div class="record-header">
            <span>今日进度</span>
            <span class="record-date">{{ todayDateDisplay }}</span>
          </div>

          <div class="input-group">
            <input
              v-model.number="todayAddedWords"
              type="number"
              class="word-input"
              placeholder="输入今天写了多少字"
              @keyup.enter="recordTodayProgress"
            />
            <button class="btn-record" @click="recordTodayProgress" :disabled="todayAddedWords <= 0">
              📌 记录
            </button>
          </div>

          <!-- 最近7天的记录 -->
          <div class="recent-records">
            <div class="records-title">最近7天</div>
            <div class="records-list">
              <div v-for="record in recentRecords" :key="record.date" class="record-item">
                <span class="record-date-short">{{ formatDateShort(record.date) }}</span>
                <span class="record-words">+{{ record.words }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="paper-actions">
          <button class="action-btn" @click="showSettings = true">
            📊 编辑目标
          </button>
          <button class="action-btn" @click="exportReport">
            📄 导出报告
          </button>
        </div>
      </template>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         设置模态框
         ═══════════════════════════════════════════════════════════ -->
    <div v-if="showSettings" class="modal-overlay" @click="showSettings = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>论文进度设置</h3>
          <button class="modal-close" @click="showSettings = false">✕</button>
        </div>

        <div class="modal-body">
          <!-- 目标字数设置 -->
          <div class="setting-item">
            <label class="setting-label">论文目标字数（字）</label>
            <div class="input-wrapper">
              <input
                v-model.number="settingTargetWords"
                type="number"
                class="setting-input"
                placeholder="例如：30000"
                min="1000"
                max="500000"
              />
              <button
                class="preset-btn"
                @click="settingTargetWords = 30000"
                title="设为30,000字"
              >
                30K
              </button>
              <button
                class="preset-btn"
                @click="settingTargetWords = 50000"
                title="设为50,000字"
              >
                50K
              </button>
              <button
                class="preset-btn"
                @click="settingTargetWords = 100000"
                title="设为100,000字"
              >
                100K
              </button>
            </div>
          </div>

          <!-- 当前字数设置 -->
          <div class="setting-item">
            <label class="setting-label">当前字数（字）</label>
            <input
              v-model.number="settingCurrentWords"
              type="number"
              class="setting-input"
              placeholder="0"
              min="0"
            />
          </div>

          <!-- 统计信息 -->
          <div class="setting-stats">
            <div class="stat-row">
              <span class="stat-key">进度：</span>
              <span class="stat-val">{{ settingProgressPercentage }}%</span>
            </div>
            <div class="stat-row">
              <span class="stat-key">剩余：</span>
              <span class="stat-val">
                {{ (settingTargetWords - settingCurrentWords).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showSettings = false">
            取消
          </button>
          <button class="btn-confirm" @click="saveSettings">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
// ═══════════════════════════════════════════════════════════
// 数据状态
// ═══════════════════════════════════════════════════════════

// 目标和进度
const targetWords = ref(30000) // 默认3万字
const currentWords = ref(0)
const dailyRecords = ref({}) // 日期对应的字数：{ '2024-01-01': 500, ... }

// UI状态
const showSettings = ref(false)

// 设置面板的临时值
const settingTargetWords = ref(30000)
const settingCurrentWords = ref(0)

// 今日输入
const todayAddedWords = ref(0)

// ═══════════════════════════════════════════════════════════
// 计算属性
// ═══════════════════════════════════════════════════════════

/**
 * 进度百分比
 */
const progressPercentage = computed(() => {
  if (targetWords.value <= 0) return 0
  const percentage = Math.min(
    100,
    Math.round((currentWords.value / targetWords.value) * 100)
  )
  return percentage
})

/**
 * 剩余字数
 */
const remainingWords = computed(() => {
  return Math.max(0, targetWords.value - currentWords.value)
})

/**
 * 日均字数
 */
const dailyAverageWords = computed(() => {
  const totalDays = Object.keys(dailyRecords.value).length
  if (totalDays === 0) return 0
  const totalWords = Object.values(dailyRecords.value).reduce((a, b) => a + b, 0)
  return Math.round(totalWords / totalDays)
})

/**
 * 预测状态类型
 */
const statusType = computed(() => {
  if (progressPercentage.value >= 100) return 'completed'
  if (progressPercentage.value >= 75) return 'excellent'
  if (progressPercentage.value >= 50) return 'good'
  if (progressPercentage.value >= 25) return 'fair'
  return 'start'
})

/**
 * 预测信息
 */
const predictionEmoji = computed(() => {
  const emojis = {
    completed: '🎉',
    excellent: '🚀',
    good: '✅',
    fair: '💪',
    start: '🌱',
  }
  return emojis[statusType.value]
})

const predictionMessage = computed(() => {
  if (progressPercentage.value >= 100) {
    return '恭喜！论文已完成'
  }

  if (dailyAverageWords.value <= 0) {
    return '开始记录日进度，系统将预测完成时间'
  }

  const daysRemaining = Math.ceil(remainingWords.value / dailyAverageWords.value)
  const messages = {
    completed: '论文已完成！',
    excellent: `按照目前速度，还需 ${daysRemaining} 天完成`,
    good: `继续加油，还需约 ${daysRemaining} 天`,
    fair: `保持节奏，还需约 ${daysRemaining} 天`,
    start: '开始记录进度，加油！',
  }
  return messages[statusType.value]
})

/**
 * 预计完成日期
 */
const estimatedCompletionDate = computed(() => {
  if (progressPercentage.value >= 100 || dailyAverageWords.value <= 0) {
    return null
  }

  const daysRemaining = Math.ceil(remainingWords.value / dailyAverageWords.value)
  const completionDate = new Date()
  completionDate.setDate(completionDate.getDate() + daysRemaining)
  return completionDate.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
})

/**
 * 今日日期显示
 */
const todayDateDisplay = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
})

/**
 * 最近7天的记录
 */
const recentRecords = computed(() => {
  const result = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]

    if (dailyRecords.value[dateKey]) {
      result.push({
        date: dateKey,
        words: dailyRecords.value[dateKey],
      })
    }
  }

  return result
})

/**
 * 设置面板中的进度百分比
 */
const settingProgressPercentage = computed(() => {
  if (settingTargetWords.value <= 0) return 0
  return Math.round((settingCurrentWords.value / settingTargetWords.value) * 100)
})

// ═══════════════════════════════════════════════════════════
// 方法
// ═══════════════════════════════════════════════════════════

/**
 * 格式化短日期
 */
const formatDateShort = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  })
}

/**
 * 记录今日进度
 */
const recordTodayProgress = () => {
  if (todayAddedWords.value <= 0) {
    alert('请输入有效的字数')
    return
  }

  const today = new Date().toISOString().split('T')[0]

  // 如果已有今日记录，则累计
  if (dailyRecords.value[today]) {
    dailyRecords.value[today] += todayAddedWords.value
  } else {
    dailyRecords.value[today] = todayAddedWords.value
  }

  // 更新总字数
  currentWords.value += todayAddedWords.value

  // 保存到本地存储
  saveData()

  // 清空输入框
  todayAddedWords.value = 0

  // 检查停滞警告
  checkStagnationWarning()
}

/**
 * 保存设置
 */
const saveSettings = () => {
  if (settingTargetWords.value <= 0) {
    alert('目标字数必须大于0')
    return
  }

  targetWords.value = settingTargetWords.value
  currentWords.value = settingCurrentWords.value

  // 保存到本地存储
  saveData()

  showSettings.value = false
}

/**
 * 保存数据到本地存储
 */
const saveData = () => {
  const data = {
    targetWords: targetWords.value,
    currentWords: currentWords.value,
    dailyRecords: dailyRecords.value,
  }
  localStorage.setItem('paperProgress', JSON.stringify(data))
}

/**
 * 从本地存储加载数据
 */
const loadData = () => {
  const saved = localStorage.getItem('paperProgress')
  if (saved) {
    const data = JSON.parse(saved)
    targetWords.value = data.targetWords || 30000
    currentWords.value = data.currentWords || 0
    dailyRecords.value = data.dailyRecords || {}
  }

  // 初始化设置面板的值
  settingTargetWords.value = targetWords.value
  settingCurrentWords.value = currentWords.value
}

/**
 * 检查停滞警告
 */
const checkStagnationWarning = () => {
  const today = new Date()
  let stagnationDays = 0

  for (let i = 1; i <= 3; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateKey = checkDate.toISOString().split('T')[0]

    if (!dailyRecords.value[dateKey]) {
      stagnationDays++
    } else {
      break
    }
  }
}

/**
 * 导出报告
 */
const exportReport = () => {
  const report = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 论文进度报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 总体进度
─────────────────────────────────
目标字数：${targetWords.value.toLocaleString()} 字
当前字数：${currentWords.value.toLocaleString()} 字
剩余字数：${remainingWords.value.toLocaleString()} 字
完成度：${progressPercentage.value}%

📈 速度统计
─────────────────────────────────
日均推进：${dailyAverageWords.value} 字/天
${dailyAverageWords.value > 0 ? `预计完成：${estimatedCompletionDate.value || '未来某天'}` : '暂无数据'}

📅 最近7天记录
─────────────────────────────────
${
  recentRecords.value.length === 0
    ? '暂无记录'
    : recentRecords.value.map((r) => `${r.date}: +${r.words} 字`).join('\n')
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
推送时间：${new Date().toLocaleString('zh-CN')}
  `.trim()

  // 复制到剪贴板
  navigator.clipboard.writeText(report).then(() => {
    alert('报告已复制到剪贴板')
  })
}

// ═══════════════════════════════════════════════════════════
// 生命周期
// ═══════════════════════════════════════════════════════════

onMounted(() => {
  loadData()
  checkStagnationWarning()
})

// 监听进度变化，定期检查停滞
watch(currentWords, () => {
  checkStagnationWarning()
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   论文进度卡片 - 主样式
   ═══════════════════════════════════════════════════════════ */

.paper-progress-widget {
  position: relative;
}

.paper-card {
  background: linear-gradient(135deg, #f5f1e8 0%, #faf7f0 100%);
  border: 2px solid #d4c7b0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(212, 199, 176, 0.15);
  transition: all 0.3s ease;
}

.paper-card:hover {
  box-shadow: 0 6px 16px rgba(212, 199, 176, 0.25);
}

/* 标题 */
.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.paper-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c2416;
}

.header-action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.header-action-btn:hover {
  background: rgba(212, 199, 176, 0.5);
  transform: scale(1.1);
}

/* 设置提示 */
.setup-prompt {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border: 1px solid #f9a825;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  color: #666;
}

.setup-prompt p {
  margin: 0 0 12px 0;
  font-size: 14px;
}

.btn-setup {
  background: #f9a825;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-setup:hover {
  background: #f7920f;
  transform: translateY(-2px);
}

/* 进度区 */
.progress-section {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ebe1d1;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  font-size: 14px;
}

.current-words {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.progress-slash {
  color: #999;
}

.target-words {
  color: #666;
  font-size: 14px;
}

.unit {
  color: #999;
  font-size: 12px;
}

/* 进度条 */
.progress-bar-container {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #81c784 0%, #66bb6a 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.5s ease;
  position: relative;
}

.progress-text {
  font-size: 10px;
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 进度统计 */
.progress-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.stat-item {
  display: flex;
  gap: 4px;
  align-items: baseline;
}

.stat-label {
  color: #999;
}

.stat-value {
  color: #333;
  font-weight: 600;
  font-size: 13px;
}

.stat-unit {
  color: #999;
  font-size: 11px;
}

/* 预测区 */
.prediction-section {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.prediction-section.status-completed {
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
  border-left: 4px solid #66bb6a;
}

.prediction-section.status-excellent {
  background: linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%);
  border-left: 4px solid #29b6f6;
}

.prediction-section.status-good {
  background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
  border-left: 4px solid #ffb74d;
}

.prediction-section.status-fair {
  background: linear-gradient(135deg, #f8bbd0 0%, #f48fb1 100%);
  border-left: 4px solid #ec407a;
}

.prediction-section.status-start {
  background: linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%);
  border-left: 4px solid #ba68c8;
}

.prediction-emoji {
  font-size: 24px;
  flex-shrink: 0;
}

.prediction-text {
  flex: 1;
}

.prediction-text p {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.prediction-date {
  font-size: 12px;
  color: #666;
  font-weight: 400;
}

/* 今日记录区 */
.daily-record-section {
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #ebe1d1;
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.record-date {
  color: #999;
  font-size: 12px;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.word-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.word-input:focus {
  outline: none;
  border-color: #81c784;
  box-shadow: 0 0 0 3px rgba(129, 199, 132, 0.1);
}

.btn-record {
  background: #81c784;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-record:hover:not(:disabled) {
  background: #66bb6a;
  transform: translateY(-2px);
}

.btn-record:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 最近记录 */
.recent-records {
  border-top: 1px solid #ebe1d1;
  padding-top: 12px;
}

.records-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 500;
}

.records-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 6px;
}

.record-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px;
  background: #f9f7f2;
  border-radius: 6px;
  font-size: 11px;
}

.record-date-short {
  color: #999;
}

.record-words {
  color: #81c784;
  font-weight: 600;
}

/* 操作按钮 */
.paper-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
  background: white;
  border: 1px solid #ddd;
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
  border-color: #81c784;
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════════════════════════
   模态框
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
  min-width: 320px;
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

.setting-item {
  margin-bottom: 16px;
}

.setting-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.setting-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  box-sizing: border-box;
}

.setting-input:focus {
  outline: none;
  border-color: #81c784;
  box-shadow: 0 0 0 3px rgba(129, 199, 132, 0.1);
}

.preset-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #333;
}

.preset-btn:hover {
  background: #efefef;
  border-color: #81c784;
}

.setting-stats {
  background: #f9f7f2;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 8px;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-key {
  color: #999;
}

.stat-val {
  color: #333;
  font-weight: 600;
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
  font-size: 13px;
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
  background: #81c784;
  color: white;
}

.btn-confirm:hover {
  background: #66bb6a;
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════════════════════════
   停滞警告
   ═══════════════════════════════════════════════════════════ */

.stagnation-warning {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ffccbc 0%, #ffab91 100%);
  border-left: 4px solid #ff7043;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  z-index: 999;
  animation: slideInUp 0.3s ease;
}

.warning-emoji {
  font-size: 28px;
  margin-right: 8px;
}

.stagnation-warning p {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.warning-btn {
  background: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #ff7043;
  transition: all 0.2s ease;
}

/* ═══════════════════════════════════════════════════════════
   动画
   ═══════════════════════════════════════════════════════════ */

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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
