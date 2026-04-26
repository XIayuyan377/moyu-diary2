<template>
  <div class="dashboard">

    <!-- 顶部欢迎横幅 -->
    <div class="welcome-banner">
      <!-- 左栏：角色和日期和成长进度 -->
      <div class="banner-left">
        <div class="avatar-wrap">
          <div class="my-character-img">
            <img 
              v-if="avatarUrl" 
              :src="avatarUrl" 
              class="banner-avatar-img"
              @error="onAvatarError"
             />
            <div v-else class="avatar-fallback-char">👤</div>
          </div>
          <div class="status-bubble">进入状态了～</div>
        </div>
        <div class="banner-info">
          <div class="greeting">早安，{{ nickname }}！ 🌟</div>
          <div class="date-defense">
            <span class="date-text">{{ todayStr }}</span>
            <span v-if="daysToDefense !== null" class="defense-countdown" :style="{ color: defenseColor }">
              🎓 答辩倒计时 {{ daysToDefense }}d
            </span>
          </div>
          <div class="growth-bar">
            <div class="level-badge">LV{{ level }} · {{ levelTitle }}</div>
            <div class="exp-progress">
              <div class="exp-bar-inner">
                <div class="exp-fill-inner" :style="{ width: expPercent + '%' }"></div>
              </div>
              <span class="exp-nums">{{ currentExp }}/{{ maxExp }}</span>
            </div>
          </div>

          <!-- 倒计时板块 -->
          <div class="countdowns-section">
            <div class="countdowns-list">
              <div
                v-for="countdown in countdowns"
                :key="countdown.id"
                class="countdown-pill"
                :class="{ urgent: countdown.daysLeft < 7 }"
              >
                <span class="countdown-icon">📅</span>
                <span class="countdown-text">{{ countdown.name }} 还有{{ countdown.daysLeft }}天</span>
                <button class="countdown-remove" @click="removeCountdown(countdown.id)">×</button>
              </div>
            </div>
            <button class="btn-add-countdown" @click="showAddCountdown = true">+ 添加</button>
          </div>

          <!-- 添加倒计时弹窗 -->
          <div v-if="showAddCountdown" class="countdown-modal-overlay" @click.self="showAddCountdown = false">
            <div class="countdown-modal">
              <div class="modal-title">添加倒计时</div>
              <input
                v-model="newCountdownName"
                type="text"
                class="countdown-input"
                placeholder="事项名称（如：论文提交）"
                @keyup.enter="addCountdown"
              />
              <input
                v-model="newCountdownDate"
                type="date"
                class="countdown-input"
              />
              <div class="countdown-modal-buttons">
                <button class="btn-confirm" @click="addCountdown">确认</button>
                <button class="btn-cancel" @click="showAddCountdown = false">取消</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右栏：每日一句 -->
      <div class="banner-right">
        <div class="quote-box">
          <span class="quote-open">「</span>
          <span class="quote-text">{{ currentQuote }}</span>
          <span class="quote-close">」</span>
          <button class="refresh-btn" @click="refreshQuote">↻</button>
        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="main-content">

      <!-- 左栏 -->
      <div class="left-col">

        <!-- 今日任务卡片 -->
        <div class="card task-card">
          <div class="card-header">
            <div class="card-title">
              <span class="title-icon">🏅</span>
              今日任务
              <span class="task-count">({{ completedCount }}/{{ todos.length }})</span>
            </div>
            <div class="card-header-buttons">
              <button class="btn-history" @click="loadHistoryTasks">📜 历史</button>
            </div>
          </div>

          <!-- 行内创建任务框 -->
          <div class="task-inline-create">
            <span class="create-icon">+</span>
            <input 
              v-model="newTaskName"
              placeholder="输入任务，回车快速创建..."
              @keyup.enter="addTask"
            />
          </div>

          <!-- 任务列表 -->
          <div class="task-list">
            <div
              v-for="task in todos"
              :key="task.id"
              class="task-item"
              :class="{ done: task.is_completed }"
            >
              <button class="task-check" @click="toggleTask(task)">
                <span v-if="task.is_completed">✓</span>
              </button>
              <span class="task-name">{{ task.content }}</span>
              <button class="task-del" @click="deleteTask(task.id)">×</button>
            </div>
            <div v-if="todos.length === 0" class="task-empty">
              <span>暂无任务，点击新建开始今日攻坚 🐼</span>
            </div>
          </div>
        </div>

        <!-- 提醒卡片 -->
        <div class="bento-grid">
          <div class="reminder-item water">
            <span class="reminder-icon">☕</span>
            <div class="reminder-title">该喝水了</div>
            <div class="reminder-sub">上次：{{ lastWater }}</div>
            <button class="btn-record" @click="recordWater">记录</button>
          </div>
          <div class="reminder-item stand">
            <span class="reminder-icon">⚡</span>
            <div class="reminder-title">起来走走</div>
            <div class="reminder-sub">久坐：{{ sittingTime }}</div>
            <button class="btn-rest" @click="recordStand">休息</button>
          </div>
          <div class="reminder-item tomato">
            <div class="reminder-title">番茄钟</div>
            <!-- idle状态：待机 -->
            <template v-if="tomatoState === 'idle'">
              <button class="btn-tomato-large" @click="startTomato">🍅 开始专注 25:00</button>
            </template>
            <!-- running状态：运行中 -->
            <template v-else-if="tomatoState === 'running'">
              <div class="tomato-running">
                <div class="tomato-time-large">{{ tomatoDisplay }}</div>
                <div class="tomato-buttons-group">
                  <button class="btn-tomato-pause" @click="pauseTomato">⏸ 暂停</button>
                  <button class="btn-tomato-quit" @click="showQuitModal = true">🏃 放弃跑路</button>
                </div>
              </div>
            </template>
            <!-- paused状态：暂停 -->
            <template v-else-if="tomatoState === 'paused'">
              <div class="tomato-paused">
                <div class="tomato-time-large" style="color: #9E9189;">{{ tomatoDisplay }}</div>
                <div class="tomato-buttons-group-three">
                  <button class="btn-tomato-resume" @click="resumeTomato">▶ 继续</button>
                  <button class="btn-tomato-end" @click="endTomato">⏹ 结束</button>
                  <button class="btn-tomato-giveup" @click="showQuitModal = true">🏃 跑路</button>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 打卡按钮 -->
        <div class="clock-row">
          <button class="btn-clock-in" @click="clockIn">
            <span>🧱</span> 开始搬砖
          </button>
          <button class="btn-clock-out" @click="clockOut">
            <span>🏃</span> 光荣跑路
          </button>
        </div>

      </div>

      <!-- 右栏 -->
      <div class="right-col">

        <!-- 今日概况 -->
        <div class="card overview-card">
          <div class="card-title-sm">今日概况</div>
          <div class="overview-grid">
            <div class="overview-item">
              <div class="ov-icon">🕐</div>
              <div class="ov-label">在岗时长</div>
              <div class="ov-value">{{ workHours }} <span class="ov-unit">h</span></div>
            </div>
            <div class="overview-item">
              <div class="ov-icon">✅</div>
              <div class="ov-label">完成任务</div>
              <div class="ov-value">{{ completedCount }} <span class="ov-unit">个</span></div>
            </div>
            <div class="overview-item">
              <div class="ov-icon">💧</div>
              <div class="ov-label">喝水次数</div>
              <div class="ov-value">{{ waterCount }} <span class="ov-unit">次</span></div>
            </div>
            <div class="overview-item">
              <div class="ov-icon">🚶</div>
              <div class="ov-label">起身次数</div>
              <div class="ov-value">{{ standCount }} <span class="ov-unit">次</span></div>
            </div>
          </div>
        </div>

        <!-- 滚滚互动区 -->
        <PandaCard />

      </div>
    </div>

    <!-- EXP飞字动画 -->
    <transition name="exp-fly">
      <div v-if="showExpFly" class="exp-fly">+{{ flyExp }} EXP 🎉</div>
    </transition>

    <!-- 打卡弹窗 -->
    <div v-if="showClockModal" class="modal-overlay" @click.self="showClockModal = false">
      <div class="clock-modal" :class="clockType">
        <div class="modal-emoji">{{ clockType === 'in' ? '🧱' : '🏃' }}</div>
        <div class="modal-title">{{ clockType === 'in' ? '开始搬砖！' : '光荣跑路！' }}</div>
        <div class="modal-quote">{{ clockQuote }}</div>
        <div class="modal-exp">+10 EXP 🎊</div>
        <button class="modal-close" @click="showClockModal = false">
          {{ clockType === 'in' ? '开始今天的表演' : '好的，晚安' }}
        </button>
      </div>
    </div>

    <!-- 跑路二次确认弹窗 -->
    <div v-if="showQuitModal" class="modal-overlay" @click.self="showQuitModal = false">
      <div class="quit-modal">
        <div class="quit-panda">🐼</div>
        <div class="quit-title">真的要跑路吗？</div>
        <div class="quit-sub">今天的Paper看完了吗？<br>模型跑通了吗？🤔</div>
        <div class="quit-btns">
          <button class="btn-stay" @click="resumeTomato">我再卷一会...</button>
          <button class="btn-quit" @click="confirmQuit">老子不干了（记为摸鱼）</button>
        </div>
      </div>
    </div>

    <!-- 历史任务面板 -->
    <div v-if="showHistoryPanel" class="history-drawer">
      <div class="history-header">
        <div class="history-title">📜 任务历史</div>
        <button class="history-close" @click="showHistoryPanel = false">✕</button>
      </div>
      <div class="history-content">
        <div v-if="historyTasks.length === 0" class="history-empty">
          <span>暂无历史记录</span>
        </div>
        <div v-else class="history-list">
          <div v-for="task in historyTasks" :key="task.id" class="history-item">
            <div class="history-item-date">{{ task.date }}</div>
            <div class="history-item-content">{{ task.content }}</div>
            <div class="history-item-tag">{{ task.tag }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import PandaCard from '../components/PandaCard.vue'

// 头像相关
const currentAvatar = ref('female')
const currentGender = ref('female')

function loadProfile() {
  const saved = localStorage.getItem('moyu_user_profile')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      currentAvatar.value = parsed.avatar || 'female'
      currentGender.value = parsed.gender || 'female'
    } catch {}
  }
}

// 监听设置更新事件
function onProfileUpdated(e: any) {
  console.log('🎯 收到头像更新事件:', e.detail)
  currentAvatar.value = e.detail.avatar
  currentGender.value = e.detail.gender
}

onMounted(() => {
  console.log('📌 Dashboard mounted，加载头像...')
  loadProfile()
  console.log('📌 当前头像:', currentAvatar.value)
  
  window.addEventListener('moyu-profile-updated', onProfileUpdated)
  console.log('📌 已监听 moyu-profile-updated 事件')
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


// 注入全局用户状态
const userStore = inject<any>('userStore')

// 倒计时相关
const countdowns = ref<any[]>([])
const showAddCountdown = ref(false)
const newCountdownName = ref('')
const newCountdownDate = ref('')

const defenseDate = ref('')
const todos = ref<any[]>([])
const showAddTask = ref(true)
const newTaskName = ref('')
const newTaskType = ref('实验')
const waterCount = ref(0)
const standCount = ref(0)
const workHours = ref(0)
const todayExp = ref(35)
const lastWater = ref('2小时前')
const sittingTime = ref('3.5小时')
const showExpFly = ref(false)
const flyExp = ref(15)
const showClockModal = ref(false)
const clockType = ref<'in' | 'out'>('in')
const clockQuote = ref('')
const pandaBubble = ref('')
const pandaSay = ref('滚滚陪你一起努力！')

// 熊猫状态映射
const pandaStateMap: Record<string, string> = {
  working:   'working.png',
  sleeping:  'sleeping.png',
  relax:     'relax.png',
  coffee:    'coffee.png',
  celebrate: 'celebrate.png',
  tired:     'tired.png',
}

// 当前熊猫状态（决定用哪张图）
const currentPandaState = ref('relax') // 默认放松

// 根据当前状态计算图片URL
const pandaImageUrl = computed(() => {
  const file = pandaStateMap[currentPandaState.value] || 'relax.png'
  try {
    return new URL(`../assets/avatars/panda/${file}`, import.meta.url).href
  } catch {
    return ''
  }
})

function onPandaError() {
  // 图片加载失败时的处理
  console.warn('panda image not found')
}

const currentMood = ref<'happy' | 'tired' | 'fishing'>('happy')

const fishingQuotes = [
  '科研的尽头是摸鱼，摸鱼的尽头是答辩',
  '今天的实验数据，明天的SCI（也许）',
  '不是在摸鱼，是在进行学术冥想',
  '导师说要坐冷板凳，我坐的很认真',
  '每一次摸鱼，都是在为下一次爆发蓄力',
  '论文写不完，但摸鱼停不了',
  '我不是在偷懒，我是在等灵感',
]

const tomatoState = ref<'idle'|'running'|'paused'>('idle')
const tomatoSeconds = ref(25 * 60)
const pressureValue = ref(0)
const showHistoryPanel = ref(false)
const showQuitModal = ref(false)
const historyTasks = ref<any[]>([])
let tomatoTimer: any = null
let pressureTimer: any = null
let tomatoStartSeconds = 25 * 60

// 从全局状态计算属性
const nickname = computed(() => userStore?.nickname || '科研人')
const level = computed(() => userStore?.level || 4)
const currentExp = computed(() => userStore?.currentExp || 0)
const maxExp = computed(() => userStore?.maxExp || 400)

const tomatoDisplay = computed(() => {
  const m = Math.floor(tomatoSeconds.value / 60).toString().padStart(2, '0')
  const s = (tomatoSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const daysToDefense = computed(() => {
  if (!defenseDate.value) return null
  const diff = new Date(defenseDate.value).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days > 0 ? days : null
})

const defenseColor = computed(() => {
  if (daysToDefense.value === null) return '#9E9189'
  if (daysToDefense.value < 30) return '#FF6B6B'
  return '#5BAD7F'
})

const quotes = [
  '"每天叫醒我的不是闹钟，是截稿日期"',
  '"不是不努力，是努力了数据还是不对"',
  '"论文不会写，但今天可以先打个卡"',
  '"研究生的尽头是什么？答辩。"',
  '"今天也是元气满满的一天（货币单位：人民币）"',
  '"咖啡续命，数据救命，论文要命"',
]
const currentQuote = ref(quotes[0])

const levelTitles: Record<number, string> = {
  1: '文献复读机 📚', 2: '文献复读机 📚',
  3: '调参老中医 🔬', 4: '调参老中医 🔬',
  5: '发量卫士 💈', 6: '发量卫士 💈',
  7: '秃头预备役 🧑‍🦲', 8: '秃头预备役 🧑‍🦲',
  9: '传说级卷王 👑', 10: '传说级卷王 👑',
}
const levelTitle = computed(() => levelTitles[level.value] || '打工人')
const expPercent = computed(() => Math.round(((userStore?.currentExp || 0) / (userStore?.maxExp || 400)) * 100))
const completedCount = computed(() => todos.value.filter(t => t.is_completed).length)

const pressureColor = computed(() => {
  if (pressureValue.value <= 30) return '#5BAD7F'
  if (pressureValue.value <= 60) return '#FF8C42'
  if (pressureValue.value <= 80) return '#FF6B35'
  return '#FF3B3B'
})

const pressureEmoji = computed(() => {
  if (pressureValue.value <= 30) return '😊'
  if (pressureValue.value <= 60) return '😤'
  if (pressureValue.value <= 80) return '🤯'
  return '💥'
})

const todayStr = computed(() => {
  const d = new Date()
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 星期${days[d.getDay()]}`
})

const quickTypes = [
  { emoji: '🔬', label: '跑实验', type: '实验' },
  { emoji: '📝', label: '写论文', type: '论文' },
  { emoji: '📖', label: '读文献', type: '文献' },
  { emoji: '🗣', label: '开组会', type: '组会' },
  { emoji: '📧', label: '回邮件', type: '其他' },
  { emoji: '🎣', label: '摸小鱼', type: '其他' },
]

function refreshQuote() {
  const today = new Date()
  const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const savedDate = localStorage.getItem('moyu_quote_date')
  let idx: number
  
  if (savedDate === dateKey) {
    const savedIdx = localStorage.getItem('moyu_quote_idx')
    if (savedIdx !== null) {
      idx = parseInt(savedIdx)
    } else {
      idx = Math.floor(Math.random() * quotes.length)
    }
  } else {
    idx = Math.floor(Math.random() * quotes.length)
    localStorage.setItem('moyu_quote_date', dateKey)
    localStorage.setItem('moyu_quote_idx', idx.toString())
  }
  currentQuote.value = quotes[idx]
}

function addTask() {
  if (!newTaskName.value.trim()) return
  todos.value.push({
    id: Date.now(),
    content: newTaskName.value.trim(),
    is_completed: false,
    priority_label: '其他',
  })
  newTaskName.value = ''
}

function quickAdd(q: any) {
  todos.value.push({
    id: Date.now(),
    content: q.label,
    is_completed: false,
    priority_label: q.type,
  })
  gainExp(5)
}

function toggleTask(task: any) {
  if (!task.is_completed) {
    task.is_completed = true
    gainExp(15)
  } else {
    task.is_completed = false
  }
}

function deleteTask(id: number) {
  todos.value = todos.value.filter(t => t.id !== id)
}

function gainExp(amount: number) {
  flyExp.value = amount
  showExpFly.value = true
  setTimeout(() => { showExpFly.value = false }, 1500)
  
  if (userStore) {
    userStore.currentExp += amount
    todayExp.value += amount
    if (userStore.currentExp >= userStore.maxExp) {
      userStore.level += 1
      userStore.currentExp = userStore.currentExp - userStore.maxExp
      userStore.maxExp = Math.round(userStore.maxExp * 1.5)
    }
  }
}

function recordWater() {
  waterCount.value++
  lastWater.value = '刚刚'
  pressureValue.value = Math.max(0, pressureValue.value - 20)
  gainExp(5)
  pandaBubble.value = '💧 压力释放！'
  setTimeout(() => { pandaBubble.value = '' }, 2000)
}

function recordStand() {
  standCount.value++
  sittingTime.value = '0分钟'
  pressureValue.value = Math.max(0, pressureValue.value - 30)
  gainExp(8)
  pandaBubble.value = '🚶 压力释放！'
  setTimeout(() => { pandaBubble.value = '' }, 2000)
}

function startTomato() {
  tomatoState.value = 'running'
  currentPandaState.value = 'working' // 番茄钟开始时，熊猫状态改为working
  tomatoStartSeconds = tomatoSeconds.value
  let pressureCounter = 0
  tomatoTimer = setInterval(() => {
    if (tomatoSeconds.value <= 0) {
      clearInterval(tomatoTimer)
      clearInterval(pressureTimer)
      tomatoState.value = 'idle'
      tomatoSeconds.value = 25 * 60
      currentPandaState.value = 'celebrate' // 番茄钟完成时，熊猫庆祝
      gainExp(20)
      pandaBubble.value = '专注结束！先摸10分钟鱼～'
      setTimeout(() => { 
        pandaBubble.value = ''
        currentPandaState.value = 'relax' // 恢复默认放松状态
      }, 3000)
    } else {
      tomatoSeconds.value--
      pressureCounter++
      if (pressureCounter >= 30) {
        pressureValue.value = Math.min(100, pressureValue.value + 5)
        pressureCounter = 0
      }
    }
  }, 1000)
}

function pauseTomato() {
  clearInterval(tomatoTimer)
  tomatoState.value = 'paused'
}

function resumeTomato() {
  showQuitModal.value = false
  if (tomatoState.value === 'paused') {
    startTomato()
  }
}

function endTomato() {
  clearInterval(tomatoTimer)
  tomatoState.value = 'idle'
  tomatoSeconds.value = 25 * 60
  currentPandaState.value = 'relax' // 结束时恢复放松状态
  gainExp(20)
}

function confirmQuit() {
  clearInterval(tomatoTimer)
  const consumedSeconds = tomatoStartSeconds - tomatoSeconds.value
  const consumedMinutes = Math.floor(consumedSeconds / 60)
  
  tomatoState.value = 'idle'
  tomatoSeconds.value = 25 * 60
  showQuitModal.value = false
  
  // 记录摸鱼时间
  if (userStore && consumedMinutes > 0) {
    userStore.fishingMinutes = (userStore.fishingMinutes || 0) + consumedMinutes
  }
  
  pandaBubble.value = `摸鱼 ${consumedMinutes} 分钟记录完成 🐟`
  setTimeout(() => { pandaBubble.value = '' }, 2500)
}

function pokePanda() {
  const quote = fishingQuotes[Math.floor(Math.random() * fishingQuotes.length)]
  pandaSay.value = quote
  pandaBubble.value = quote
  setTimeout(() => { pandaBubble.value = '' }, 2500)
}

function setMood(emoji: string) {
  if (emoji === '😄') {
    currentMood.value = 'happy'
  } else if (emoji === '😩') {
    currentMood.value = 'tired'
  } else if (emoji === '🎣') {
    currentMood.value = 'fishing'
  }
  pandaBubble.value = `你的心情是 ${emoji}`
  setTimeout(() => { pandaBubble.value = '' }, 1500)
}

const clockInQuotes = [
  '打卡成功，工资原地等待',
  '你来了，公司又多撑了一天',
  '身体到岗，灵魂另议',
  '今日份表演，正式开始',
  '恭喜成功开始消耗生命',
]
const clockOutQuotes = [
  '活着下班，已经赢了',
  '今天的你，尽力了（也没什么用）',
  '恭喜逃出升天，明天继续受苦',
  '走了，明天的我会解决今天的问题',
]

function clockIn() {
  clockType.value = 'in'
  clockQuote.value = clockInQuotes[Math.floor(Math.random() * clockInQuotes.length)]
  showClockModal.value = true
  gainExp(10)
}

function clockOut() {
  clockType.value = 'out'
  clockQuote.value = clockOutQuotes[Math.floor(Math.random() * clockOutQuotes.length)]
  showClockModal.value = true
  gainExp(10)
}

function loadHistoryTasks() {
  showHistoryPanel.value = !showHistoryPanel.value
  if (!showHistoryPanel.value) return
  
  historyTasks.value = []
  const today = new Date()
  
  // 获取过去7天的任务
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const key = `moyu_tasks_${dateStr}`
    const savedTasks = localStorage.getItem(key)
    
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks)
        tasks.forEach((task: any) => {
          if (task.is_completed) {
            historyTasks.value.push({
              id: task.id,
              date: dateStr,
              content: task.content,
              tag: task.priority_label || '其他'
            })
          }
        })
      } catch {}
    }
  }
}

// 倒计时相关函数
function loadCountdowns() {
  const saved = localStorage.getItem('moyu_countdowns')
  if (saved) {
    try {
      const list = JSON.parse(saved)
      countdowns.value = list.map((item: any) => ({
        ...item,
        daysLeft: calculateDaysLeft(item.date)
      }))
    } catch {}
  }
  // 添加答辩倒计时作为默认项
  if (defenseDate.value && !countdowns.value.some(c => c.id === 'defense')) {
    countdowns.value.unshift({
      id: 'defense',
      name: '答辩',
      date: defenseDate.value,
      daysLeft: daysToDefense.value || 0
    })
  }
}

function calculateDaysLeft(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function addCountdown() {
  if (!newCountdownName.value.trim() || !newCountdownDate.value) {
    return
  }
  const newCountdown = {
    id: Date.now().toString(),
    name: newCountdownName.value.trim(),
    date: newCountdownDate.value,
    daysLeft: calculateDaysLeft(newCountdownDate.value)
  }
  countdowns.value.push(newCountdown)
  saveCountdowns()
  newCountdownName.value = ''
  newCountdownDate.value = ''
  showAddCountdown.value = false
}

function removeCountdown(id: string) {
  countdowns.value = countdowns.value.filter(c => c.id !== id)
  saveCountdowns()
}

function saveCountdowns() {
  const toSave = countdowns.value.filter(c => c.id !== 'defense')
  localStorage.setItem('moyu_countdowns', JSON.stringify(toSave))
}

// 工作时间计时
let workTimer: any = null
onMounted(() => {
  const savedNickname = localStorage.getItem('moyu_nickname')
  if (savedNickname && userStore) {
    userStore.nickname = savedNickname
  }
  
  const savedDefenseDate = localStorage.getItem('moyu_defenseDate')
  if (savedDefenseDate) defenseDate.value = savedDefenseDate
  
  // 加载倒计时
  loadCountdowns()
  
  // 初始化每日一句
  const today = new Date()
  const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const savedDate = localStorage.getItem('moyu_quote_date')
  
  if (savedDate === dateKey) {
    const savedIdx = localStorage.getItem('moyu_quote_idx')
    if (savedIdx !== null) {
      currentQuote.value = quotes[parseInt(savedIdx)]
    }
  } else {
    const idx = Math.floor(Math.random() * quotes.length)
    currentQuote.value = quotes[idx]
    localStorage.setItem('moyu_quote_date', dateKey)
    localStorage.setItem('moyu_quote_idx', idx.toString())
  }
  
  workTimer = setInterval(() => {
    workHours.value = Math.round((workHours.value + 1/3600) * 10) / 10
  }, 1000)
})
onUnmounted(() => {
  clearInterval(workTimer)
  clearInterval(tomatoTimer)
  clearInterval(pressureTimer)
})
</script>

<style scoped>
.my-character-img {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}
.banner-avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255,140,66,0.3);
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.avatar-fallback-char {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #FFE8D6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}
.dashboard {
  padding: 20px 24px;
  background: #FAF7F2;
  min-height: 100vh;
  font-family: 'PingFang SC', system-ui, sans-serif;
  font-size: 15px;
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #FFF8F2 0%, #FFF0E0 100%);
  border-radius: 16px;
  margin-bottom: 20px;
  border: 1px solid #FFE8CC;
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 20px 24px;
}
.banner-left {
  flex: 0 0 60%;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.banner-right {
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  border-left: 1px solid #FFE8CC;
}
.banner-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.date-defense {
  display: flex;
  gap: 12px;
  font-size: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.growth-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 4px;
  border-top: 1px solid #FFE8CC;
}
.level-badge {
  font-size: 13px;
  font-weight: 600;
  color: #FF8C42;
}
.exp-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}
.exp-bar-inner {
  width: 60%;
  height: 6px;
  background: #EDE8E0;
  border-radius: 3px;
  overflow: hidden;
  min-width: 80px;
}
.exp-fill-inner {
  height: 100%;
  background: #5BAD7F;
  transition: width 0.3s ease;
}
.exp-nums {
  font-size: 12px;
  color: #9E9189;
  white-space: nowrap;
}

/* 倒计时板块 */
.countdowns-section {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #FFE8CC;
}
.countdowns-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.countdown-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #FFF8F2;
  border: 1px solid #FFD0A0;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  color: #3D3530;
  white-space: nowrap;
  position: relative;
}
.countdown-pill.urgent {
  background: #FFE8D1;
  border-color: #FF8C42;
  color: #FF6B35;
  font-weight: 600;
}
.countdown-icon {
  font-size: 12px;
  flex-shrink: 0;
}
.countdown-text {
  flex: 0 1 auto;
}
.countdown-remove {
  background: none;
  border: none;
  color: #9E9189;
  cursor: pointer;
  font-size: 12px;
  padding: 0 2px;
  flex-shrink: 0;
  margin-left: 2px;
}
.countdown-remove:hover {
  color: #FF6B6B;
}
.btn-add-countdown {
  background: none;
  border: 1px dashed #FFD0A0;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  color: #FF8C42;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-add-countdown:hover {
  background: #FFFBF0;
  border-color: #FF8C42;
}

/* 倒计时弹窗 */
.countdown-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.countdown-modal {
  background: white;
  border-radius: 16px;
  padding: 24px;
  min-width: 300px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.countdown-modal .modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #3D3530;
  margin-bottom: 16px;
}
.countdown-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #EDE8E0;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 12px;
  font-family: inherit;
  color: #3D3530;
}
.countdown-input:focus {
  outline: none;
  border-color: #FF8C42;
  background: #FFFBF0;
}
.countdown-modal-buttons {
  display: flex;
  gap: 12px;
}
.quote-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  text-align: center;
  min-height: 80px;
}
.quote-open {
  font-size: 32px;
  color: #FF8C42;
  line-height: 1;
}
.quote-close {
  font-size: 32px;
  color: #FF8C42;
  line-height: 1;
}
.quote-text {
  font-size: 20px;
  color: #FF8C42;
  font-weight: 700;
  font-style: italic;
  flex: 0 1 auto;
  max-width: 100%;
  padding: 8px 0;
}
.avatar-wrap { position: relative; }
.my-character {
  width: 60px; height: 70px;
  position: relative; display: flex; flex-direction: column; align-items: center;
}
.char-hair {
  width: 52px; height: 22px;
  background: #3D2B1F; border-radius: 26px 26px 0 0;
  position: absolute; top: 0; z-index: 2;
}
.char-face {
  width: 48px; height: 44px;
  background: #FFD4B8; border-radius: 50%;
  position: absolute; top: 12px; z-index: 1;
}
.char-eye {
  width: 6px; height: 6px; background: #3D2B1F;
  border-radius: 50%; position: absolute; top: 14px;
}
.char-eye.left { left: 10px; }
.char-eye.right { right: 10px; }
.char-blush {
  width: 10px; height: 6px;
  background: rgba(255,150,150,0.5); border-radius: 50%;
  position: absolute; top: 22px;
}
.char-blush.left { left: 6px; }
.char-blush.right { right: 6px; }
.char-mouth {
  width: 14px; height: 7px;
  border: 2px solid #3D2B1F; border-top: none;
  border-radius: 0 0 8px 8px;
  position: absolute; top: 28px; left: 17px;
}
.char-body {
  width: 40px; height: 24px;
  background: #FFF; border-radius: 0 0 20px 20px;
  position: absolute; bottom: 0;
  display: flex; align-items: center; justify-content: center;
}
.char-heart { color: #FF8CA0; font-size: 10px; }
.status-bubble {
  position: absolute; top: -20px; left: -8px;
  background: white; border: 1px solid #FFD0A0;
  border-radius: 10px; padding: 3px 8px;
  font-size: 11px; color: #FF8C42; white-space: nowrap;
}
.greeting { font-size: 24px; font-weight: 700; color: #3D3530; }
.date-text { font-size: 13px; color: #9E9189; }
.defense-countdown { 
  font-size: 13px; font-weight: 500;
}
.refresh-btn {
  background: none; 
  border: none; 
  cursor: pointer;
  color: #FF8C42; 
  font-size: 20px; 
  flex-shrink: 0;
  padding: 4px 8px;
  transition: transform 0.2s ease;
}
.refresh-btn:hover {
  transform: rotate(180deg);
}

/* 主体 */
.main-content { display: flex; gap: 20px; }
.left-col { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.right-col { width: 300px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }

/* 卡片 */
.card {
  background: white; border-radius: 16px;
  padding: 20px; box-shadow: 0 2px 12px rgba(61,53,48,0.08);
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: 0 4px 20px rgba(61,53,48,0.14); }

/* 任务卡片 */
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-header-buttons { display: flex; gap: 8px; }
.card-title { font-size: 16px; font-weight: 700; color: #3D3530; display: flex; align-items: center; gap: 6px; }
.title-icon { font-size: 18px; }
.task-count { font-size: 14px; color: #9E9189; font-weight: 400; }
.btn-add {
  background: #FF8C42; color: white; border: none;
  border-radius: 20px; padding: 6px 14px; font-size: 13px;
  cursor: pointer; font-weight: 600;
}
.btn-add:hover { background: #e07a38; }
.btn-history {
  background: #5BAD7F; color: white; border: none;
  border-radius: 20px; padding: 6px 14px; font-size: 13px;
  cursor: pointer; font-weight: 600;
}
.btn-history:hover { background: #4a9968; }

.task-inline-create {
  background: #FFFBF0;
  border: 1.5px dashed #FFD0A0;
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.create-icon {
  font-size: 18px;
  color: #FFD0A0;
  flex-shrink: 0;
}
.task-inline-create input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
  font-family: inherit;
  color: #3D3530;
}
.task-inline-create input::placeholder {
  color: #FFB87F;
}
.task-inline-create input:focus {
  outline: none;
}
.task-type-select {
  display: none;
}
.btn-confirm {
  background: #5BAD7F; color: white; border: none;
  border-radius: 10px; padding: 8px 14px; font-size: 13px; cursor: pointer;
}
.btn-cancel {
  background: #EDE8E0; color: #9E9189; border: none;
  border-radius: 10px; padding: 8px 14px; font-size: 13px; cursor: pointer;
}

.task-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.task-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; background: #FAF7F2;
  border-radius: 12px; transition: all 0.2s;
}
.task-item.done { opacity: 0.6; }
.task-item.done .task-name { text-decoration: line-through; color: #9E9189; }
.task-check {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid #5BAD7F; background: white;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: #5BAD7F; flex-shrink: 0;
  transition: all 0.2s;
}
.task-item.done .task-check { background: #5BAD7F; color: white; }
.task-name { flex: 1; font-size: 14px; color: #3D3530; }
.task-del {
  background: none; border: none; color: #ccc;
  cursor: pointer; font-size: 16px; padding: 0 4px;
}
.task-del:hover { color: #ff6b6b; }
.task-empty { text-align: center; color: #9E9189; font-size: 14px; padding: 20px 0; }

/* 提醒卡片 */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.reminder-item {
  min-height: 140px;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
}
.reminder-item.water { background: #F0F9FF; }
.reminder-item.stand { background: #F0FFF4; }
.reminder-item.tomato { background: #FFF8F0; }
.reminder-icon { font-size: 28px; }
.reminder-title { font-size: 16px; font-weight: 700; color: #3D3530; }
.reminder-sub { font-size: 13px; color: #9E9189; }
.btn-record {
  background: #5BAD7F; color: white; border: none;
  border-radius: 8px; padding: 7px 16px; font-size: 15px; cursor: pointer;
  font-weight: 600;
}
.btn-rest {
  background: #5BAD7F; color: white; border: none;
  border-radius: 8px; padding: 7px 16px; font-size: 15px; cursor: pointer;
  font-weight: 600;
}
.tomato-label { font-size: 12px; color: #9E9189; }
.tomato-time { font-size: 28px; font-weight: 700; color: #FF8C42; }
.tomato-time-large { font-size: 32px; font-weight: 700; color: #FF8C42; line-height: 1; }
.btn-tomato {
  width: 40px; height: 40px; border-radius: 50%;
  background: #FF8C42; color: white; border: none;
  font-size: 14px; cursor: pointer; display: flex;
  align-items: center; justify-content: center;
}
.btn-tomato-large {
  background: #FF8C42;
  border-radius: 24px;
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-tomato-large:hover {
  background: #FF7A2E;
}
.tomato-running {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
}
.tomato-buttons-group {
  display: flex;
  gap: 8px;
  width: 100%;
}
.tomato-paused {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.tomato-buttons-group {
  display: flex;
  gap: 8px;
  width: 100%;
}

.tomato-buttons-group-three {
  display: flex;
  gap: 6px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-tomato-pause,
.btn-tomato-quit,
.btn-tomato-resume,
.btn-tomato-end,
.btn-tomato-giveup {
  flex: 1;
  min-width: 80px;
  height: 36px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-tomato-pause {
  background: #EDE8E0;
  color: #3D3530;
}
.btn-tomato-pause:hover {
  background: #DDD3CC;
}

.btn-tomato-quit {
  background: #FFE8E8;
  color: #FF6B6B;
}
.btn-tomato-quit:hover {
  background: #FFD8D8;
}

.btn-tomato-resume {
  background: #5BAD7F;
  color: white;
  flex-basis: 45%;
}
.btn-tomato-resume:hover {
  background: #4a9968;
}

.btn-tomato-end {
  background: #FF6B6B;
  color: white;
  flex-basis: 45%;
}
.btn-tomato-end:hover {
  background: #FF5555;
}

.btn-tomato-giveup {
  background: #EDE8E0;
  color: #9E9189;
  flex-basis: 100%;
}
.btn-tomato-giveup:hover {
  background: #DDD3CC;
}

/* 跑路二次确认弹窗 */
.quit-modal {
  background: white;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  min-width: 320px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
  animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
}

.quit-panda {
  font-size: 48px;
  margin-bottom: 16px;
}

.quit-title {
  font-size: 18px;
  font-weight: 700;
  color: #3D3530;
  margin-bottom: 8px;
}

.quit-sub {
  font-size: 14px;
  color: #9E9189;
  line-height: 1.6;
  margin-bottom: 20px;
}

.quit-btns {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.btn-stay {
  background: #EDE8E0;
  color: #9E9189;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-stay:hover {
  background: #DDD3CC;
}

.btn-quit {
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-quit:hover {
  background: #FF5555;
}

.pressure-display {
  display: flex; align-items: center; gap: 6px; justify-content: center;
}
.pressure-emoji { font-size: 20px; }
.pressure-bar {
  width: 60px; height: 6px; background: #EDE8E0;
  border-radius: 3px; overflow: hidden;
}
.pressure-bar.pulse { animation: pressurePulse 0.6s ease-in-out infinite; }
.pressure-fill {
  height: 100%; transition: width 0.3s ease, background-color 0.3s ease;
}
.pressure-alert { font-size: 11px; color: #FF6B6B; font-weight: 600; margin-bottom: 4px; }
.pressure-value { font-size: 12px; color: #3D3530; font-weight: 600; }

/* 打卡按钮 */
.clock-row { display: flex; gap: 16px; }
.btn-clock-in, .btn-clock-out {
  flex: 1; height: 56px; border: none; border-radius: 16px;
  font-size: 16px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: transform 0.15s;
}
.btn-clock-in:hover, .btn-clock-out:hover { transform: translateY(-2px); }
.btn-clock-in { background: linear-gradient(135deg, #5BAD7F, #4CAF70); color: white; }
.btn-clock-out { background: linear-gradient(135deg, #FF8C42, #FF6B35); color: white; }

/* 右栏 */
.card-title-sm { font-size: 14px; font-weight: 700; color: #3D3530; margin-bottom: 14px; }
.overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.overview-item {
  background: #FAF7F2; border-radius: 10px; padding: 12px;
  display: flex; flex-direction: column; gap: 4px;
}
.ov-icon { font-size: 16px; }
.ov-label { font-size: 11px; color: #9E9189; }
.ov-value { font-size: 28px; font-weight: 700; color: #3D3530; }
.ov-unit { font-size: 12px; font-weight: 400; color: #9E9189; }

/* 熊猫卡片 */
.panda-card { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.panda-wrap { position: relative; cursor: pointer; }
.panda-css {
  width: 100px; height: 180px; position: relative;
  transition: transform 0.15s;
}
.panda-wrap:hover .panda-css { transform: scale(1.05); }
.p-ear {
  width: 24px; height: 24px; background: #2C2C2C;
  border-radius: 50%; position: absolute; top: 0;
}
.p-ear.left { left: 4px; }
.p-ear.right { right: 4px; }
.p-face {
  width: 70px; height: 64px; background: white;
  border-radius: 50%; position: absolute; top: 12px; left: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.p-eye-patch {
  width: 22px; height: 16px; background: #2C2C2C;
  border-radius: 50%; position: absolute; top: 14px;
  transform: rotate(-10deg);
}
.p-eye-patch.left { left: 8px; transform: rotate(10deg); }
.p-eye-patch.right { right: 8px; transform: rotate(-10deg); }
.p-eye {
  width: 8px; height: 8px; background: white;
  border-radius: 50%; position: absolute; top: 17px;
}
.p-eye.left { left: 13px; }
.p-eye.right { right: 13px; }
.p-blush {
  width: 12px; height: 8px;
  background: rgba(255,182,193,0.7); border-radius: 50%;
  position: absolute; top: 34px;
}
.p-blush.left { left: 8px; }
.p-blush.right { right: 8px; }
.p-nose {
  width: 8px; height: 5px; background: #2C2C2C;
  border-radius: 50%; position: absolute;
  top: 34px; left: 31px;
}
.p-mouth {
  width: 16px; height: 8px;
  border: 2px solid #2C2C2C; border-top: none;
  border-radius: 0 0 8px 8px;
  position: absolute; top: 42px; left: 27px;
}
/* 熊猫身体 */
.p-body {
  width: 50px; height: 35px; background: white;
  border-radius: 24px; position: absolute;
  bottom: 0; left: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
/* 熊猫手臂 */
.p-arm {
  width: 8px; height: 20px; background: #2C2C2C;
  border-radius: 4px; position: absolute;
  top: 85px; transform-origin: top center;
  transition: transform 0.3s ease;
}
.p-arm.left { left: 12px; }
.p-arm.right { right: 12px; }

/* 根据mood调整手臂动作 */
.panda-css.mood-happy .p-arm.left { transform: rotate(-150deg); }
.panda-css.mood-happy .p-arm.right { transform: rotate(150deg); }

.panda-css.mood-tired .p-arm.left { transform: rotate(-10deg); }
.panda-css.mood-tired .p-arm.right { transform: rotate(10deg); }

.panda-css.mood-fishing .p-arm.left { transform: rotate(45deg); }
.panda-css.mood-fishing .p-arm.right { transform: rotate(10deg); }
.panda-bubble {
  position: absolute; top: -10px; left: 85px;
  background: white; border: 1px solid #FFD0A0;
  border-radius: 10px; padding: 6px 10px;
  font-size: 12px; color: #FF8C42; white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.panda-say { font-size: 13px; color: #9E9189; text-align: center; }



/* EXP飞字 */
.exp-fly {
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px; font-weight: 700; color: #FF8C42;
  pointer-events: none; z-index: 9999;
}
.exp-fly-enter-active { animation: flyUp 1.5s ease-out forwards; }
@keyframes flyUp {
  0% { opacity: 1; transform: translate(-50%, -50%); }
  100% { opacity: 0; transform: translate(-50%, -150%); }
}

/* 压力条闪烁动画 */
@keyframes pressurePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 历史抽屉 */
.history-drawer {
  position: fixed; right: 0; top: 0; bottom: 0;
  width: 300px; background: white;
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);
  display: flex; flex-direction: column;
  z-index: 1100; animation: slideIn 0.3s ease;
}
@keyframes slideIn {
  from { transform: translateX(300px); }
  to { transform: translateX(0); }
}
.history-header {
  padding: 16px; border-bottom: 1px solid #EDE8E0;
  display: flex; align-items: center; justify-content: space-between;
}
.history-title { font-size: 16px; font-weight: 700; color: #3D3530; }
.history-close {
  background: none; border: none; cursor: pointer;
  font-size: 18px; color: #9E9189; padding: 0;
}
.history-content {
  flex: 1; overflow-y: auto; padding: 12px;
}
.history-empty {
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: #9E9189; font-size: 14px;
}
.history-list { display: flex; flex-direction: column; gap: 12px; }
.history-item {
  padding: 12px; background: #FAF7F2; border-radius: 10px;
  display: flex; flex-direction: column; gap: 4px;
}
.history-item-date { font-size: 11px; color: #9E9189; }
.history-item-content { font-size: 13px; color: #3D3530; font-weight: 500; }
.history-item-tag {
  font-size: 11px; color: #9E9189;
  background: white; border-radius: 4px; padding: 2px 6px; display: inline-block;
  width: fit-content;
}

/* 打卡弹窗 */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.clock-modal {
  background: white; border-radius: 24px;
  padding: 40px; text-align: center;
  min-width: 320px; box-shadow: 0 8px 40px rgba(0,0,0,0.15);
  animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes modalIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-emoji { font-size: 48px; margin-bottom: 12px; }
.modal-title { font-size: 22px; font-weight: 700; color: #3D3530; margin-bottom: 8px; }
.modal-quote { font-size: 15px; color: #FF8C42; font-style: italic; margin-bottom: 8px; }
.modal-exp { font-size: 14px; color: #5BAD7F; font-weight: 600; margin-bottom: 20px; }
.modal-close {
  background: #FF8C42; color: white; border: none;
  border-radius: 20px; padding: 12px 32px;
  font-size: 15px; font-weight: 600; cursor: pointer;
}
.clock-modal.out .modal-close { background: #5BAD7F; }
</style>