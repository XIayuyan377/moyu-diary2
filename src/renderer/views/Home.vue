<template>
  <div class="home-container">
    <!-- ═══════════════════════════════════════════════════════════
         顶部导航栏 - 52px高
         ═══════════════════════════════════════════════════════════ -->
    <header class="home-header">
      <div class="header-content">
        <!-- 左边：Logo -->
        <div class="header-logo">
          <span class="logo-emoji">🐼</span>
          <span class="logo-text">摸鱼日记</span>
        </div>

        <!-- 右边：导航图标 -->
        <nav class="header-nav">
          <button class="nav-btn" title="数据统计" @click="$emit('navigate', 'report')">📊</button>
          <button class="nav-btn" title="任务管理" @click="handleNavigation('tasks')">📋</button>
          <button class="nav-btn" title="心情记录" @click="handleNavigation('mood')">😊</button>
          <button class="nav-btn" title="设置" @click="handleNavigation('settings')">⚙️</button>
        </nav>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════════════
         主体三列布局
         ═══════════════════════════════════════════════════════════ -->
    <main class="home-main">
      <!-- 【左列 28%】- 滚滚状态栏 -->
      <aside class="home-column column-left">
        <!-- 卡片1：滚滚主形象卡 -->
        <div class="card card-panda">
          <!-- 上半：滚滚和气泡 -->
          <div class="panda-section">
            <div class="panda-container">
              <div class="panda-mood" :class="`panda-${pandaMood}`">{{ pandaEmoji }}</div>
            </div>
            <div class="panda-bubble">
              <div class="bubble-content">{{ pandaSayings[bubbleIndex % pandaSayings.length] }}</div>
              <span class="bubble-triangle"></span>
            </div>
          </div>

          <!-- 分割线（虚线，手账感） -->
          <div class="divider-dashed"></div>

          <!-- 下半：角色信息 -->
          <div class="panda-info">
            <div class="info-header">
              <span class="level-badge">Lv.{{ pandaLevel }} · 资深科研民工</span>
            </div>
            <div class="exp-section mt-md">
              <div class="exp-bar">
                <div class="exp-fill" :style="{ width: expPercent + '%' }"></div>
              </div>
              <div class="exp-text">{{ currentExp }} / {{ maxExp }} EXP</div>
            </div>
            <div class="daily-quote mt-lg">{{ dailyWisdom }}</div>
          </div>
        </div>

        <!-- 卡片2：今日状态速览 -->
        <div class="card card-stats mt-lg">
          <div class="stat-row">
            <span class="stat-label">在岗时长</span>
            <span class="stat-value">{{ onSiteHours }}h {{ onSiteMinutes }}m</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-row">
            <span class="stat-label">学术冥想</span>
            <span class="stat-value">{{ fishingHours }}h {{ fishingMinutes }}m</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-row stat-task-rate">
            <div class="task-circle">
              <svg class="task-svg" viewBox="0 0 100 100">
                <circle class="task-bg" cx="50" cy="50" r="45" />
                <circle
                  class="task-fill"
                  cx="50"
                  cy="50"
                  r="45"
                  :style="{ strokeDasharray: `${circumference * taskCompletion / 100} ${circumference}` }"
                />
              </svg>
              <div class="task-text">{{ taskCompletion }}%</div>
            </div>
            <span class="task-label">今日任务完成率</span>
          </div>
        </div>
      </aside>

      <!-- 【中列 44%】- 今日工作台 -->
      <section class="home-column column-center">
        <!-- 卡片1：每日圣旨（必须最顶部） -->
        <div class="card card-decree">
          <div class="decree-quote">「</div>
          <div class="decree-content">
            <p class="decree-text">{{ dailyMotivation }}</p>
          </div>
          <div class="decree-footer">
            <span class="decree-source">滚滚今日推送</span>
            <span class="decree-emoji">🐼</span>
          </div>
          <button class="btn-refresh" @click="refreshMotivation" title="刷新">🔄</button>
        </div>

        <!-- 卡片2：今日课题（任务列表） -->
        <div class="card card-tasks mt-lg">
          <div class="tasks-header">
            <h3 class="tasks-title">今日课题 · {{ totalTasks }}项待攻克</h3>
            <div class="task-filters">
              <button
                v-for="filter in taskFilters"
                :key="filter"
                :class="['filter-btn', { active: currentFilter === filter }]"
                @click="currentFilter = filter"
              >
                {{ filter }}
              </button>
            </div>
          </div>

          <div class="tasks-list mt-lg">
            <div
              v-for="(task, idx) in filteredTasks"
              :key="idx"
              :class="['task-item', { completed: task.completed }]"
              @click="toggleTask(idx)"
            >
              <div class="task-priority-dot" :class="`priority-${task.priority}`"></div>
              <div class="task-content">
                <span class="task-text" :class="{ strike: task.completed }">{{ task.title }}</span>
              </div>
              <div class="task-right">
                <span class="task-tag" :class="`tag-${task.type}`">{{ task.emoji }} {{ task.type }}</span>
                <div class="task-checkbox" :class="{ checked: task.completed }">
                  <span v-if="task.completed" class="checkbox-icon">✓</span>
                </div>
              </div>
              <!-- 完成印章 -->
              <div v-if="task.completed" class="completion-stamp">已攻克</div>
            </div>
          </div>

          <!-- 新增课题按钮 -->
          <button class="btn-add-task mt-lg">+ 新增课题</button>
        </div>

        <!-- 卡片3：今日软件使用 -->
        <div class="card card-software mt-lg">
          <h3 class="software-title">今日软件使用</h3>
          <div class="software-grid mt-lg">
            <div
              v-for="(app, idx) in topSoftware"
              :key="idx"
              :class="['software-item', { 'most-used': idx === 0 }]"
            >
              <div class="software-emoji">{{ app.emoji }}</div>
              <div class="software-info">
                <div class="software-name">{{ app.name }}</div>
                <div class="software-time">{{ app.hours }}h {{ app.minutes }}m</div>
              </div>
              <span v-if="idx === 0" class="app-companion">今日伴侣</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 【右列 28%】- 心情与天气 -->
      <aside class="home-column column-right">
        <!-- 卡片1：今日天气 -->
        <div class="card card-weather">
          <div class="weather-header">
            <div class="weather-icon">{{ weatherEmoji }}</div>
            <div class="weather-info">
              <div class="weather-location">{{ weatherCity }}</div>
              <div class="weather-temp">{{ weatherTemp }}°C</div>
            </div>
          </div>
          <div class="weather-copy">{{ weatherSentence }}</div>
        </div>

        <!-- 卡片2：心情快记 -->
        <div class="card card-mood mt-lg">
          <div class="mood-labels">6个心情一次记下</div>
          <div class="mood-buttons">
            <button
              v-for="(mood, idx) in moods"
              :key="idx"
              :class="['mood-btn', { active: selectedMood === idx }]"
              @click="selectMood(idx)"
            >
              <div class="mood-icon">{{ mood.emoji }}</div>
              <div class="mood-name">{{ mood.name }}</div>
            </button>
          </div>
          <!-- 今日心情轨迹 -->
          <div class="mood-timeline mt-lg">
            <div class="timeline-label">今日心情轨迹</div>
            <div class="timeline-items">
              <span
                v-for="(m, idx) in todayMoodTrack"
                :key="idx"
                class="timeline-emoji"
                :title="m.time"
              >
                {{ m.emoji }}
              </span>
            </div>
          </div>
        </div>

        <!-- 卡片3：滚滚提醒 -->
        <div class="card card-reminder mt-lg">
          <div class="reminder-icon">💬</div>
          <div class="reminder-content">
            <p class="reminder-text">{{ currentReminder }}</p>
          </div>
        </div>
      </aside>
    </main>

    <!-- ═══════════════════════════════════════════════════════════
         底部浮动按钮
         ═══════════════════════════════════════════════════════════ -->
    <div class="floating-button-container">
      <button class="btn-floating" @click="finishDay">
        <span class="floating-emoji">🐼</span>
        <span class="floating-text">今天搞完啦</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ™️ 定义 emit
const emit = defineEmits(['navigate'])

// ™️ 导航方法
const handleNavigation = (page) => {
  // 其他页面暂未实现，可以在这里添加提示
  console.log(`导航到: ${page}`)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 响应式状态数据
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━【左列：滚滚状态栏】━━━
const pandaMood = ref('normal') // normal, happy, tired, sad
const bubbleIndex = ref(0)
const pandaLevel = ref(12)
const currentExp = ref(850)
const maxExp = ref(1000)
const expPercent = computed(() => Math.round((currentExp.value / maxExp.value) * 100))

// 滚滚的台词库
const pandaSayings = [
  '今天也是假装努力的一天呢',
  '你的CPU又烫了吗?',
  '论文的事儿等会儿说',
  '我就静静地看你摸鱼...',
  '真·学术冥想进行中',
  '下班还有多久啊....',
  '偷偷看一眼论文?',
]

const dailyWisdom = '尽管事情很难，但你还是很努力的样子呐。'

// 时长统计
const onSiteHours = ref(8)
const onSiteMinutes = ref(24)
const fishingHours = ref(2)
const fishingMinutes = ref(15)
const taskCompletion = ref(65)

// 圆环图数据
const circumference = computed(() => 2 * Math.PI * 45)

// ━━━【中列：今日工作台】━━━

// 每日励志句子库
const motivations = [
  '天气好成这样，但你还是要上班',
  '与其焦虑不如直接摸鱼',
  '论文提交期限之前的时间，都是假的',
  '想什么呢，继续写论文',
  '人生就像论文一样，越写越短',
  '科研的本质是等待deadline的到来',
  '你的idea很好，但deadline更好',
]

const dailyMotivation = ref('天气好成这样，但你还是要上班')

const refreshMotivation = () => {
  const randomIdx = Math.floor(Math.random() * motivations.length)
  dailyMotivation.value = motivations[randomIdx]
}

// 任务相关
const tasks = ref([
  { title: '审视论文第三章的逻辑', priority: 'high', type: '🔬改论文', emoji: '🔬', completed: false },
  { title: '训练BERT模型（batch=32）', priority: 'high', type: '💻跑实验', emoji: '💻', completed: true },
  { title: '阅读NIPS 2023最新论文', priority: 'medium', type: '📖读文献', emoji: '📖', completed: false },
  { title: '周五组会PPT准备', priority: 'medium', type: '🗣开组会', emoji: '🗣', completed: false },
  { title: '冥想30分钟', priority: 'low', type: '☕学术冥想', emoji: '☕', completed: false },
  { title: '修改实验配置文件', priority: 'high', type: '💻跑实验', emoji: '💻', completed: false },
  { title: '整理研究笔记', priority: 'low', type: '📖读文献', emoji: '📖', completed: false },
])

const currentFilter = ref('全部')
const taskFilters = ['全部', '🔬改论文', '💻跑实验', '📖读文献', '🗣开组会', '☕学术冥想']
const totalTasks = computed(() => tasks.value.length)

const filteredTasks = computed(() => {
  if (currentFilter.value === '全部') {
    return tasks.value
  }
  return tasks.value.filter(t => t.type === currentFilter.value)
})

const toggleTask = (idx) => {
  const task = tasks.value[idx]
  task.completed = !task.completed
}

// 软件使用数据
const topSoftware = ref([
  { emoji: '🔬', name: 'VS Code', hours: 4, minutes: 32 },
  { emoji: '📊', name: 'Jupyter', hours: 2, minutes: 18 },
  { emoji: '🌐', name: 'Scholar', hours: 1, minutes: 45 },
  { emoji: '📝', name: 'Notion', hours: 0, minutes: 58 },
])

// ━━━【右列：心情与天气】━━━

// 天气数据
const weatherEmoji = ref('☀️')
const weatherCity = ref('上海')
const weatherTemp = ref(22)
const weatherSentence = ref('天气好成这样，但你还是要上班。')

// 心情按钮库
const moods = [
  { emoji: '😎', name: '还活着' },
  { emoji: '😩', name: '累了' },
  { emoji: '🤡', name: '破防了' },
  { emoji: '🔥', name: '打了鸡血' },
  { emoji: '🫠', name: '融化了' },
  { emoji: '😶', name: '麻了' },
]

const selectedMood = ref(null)
const todayMoodTrack = ref([
  { emoji: '😎', time: '09:30' },
  { emoji: '😩', time: '12:45' },
  { emoji: '🤡', time: '14:20' },
  { emoji: '☕', time: '15:00' },
  { emoji: '🔥', time: '16:30' },
])

const selectMood = (idx) => {
  selectedMood.value = selectedMood.value === idx ? null : idx
  // 添加到心情轨迹
  if (selectedMood.value !== null) {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    todayMoodTrack.value.push({
      emoji: moods[idx].emoji,
      time: timeStr,
    })
  }
}

// 滚滚提醒
const currentReminder = ref('早安，今天也要假装努力呢～')
const remindersMap = {
  9: '早安，今天也要假装努力呢～',
  12: '去恰饭吧，顺便想想下午怎么摸鱼～',
  15: '下午茶时间，低调摸鱼中...',
  18: '到点了，今天能跑就跑～',
  21: '还在？你是真的卷啊...',
  23: '天都黑了，该睡觉了吧？',
}

// 更新提醒信息
const updateReminder = () => {
  const hour = new Date().getHours()
  let reminder = '今天同学们真努力啊...'

  if (hour >= 9 && hour < 12) {
    reminder = remindersMap[9]
  } else if (hour >= 12 && hour < 15) {
    reminder = remindersMap[12]
  } else if (hour >= 15 && hour < 18) {
    reminder = remindersMap[15]
  } else if (hour >= 18 && hour < 21) {
    reminder = remindersMap[18]
  } else if (hour >= 21) {
    reminder = remindersMap[21]
  }

  currentReminder.value = reminder
}

// 生成熊猫emoji（根据状态）
const pandaEmoji = computed(() => {
  const moods = {
    normal: '🐼',
    happy: '😊',
    tired: '😴',
    sad: '😔',
  }
  return moods[pandaMood.value] || '🐼'
})

// 按钮动作
const finishDay = () => {
  alert('🎉 今天的学术之路圆满落幕！明天再来摸鱼吧～')
  // 这里可以触发关闭、保存数据等操作
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 生命周期钩子
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let reminderInterval
let bubbleInterval

onMounted(() => {
  // 初始化提醒
  updateReminder()
  reminderInterval = setInterval(updateReminder, 60000) // 每分钟更新一次

  // 初始化气泡
  bubbleInterval = setInterval(() => {
    bubbleIndex.value++
  }, 5000) // 每5秒切换一次

  // 模拟实时更新时长
  setInterval(() => {
    onSiteMinutes.value++
    if (onSiteMinutes.value >= 60) {
      onSiteMinutes.value = 0
      onSiteHours.value++
    }
  }, 60000)
})

onUnmounted(() => {
  clearInterval(reminderInterval)
  clearInterval(bubbleInterval)
})
</script>

<style scoped>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   容器和布局
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.home-container {
  width: 100%;
  height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ━━━【顶部导航栏】━━━ */
.home-header {
  height: 52px;
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-xs);
  padding: 0 var(--spacing-2xl);
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  font-family: var(--font-family-round);
}

.logo-emoji {
  font-size: 32px;
  line-height: 1;
}

.logo-text {
  font-size: var(--font-size-xl);
}

.header-nav {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: var(--spacing-xs);
  transition: all 0.2s ease;
  border-radius: var(--radius-md);
}

.nav-btn:hover {
  background-color: var(--color-bg-light);
  transform: scale(1.1);
}

/* ━━━【主体内容】━━━ */
.home-main {
  flex: 1;
  display: flex;
  gap: var(--spacing-2xl);
  padding: var(--spacing-2xl);
  overflow: hidden;
  overflow-y: auto;
}

.home-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  overflow-y: auto;
}

.home-column::-webkit-scrollbar {
  width: 6px;
}

.home-column::-webkit-scrollbar-track {
  background: transparent;
}

.home-column::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.home-column::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

.column-left {
  flex: 0 0 28%;
}

.column-center {
  flex: 1 1 44%;
}

.column-right {
  flex: 0 0 28%;
}

/* ━━━【卡片基础样式】━━━ */
.card {
  background-color: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.card-panda {
  background-color: var(--color-bg-green);
  border: 2px solid rgba(91, 173, 127, 0.3);
}

.card-stats {
  background-color: var(--color-bg-warm);
  border: 2px solid rgba(255, 140, 66, 0.2);
}

.card-decree {
  background: linear-gradient(135deg, #FFF8F0 0%, #FFE8D0 100%);
  border: 2px dashed rgba(255, 140, 66, 0.4);
  position: relative;
}

.card-tasks {
  background-color: var(--color-bg-card);
}

.card-software {
  background-color: var(--color-bg-card);
}

.card-weather {
  background: linear-gradient(135deg, #E8F4F8 0%, #E8F5EE 100%);
  border: 1px solid rgba(91, 173, 127, 0.2);
}

.card-mood {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
}

.card-reminder {
  background: linear-gradient(135deg, #FFE8F0 0%, #FFF5E6 100%);
  border: 1px solid rgba(255, 182, 193, 0.3);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   【左列：滚滚状态栏】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* 滚滚主形象区 */
.panda-section {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}

.panda-container {
  display: flex;
  justify-content: center;
  flex: 0 0 auto;
}

.panda-mood {
  font-size: 110px;
  line-height: 1;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(44, 44, 44, 0.15));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.panda-normal {
  animation: float 3s ease-in-out infinite;
}

.panda-happy {
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-20px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-10px);
  }
}

/* 气泡 */
.panda-bubble {
  flex: 1;
  position: relative;
  padding: var(--spacing-lg);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.1);
  min-height: 60px;
  display: flex;
  align-items: center;
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-normal);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bubble-triangle {
  position: absolute;
  left: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-right: 8px solid rgba(255, 255, 255, 0.9);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

/* 分割线 */
.divider-dashed {
  height: 1px;
  border-top: 2px dashed rgba(91, 173, 127, 0.3);
  margin: var(--spacing-xl) 0;
}

/* 角色信息 */
.panda-info {
  text-align: center;
}

.info-header {
  display: flex;
  justify-content: center;
}

.level-badge {
  display: inline-block;
  padding: 6px 12px;
  background-color: rgba(91, 173, 127, 0.15);
  color: var(--color-main);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

/* EXP进度条 */
.exp-section {
  margin-top: var(--spacing-lg);
}

.exp-bar {
  width: 100%;
  height: 12px;
  background-color: rgba(91, 173, 127, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-main), #7AC77F);
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.exp-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-align: center;
}

/* 今日格言 */
.daily-quote {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-style: italic;
  line-height: var(--line-height-relaxed);
}

/* 今日状态速览 */
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) 0;
  font-size: var(--font-size-base);
}

.stat-label {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.stat-value {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-mono);
}

.stat-divider {
  height: 1px;
  background-color: rgba(255, 140, 66, 0.2);
  margin: var(--spacing-md) 0;
}

.stat-task-rate {
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-sm);
}

/* 圆环图 */
.task-circle {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.task-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.task-bg {
  fill: none;
  stroke: rgba(91, 173, 127, 0.1);
  stroke-width: 4;
}

.task-fill {
  fill: none;
  stroke: var(--color-main);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}

.task-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-main);
}

.task-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   【中列：今日工作台】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* 每日圣旨卡 */
.decree-quote {
  position: absolute;
  top: 12px;
  left: 16px;
  font-size: 48px;
  color: rgba(255, 140, 66, 0.4);
  line-height: 1;
}

.decree-content {
  padding-left: var(--spacing-2xl);
  padding-top: var(--spacing-lg);
  min-height: 80px;
  display: flex;
  align-items: center;
}

.decree-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
}

.decree-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgba(255, 140, 66, 0.2);
}

.decree-source {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.decree-emoji {
  font-size: 24px;
}

.btn-refresh {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background-color: rgba(255, 140, 66, 0.1);
  transform: rotate(180deg);
}

/* 今日课题 */
.tasks-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.tasks-title {
  font-size: var(--font-size-xl);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.task-filters {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 12px;
  background-color: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: var(--color-bg-warm);
  border-color: var(--color-accent);
}

.filter-btn.active {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

/* 任务列表 */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.task-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-light);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.task-item:hover {
  background-color: var(--color-bg-warm);
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.task-item.completed {
  background-color: rgba(122, 199, 127, 0.08);
  border-color: var(--color-success);
}

.task-priority-dot {
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-warning);
}

.priority-high {
  background-color: var(--color-error);
}

.priority-medium {
  background-color: var(--color-warning);
}

.priority-low {
  background-color: var(--color-text-light);
}

.task-content {
  flex: 1;
}

.task-text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
}

.task-text.strike {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.task-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.task-tag {
  font-size: var(--font-size-xs);
  padding: 4px 8px;
  background-color: rgba(91, 173, 127, 0.1);
  color: var(--color-main);
  border-radius: 4px;
  white-space: nowrap;
  font-weight: var(--font-weight-medium);
}

.tag-🔬改论文 {
  background-color: rgba(255, 140, 66, 0.1);
  color: var(--color-accent);
}

.tag-💻跑实验 {
  background-color: rgba(91, 173, 127, 0.1);
  color: var(--color-main);
}

.tag-📖读文献 {
  background-color: rgba(8, 145, 178, 0.1);
  color: #0891b2;
}

.tag-🗣开组会 {
  background-color: rgba(219, 39, 119, 0.1);
  color: #db2777;
}

.tag-☕学术冥想 {
  background-color: rgba(255, 184, 77, 0.1);
  color: var(--color-warning);
}

.task-checkbox {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  transition: all 0.2s ease;
}

.task-checkbox.checked {
  background-color: var(--color-success);
  border-color: var(--color-success);
  color: white;
  font-weight: bold;
}

.checkbox-icon {
  font-size: 14px;
  line-height: 1;
}

/* 完成印章 */
.completion-stamp {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%) rotate(15deg);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  color: var(--color-error);
  border: 2px solid var(--color-error);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0;
  animation: stampAppear 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes stampAppear {
  0% {
    opacity: 0;
    transform: translateY(-50%) rotate(15deg) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) rotate(15deg) scale(1);
  }
}

/* 新增课题按钮 */
.btn-add-task {
  padding: var(--spacing-lg);
  background-color: transparent;
  border: 2px dashed var(--color-text-light);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: var(--font-weight-medium);
}

.btn-add-task:hover {
  border-color: var(--color-main);
  color: var(--color-main);
  background-color: rgba(91, 173, 127, 0.05);
}

/* 今日软件使用 */
.software-title {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.software-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.software-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-light);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  position: relative;
}

.software-item:hover {
  background-color: var(--color-bg-warm);
}

.software-item.most-used {
  background: linear-gradient(135deg, rgba(255, 140, 66, 0.1) 0%, rgba(255, 184, 77, 0.1) 100%);
  border-left: 4px solid var(--color-accent);
  padding-left: var(--spacing-lg) - 4px;
}

.software-emoji {
  font-size: 28px;
  flex: 0 0 auto;
}

.software-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.software-name {
  font-size: var(--font-size-base);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.software-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.app-companion {
  display: inline-block;
  padding: 4px 8px;
  background-color: rgba(255, 140, 66, 0.15);
  color: var(--color-accent);
  border-radius: 4px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   【右列：心情与天气】
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* 天气卡片 */
.weather-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.weather-icon {
  font-size: 56px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(91, 173, 127, 0.1));
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.weather-location {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.weather-temp {
  font-size: var(--font-size-2xl);
  color: var(--color-main);
  font-weight: var(--font-weight-bold);
}

.weather-copy {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
  font-style: italic;
}

/* 心情按钮群 */
.mood-labels {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  margin-bottom: var(--spacing-lg);
}

.mood-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--spacing-lg);
  background-color: var(--color-bg-light);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mood-btn:hover {
  background-color: var(--color-bg-warm);
  border-color: var(--color-accent);
  transform: translateY(-4px);
}

.mood-btn.active {
  background: linear-gradient(135deg, rgba(255, 140, 66, 0.2) 0%, rgba(255, 182, 193, 0.2) 100%);
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.2);
  animation: moodBounce 0.4s ease;
}

@keyframes moodBounce {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.05);
  }
  100% {
    transform: translateY(-4px) scale(1);
  }
}

.mood-icon {
  font-size: 28px;
  line-height: 1;
}

.mood-name {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  text-align: center;
}

/* 心情轨迹 */
.mood-timeline {
  padding: var(--spacing-lg);
  background-color: var(--color-bg-light);
  border-radius: var(--radius-sm);
}

.timeline-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  font-weight: var(--font-weight-medium);
}

.timeline-items {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.timeline-emoji {
  font-size: 20px;
  cursor: default;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.timeline-emoji:hover {
  opacity: 1;
  transform: scale(1.2);
}

/* 滚滚提醒 */
.card-reminder {
  padding: var(--spacing-xl);
}

.reminder-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-md);
}

.reminder-content {
  display: flex;
  align-items: center;
}

.reminder-text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   底部浮动按钮
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.floating-button-container {
  position: fixed;
  bottom: var(--spacing-2xl);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.btn-floating {
  padding: var(--spacing-lg) var(--spacing-2xl);
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  box-shadow: var(--shadow-floating);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all 0.3s ease;
  font-family: var(--font-family-base);
}

.btn-floating:hover {
  background-color: var(--color-accent);
  box-shadow: var(--shadow-lifted);
  transform: translateY(-2px);
}

.btn-floating:active {
  transform: translateY(0);
  box-shadow: var(--shadow-hover);
}

.floating-emoji {
  font-size: 20px;
  line-height: 1;
}

.floating-text {
  letter-spacing: 0.5px;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   通用工具类
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.mt-lg {
  margin-top: var(--spacing-lg);
}

.mt-md {
  margin-top: var(--spacing-md);
}

.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.mb-sm {
  margin-bottom: var(--spacing-sm);
}

.gap-lg {
  gap: var(--spacing-lg);
}

.gap-md {
  gap: var(--spacing-md);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   响应式设计（如果需要）
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

@media (max-desktop) {
  .home-main {
    flex-direction: column;
  }

  .column-left,
  .column-center,
  .column-right {
    flex: 1 !important;
  }
}
</style>
