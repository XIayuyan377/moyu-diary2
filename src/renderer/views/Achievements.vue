<template>
  <div class="achievements-page">

    <!-- 顶部角色信息 -->
    <div class="profile-card">
      <!-- 头像：用真实图片替换CSS绘制 -->
      <div class="profile-avatar-wrap">
        <img
          v-if="avatarUrl && !avatarError"
          :src="avatarUrl"
          alt="avatar"
          class="profile-avatar-img"
          @error="avatarError = true"
        />
        <div v-else class="profile-avatar-fallback">👤</div>
      </div>

      <div class="profile-info">
        <div class="profile-level">Lv.{{ level }} · {{ levelTitle }}</div>
        <div class="profile-quote">"每一个勋章，都是你努力的见证"</div>
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-icon">⚡</div>
            <div class="stat-label">总经验值（EXP）</div>
            <div class="stat-val">{{ totalExp }} <span class="stat-unit">pts</span></div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-icon">🏅</div>
            <div class="stat-label">已点亮勋章</div>
            <div class="stat-val orange">{{ unlockedCount }} <span class="stat-unit">/ {{ allAchievements.length }}</span></div>
          </div>
        </div>
      </div>

      <div class="checkin-panel">
        <div class="checkin-status" :class="{ active: clockInToday }">
          <span class="checkin-icon">{{ clockInToday ? '✓' : '○' }}</span>
          <span class="checkin-label">{{ clockInToday ? '已打卡' : '未打卡' }}</span>
        </div>
        <div class="checkin-stat">
          <div class="stat-row">
            <span class="stat-key">连续打卡</span>
            <span class="stat-num">{{ continuousDays }}</span>
            <span class="stat-key">天</span>
          </div>
          <div class="stat-row">
            <span class="stat-key">今日获得</span>
            <span class="stat-num exp">+{{ todayExp }}</span>
            <span class="stat-key">EXP</span>
          </div>
        </div>
      </div>

      <div class="title-panel">
        <div class="title-label">我的称号</div>
        <div class="title-display">{{ equippedTitle }}</div>
        <div class="title-stats">
          <div class="title-stat-row">{{ clockInToday ? '✓ 今日已打卡' : '○ 未打卡' }}</div>
          <div class="title-stat-row">连续 {{ continuousDays }} 天</div>
          <div v-if="recentUnlockedAchievements.length > 0" class="title-stat-row">
            最新解锁：{{ recentUnlockedAchievements[0].emoji }} {{ recentUnlockedAchievements[0].title }}
          </div>
        </div>
        <button class="btn-switch-title" @click="showTitleSelector = true">更换称号</button>
      </div>
    </div>

    <!-- 称号选择弹窗 -->
    <div v-if="showTitleSelector" class="modal-overlay" @click.self="showTitleSelector = false">
      <div class="title-selector-modal">
        <div class="modal-title">选择佩戴的称号</div>
        <div class="title-list">
          <button
            v-for="title in availableTitles"
            :key="title"
            class="title-option"
            :class="{ selected: equippedTitle === title }"
            @click="selectTitle(title)"
          >{{ title }}</button>
        </div>
        <button class="modal-close" @click="showTitleSelector = false">关闭</button>
      </div>
    </div>

    <!-- 分类Tab -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="cat-tab"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >{{ cat.icon }} {{ cat.label }}</button>
    </div>

    <!-- 勋章网格 -->
    <div class="badge-grid">
      <div
        v-for="a in filteredAchievements"
        :key="a.id"
        class="badge-card"
        :class="{ unlocked: a.unlocked, rare: a.rare, locked: !a.unlocked }"
        @click="showDetail(a)"
      >
        <div v-if="!a.unlocked" class="badge-locked-tag">尚未</div>
        <div class="badge-icon-wrap" :class="{ 'is-locked': !a.unlocked }" :style="{ background: a.unlocked ? a.color : '#F5F5F5' }">
          <span class="badge-icon" :class="{ 'locked-icon': !a.unlocked }">{{ a.emoji }}</span>
        </div>
        <div class="badge-name">{{ a.unlocked ? a.title : '??? 神秘成就' }}</div>
        <div class="badge-desc">{{ a.unlocked ? a.desc : a.hint }}</div>
        <div v-if="a.unlocked" class="badge-date">{{ a.date }} 获得</div>
        <div v-else class="badge-progress-wrap">
          <div class="badge-progress-bg">
            <div class="badge-progress-fill" :style="{ width: (a.progress / a.target * 100) + '%' }"></div>
          </div>
          <div class="badge-progress-text">进度 {{ a.progress }} / {{ a.target }}</div>
        </div>
      </div>
    </div>

    <!-- 勋章详情弹窗 -->
    <div v-if="detailAchievement" class="modal-overlay" @click.self="detailAchievement = null">
      <div class="detail-modal">
        <div class="detail-icon-wrap" :style="{ background: detailAchievement.color }">
          <span class="detail-icon">{{ detailAchievement.emoji }}</span>
        </div>
        <div class="detail-name">{{ detailAchievement.title }}</div>
        <div class="detail-desc">{{ detailAchievement.desc }}</div>
        <div v-if="detailAchievement.unlocked" class="detail-unlocked">🎉 {{ detailAchievement.date }} 获得</div>
        <div v-else class="detail-locked">进度：{{ detailAchievement.progress }} / {{ detailAchievement.target }}</div>
        <button class="detail-close" @click="detailAchievement = null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'

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

// ── 用户数据 ──────────────────────────────
const userState = inject<any>('userState')
const level = computed(() => userState?.level || 4)
const totalExp = ref(1245)
const clockInToday = ref(true)
const continuousDays = ref(15)
const todayExp = ref(35)
const showTitleSelector = ref(false)
const equippedTitle = ref(localStorage.getItem('moyu_equipped_title') || '实验室常客')

function selectTitle(title: string) {
  equippedTitle.value = title
  localStorage.setItem('moyu_equipped_title', title)
  showTitleSelector.value = false
}

const levelTitle = computed(() => {
  const titles: Record<number, string> = {
    1:'文献复读机', 2:'文献复读机',
    3:'调参老中医', 4:'调参老中医',
    5:'发量卫士', 6:'发量卫士',
    7:'发量卫士', 8:'发量卫士',
    9:'秃头预备役', 10:'秃头预备役',
    11:'卷王附体', 12:'卷王附体', 13:'卷王附体',
    14:'科研苦行僧', 15:'科研苦行僧',
    17:'传说级打工机器', 18:'传说级打工机器',
  }
  return titles[level.value] || '打工人'
})

const activeCategory = ref('clock')
const detailAchievement = ref<any>(null)

const categories = [
  { id: 'clock',    icon: '🏅', label: '打卡勋章' },
  { id: 'research', icon: '📋', label: '科研勋章' },
  { id: 'health',   icon: '💪', label: '健康勋章' },
  { id: 'mood',     icon: '🎭', label: '情绪勋章' },
  { id: 'roll',     icon: '⚡', label: '卷王成就' },
  { id: 'fish',     icon: '🐟', label: '摸鱼成就' },
]

const allAchievements = ref([
  { id:'first',      category:'clock',    title:'第一天',         desc:'完成第一次打卡',              emoji:'⭐', color:'#FFF3C4', unlocked:true,  date:'2026-04-01', progress:1,  target:1,   rare:false, hint:'打开成就的第一扇门' },
  { id:'streak7',    category:'clock',    title:'C刊潜力股',      desc:'连续7天沉浸式搬砖',           emoji:'🔥', color:'#FFD6D6', unlocked:true,  date:'2026-04-08', progress:7,  target:7,   rare:false, hint:'坚持的力量' },
  { id:'streak30',   category:'clock',    title:'月度卷王认证',   desc:'本月连续打卡，人均劝退',      emoji:'👑', color:'#FFF3C4', unlocked:false, date:'',           progress:15, target:30,  rare:true,  hint:'一个月的坚持' },
  { id:'streak100',  category:'clock',    title:'年度常驻',       desc:'累计打卡100天',               emoji:'🏆', color:'#FFF3C4', unlocked:false, date:'',           progress:15, target:100, rare:true,  hint:'百日传说的开始' },
  { id:'early',      category:'clock',    title:'早八战士',       desc:'8点前打卡3次',                emoji:'🌅', color:'#C4EDFF', unlocked:false, date:'',           progress:1,  target:3,   rare:false, hint:'晨曦中的打卡声' },
  { id:'task10',     category:'research', title:'任务新手',       desc:'完成10个任务',                emoji:'✅', color:'#C4FFC4', unlocked:true,  date:'2026-04-10', progress:10, target:10,  rare:false, hint:'任务的第一步' },
  { id:'task100',    category:'research', title:'任务终结者',     desc:'累计完成100个任务',           emoji:'⚡', color:'#FFF3C4', unlocked:false, date:'',           progress:34, target:100, rare:true,  hint:'百个任务的征程' },
  { id:'tomato10',   category:'research', title:'Debug 仙人',     desc:'连续专注4小时，封神了',       emoji:'🍅', color:'#FFD6D6', unlocked:false, date:'',           progress:4,  target:10,  rare:false, hint:'番茄的时间魔法' },
  { id:'water50',    category:'health',   title:'补水达人',       desc:'累计喝水50次',                emoji:'💧', color:'#C4EDFF', unlocked:false, date:'',           progress:21, target:50,  rare:false, hint:'水，是生命之源' },
  { id:'stand30',    category:'health',   title:'活力打工人',     desc:'累计起身30次',                emoji:'🚶', color:'#C4FFC4', unlocked:false, date:'',           progress:12, target:30,  rare:false, hint:'每一次站起，都是爱' },
  { id:'noovert',    category:'health',   title:'准时下班',       desc:'连续5天18点前下班',           emoji:'🏃', color:'#FFD6D6', unlocked:false, date:'',           progress:2,  target:5,   rare:false, hint:'工作生活的平衡术' },
  { id:'mood7',      category:'mood',     title:'情绪记录者',     desc:'连续7天记录心情',             emoji:'🎭', color:'#E8C4FF', unlocked:false, date:'',           progress:3,  target:7,   rare:false, hint:'了解自己的每一刻' },
  { id:'chat20',     category:'mood',     title:'滚滚铁粉',       desc:'和滚滚聊天20次',              emoji:'🐼', color:'#FFD6D6', unlocked:false, date:'',           progress:8,  target:20,  rare:false, hint:'滚滚，是我最好的朋友' },
  { id:'midnight',   category:'roll',     title:'凌晨实验室常客', desc:'深夜还在发光发热',            emoji:'🌙', color:'#E8D5FF', unlocked:false, date:'',           progress:0,  target:1,   rare:true,  hint:'最深的夜里，最亮的屏幕' },
  { id:'focus4h',    category:'roll',     title:'Debug 仙人',     desc:'连续专注4小时，封神了',       emoji:'⚡', color:'#FFF3C4', unlocked:false, date:'',           progress:0,  target:1,   rare:true,  hint:'心无旁骛的时光' },
  { id:'water10',    category:'fish',     title:'带薪补水运动员', desc:'喝水也是在认真工作',          emoji:'💧', color:'#C4EDFF', unlocked:false, date:'',           progress:3,  target:10,  rare:false, hint:'水，是打工人的生命之源' },
  { id:'nap',        category:'fish',     title:'午休艺术家',     desc:'记录10次午休',                emoji:'😴', color:'#E8D5FF', unlocked:false, date:'',           progress:2,  target:10,  rare:false, hint:'午睡，是对灵魂的充电' },
  { id:'tea_time',   category:'fish',     title:'下午茶护法',     desc:'连续5天15点记录休息',         emoji:'🍵', color:'#FFF3C4', unlocked:false, date:'',           progress:1,  target:5,   rare:false, hint:'摸鱼要讲究仪式感' },
])

const availableTitles = computed(() => [
  '文献复读机','实验室常客','调参老中医',
  '发量卫士','秃头预备役','卷王附体',
  '科研苦行僧','传说级打工机器'
])

const unlockedCount = computed(() => allAchievements.value.filter(a => a.unlocked).length)
const recentUnlockedAchievements = computed(() =>
  allAchievements.value.filter(a => a.unlocked && a.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 1)
)
const filteredAchievements = computed(() =>
  allAchievements.value.filter(a => a.category === activeCategory.value)
)
function showDetail(a: any) { detailAchievement.value = a }
</script>

<style scoped>
.achievements-page {
  padding: 20px 24px; background: #FAF7F2;
  min-height: 100vh; font-family: 'PingFang SC', system-ui, sans-serif;
}

.profile-card {
  background: linear-gradient(135deg, #FFF8F0, #FFF0E0);
  border-radius: 20px; padding: 24px;
  display: flex; align-items: center; gap: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 16px rgba(255,140,66,0.15);
}

/* 真实头像 */
.profile-avatar-wrap {
  width: 80px; height: 80px; border-radius: 50%;
  flex-shrink: 0; overflow: hidden;
  background: #FFE8D6;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 3px solid rgba(255,140,66,0.3);
}
.profile-avatar-img {
  width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
}
.profile-avatar-fallback { font-size: 36px; }

.profile-info { flex: 1; }
.profile-level { font-size: 20px; font-weight: 700; color: #3D3530; margin-bottom: 4px; }
.profile-quote { font-size: 13px; color: #9E9189; margin-bottom: 16px; font-style: italic; }
.profile-stats { display: flex; align-items: center; gap: 24px; }
.stat-item { display: flex; flex-direction: column; gap: 2px; }
.stat-icon { font-size: 14px; }
.stat-label { font-size: 11px; color: #9E9189; }
.stat-val { font-size: 24px; font-weight: 700; color: #3D3530; }
.stat-val.orange { color: #FF8C42; }
.stat-unit { font-size: 13px; color: #9E9189; font-weight: 400; }
.stat-divider { width: 1px; height: 40px; background: #EDE8E0; }

.checkin-panel {
  display: flex; flex-direction: column; gap: 12px;
  padding: 16px; background: #FFF8F2;
  border-radius: 12px; border: 1px solid #FFE8CC;
  min-width: 140px; text-align: center;
}
.checkin-status { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.checkin-status.active .checkin-icon { color: #5BAD7F; font-weight: 700; font-size: 28px; }
.checkin-status:not(.active) .checkin-icon { color: #9E9189; font-size: 28px; }
.checkin-label { font-size: 12px; color: #3D3530; font-weight: 600; }
.checkin-stat { display: flex; flex-direction: column; gap: 6px; padding-top: 8px; border-top: 1px solid #FFE8CC; }
.stat-row { display: flex; align-items: baseline; justify-content: center; gap: 3px; font-size: 12px; }
.stat-key { color: #9E9189; }
.stat-num { font-size: 18px; font-weight: 700; color: #3D3530; }
.stat-num.exp { color: #FF8C42; }

.title-panel {
  display: flex; flex-direction: column; gap: 10px;
  padding: 16px; background: #FFF0E0;
  border-radius: 12px; border: 1px solid #FFD6B8;
  min-width: 180px; text-align: center;
}
.title-label { font-size: 11px; color: #9E9189; font-weight: 600; }
.title-display { font-size: 16px; font-weight: 700; color: #FF8C42; line-height: 1.4; }
.title-stats { display: flex; flex-direction: column; gap: 4px; padding: 8px 0; }
.title-stat-row { font-size: 11px; color: #9E9189; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.btn-switch-title {
  background: #FF8C42; color: white; border: none;
  border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-weight: 600;
}

.title-selector-modal {
  background: white; border-radius: 20px; padding: 32px;
  text-align: center; min-width: 300px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.modal-title { font-size: 18px; font-weight: 700; color: #3D3530; margin-bottom: 20px; }
.title-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 20px; }
.title-option {
  background: #F5F3F0; color: #3D3530; border: 2px solid transparent;
  border-radius: 8px; padding: 10px; font-size: 13px; cursor: pointer; font-weight: 500;
}
.title-option.selected { background: #FF8C42; color: white; }
.modal-close {
  background: #FF8C42; color: white; border: none;
  border-radius: 16px; padding: 10px 24px; font-size: 13px; cursor: pointer; font-weight: 600;
}

.category-tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.cat-tab {
  padding: 8px 20px; border: none; border-radius: 20px;
  font-size: 14px; cursor: pointer; background: white; color: #9E9189;
  box-shadow: 0 2px 8px rgba(61,53,48,0.06); transition: all 0.2s;
}
.cat-tab.active { background: #FF8C42; color: white; font-weight: 600; }

.badge-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.badge-card {
  background: white; border-radius: 16px; padding: 20px;
  text-align: center; position: relative;
  box-shadow: 0 2px 12px rgba(61,53,48,0.06);
  transition: all 0.2s; cursor: pointer;
}
.badge-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(61,53,48,0.12); }
.badge-card.unlocked { border: 2px solid transparent; background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #FFD166, #FF8C42) border-box; }
.badge-card.rare.unlocked { background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #FFD700, #FF8C42, #FF6B9D) border-box; }
.badge-card.locked { background: #F5F5F5; opacity: 0.9; }
.badge-locked-tag { position: absolute; top: 8px; right: 8px; font-size: 10px; color: #9E9189; background: #EEE; border-radius: 4px; padding: 2px 6px; }
.badge-icon-wrap { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
.badge-icon-wrap.is-locked { background: #E8E8E8 !important; }
.badge-icon { font-size: 28px; }
.badge-name { font-size: 14px; font-weight: 700; color: #3D3530; margin-bottom: 4px; }
.badge-card.locked .badge-name { color: #9E9189; }
.badge-desc { font-size: 12px; color: #9E9189; margin-bottom: 8px; min-height: 32px; line-height: 1.4; }
.badge-date { font-size: 11px; color: #5BAD7F; font-weight: 600; }
.badge-progress-wrap { }
.badge-progress-bg { height: 4px; background: #EDE8E0; border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.badge-progress-fill { height: 100%; background: #FF8C42; border-radius: 2px; }
.badge-progress-text { font-size: 10px; color: #9E9189; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.detail-modal { background: white; border-radius: 24px; padding: 40px; text-align: center; min-width: 280px; animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes modalIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.detail-icon-wrap { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.detail-icon { font-size: 40px; }
.detail-name { font-size: 20px; font-weight: 700; color: #3D3530; margin-bottom: 8px; }
.detail-desc { font-size: 14px; color: #9E9189; margin-bottom: 12px; }
.detail-unlocked { font-size: 14px; color: #5BAD7F; font-weight: 600; margin-bottom: 16px; }
.detail-locked { font-size: 14px; color: #9E9189; margin-bottom: 16px; }
.detail-close { background: #FF8C42; color: white; border: none; border-radius: 20px; padding: 10px 28px; font-size: 14px; cursor: pointer; }
</style>