<template>
  <div class="app-layout">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <!-- Logo区 -->
      <div class="sidebar-logo">
        <div class="logo-icon">🐟</div>
        <div class="logo-text-wrap">
          <div class="logo-title">摸鱼日记</div>
          <div class="logo-tag">科研搭子</div>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item-active': isActive(item.path) }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <div v-if="isActive(item.path)" class="nav-indicator"></div>
        </router-link>
      </nav>

      <!-- 底部用户卡片：使用真实图片头像 -->
      <div class="sidebar-user">
        <div class="user-avatar">
          <!-- 真实图片头像，随系统设置实时更新 -->
          <img
            v-if="avatarUrl && !avatarLoadError"
            :src="avatarUrl"
            class="avatar-img"
            alt="avatar"
            @error="avatarLoadError = true"
          />
          <div v-else class="avatar-emoji">👤</div>
        </div>
        <div class="user-info">
          <p class="user-nickname">{{ userNickname }}</p>
          <p class="user-level">Lv.{{ userStore.level }}</p>
          <p class="user-title">{{ userStore.equippedTitle }}</p>
        </div>
        <div class="user-status"></div>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="content-area">
      <div class="breadcrumb">
        <span class="breadcrumb-text">{{ currentPageLabel }}</span>
      </div>
      <Transition name="fade-in" mode="out-in">
        <div :key="$route.path" class="content-wrapper">
          <router-view />
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = inject('userStore') as any

// ── 头像真实图片逻辑 ──────────────────────────────────────
const currentAvatarId = ref('female')
const avatarLoadError = ref(false)

function loadProfile() {
  // 优先读 moyu_user_profile（保存设置时写入的）
  const saved = localStorage.getItem('moyu_user_profile')
  if (saved) {
    try {
      const p = JSON.parse(saved)
      // avatar 字段存的是 'male' 或 'female'
      currentAvatarId.value = p.avatar || 'female'
      return
    } catch {}
  }
  // 兼容旧的 moyuSettings
  const settings = localStorage.getItem('moyuSettings')
  if (settings) {
    try {
      const p = JSON.parse(settings)
      if (p.avatar === 'male') currentAvatarId.value = 'male'
      else currentAvatarId.value = 'female'
    } catch {}
  }
}

// 监听系统设置保存事件，实时同步
function onProfileUpdated(e: any) {
  avatarLoadError.value = false
  const avatar = e.detail?.avatar
  currentAvatarId.value = (avatar === 'male') ? 'male' : 'female'
}

onMounted(() => {
  loadProfile()
  window.addEventListener('moyu-profile-updated', onProfileUpdated)
})

onUnmounted(() => {
  window.removeEventListener('moyu-profile-updated', onProfileUpdated)
})

// 计算真实头像图片路径
const avatarUrl = computed(() => {
  const file = currentAvatarId.value === 'male'
    ? 'profile-male.png'
    : 'profile-female.png'
  try {
    return new URL(`../assets/avatars/${file}`, import.meta.url).href
  } catch {
    return ''
  }
})
// ─────────────────────────────────────────────────────────

const navItems = [
  { path: '/',            label: '摸鱼大厅', icon: '🏠' },
  { path: '/mood',        label: '情绪日记', icon: '😊' },
  { path: '/report',      label: '摸鱼报表', icon: '📊' },
  { path: '/achievements',label: '成就墙',   icon: '🏆' },
  { path: '/settings',    label: '系统设置', icon: '⚙️' },
]

const pageLabels: Record<string, string> = {
  '/':             '摸鱼大厅',
  '/mood':         '情绪日记',
  '/report':       '摸鱼报表',
  '/achievements': '成就墙',
  '/settings':     '系统设置',
}

const userNickname = computed(() => userStore.nickname)
const isActive = (path: string) => route.path === path
const currentPageLabel = computed(() => pageLabels[route.path] || '摸鱼大厅')
</script>

<style scoped>
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: var(--color-bg);
  overflow: hidden;
}

/* 左侧导航栏 */
.sidebar {
  width: 220px;
  background-color: #FFFFFF;
  border-right: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 1px 0 8px rgba(61, 53, 48, 0.04);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid var(--color-border-light);
}
.logo-icon { font-size: 28px; }
.logo-text-wrap { display: flex; flex-direction: column; }
.logo-title {
  font-size: 18px; font-weight: 800; color: #3D3530;
  letter-spacing: -0.5px; line-height: 1.2; margin: 0;
}
.logo-tag {
  display: inline-block; background: #E8F5EE; color: #5BAD7F;
  font-size: 11px; padding: 2px 8px; border-radius: 10px;
  font-weight: 600; margin-top: 3px;
}

.sidebar-nav {
  flex: 1; padding: 8px 0; overflow-y: auto;
  display: flex; flex-direction: column; gap: 0;
}
.nav-item {
  display: flex; align-items: center; gap: 12px;
  height: 52px; padding: 0 12px; margin: 0 8px;
  border-radius: var(--radius-sm);
  color: var(--color-text); text-decoration: none;
  transition: all 200ms ease; position: relative; cursor: pointer;
  font-size: var(--font-size-base);
}
.nav-item:hover { background-color: var(--color-bg-green); color: var(--color-main); }
.nav-item-active {
  background-color: var(--color-bg-green); color: var(--color-main);
  font-weight: var(--font-weight-semibold);
}
.nav-icon { font-size: 20px; flex-shrink: 0; width: 20px; text-align: center; }
.nav-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nav-indicator {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 4px; height: 24px; background-color: var(--color-main);
  border-radius: 0 2px 2px 0;
}

/* ── 底部用户卡片 ── */
.sidebar-user {
  display: flex; align-items: center; gap: 12px;
  padding: 12px; margin: 0 8px 16px 8px;
  background-color: var(--color-bg-light);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-light);
  position: relative;
}

.user-avatar {
  flex-shrink: 0;
  width: 48px; height: 48px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background-color: #FFE8D6;
  border: 2px solid var(--color-main);
  overflow: hidden;
}

/* 真实图片头像 */
.avatar-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

/* 图片加载失败时的 emoji 占位 */
.avatar-emoji {
  font-size: 24px;
  line-height: 1;
}

.user-info { flex: 1; min-width: 0; }
.user-nickname {
  margin: 0; font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold); color: var(--color-text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.user-level {
  margin: 2px 0 0; font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.user-title {
  margin: 0; font-size: 11px; color: #FF8C42;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font-weight: 600;
}
.user-status {
  position: absolute; bottom: 8px; right: 8px;
  width: 8px; height: 8px;
  background-color: var(--color-success); border-radius: 50%;
  border: 2px solid #FFFFFF;
  box-shadow: 0 0 4px rgba(122, 199, 127, 0.5);
}

/* 右侧内容区 */
.content-area {
  flex: 1; display: flex; flex-direction: column;
  overflow: hidden; background-color: var(--color-bg);
}
.breadcrumb {
  height: 40px; padding: 0 24px;
  display: flex; align-items: center;
  font-size: var(--font-size-sm); color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border-light);
  background-color: #FFFFFF;
}
.breadcrumb-text { font-weight: var(--font-weight-medium); color: var(--color-text-secondary); }
.content-wrapper {
  flex: 1; overflow-y: auto; padding: 24px;
  display: flex; flex-direction: column;
}

/* 滚动条 */
.sidebar::-webkit-scrollbar,
.content-wrapper::-webkit-scrollbar { width: 6px; }
.sidebar::-webkit-scrollbar-track,
.content-wrapper::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb,
.content-wrapper::-webkit-scrollbar-thumb {
  background: var(--color-main); border-radius: 3px;
}

/* 过渡动画 */
.fade-in-enter-active, .fade-in-leave-active { transition: opacity 150ms ease; }
.fade-in-enter-from, .fade-in-leave-to { opacity: 0; }
.fade-in-enter-to, .fade-in-leave-from { opacity: 1; }
</style>