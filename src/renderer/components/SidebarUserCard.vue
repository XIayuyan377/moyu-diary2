<template>
  <div class="user-card-container">
    <div class="user-card">
      <div class="avatar-wrap">
        <img v-if="sidebarAvatarUrl" :src="sidebarAvatarUrl" class="sidebar-avatar-img" @error="onAvatarError" />
        <div v-else class="avatar-fallback">👤</div>
      </div>
      <div class="user-info">
        <p class="user-nickname">{{ userStore.nickname }}</p>
        <p class="user-level">{{ userStore.levelDisplay }}</p>
      </div>
      <button class="settings-btn" title="打开设置" @click="handleOpenSettings">⚙️</button>
    </div>

    <div class="exp-bar-container">
      <div class="exp-bar-label">
        <span>经验值</span>
        <span class="exp-number">{{ userStore.currentExp }}/{{ userStore.maxExp }}</span>
      </div>
      <div class="exp-bar-bg">
        <div class="exp-bar-fill" :style="{ width: `${userStore.expPercentage}%` }" />
      </div>
    </div>

    <div class="quick-actions">
      <button class="action-btn" @click="handleQuickAction('clock-in')">🎯 打卡</button>
      <button class="action-btn" @click="handleQuickAction('fish')">🐠 摸鱼</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const currentAvatar = ref('female')
const avatarLoadError = ref(false)

function loadProfile() {
  // 优先读 moyu_user_profile
  const saved = localStorage.getItem('moyu_user_profile')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      currentAvatar.value = parsed.avatar || 'female'
      return
    } catch {}
  }
  // 兼容旧的 moyuSettings
  const settings = localStorage.getItem('moyuSettings')
  if (settings) {
    try {
      const p = JSON.parse(settings)
      if (p.avatar) currentAvatar.value = p.avatar
    } catch {}
  }
}

function onProfileUpdated(e: any) {
  avatarLoadError.value = false
  currentAvatar.value = e.detail?.avatar || 'female'
}

onMounted(() => {
  loadProfile()
  window.addEventListener('moyu-profile-updated', onProfileUpdated)
})

onUnmounted(() => {
  window.removeEventListener('moyu-profile-updated', onProfileUpdated)
})

const sidebarAvatarUrl = computed(() => {
  if (avatarLoadError.value) return ''
  const file = currentAvatar.value === 'male' ? 'profile-male.png' : 'profile-female.png'
  try {
    return new URL(`../assets/avatars/${file}`, import.meta.url).href
  } catch { return '' }
})

function onAvatarError() {
  avatarLoadError.value = true
}

function handleOpenSettings() {
  // 导航到设置页
}

function handleQuickAction(action: string) {
  if (action === 'clock-in') {
    userStore.addExp(10)
  }
}
</script>

<style scoped>
.user-card-container {
  padding: 16px 12px;
  margin: 0 8px 16px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 12px;
  border: 1px solid rgba(91, 173, 127, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-wrap {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}

.sidebar-avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(91, 173, 127, 0.3);
}

.avatar-fallback {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-nickname {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-level {
  margin: 2px 0 0;
  font-size: 11px;
  color: #718096;
}

.settings-btn {
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
  transition: all 0.2s;
}

.settings-btn:hover {
  background: rgba(91, 173, 127, 0.1);
  transform: rotate(15deg);
}

.exp-bar-container {
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.exp-bar-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 11px;
  color: #718096;
  font-weight: 600;
}

.exp-number { color: #5BAD7F; }

.exp-bar-bg {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5BAD7F, #4a9a6f);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  background: linear-gradient(135deg, #5BAD7F, #4a9a6f);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.4);
}
</style>