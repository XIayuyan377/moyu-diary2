<template>
  <div class="calendar-heatmap">
    <!-- 标题 -->
    <div class="heatmap-header">
      <h3 class="heatmap-title">🔥 打卡热力</h3>
      <span class="heatmap-date">{{ currentMonth }}</span>
    </div>

    <!-- 周天标签 -->
    <div class="weekdays-row">
      <div v-for="day in weekLabels" :key="day" class="weekday-label">
        {{ day }}
      </div>
    </div>

    <!-- 热力图网格 -->
    <div class="heatmap-grid">
      <div
        v-for="day in calendarDays"
        :key="`${day.date}`"
        class="heatmap-cell"
        :class="[
          `intensity-${day.intensity}`,
          { 'today': day.isToday },
        ]"
        :title="`${day.date}: ${day.checkinCount} 次打卡`"
        @mouseenter="hoveredDay = day"
        @mouseleave="hoveredDay = null"
      >
        <span class="cell-number">{{ day.dateNum }}</span>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="heatmap-tooltip" v-if="hoveredDay">
      <div class="tooltip-content">
        <div class="tooltip-date">{{ hoveredDay.date }}</div>
        <div class="tooltip-count">{{ hoveredDay.checkinCount }} 次打卡</div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="heatmap-legend">
      <span class="legend-label">少</span>
      <div class="legend-scale">
        <div class="legend-item intensity-0" />
        <div class="legend-item intensity-1" />
        <div class="legend-item intensity-2" />
        <div class="legend-item intensity-3" />
        <div class="legend-item intensity-4" />
      </div>
      <span class="legend-label">多</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// =====================================
// 状态
// =====================================
const hoveredDay = ref(null)

// =====================================
// 计算属性
// =====================================

const weekLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const currentMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月`
})

// 生成日历数据（模拟）
const calendarDays = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dateStr = date.toLocaleDateString('zh-CN')
    
    // 模拟打卡数据（随机 0-5）
    const checkinCount = Math.floor(Math.random() * 6)
    
    // 强度级别
    let intensity = 0
    if (checkinCount === 0) intensity = 0
    else if (checkinCount === 1) intensity = 1
    else if (checkinCount <= 2) intensity = 2
    else if (checkinCount <= 3) intensity = 3
    else intensity = 4
    
    days.push({
      dateNum: i,
      date: dateStr,
      checkinCount,
      intensity,
      isToday: i === today.getDate(),
    })
  }
  return days
})
</script>

<style scoped>
.calendar-heatmap {
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 标题 */
.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.heatmap-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #2d3748;
}

.heatmap-date {
  font-size: 12px;
  color: #718096;
  font-weight: 500;
}

/* 周天标签 */
.weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday-label {
  text-align: center;
  font-size: 10px;
  color: #a0aec0;
  font-weight: 600;
}

/* 热力网格 */
.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 12px;
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 强度样式 */
.heatmap-cell.intensity-0 {
  background: #f0f4f8;
  color: #cbd5e0;
}

.heatmap-cell.intensity-1 {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #22543d;
}

.heatmap-cell.intensity-2 {
  background: linear-gradient(135deg, #68d391 0%, #48bb78 100%);
  color: #1e3a1f;
}

.heatmap-cell.intensity-3 {
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  color: white;
}

.heatmap-cell.intensity-4 {
  background: linear-gradient(135deg, #22543d 0%, #1e3a1f 100%);
  color: white;
  box-shadow: 0 0 8px rgba(34, 84, 61, 0.4);
}

/* 今天高亮 */
.heatmap-cell.today {
  transform: scale(1.08);
  box-shadow: 0 0 8px rgba(91, 173, 127, 0.5);
  border-color: #5BAD7F;
}

.heatmap-cell:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 提示 */
.heatmap-tooltip {
  position: fixed;
  background: #2d3748;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tooltip-date {
  font-weight: 600;
}

.tooltip-count {
  font-size: 11px;
  opacity: 0.9;
}

/* 图例 */
.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 11px;
  color: #718096;
}

.legend-label {
  font-weight: 600;
}

.legend-scale {
  display: flex;
  gap: 3px;
}

.legend-item {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.legend-item.intensity-0 {
  background: #f0f4f8;
}

.legend-item.intensity-1 {
  background: #c6f6d5;
}

.legend-item.intensity-2 {
  background: #68d391;
}

.legend-item.intensity-3 {
  background: #38a169;
}

.legend-item.intensity-4 {
  background: #22543d;
}

@media (max-width: 768px) {
  .calendar-heatmap {
    padding: 12px;
  }

  .heatmap-title {
    font-size: 13px;
  }

  .heatmap-grid {
    gap: 2px;
  }

  .heatmap-cell {
    font-size: 8px;
  }
}
</style>
