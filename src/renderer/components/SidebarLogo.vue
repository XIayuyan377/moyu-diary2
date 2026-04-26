<template>
  <div class="logo-container">
    <!-- 外圆形背景 -->
    <div class="logo-icon-wrapper">
      <!-- 图标内容 -->
      <div class="logo-icon">
        🐼
      </div>
    </div>

    <!-- 文字区域 -->
    <div class="logo-text-area">
      <!-- 主标题 -->
      <h1 class="logo-title">摸鱼日记</h1>
      
      <!-- 副标题 Tag -->
      <div class="logo-tag">科研搭子</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 纯展示组件，不需要逻辑
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 8px;
}

/* 圆形图标背景 */
.logo-icon-wrapper {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #5BAD7F 0%, #4a9a6f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.logo-icon-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(91, 173, 127, 0.4);
}

.logo-icon {
  font-size: 24px;
  font-weight: bold;
}

/* 文字区域 */
.logo-text-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 主标题 */
.logo-title {
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

/* 副标题 Tag */
.logo-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 4px 10px;
  background: linear-gradient(135deg, #E8F5EE 0%, #D4F0E8 100%);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: #2d7f5a;
  letter-spacing: 0.3px;
  border: 1px solid rgba(91, 173, 127, 0.2);
  transition: all 0.3s ease;
}

.logo-tag:hover {
  background: linear-gradient(135deg, #D4F0E8 0%, #B3E8D9 100%);
  border-color: rgba(91, 173, 127, 0.4);
}

@media (max-width: 768px) {
  .logo-container {
    padding: 12px;
    gap: 8px;
  }

  .logo-icon-wrapper {
    width: 36px;
    height: 36px;
  }

  .logo-icon {
    font-size: 20px;
  }

  .logo-title {
    font-size: 14px;
  }

  .logo-tag {
    font-size: 10px;
    padding: 3px 8px;
  }
}
</style>
