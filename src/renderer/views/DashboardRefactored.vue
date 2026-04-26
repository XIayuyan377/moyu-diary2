<template>
  <div class="dashboard-new">
    <!-- 欢迎卡片区 -->
    <div class="welcome-section">
      <div class="welcome-card">
        <div class="welcome-left">
          <div class="character-avatar">
            <img
              v-if="avatarUrl && !avatarError"
              :src="avatarUrl"
              alt="avatar"
              class="avatar-img"
              @error="avatarError = true"
            />
            <div v-else class="avatar-fallback">👤</div>
          </div>
          <div class="welcome-text">
            <h2 class="welcome-title">进入书房了～</h2>
            <p class="welcome-subtitle">早安，科研人！ 🥐</p>
            <p class="welcome-date">{{ todayStr }}</p>
          </div>
        </div>
        <div class="welcome-quote">
          <p class="quote-text">"每次叫醒我的不是闹钟，是截稿日期"</p>
        </div>
      </div>
    </div>

    <!-- 任务和概况区 -->
    <div class="main-content">
      <div class="left-panel">
        <div class="task-section">
          <div class="section-header">
            <h3 class="section-title">📌 今日任务</h3>
            <span class="task-count">(0/3)</span>
            <button class="btn-add-task">+ 新建任务</button>
          </div>
          <div class="task-list">
            <div class="task-item">
              <input type="checkbox" class="task-checkbox" />
              <span class="task-name">跑模型数据</span>
              <span class="task-tag task-tag-exp">实验</span>
            </div>
            <div class="task-item">
              <input type="checkbox" class="task-checkbox" />
              <span class="task-name">修改引言部分</span>
              <span class="task-tag task-tag-paper">论文</span>
            </div>
            <div class="task-item">
              <input type="checkbox" class="task-checkbox" />
              <span class="task-name">阅读 CVPR 最新文献</span>
              <span class="task-tag task-tag-paper">文献</span>
            </div>
          </div>
        </div>

        <div class="activity-section">
          <div class="activity-grid">
            <div class="activity-card"><div class="activity-icon">💧</div><div class="activity-label">该喝水了</div><div class="activity-value">-</div></div>
            <div class="activity-card"><div class="activity-icon">📝</div><div class="activity-label">记录</div><div class="activity-value">-</div></div>
            <div class="activity-card"><div class="activity-icon">⚡</div><div class="activity-label">起来走走</div><div class="activity-value">-</div></div>
            <div class="activity-card"><div class="activity-icon">😴</div><div class="activity-label">休息</div><div class="activity-value">-</div></div>
            <div class="activity-card"><div class="activity-icon">⏲️</div><div class="activity-label">番茄钟</div><div class="activity-value">25:00</div></div>
            <div class="activity-card"><div class="activity-icon">▶️</div><div class="activity-label">开始</div><div class="activity-value">-</div></div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <SidebarUserCard />

        <div class="today-overview">
          <h4 class="overview-title">今日概况</h4>
          <div class="overview-item"><span class="overview-label">在岗时长</span><span class="overview-value">0 h</span></div>
          <div class="overview-item"><span class="overview-label">完成任务</span><span class="overview-value">0</span></div>
          <div class="overview-item"><span class="overview-label">摸鱼次数</span><span class="overview-value">0 次</span></div>
          <div class="overview-item"><span class="overview-label">起身次数</span><span class="overview-value">0 次</span></div>
        </div>

        <div class="ai-tips">
          <p class="tips-text">"每个奋斗者都有梦想，可是等等，你开始了吗？"</p>
        </div>
      </div>
    </div>

    <div class="action-section">
      <button class="btn-large btn-checkin-start">🧱 开始搬砖</button>
      <button class="btn-large btn-checkin-end">🏃 光荣跑路</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SidebarUserCard from '../components/SidebarUserCard.vue'

// ── 头像同步 ──────────────────────────────
const currentAvatar = ref('female')
const avatarError = ref(false)

function loadProfile() {
  const saved = localStorage.getItem('moyu_user_profile')
  if (saved) {
    try {
      const p = JSON.parse(saved)
      currentAvatar.value = p.avatar || 'female'
      return
    } catch {}
  }
  const settings = localStorage.getItem('moyuSettings')
  if (settings) {
    try {
      const p = JSON.parse(settings)
      if (p.avatar) currentAvatar.value = p.avatar
    } catch {}
  }
}

function onProfileUpdated(e: any) {
  avatarError.value = false
  currentAvatar.value = e.detail?.avatar || 'female'
}

onMounted(() => {
  loadProfile()
  window.addEventListener('moyu-profile-updated', onProfileUpdated)
})
onUnmounted(() => {
  window.removeEventListener('moyu-profile-updated', onProfileUpdated)
})

const avatarUrl = computed(() => {
  const file = currentAvatar.value === 'male' ? 'profile-male.png' : 'profile-female.png'
  try {
    return new URL(`../assets/avatars/${file}`, import.meta.url).href
  } catch { return '' }
})

// ── 日期 ──────────────────────────────────
const todayStr = computed(() => {
  const d = new Date()
  const days = ['日','一','二','三','四','五','六']
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 星期${days[d.getDay()]}`
})
</script>

<style scoped>
.dashboard-new {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #FAF7F2 0%, #FFF5E6 100%);
  padding: 20px; overflow-y: auto;
}

.welcome-section { margin-bottom: 24px; }
.welcome-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #FFF5E6 100%);
  border-radius: 16px; padding: 20px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 2px 8px rgba(61,53,48,0.08); border: 1px solid #EDE8E0;
}
.welcome-left { display: flex; align-items: center; gap: 16px; flex: 1; }

/* 头像 */
.character-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: #FFE8D6; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.avatar-fallback { font-size: 36px; }

.user-avatar-small {
  width: 56px; height: 56px; border-radius: 50%;
  background: #FFE8D6; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.avatar-img-small { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.avatar-fallback-small { font-size: 24px; }

.welcome-text { display: flex; flex-direction: column; gap: 4px; }
.welcome-title { font-size: 18px; font-weight: 600; color: #3D3530; margin: 0; }
.welcome-subtitle { font-size: 16px; color: #5BAD7F; margin: 0; font-weight: 500; }
.welcome-date { font-size: 12px; color: #9E9189; margin: 0; }

.welcome-quote {
  flex: 1; background: #FFF0E6; border-radius: 12px; padding: 16px;
  display: flex; align-items: center; justify-content: center; margin-left: 20px;
}
.quote-text { font-size: 14px; color: #3D3530; text-align: center; margin: 0; font-weight: 500; }

.main-content { display: grid; grid-template-columns: 1fr 320px; gap: 20px; margin-bottom: 24px; }
.left-panel { display: flex; flex-direction: column; gap: 20px; }

.task-section {
  background: #FFFFFF; border-radius: 12px; padding: 20px;
  border: 1px solid #EDE8E0; box-shadow: 0 2px 8px rgba(61,53,48,0.08);
}
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; gap: 12px; }
.section-title { font-size: 16px; font-weight: 600; color: #3D3530; margin: 0; }
.task-count { font-size: 14px; color: #9E9189; }
.btn-add-task {
  background: #FF8C42; color: white; border: none; border-radius: 8px;
  padding: 8px 16px; font-size: 14px; cursor: pointer; margin-left: auto;
}
.task-list { display: flex; flex-direction: column; gap: 12px; }
.task-item {
  display: flex; align-items: center; gap: 12px; padding: 12px;
  background: #FFFAF5; border-radius: 8px; border: 1px solid #F5F0EA;
}
.task-checkbox { width: 20px; height: 20px; accent-color: #5BAD7F; }
.task-name { flex: 1; font-size: 14px; color: #3D3530; font-weight: 500; }
.task-tag { font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 500; }
.task-tag-exp { background: #E8F5EE; color: #5BAD7F; }
.task-tag-paper { background: #FFF0E6; color: #FF8C42; }

.activity-section {
  background: #FFFFFF; border-radius: 12px; padding: 20px;
  border: 1px solid #EDE8E0; box-shadow: 0 2px 8px rgba(61,53,48,0.08);
}
.activity-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.activity-card {
  background: linear-gradient(135deg, #FFFAF5, #FFF5E6);
  border-radius: 8px; padding: 12px; text-align: center;
  border: 1px solid #F5F0EA;
}
.activity-icon { font-size: 24px; margin-bottom: 8px; }
.activity-label { font-size: 12px; color: #9E9189; margin-bottom: 4px; }
.activity-value { font-size: 13px; font-weight: 600; color: #3D3530; }

.right-panel { display: flex; flex-direction: column; gap: 16px; }
.user-card {
  background: linear-gradient(135deg, #FFFAF5, #FFF0E6);
  border-radius: 12px; padding: 16px;
  border: 1px solid #EDE8E0; box-shadow: 0 2px 8px rgba(61,53,48,0.08);
}
.user-card-header { display: flex; gap: 12px; margin-bottom: 16px; }
.user-info { display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.user-name { font-size: 14px; font-weight: 600; color: #3D3530; margin: 0; }
.user-quote { font-size: 11px; color: #9E9189; margin: 0; }

.user-stats { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #EDE8E0; }
.stat-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
.stat-label { color: #9E9189; }
.stat-value { font-weight: 600; color: #3D3530; }

.user-buttons { display: flex; flex-direction: column; gap: 8px; }
.btn { padding: 10px 12px; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; }
.btn-primary { background: #FF8C42; color: white; }
.btn-secondary { background: #F0F7F0; color: #5BAD7F; border: 1px solid #E8F5EE; }

.today-overview {
  background: #FFFFFF; border-radius: 12px; padding: 16px;
  border: 1px solid #EDE8E0; box-shadow: 0 2px 8px rgba(61,53,48,0.08);
}
.overview-title { font-size: 14px; font-weight: 600; color: #3D3530; margin: 0 0 12px; }
.overview-item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
.overview-label { color: #9E9189; }
.overview-value { font-weight: 600; color: #3D3530; }

.ai-tips {
  background: linear-gradient(135deg, #FFF0E6, #FFE8D6);
  border-radius: 12px; padding: 12px;
  border: 1px solid #EDE8E0; border-left: 4px solid #FF8C42;
}
.tips-text { font-size: 12px; color: #3D3530; margin: 0; text-align: center; font-weight: 500; }

.action-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 600px; }
.btn-large {
  padding: 16px 24px; border: none; border-radius: 12px;
  font-size: 16px; font-weight: 600; cursor: pointer;
}
.btn-checkin-start { background: #5BAD7F; color: white; }
.btn-checkin-end { background: linear-gradient(135deg, #FF8C42, #FFB3A3); color: white; }
</style>