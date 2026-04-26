<template>
  <div class="report-page">
    <div class="tab-bar">
      <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'today'" class="tab-content">
      <div class="today-two-col">
        <div class="today-left-col">
          <div class="card target-card">
            <div class="card-header-row">
              <span class="card-title">🎯 目标工时</span>
              <span class="card-right-tag">8 小时</span>
            </div>
            <div class="big-num-sm">{{ todayHours }} <span class="unit">/8h</span></div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" :style="{ width: Math.min(todayHours/8*100, 100) + '%' }"></div>
              </div>
            </div>
            <div class="progress-tag">超越 {{ beatPercent }}% 同学</div>
            <PersonaCard :stats="todayStats" :gender="userGender" />
          </div>

          <div class="two-mini-row">
            <div class="mini-card blue">
              <div class="mini-icon">💧</div>
              <div class="mini-label">喝水记录</div>
              <div class="mini-val">{{ waterMl }} <span class="mini-unit">ml</span></div>
            </div>
            <div class="mini-card green">
              <div class="mini-icon">⚡</div>
              <div class="mini-label">起身活动</div>
              <div class="mini-val">{{ standTimes }} <span class="mini-unit">次</span></div>
            </div>
          </div>

          <div class="card software-card">
            <div class="fav-software-card">
              <div class="fav-crown">🏆</div>
              <div class="fav-title">最爱宠妃</div>
              <div class="fav-name">{{ favSoftware }}</div>
              <div class="fav-time">独宠 {{ favSoftwareTime }}，真爱无疑</div>
            </div>
            <div class="mini-label" style="margin: 16px 0 12px;">软件使用分布</div>
            <div v-for="(category, idx) in appsByCategory" :key="idx" class="app-category">
              <div class="category-title" :class="`cat-${idx}`">{{ category.icon }} {{ category.title }}</div>
              <div v-if="category.apps.length > 0" class="app-list">
                <div v-for="(app, i) in category.apps" :key="i" class="app-row">
                  <span class="app-name">{{ app.name }}</span>
                  <div class="app-bar-bg">
                    <div class="app-bar-fill" :style="{ width: app.pct + '%' }"></div>
                  </div>
                  <span class="app-time">{{ app.time }}</span>
                </div>
              </div>
              <div v-else class="empty-tip">暂无数据</div>
            </div>
          </div>
        </div>

        <div class="today-right-col">
          <div class="card month-calendar-card">
            <div class="mini-label" style="margin-bottom: 12px;">📅 本月打卡日历</div>
            
            <!-- 月份标题 -->
            <div class="cal-header">{{ currentYear }}年{{ currentMonth }}月</div>
            
            <!-- 星期行 -->
            <div class="cal-weekdays">
              <div class="weekday">一</div>
              <div class="weekday">二</div>
              <div class="weekday">三</div>
              <div class="weekday">四</div>
              <div class="weekday">五</div>
              <div class="weekday">六</div>
              <div class="weekday">日</div>
            </div>
            
            <!-- 日期网格 -->
            <div class="cal-grid">
              <div
                v-for="day in calendarDays"
                :key="day.date"
                class="cal-day"
                :class="{ 'clocked': day.clocked, 'today': day.isToday, 'future': day.isFuture }"
                @mouseenter="hoveredDay = day.clocked ? day : null"
                @mouseleave="hoveredDay = null"
              >
                <span class="day-num">{{ day.date }}</span>
                <div v-if="hoveredDay && hoveredDay.date === day.date && day.clocked" class="day-tooltip">
                  {{ currentMonth }}月{{ day.date }}日 · 专注{{ day.hours }}h
                </div>
              </div>
            </div>
          </div>

          <div class="card mood-card">
            <div class="mini-label" style="margin-bottom: 12px;">😊 今日心情轨迹</div>
            <div v-if="todayMoodTrail.length > 0" class="mood-trail">
              <div v-for="(mood, idx) in todayMoodTrail" :key="idx" class="mood-trail-item">
                <span class="mood-time">{{ mood.time?.substring(11, 16) || '--:--' }}</span>
                <span class="mood-emoji">{{ mood.moodEmoji || '💬' }}</span>
              </div>
            </div>
            <div v-else class="mood-empty">还没记录今日心情</div>
          </div>

          <div class="card ai-report-card">
            <div class="ai-header">
              <span class="ai-title">✨ 今日打工总结</span>
              <span class="ai-sub">AI 生成 · {{ todayDateStr }}</span>
            </div>
            <div class="ai-panda">🐼</div>
            <div class="ai-text" v-html="aiReportHtml"></div>
            <div class="ai-score">今日评分 <span class="score-num">{{ todayScore }}</span> 分</div>
            <div class="ai-quote">"{{ aiQuote }}"</div>
            <button class="btn-copy" @click="copyReport">
              📋 复制日报
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'week'" class="tab-content">
      <div class="card">
        <div class="card-title-sm">📅 本周工时（竹子风格）</div>
        <div class="bamboo-container">
          <div v-for="(d, i) in weekBambooNodes" :key="i" class="bamboo-item">
            <div class="bamboo-stick">
              <div class="bamboo-nodes-wrap" :style="{ height: (d.hours/10*150) + 'px' }"></div>
            </div>
            <div class="bamboo-label">{{ d.day }}</div>
            <div class="bamboo-hours">{{ d.hours }}h</div>
          </div>
        </div>
        <div class="commentary" style="margin-top: 16px;">💭 {{ weekCommentary }}</div>
      </div>

      <div class="stats-grid-four" style="margin-top: 16px;">
        <div class="mini-card">
          <div class="mini-label">本周总工时</div>
          <div class="mini-val">{{ weekTotal }} <span class="mini-unit">h</span></div>
        </div>
        <div class="mini-card">
          <div class="mini-label">完成任务</div>
          <div class="mini-val">{{ weekTasks }} <span class="mini-unit">个</span></div>
        </div>
        <div class="mini-card">
          <div class="mini-label">喝水次数</div>
          <div class="mini-val">{{ weekWater }} <span class="mini-unit">次</span></div>
        </div>
        <div class="mini-card">
          <div class="mini-label">起身次数</div>
          <div class="mini-val">{{ weekStand }} <span class="mini-unit">次</span></div>
        </div>
      </div>

      <div class="card" style="margin-top: 16px;">
        <div class="mini-label" style="margin-bottom: 12px;">😊 本周情绪统计</div>
        <div class="mood-stats">
          <div v-for="(item, idx) in weekMoodStats" :key="idx" class="mood-stat-item">
            <span class="mood-stat-emoji">{{ item.emoji }}</span>
            <span class="mood-stat-count">{{ item.count }}次</span>
          </div>
        </div>
        <div v-if="weekMoodStats.length === 0" class="mood-empty">暂无情绪记录</div>
      </div>

      <div class="card" style="margin-top: 16px;">
        <div class="mini-label" style="margin-bottom: 12px;">🐼 AI周报</div>
        <div class="ai-report-text">{{ weekAiReport }}</div>
        <button class="btn-copy" @click="copyWeekReport" style="margin-top: 12px;">📋 复制周报</button>
      </div>
    </div>

    <div v-if="activeTab === 'month'" class="tab-content">
      <div class="card">
        <div class="card-title-sm">📊 本月工时趋势</div>
        <div class="month-chart">
          <div v-for="(d, i) in monthData" :key="i" class="month-bar-item">
            <div class="month-bar-wrap">
              <div class="month-bar-fill" :style="{ height: (d.hours/12*100) + '%' }"></div>
            </div>
            <div class="month-date">{{ d.date }}</div>
          </div>
        </div>
      </div>

      <div class="stats-grid-two" style="margin-top: 16px;">
        <div class="mini-card">
          <div class="mini-label">本月总工时</div>
          <div class="mini-val">{{ monthTotal }} <span class="mini-unit">h</span></div>
        </div>
        <div class="mini-card">
          <div class="mini-label">完成任务</div>
          <div class="mini-val">{{ monthTasks }} <span class="mini-unit">个</span></div>
        </div>
      </div>

      <div class="card" style="margin-top: 16px;">
        <div class="mini-label" style="margin-bottom: 12px;">🐼 AI月报</div>
        <div class="ai-report-text">{{ monthAiReport }}</div>
        <div class="month-score">月度评分：<span class="score-num">{{ monthScore }}</span> 分</div>
        <button class="btn-copy" @click="copyMonthReport" style="margin-top: 12px;">📋 复制月报</button>
      </div>
    </div>

    <div v-if="activeTab === 'year'" class="tab-content">
      <div class="year-card">
        <div class="year-title">🎊 {{ currentYear }} 年度打工实录</div>
        <div class="year-stats">
          <div class="year-stat-item">
            <div class="year-num">{{ yearHours }}</div>
            <div class="year-label">总工时（h）</div>
          </div>
          <div class="year-stat-item">
            <div class="year-num">{{ yearTasks }}</div>
            <div class="year-label">完成任务</div>
          </div>
          <div class="year-stat-item">
            <div class="year-num">{{ yearDays }}</div>
            <div class="year-label">打卡天数</div>
          </div>
          <div class="year-stat-item">
            <div class="year-num">{{ yearStreak }}</div>
            <div class="year-label">最长连续打卡</div>
          </div>
        </div>
        <div class="year-title-badge">{{ yearBadge }}</div>
        <div class="year-quote">"{{ yearQuote }}"</div>
        <div class="year-panda">🐼 滚滚认证</div>
      </div>
    </div>

    <div v-if="copySuccess" class="copy-toast">✓ 已复制到剪贴板</div>
  </div>
</template>

<script setup lang="ts">


import { ref, computed, onMounted, onUnmounted } from 'vue'
import PersonaCard from '../components/PersonaCard.vue'
import { userStore } from '../stores/userStore'

// ── 响应式性别状态 ──────────────────────
const profileGender = ref('female')

function loadGender() {
  // 优先读新格式
  const profile = localStorage.getItem('moyu_user_profile')
  if (profile) {
    try {
      const p = JSON.parse(profile)
      // 兼容新格式 'female'/'male' 和旧格式 '女研究生'/'男研究生'
      if (p.gender === 'male' || p.gender === '男研究生') {
        profileGender.value = 'male'
      } else {
        profileGender.value = 'female'
      }
      return
    } catch {}
  }
  // 兼容旧的 moyuSettings
  const settings = localStorage.getItem('moyuSettings')
  if (settings) {
    try {
      const p = JSON.parse(settings)
      if (p.gender === 'male' || p.gender === '男研究生') {
        profileGender.value = 'male'
      } else {
        profileGender.value = 'female'
      }
    } catch {}
  }
}

function onProfileUpdated(e: any) {
  const g = e.detail?.gender
  if (g === 'male' || g === '男研究生') {
    profileGender.value = 'male'
  } else {
    profileGender.value = 'female'
  }
}

onMounted(() => {
  loadGender()
  window.addEventListener('moyu-profile-updated', onProfileUpdated)
})

onUnmounted(() => {
  window.removeEventListener('moyu-profile-updated', onProfileUpdated)
})

const activeTab = ref('today')
const hoveredDay = ref<any>(null)
const tabs = [
  { id: 'today', label: '今日' },
  { id: 'week',  label: '本周' },
  { id: 'month', label: '本月' },
  { id: 'year',  label: '年报' },
]

const todayHours = ref(6.5)
const beatPercent = ref(70)
const waterMl = ref(1250)
const standTimes = ref(4)
const todayMainMood = ref('😄')
const todayScore = ref(92)
const copySuccess = ref(false)
const todayMoods = ref(['😄', '😊', '🥰'])

const todayMoodTrail = computed(() => {
  // 从 localStorage 读取今日心情记录
  const moodDiaryKey = 'moyu_mood_diary'
  const stored = localStorage.getItem(moodDiaryKey)
  
  if (!stored) return []
  
  try {
    const allRecords = JSON.parse(stored)
    const now = new Date()
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
    
    // 过滤今日记录
    const todayRecords = allRecords.filter((record: any) => {
      const recordDate = record.time?.substring(0, 10) || ''
      return recordDate === todayStr
    })
    
    // 按时间排序
    return todayRecords.sort((a: any, b: any) => {
      return (a.time || '').localeCompare(b.time || '')
    })
  } catch (error) {
    console.error('Failed to parse mood diary:', error)
    return []
  }
})
const monthScore = ref(88)

const todayDateStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`
})

const topApps = ref([
  { name: 'VS Code',  time: '3.2h', pct: 80 },
  { name: 'PyCharm',  time: '2.1h', pct: 55 },
  { name: 'Chrome',   time: '1.8h', pct: 45 },
  { name: '微信',      time: '0.8h', pct: 20 },
  { name: '微博',      time: '0.5h', pct: 12 },
  { name: 'MATLAB',   time: '0.9h', pct: 25 },
])

const workApps = ['VS Code', 'PyCharm', 'MATLAB', 'Visual Studio', 'Jupyter', 'IntelliJ', 'RStudio']
const relaxApps = ['Chrome', '微信', '微博', 'WeChat', '钉钉', 'QQ', 'Safari']

const appsByCategory = computed(() => {
  const crazy: any[] = []
  const surfing: any[] = []
  const mystery: any[] = []
  
  topApps.value.forEach(app => {
    if (workApps.includes(app.name)) {
      crazy.push(app)
    } else if (relaxApps.includes(app.name)) {
      surfing.push(app)
    } else {
      mystery.push(app)
    }
  })
  
  return [
    { icon: '🔬', title: '疯狂掉发区', apps: crazy },
    { icon: '🌊', title: '冲浪吃瓜区', apps: surfing },
    { icon: '🐟', title: '神秘摸鱼区', apps: mystery },
  ]
})

const favSoftware = computed(() => topApps.value[0]?.name || 'VS Code')
const favSoftwareTime = computed(() => topApps.value[0]?.time || '3.2h')

const aiReportHtml = computed(() => {
  return `哦吼～主人今天在岗 <b style="color:#FF8C42">${todayHours.value}</b> 小时，完成了 <b style="color:#5BAD7F">4</b> 个任务，摸鱼 <b style="color:#FF8C42">45</b> min（劳逸结合，很合理）。<br><br>喝水 <b>${Math.round(waterMl.value/250)}</b> 次，起身 <b>${standTimes.value}</b> 次，主要心情还是 ${todayMainMood.value} 开心！`
})

async function generateAiReport(): Promise<string> {
  const pandaStyle = userStore.pandaStyle || 'gentle'
  
  const systemPrompts: Record<string, string> = {
    gentle: `你是科研打工人的温柔陪伴型AI助手滚滚。
用温暖治愈的语气，根据以下数据写一段60字内的日结评语。
要有鼓励、要提到数据细节、结尾加一句暖心的话。
回复格式：直接输出评语，不要有多余内容。`,
    
    toxic: `你是一个刀子嘴豆腐心的导师型AI助手。
根据以下数据写一段60字内的犀利日结评语，要有数据吐槽和梗，
要讽刺但不失关心，最后一句要有转折暖意。
回复格式：直接输出评语，不要有多余内容。`,
    
    sarcasm: `你是一个阴阳怪气但其实很关心用户的AI助手。
根据以下数据写一段60字内的阴阳评语，语气要反讽，
表面嘲讽实则心疼，要精准戳到数据细节。
回复格式：直接输出评语，不要有多余内容。`,
  }
  
  const userPrompt = `今日数据：
总工时${todayHours.value}小时，完成任务4个
最爱软件：VS Code用了3.2小时
摸鱼时长：45分钟
喝水${Math.round(waterMl.value/250)}次，起身${standTimes.value}次
主要心情：${todayMainMood.value}开心
请生成今日评语（60字内）`
  
  const systemPrompt = systemPrompts[pandaStyle] || systemPrompts.gentle
  
  // 读取 API Key
  const apiKey = localStorage.getItem('moyu_api_key') || ''
  
  if (!apiKey) {
    // 无 API Key 时使用本地兜底文案
    const fallbackTexts: Record<string, string> = {
      gentle: '主人今天辛苦了，6.5小时的专注很棒呢。摸鱼45分钟也很合理，身体才是本钱。希望明天也能保持这份热情～',
      toxic: '6.5小时？还差1.5小时才及格，但看在你态度认真的份上，给个A-。摸鱼45分钟我就当你休息了。',
      sarcasm: '哟，今天6.5小时呢，这是破记录还是新低？不过话说回来，你的坚持我都看在眼里。',
    }
    return fallbackTexts[pandaStyle] || fallbackTexts.gentle
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })
    
    if (!response.ok) {
      throw new Error('API request failed')
    }
    
    const data = await response.json()
    return data.choices?.[0]?.message?.content || '主人今天辛苦了～'
  } catch (error) {
    console.error('AI report generation failed:', error)
    const fallbackTexts: Record<string, string> = {
      gentle: '主人今天辛苦了，每一分钟的努力都在累积。希望明天也能保持这份热情～',
      toxic: '6.5小时不算太差，继续加油吧。',
      sarcasm: '今天状态还不错，继续努力呀。',
    }
    return fallbackTexts[pandaStyle] || fallbackTexts.gentle
  }
}

const aiQuote = ref('只要学不死，就往死里学。今天也是元气满满的一天呢！')

const todayStats = computed(() => ({
  workHours: todayHours.value,
  completedTasks: 4,
  coffeeCount: 2,
  standCount: standTimes.value,
}))

// 传给 PersonaCard 的 gender prop
const userGender = computed(() => profileGender.value)

const weekData = ref([
  { day: '周一', hours: 7.5 },
  { day: '周二', hours: 8.2 },
  { day: '周三', hours: 6.0 },
  { day: '周四', hours: 9.1 },
  { day: '周五', hours: 5.5 },
  { day: '周六', hours: 3.0 },
  { day: '周日', hours: 1.5 },
])

const weekTotal = computed(() => weekData.value.reduce((a, b) => a + b.hours, 0).toFixed(1))

const weekCommentary = computed(() => {
  const total = parseFloat(weekTotal.value)
  if (total < 30) return '本周相当于看完了一部超长纪录片'
  if (total < 40) return '标准社畜周，你值得一个周末奖励'
  return `本周工时${total}h，实验室的竹子都替你心疼`
})

const weekBambooNodes = computed(() => {
  return weekData.value.map(d => {
    return {
      day: d.day,
      hours: d.hours,
    }
  })
})

const weekTasks = ref(18)
const weekWater = ref(21)
const weekStand = ref(14)

const weekMoodStats = computed(() => {
  return [
    { emoji: '😄', count: 5 },
    { emoji: '😊', count: 3 },
    { emoji: '🥰', count: 2 },
  ]
})

const weekAiReport = ref('本周工作稳定推进，完成了18个任务，工时达41.8小时。虽然周末摸鱼了，但整体状态不错。建议下周保持节奏，劳逸结合哦～毒鸡汤提示：只要不停止学习，摸鱼也是在进步！💪')

const monthData = ref(
  Array.from({ length: 18 }, (_, i) => ({
    date: `${i + 1}`,
    hours: Math.round(Math.random() * 8 + 2),
  }))
)
const monthTotal = computed(() => monthData.value.reduce((a, b) => a + b.hours, 0))
const monthTasks = ref(67)

const monthAiReport = ref('四月春光明媚，你的工时记录也闪闪发光！完成了67个任务，总工时168小时，平均每天5.6小时的稳定输出。虽然偶尔摸鱼，但整体保持了科研苦行僧的风范。下月继续冲呀～')

const yearHours = ref(842)
const yearTasks = ref(312)
const yearDays = ref(98)
const yearStreak = ref(15)
const yearBadge = computed(() => {
  if (yearHours.value > 2000) return '🏆 传说级打工机器'
  if (yearHours.value > 1500) return '👑 标准社畜认证'
  if (yearHours.value > 800)  return '⭐ 科研苦行僧'
  return '🌱 佛系打工人'
})
const yearQuote = ref('每一行代码，每一篇文献，都是你对未来的投资。')

const clockinDates = computed(() => {
  const stored = localStorage.getItem('moyu_clockin_dates')
  return stored ? JSON.parse(stored) : []
})

const currentYear = computed(() => new Date().getFullYear())
const currentMonth = computed(() => new Date().getMonth() + 1)

const calendarDays = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  
  // 获取月的第一天
  const firstDay = new Date(year, month, 1)
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // 转换为0=一, 6=日
  
  // 获取月的最后一天
  const lastDay = new Date(year, month + 1, 0)
  const lastDateOfMonth = lastDay.getDate()
  
  const days = []
  
  // 前月日期填充
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek; i > 0; i--) {
    days.push({
      date: prevMonthLastDay - i + 1,
      otherMonth: true,
      clocked: false,
      isToday: false,
      isFuture: false,
      hours: 0,
    })
  }
  
  // 本月日期
  for (let i = 1; i <= lastDateOfMonth; i++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const isClockin = clockinDates.value.includes(fullDate)
    const isToday = i === today && month === now.getMonth()
    const isFuture = new Date(year, month, i) > now
    
    days.push({
      date: i,
      otherMonth: false,
      clocked: isClockin,
      isToday,
      isFuture,
      hours: isClockin ? 6.5 : 0, // 示例数据
    })
  }
  
  // 后月日期填充
  const remainingDays = 42 - days.length // 6行 × 7列 = 42天
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      otherMonth: true,
      clocked: false,
      isToday: false,
      isFuture: false,
      hours: 0,
    })
  }
  
  return days
})

function copyReport() {
  const text = `今日打工总结 ${todayDateStr.value}\n在岗：${todayHours.value}h | 任务：4个 | 喝水：${Math.round(waterMl.value/250)}次 | 起身：${standTimes.value}次\n今日评分：${todayScore.value}分\n"${aiQuote.value}"\n——滚滚`
  navigator.clipboard.writeText(text).then(() => {
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  })
}

function copyWeekReport() {
  const text = `本周打工总结\n工时：${weekTotal.value}h | 任务：${weekTasks.value}个 | 喝水：${weekWater.value}次 | 起身：${weekStand.value}次\n${weekAiReport.value}\n——滚滚`
  navigator.clipboard.writeText(text).then(() => {
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  })
}

function copyMonthReport() {
  const text = `本月打工总结\n工时：${monthTotal}h | 任务：${monthTasks.value}个 | 评分：${monthScore.value}分\n${monthAiReport.value}\n——滚滚`
  navigator.clipboard.writeText(text).then(() => {
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  })
}
</script>

<style scoped>
.report-page {
  padding: 20px 24px;
  background: #FAFAF8;
  min-height: 100vh;
  font-family: 'PingFang SC', system-ui, sans-serif;
}

.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  padding: 6px;
  width: fit-content;
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.06);
}

.tab-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #9E9189;
  background: transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #5BAD7F;
  color: white;
  font-weight: 600;
}

.tab-content {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
  }
}

.today-two-col {
  display: flex;
  gap: 20px;
}

.today-left-col {
  flex: 0 0 55%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.today-right-col {
  flex: 0 0 45%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #FAFAF8;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(61, 53, 48, 0.08);
  border: 1px solid #F0EDE8;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #3D3530;
}

.card-right-tag {
  font-size: 13px;
  color: #9E9189;
}

.card-title-sm {
  font-size: 14px;
  font-weight: 700;
  color: #3D3530;
  margin-bottom: 16px;
}

.big-num-sm {
  font-size: 32px;
  font-weight: 700;
  color: #3D3530;
  margin: 8px 0;
}

.unit {
  font-size: 14px;
  color: #9E9189;
  font-weight: 400;
}

.progress-bar-wrap {
  margin: 8px 0;
}

.progress-bar-bg {
  height: 10px;
  background: #F0EDE8;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5BAD7F, #73D18F);
  border-radius: 5px;
  transition: width 0.8s ease;
}

.progress-tag {
  font-size: 12px;
  color: #5BAD7F;
  font-weight: 600;
}

.commentary-tag {
  font-size: 12px;
  color: white;
  font-weight: 600;
  background: linear-gradient(135deg, #5BAD7F, #3D8B5F);
  padding: 12px 16px;
  border-radius: 24px;
  margin-top: 12px;
  text-align: center;
}

.two-mini-row {
  display: flex;
  gap: 12px;
}

.mini-card {
  flex: 1;
  background: #FAFAF8;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.06);
  border: 1px solid #F0EDE8;
}

.mini-card.blue {
  background: #F0F9FF;
  border-color: #E0F2FE;
}

.mini-card.green {
  background: #F0FFF4;
  border-color: #DCFCE7;
}

.mini-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.mini-label {
  font-size: 12px;
  color: #9E9189;
  margin-bottom: 4px;
}

.mini-val {
  font-size: 24px;
  font-weight: 700;
  color: #3D3530;
}

.mini-unit {
  font-size: 12px;
  color: #9E9189;
  font-weight: 400;
}

.software-card {
  padding: 20px !important;
}

.fav-software-card {
  background: linear-gradient(135deg, #FF8C42, #FFB366);
  border-radius: 16px;
  padding: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.2);
}

.fav-crown {
  font-size: 24px;
}

.fav-title {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
}

.fav-name {
  font-size: 18px;
  font-weight: 700;
}

.fav-time {
  font-size: 12px;
  opacity: 0.85;
  text-align: center;
}

.app-category {
  margin-bottom: 16px;
}

.app-category:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 13px;
  font-weight: 700;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.category-title.cat-0 {
  background: linear-gradient(135deg, #5BAD7F, #4CAF70);
}

.category-title.cat-1 {
  background: linear-gradient(135deg, #64B5F6, #42A5F5);
}

.category-title.cat-2 {
  background: linear-gradient(135deg, #FFB74D, #FFA726);
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.app-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-name {
  font-size: 12px;
  color: #3D3530;
  width: 56px;
  flex-shrink: 0;
}

.app-bar-bg {
  flex: 1;
  height: 6px;
  background: #F0EDE8;
  border-radius: 3px;
  overflow: hidden;
}

.app-bar-fill {
  height: 100%;
  background: #5BAD7F;
  border-radius: 3px;
}

.app-time {
  font-size: 11px;
  color: #9E9189;
  width: 32px;
  text-align: right;
}

.empty-tip {
  font-size: 12px;
  color: #9E9189;
  text-align: center;
  padding: 8px 0;
}

.month-calendar-card {
  background: #FAFAF8;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(61, 53, 48, 0.08);
  border: 1px solid #F0EDE8;
}

.cal-header {
  font-size: 16px;
  font-weight: 700;
  color: #3D3530;
  text-align: center;
  margin-bottom: 16px;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #9E9189;
  padding: 8px 0;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.cal-day {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 500;
  color: #3D3530;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.cal-day.clocked {
  background: #6BAE8C;
  color: white;
  font-weight: 700;
}

.cal-day.today {
  border: 2px solid #F4956A;
  color: #F4956A;
  font-weight: 700;
}

.cal-day.future {
  color: #C0B8B0;
}

.day-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: #3D3530;
  color: white;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
}

.mood-card {
  padding: 20px !important;
}

.mood-trail {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.mood-trail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #FAF7F2;
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid #F0EDE8;
}

.mood-time {
  font-size: 11px;
  color: #9E9189;
  font-weight: 500;
}

.mood-emoji {
  font-size: 20px;
}

.mood-emojis {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;
  align-items: center;
}

.mood-emoji {
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.2s;
}

.mood-emoji:hover {
  transform: scale(1.2);
}

.mood-empty {
  font-size: 14px;
  color: #9E9189;
  text-align: center;
  padding: 20px 0;
}

.ai-report-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px !important;
}

.ai-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ai-title {
  font-size: 15px;
  font-weight: 700;
  color: #3D3530;
}

.ai-sub {
  font-size: 11px;
  color: #9E9189;
}

.ai-panda {
  font-size: 32px;
  text-align: center;
}

.ai-text {
  font-size: 13px;
  color: #3D3530;
  line-height: 1.7;
}

.ai-score {
  font-size: 13px;
  color: #9E9189;
}

.score-num {
  font-size: 18px;
  font-weight: 700;
  color: #FF8C42;
}

.ai-quote {
  font-size: 12px;
  color: #9E9189;
  font-style: italic;
  background: #F5F3F0;
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #5BAD7F;
}

.btn-copy {
  background: #5BAD7F;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s;
}

.btn-copy:hover {
  background: #4CAF70;
}

.bamboo-container {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  justify-content: space-around;
  min-height: 200px;
  margin-bottom: 16px;
}

.bamboo-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-height: 100%;
  justify-content: flex-end;
}

.bamboo-stick {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  min-height: 100px;
}

.bamboo-nodes-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #5BAD7F;
  border-radius: 0 0 0 0;
  border-radius: 6px 6px 0 0;
  width: 28px;
  position: relative;
  box-shadow: 0 2px 8px rgba(91, 173, 127, 0.3);
  transition: height 0.3s ease;
}

.bamboo-nodes-wrap::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 12px;
  background: #5BAD7F;
  border-radius: 50%;
  opacity: 0.8;
  box-shadow: -8px -2px 0 -3px #5BAD7F;
}

.bamboo-label {
  font-size: 12px;
  color: #9E9189;
  font-weight: 500;
}

.bamboo-hours {
  font-size: 13px;
  font-weight: 600;
  color: #5BAD7F;
}

.stats-grid-four {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stats-grid-two {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.mood-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.mood-stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mood-stat-emoji {
  font-size: 24px;
}

.mood-stat-count {
  font-size: 13px;
  color: #3D3530;
  font-weight: 600;
}

.ai-report-text {
  font-size: 13px;
  color: #3D3530;
  line-height: 1.8;
  background: #F5F3F0;
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #5BAD7F;
}

.month-score {
  font-size: 13px;
  color: #9E9189;
  margin-top: 12px;
}

.month-chart {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 100px;
  overflow-x: auto;
}

.month-bar-item {
  flex-shrink: 0;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  height: 100%;
}

.month-bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.month-bar-fill {
  width: 100%;
  background: #5BAD7F;
  border-radius: 3px 3px 0 0;
  min-height: 2px;
}

.month-date {
  font-size: 9px;
  color: #9E9189;
}

.year-card {
  background: linear-gradient(135deg, #FFF8F0, #FFF0E0);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(91, 173, 127, 0.1);
  border: 1px solid #F0EDE8;
}

.year-title {
  font-size: 20px;
  font-weight: 700;
  color: #3D3530;
  margin-bottom: 32px;
}

.year-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 32px;
}

.year-stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.year-num {
  font-size: 36px;
  font-weight: 700;
  color: #5BAD7F;
}

.year-label {
  font-size: 13px;
  color: #9E9189;
}

.year-title-badge {
  font-size: 20px;
  font-weight: 700;
  color: #FF8C42;
  margin-bottom: 12px;
}

.year-quote {
  font-size: 14px;
  color: #9E9189;
  font-style: italic;
  margin-bottom: 16px;
}

.year-panda {
  font-size: 14px;
  color: #9E9189;
}

.commentary {
  font-size: 13px;
  color: #3D3530;
  font-weight: 500;
}

.copy-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #3D3530;
  color: white;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 999;
  animation: toastIn 0.3s ease;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>