<template>
  <div class="stat-card" :class="`trend-${trendClass}`">
    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 图标 -->
      <div class="card-icon">{{ icon }}</div>

      <!-- 文字内容 -->
      <div class="card-text">
        <p class="card-title">{{ title }}</p>
        <p class="card-value">{{ value }}</p>
      </div>
    </div>

    <!-- 趋势指示 -->
    <div class="card-trend">
      <span class="trend-badge" :class="trendClass">{{ trend }}</span>
    </div>

    <!-- 背景装饰 -->
    <div class="card-decoration" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  value: string
  trend: string
  trendClass?: 'positive' | 'negative' | 'neutral'
}

withDefaults(defineProps<Props>(), {
  trendClass: 'neutral',
})
</script>

<style scoped>
.stat-card {
  position: relative;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-card.trend-positive {
  border-color: rgba(72, 187, 120, 0.2);
  background: linear-gradient(135deg, #f0fff4 0%, #f9fffd 100%);
}

.stat-card.trend-negative {
  border-color: rgba(245, 101, 101, 0.2);
  background: linear-gradient(135deg, #fff5f5 0%, #fffdfd 100%);
}

.stat-card.trend-neutral {
  border-color: rgba(160, 174, 192, 0.2);
  background: linear-gradient(135deg, #f7fafc 0%, #f0f4f8 100%);
}

/* 卡片内容 */
.card-content {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.card-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, rgba(91, 173, 127, 0.1), rgba(91, 173, 127, 0.05));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.card-text {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  margin: 4px 0 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

/* 趋势 */
.card-trend {
  display: flex;
  justify-content: flex-end;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.trend-badge.positive {
  background: #c6f6d5;
  color: #22543d;
}

.trend-badge.negative {
  background: #fed7d7;
  color: #742a2a;
}

.trend-badge.neutral {
  background: #e2e8f0;
  color: #2d3748;
}

/* 背景装饰 */
.card-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(91, 173, 127, 0.1), transparent);
  border-radius: 50%;
  pointer-events: none;
}

@media (max-width: 768px) {
  .stat-card {
    padding: 12px;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  .card-value {
    font-size: 20px;
  }

  .card-title {
    font-size: 11px;
  }
}
</style>
