<template>
  <div class="meditation-monitor">
    <!-- ═══════════════════════════════════════════════════════════
         冥想卡片
         ═══════════════════════════════════════════════════════════ -->
    <div class="meditation-card">
      <!-- 标题 -->
      <div class="meditation-header">
        <h3 class="card-title">🧘 学术冥想</h3>
        <span class="tier-badge" :class="`tier-${weeklyTier.emoji}`">
          {{ weeklyTier.emoji }} {{ weeklyTier.name }}
        </span>
      </div>

      <!-- 本周统计 -->
      <div class="stats-section">
        <div class="stat-box">
          <span class="stat-icon">⏱️</span>
          <div class="stat-content">
            <span class="stat-value">{{ weeklyStats.totalHours }}</span>
            <span class="stat-label">本周冥想时长</span>
          </div>
        </div>

        <div class="stat-box">
          <span class="stat-icon">📅</span>
          <div class="stat-content">
            <span class="stat-value">{{ weeklyStats.recordDays }}</span>
            <span class="stat-label">记录天数</span>
          </div>
        </div>

        <div class="stat-box">
          <span class="stat-icon">📊</span>
          <div class="stat-content">
            <span class="stat-value">{{ dailyAverage }}</span>
            <span class="stat-label">日均冥想</span>
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar-wrapper">
          <div class="progress-bar" :style="{ width: meditationProgress + '%' }"></div>
        </div>
        <span class="progress-text">{{ meditationProgress }}%</span>
      </div>

      <!-- 冥想评语 -->
      <div class="comment-box">
        <p class="comment-text">💭 "{{ meditationComment }}"</p>
      </div>

      <!-- 输入区 -->
      <div class="input-section">
        <label class="input-label">记录今天的冥想</label>
        <div class="input-group">
          <input
            v-model.number="todayMinutes"
            type="number"
            class="time-input"
            placeholder="输入分钟数"
            min="0"
            max="1440"
            @keyup.enter="recordToday"
          />
          <span class="input-unit">分钟</span>
          <button class="btn-record" @click="recordToday">记录</button>
        </div>
      </div>

      <!-- 快捷按钮 -->
      <div class="quick-buttons">
        <button class="quick-btn" @click="recordToday(15)">15分</button>
        <button class="quick-btn" @click="recordToday(30)">30分</button>
        <button class="quick-btn" @click="recordToday(60)">1小时</button>
        <button class="quick-btn" @click="recordToday(120)">2小时</button>
      </div>

      <!-- 期间数据 -->
      <div class="period-tabs">
        <button
          class="tab-btn"
          :class="{ active: activePeriod === 'week' }"
          @click="activePeriod = 'week'"
        >
          周报
        </button>
        <button
          class="tab-btn"
          :class="{ active: activePeriod === 'month' }"
          @click="activePeriod = 'month'"
        >
          月报
        </button>
      </div>

      <!-- 期间报告 -->
      <div v-if="activePeriod === 'week'" class="period-report">
        <h4>📚 本周冥想总结</h4>
        <div class="report-text">
          <p>
            <strong>冥想总时长：</strong>{{ weeklyStats.totalHours }} 小时
          </p>
          <p>
            <strong>记录天数：</strong>{{ weeklyStats.recordDays }} 天
          </p>
          <p>
            <strong>冥想指数：</strong>
            <span class="tier-label">{{ weeklyTier.emoji }} {{ weeklyTier.name }}</span>
          </p>
          <p class="comment-line">
            <em>"{{ meditationComment }}"</em>
          </p>
        </div>
      </div>

      <div v-if="activePeriod === 'month'" class="period-report">
        <h4>📚 本月冥想总结</h4>
        <div class="report-text">
          <p>
            <strong>冥想总时长：</strong>{{ monthlyStats.totalHours }} 小时
          </p>
          <p>
            <strong>记录天数：</strong>{{ monthlyStats.recordDays }} 天
          </p>
          <p>
            <strong>冥想指数：</strong>
            <span class="tier-label">{{ monthlyTier.emoji }} {{ monthlyTier.name }}</span>
          </p>
          <p class="comment-line">
            <em>"{{ monthlyComment }}"</em>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MeditationTracker, MEDITATION_TIERS } from '../data/meditationStats.ts'

// ═══════════════════════════════════════════════════════════
// 数据状态
// ═══════════════════════════════════════════════════════════

const tracker = ref(new MeditationTracker())
const todayMinutes = ref(0)
const activePeriod = ref('week')

// ═══════════════════════════════════════════════════════════
// 计算属性
// ═══════════════════════════════════════════════════════════

/**
 * 本周统计
 */
const weeklyStats = computed(() => {
  return tracker.value.getWeeklyStats()
})

/**
 * 本月统计
 */
const monthlyStats = computed(() => {
  return tracker.value.getMonthlyStats()
})

/**
 * 本周冥想等级
 */
const weeklyTier = computed(() => {
  return tracker.value.calculateTier(weeklyStats.value.totalHours)
})

/**
 * 本月冥想等级
 */
const monthlyTier = computed(() => {
  return tracker.value.calculateTier(monthlyStats.value.totalHours)
})

/**
 * 冥想评语（本周）
 */
const meditationComment = computed(() => {
  return tracker.value.getMeditationComment(weeklyStats.value.totalHours)
})

/**
 * 冥想评语（本月）
 */
const monthlyComment = computed(() => {
  return tracker.value.getMeditationComment(monthlyStats.value.totalHours)
})

/**
 * 冥想进度百分比（相对于钻石等级的6小时）
 */
const meditationProgress = computed(() => {
  return Math.min(100, Math.round((weeklyStats.value.totalHours / 6) * 100))
})

/**
 * 日均冥想时间（格式化）
 */
const dailyAverage = computed(() => {
  const minutes = Math.round(weeklyStats.value.averagePerDay)
  if (minutes === 0) return '0分钟'
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h${mins}m` : `${hours}小时`
})

// ═══════════════════════════════════════════════════════════
// 方法
// ═══════════════════════════════════════════════════════════

/**
 * 记录今天的冥想
 */
const recordToday = (minutes = null) => {
  const minutesToRecord = minutes !== null ? minutes : todayMinutes.value

  if (minutesToRecord <= 0) {
    alert('请输入有效的冥想时间')
    return
  }

  tracker.value.recordMeditation(null, minutesToRecord)

  // 清空输入
  if (minutes === null) {
    todayMinutes.value = 0
  }

  // 可以此处触发成就检查等其他逻辑
  checkAchievements()
}

/**
 * 检查冥想成就
 */
const checkAchievements = () => {
  const dailyData = tracker.value.getDailyMeditation()

  // 检查是否达到"冥想大师"成就（单日3小时）
  if (dailyData.hours >= 3) {
    triggerAchievement('fish_master')
  }
}

/**
 * 触发成就解锁（可发送事件给父组件）
 */
const triggerAchievement = (achievementId) => {
  console.log(`成就解锁: ${achievementId}`)
  // 可以发送事件或调用父组件方法
}

// ═══════════════════════════════════════════════════════════
// 生命周期
// ═══════════════════════════════════════════════════════════

onMounted(() => {
  // 初始化时加载数据
  tracker.value.loadFromStorage()
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   冥想卡片 - 主样式
   ═══════════════════════════════════════════════════════════ */

.meditation-monitor {
  width: 100%;
}

.meditation-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border: 2px solid #81c784;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.15);
  transition: all 0.3s ease;
}

.meditation-card:hover {
  box-shadow: 0 6px 16px rgba(129, 199, 132, 0.25);
}

/* 标题 */
.meditation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
}

.tier-badge {
  background: white;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #81c784;
  color: #2e7d32;
}

.tier-badge.tier-🥉 {
  background: #fff3e0;
  border-color: #ffb74d;
  color: #e65100;
}

.tier-badge.tier-🥈 {
  background: #eceff1;
  border-color: #90caf9;
  color: #01579b;
}

.tier-badge.tier-🥇 {
  background: #fff8e1;
  border-color: #fbc02d;
  color: #f57f17;
}

.tier-badge.tier-💎 {
  background: #f3e5f5;
  border-color: #ce93d8;
  color: #6a1b9a;
}

/* 统计区 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-box {
  background: white;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid #c8e6c9;
}

.stat-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #2e7d32;
}

.stat-label {
  font-size: 11px;
  color: #999;
  font-weight: 500;
}

/* 进度条 */
.progress-container {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.progress-bar-wrapper {
  flex: 1;
  height: 12px;
  background: #c8e6c9;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #a5d6a7;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #66bb6a 0%, #43a047 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #2e7d32;
  min-width: 35px;
  text-align: right;
}

/* 评语框 */
.comment-box {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border-left: 4px solid #81c784;
  border-radius: 6px;
}

.comment-text {
  margin: 0;
  font-size: 13px;
  color: #333;
  font-style: italic;
  line-height: 1.4;
}

/* 输入区 */
.input-section {
  margin-bottom: 12px;
}

.input-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.time-input {
  flex: 1;
  border: 1px solid #a5d6a7;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.time-input:focus {
  outline: none;
  border-color: #66bb6a;
  box-shadow: 0 0 0 3px rgba(102, 187, 106, 0.1);
}

.input-unit {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

.btn-record {
  background: #81c784;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-record:hover {
  background: #66bb6a;
  transform: translateY(-2px);
}

/* 快捷按钮 */
.quick-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.quick-btn {
  background: white;
  border: 1px solid #a5d6a7;
  border-radius: 6px;
  padding: 8px 0;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #2e7d32;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  background: #e8f5e9;
  border-color: #66bb6a;
  transform: scale(1.05);
}

/* 标签页 */
.period-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #c8e6c9;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #999;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #666;
}

.tab-btn.active {
  color: #2e7d32;
  border-bottom-color: #81c784;
}

/* 期间报告 */
.period-report {
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #c8e6c9;
}

.period-report h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #2e7d32;
  font-weight: 600;
}

.report-text {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.report-text p {
  margin: 0 0 8px 0;
}

.report-text strong {
  color: #333;
  font-weight: 600;
}

.tier-label {
  background: #e8f5e9;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid #a5d6a7;
}

.comment-line {
  margin-top: 12px !important;
  padding: 8px 12px;
  background: #f1f8e9;
  border-radius: 4px;
  border-left: 3px solid #81c784;
}

.comment-line em {
  color: #2e7d32;
  font-style: italic;
}
</style>
