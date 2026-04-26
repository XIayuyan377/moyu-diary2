<template>
  <div class="header-user-info">
    <!-- 面包屑 / 当前页面 -->
    <div class="breadcrumb">
      <span class="breadcrumb-icon">📍</span>
      <span class="breadcrumb-text">{{ currentPageLabel }}</span>
    </div>

    <!-- 分隔线 -->
    <div class="divider" />

    <!-- 用户信息卡片 -->
    <div class="user-info-card">
      <!-- 用户头像 -->
      <Avatar
        :content="avatarEmoji"
        size="sm"
        :status="userOnlineStatus"
        showStatus
      />

      <!-- 用户信息 -->
      <div class="user-details">
        <p class="detail-name">{{ userStore.nickname }}</p>
        <p class="detail-level">{{ userStore.levelDisplay }}</p>
      </div>

      <!-- 通知按钮 -->
      <button class="notify-btn" title="通知">
        🔔
        <span class="notify-badge" v-if="notificationCount > 0">
          {{ notificationCount }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import Avatar from './Avatar.vue'

// =====================================
// 状态管理
// =====================================
const route = useRoute()
const userStore = useUserStore()

// =====================================
// 本地状态
// =====================================
// 页面标签映射
const pageLabels = {
  '/': '摸鱼大厅',
  '/mood': '情绪日记',
  '/report': '摸鱼报表',
  '/achievements': '成就墙',
  '/settings': '系统设置',
  '/clock-in': '打卡',
  '/task-manager': '今日课题',
}

// 模拟通知数量
const notificationCount = computed(() => {
  return 0 // 可根据实际业务修改
})

// =====================================
// 计算属性
// =====================================

const currentPageLabel = computed(() => {
  return pageLabels[route.path] || '摸鱼日记'
})

const avatarEmoji = computed(() => {
  const avatarMap = {
    default: '👧',
    short_hair: '👩',
    boy: '🧑',
    glasses: '👓',
    graduate: '🎓',
    panda: '🐼',
  }
  return avatarMap[userStore.avatar] || '👧'
})

const userOnlineStatus = computed(() => {
  return 'online'
})
</script>

<style scoped>
.header-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
}

.breadcrumb-icon {
  font-size: 16px;
}

/* 分隔线 */
.divider {
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.08);
}

/* 用户信息卡片 */
.user-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-radius: 10px;
  border: 1px solid rgba(91, 173, 127, 0.1);
  transition: all 0.3s ease;
}

.user-info-card:hover {
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.1);
  border-color: rgba(91, 173, 127, 0.2);
}

/* 用户详情 */
.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.detail-name {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-level {
  margin: 0;
  font-size: 11px;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 通知按钮 */
.notify-btn {
  position: relative;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.notify-btn:hover {
  background: rgba(91, 173, 127, 0.1);
  transform: scale(1.05);
}

.notify-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  border: 2px solid white;
}

@media (max-width: 1024px) {
  .header-user-info {
    gap: 12px;
    padding: 10px 16px;
  }

  .breadcrumb {
    font-size: 13px;
  }

  .detail-name {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .header-user-info {
    gap: 8px;
    flex-wrap: wrap;
  }

  .divider {
    display: none;
  }

  .user-info-card {
    padding: 6px 10px;
  }

  .detail-level {
    display: none;
  }
}
</style>
