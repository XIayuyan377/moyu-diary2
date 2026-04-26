<template>
  <div class="dashboard-container">
    <!-- ============ 庆祝消息浮窗 ============ -->
    <Transition name="celebration-pop">
      <div v-if="celebrationVisible" class="celebration-message">
        {{ celebrationText }}
        <div class="celebration-particles">
          <div v-for="i in 12" :key="i" class="particle"></div>
        </div>
      </div>
    </Transition>

    <!-- ============ 角色系统部分（新增）============ -->
    <div class="character-showcase">
      <div class="character-wrapper">
        <MyCharacter
          :level="character.level"
          :exp="character.exp"
          :mood="character.mood"
          :size="140"
          :show-stats="true"
          :interactive="true"
          @level-up="handleLevelUp"
          @character-clicked="handleCharacterClick"
        />
      </div>

      <!-- 经验进度详情 -->
      <div class="exp-details">
        <div class="exp-row">
          <span class="exp-label">等级</span>
          <span class="exp-value">LV {{ character.level }}</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">经验</span>
          <span class="exp-value">{{ character.exp }} / {{ nextExpRequired }}</span>
        </div>
        <div class="exp-bar-container">
          <div class="exp-bar-bg">
            <div class="exp-bar-fill" :style="{ width: expProgress + '%' }"></div>
          </div>
          <span class="exp-percentage">{{ expProgress }}%</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">心情</span>
          <span class="exp-value mood-display" :class="character.mood">
            {{ moodText }}
          </span>
        </div>
      </div>
    </div>

    <!-- ============ 任务系统部分（新增）============ -->
    <div class="task-system-wrapper">
      <h2 class="section-title">📋 任务清单</h2>
      <TaskList
        @task-completed="handleTaskCompleted"
        @task-added="handleTaskAdded"
        @task-deleted="handleTaskDeleted"
      />
    </div>

    <!-- ============ 其他原有卡片 ============ -->
    <div class="other-cards-section">
      <!-- 原有的欢迎横幅、提醒等保留 -->
      <!-- ... existing code ... -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Panda from '../components/Panda.vue'
import MyCharacter from '../components/MyCharacter.vue'
import TaskList from '../components/TaskList.vue'

// ====================================================================
// 🎮 核心：角色状态管理（集中式）
// ====================================================================
const character = reactive({
  level: 1,           // 等级 1-10+
  exp: 0,             // 当前经验
  mood: 'idle',       // idle / happy / tired / stressed
})

// ====================================================================
// 📊 计算属性：升级系统
// ====================================================================

// 下一级所需经验（指数增长）
const nextExpRequired = computed(() => {
  const base = 100
  const rate = 1.2
  return Math.round(base * Math.pow(rate, character.level - 1))
})

// 经验进度百分比
const expProgress = computed(() => {
  if (nextExpRequired.value === 0) return 0
  return Math.min(
    Math.round((character.exp / nextExpRequired.value) * 100),
    100
  )
})

// 心情文本
const moodText = computed(() => {
  const moods = {
    idle: '闲适🌿',
    happy: '高兴😊',
    tired: '疲惫😴',
    stressed: '压力山大😰',
  }
  return moods[character.mood] || '未知'
})

// ====================================================================
// 🎬 事件处理：任务完成 → exp增加 → mood变happy → 检查升级
// ====================================================================

/**
 * ⭐ 任务完成的核心处理函数
 * 1. exp 增加
 * 2. mood 变 happy
 * 3. 检查升级
 * 4. 2秒后恢复 mood
 */
const handleTaskCompleted = ({ taskId, title, expReward }) => {
  console.log(
    `✅ 任务完成: "${title}" | 获得 ${expReward} exp | 对应 TaskId: ${taskId}`
  )

  // ========== Step 1: 增加经验 ==========
  character.exp += expReward
  console.log(`📊 经验更新: ${character.exp} / ${nextExpRequired.value}`)

  // ========== Step 2: 改变心情 ==========
  character.mood = 'happy'
  console.log(`😊 心情更新: happy`)

  // ========== Step 3: 显示通知 ==========
  showCelebration(`🎉 ${title}\n+${expReward} exp`, 2000)

  // ========== Step 4: 检查升级逻辑 ⭐⭐⭐ ==========
  if (character.exp >= nextExpRequired.value) {
    // 计算多余经验（可以转到下一级）
    const bonusExp = character.exp - nextExpRequired.value

    // 升级
    character.level++
    character.exp = bonusExp

    console.log(
      `🎊 升级! LV${character.level - 1} → LV${character.level} | 剩余经验: ${bonusExp}`
    )

    // 播放升级庆祝
    showCelebration(
      `⭐ 升到 LV${character.level}!\n继续加油～`,
      3000
    )

    // 这会触发 MyCharacter 的 @level-up 事件 (可选)
  }

  // ========== Step 5: 2秒后恢复心情 ==========
  setTimeout(() => {
    character.mood = 'idle'
    console.log(`😴 心情恢复: idle`)
  }, 2000)
}

/**
 * 任务添加
 */
const handleTaskAdded = (task) => {
  console.log(`📝 新任务添加: "${task.title}" | ID: ${task.id}`)
}

/**
 * 任务删除
 */
const handleTaskDeleted = (task) => {
  console.log(`🗑️ 任务删除: "${task.title}" | ID: ${task.id}`)
}

/**
 * MyCharacter 升级事件（如果组件发送）
 */
const handleLevelUp = ({ newLevel, bonusExp }) => {
  console.log(`🌟 角色升级事件触发: LV${newLevel} | 奖励经验: ${bonusExp}`)
}

/**
 * MyCharacter 点击事件
 */
const handleCharacterClick = ({ level, mood }) => {
  console.log(
    `👉 角色被点击！当前等级: LV${level} | 心情: ${mood}`
  )
}

// ====================================================================
// 🎆 UI 反馈系统
// ====================================================================

const celebrationVisible = ref(false)
const celebrationText = ref('')

const showCelebration = (text, duration = 2000) => {
  celebrationText.value = text
  celebrationVisible.value = true

  console.log(`🎉 通知: ${text}`)

  setTimeout(() => {
    celebrationVisible.value = false
  }, duration)
}

// ====================================================================
// 💾 可选：状态持久化
// ====================================================================

// 监听角色状态变化，自动保存到 localStorage
watch(
  () => character,
  (newCharacter) => {
    localStorage.setItem(
      'character_state',
      JSON.stringify({
        level: newCharacter.level,
        exp: newCharacter.exp,
        mood: newCharacter.mood,
      })
    )
  },
  { deep: true }
)

// 页面加载时恢复之前的状态
onMounted(() => {
  const saved = localStorage.getItem('character_state')
  if (saved) {
    try {
      const loaded = JSON.parse(saved)
      character.level = loaded.level || 1
      character.exp = loaded.exp || 0
      character.mood = loaded.mood || 'idle'
      console.log(`✅ 已恢复角色状态: LV${character.level} EXP${character.exp}`)
    } catch (error) {
      console.error('状态恢复失败:', error)
    }
  }
})

// ====================================================================
// 原有的代码保持不变...
// ====================================================================

const userNickname = ref('打工人')
const userMood = ref('working')

const currentDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

const quotes = [
  '科研如人生，一切皆过眼烟云',
  '加油，论文还有救',
  '摸鱼即修行',
  '点外卖的时间都省下来了',
  '又是充满希望的一天',
]

const motivationalQuote = ref(quotes[Math.floor(Math.random() * quotes.length)])

const dailyGreetings = ['早安', '上午好', '中午好', '下午好', '晚上好', '夜深了']
const dailyGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '深夜奋笔疾书'
  if (hour < 12) return dailyGreetings[0]
  if (hour < 13) return dailyGreetings[2]
  if (hour < 17) return dailyGreetings[3]
  if (hour < 21) return dailyGreetings[4]
  return dailyGreetings[5]
})

const tasks = ref([
  { text: '完成论文绪论部分', done: false },
  { text: '修改导师反馈', done: true },
  { text: '收集参考文献', done: false },
  { text: '更新实验数据', done: true },
  { text: '准备小会汇报', done: false },
])

const tasksToShow = computed(() => tasks.value.slice(0, 4))
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter((t) => t.done).length)
const taskProgress = computed(() => (completedTasks.value / totalTasks.value) * 100)

const toggleTask = (idx) => {
  tasks.value[idx].done = !tasks.value[idx].done
}

const lastWaterTime = ref('5小时前')
const sittingTime = ref('2小时')
const pomodoroActive = ref(false)

const recordWater = () => {
  lastWaterTime.value = '刚刚'
  showCelebration('🍵 滚滚：干杯！', 2000)
}

const recordStretch = () => {
  sittingTime.value = '0分钟'
  showCelebration('🏃 滚滚：一起活动活动筋骨吧', 1800)
}

const togglePomodoro = () => {
  pomodoroActive.value = !pomodoroActive.value
  if (pomodoroActive.value) {
    showCelebration('⏱️ 滚滚：25分钟专注，我陪你！', 1500)
  }
}

const quickTask = (type) => {
  const taskNames = {
    experiment: '🔬 跑实验',
    writing: '📝 写论文',
    reading: '📖 读文献',
    meeting: '🗣️ 组会',
    email: '📧 回邮件',
    fishing: '☕ 摸鱼',
  }
  showCelebration(`滚滚：加油完成 ${taskNames[type] || '任务'}！`, 2000)
}

const pandaQuote = ref('每完成一个任务，我就开心一点~')
const pandaMood = ref('normal')
const pandaMoodText = computed(() => {
  const texts = {
    normal: '滚滚在等待你的行动...',
    happy: '滚滚被你的努力感动了！',
    tired: '滚滚累了，需要陪伴...',
  }
  return texts[pandaMood.value] || '滚滚在思考...'
})

const onSiteHours = ref('8.5')
const dailyMeditation = ref(3)
const dailyExp = ref(0)

const openMoodDiary = () => {
  showCelebration('💬 正在打开心情日记...', 1500)
}
</script>

<style scoped>
/* ============================
   角色展示区
   ============================ */
.character-showcase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #fff9f5 0%, #fffbf8 100%);
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.character-wrapper {
  flex-shrink: 0;
}

.exp-details {
  flex: 1;
  background: white;
  padding: 20px 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.exp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.exp-label {
  color: #9e9189;
  font-weight: 500;
}

.exp-value {
  color: #3d3530;
  font-weight: 600;
  font-size: 16px;
}

.exp-value.mood-display {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f5f0ea;
  font-size: 14px;
}

.exp-value.mood-display.happy {
  background: #ffeaa7;
  color: #d97706;
}

.exp-value.mood-display.idle {
  background: #e8f5e9;
  color: #689f38;
}

.exp-value.mood-display.tired {
  background: #e0e0e0;
  color: #616161;
}

.exp-value.mood-display.stressed {
  background: #ffebee;
  color: #d32f2f;
}

.exp-bar-container {
  position: relative;
  margin: 12px 0;
  height: 24px;
  background: #f0ebe5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.exp-bar-bg {
  width: 100%;
  height: 100%;
  background: #e8dcd0;
  border-radius: 12px;
  overflow: hidden;
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5bad7f 0%, #7ac77f 100%);
  transition: width 0.6s cubic-bezier(0.23, 1, 0.82, 1);
  box-shadow: 0 0 8px rgba(91, 173, 127, 0.5);
}

.exp-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: #3d3530;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
}

/* ============================
   任务系统区
   ============================ */
.task-system-wrapper {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #3d3530;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ============================
   庆祝消息
   ============================ */
.celebration-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #5bad7f 0%, #7ac77f 100%);
  color: white;
  padding: 24px 32px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 8px 24px rgba(91, 173, 127, 0.4);
  z-index: 9999;
  white-space: pre-line;
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.celebration-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: visible;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: float-up 2s ease-out forwards;
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) translateX(var(--tx, 0px));
  }
}

.celebration-pop-enter-active,
.celebration-pop-leave-active {
  transition: opacity 0.3s ease;
}

.celebration-pop-enter-from,
.celebration-pop-leave-to {
  opacity: 0;
}

/* ============================
   响应式设计
   ============================ */
@media (max-width: 768px) {
  .character-showcase {
    flex-direction: column;
    gap: 20px;
  }

  .exp-details {
    width: 100%;
  }

  .dashboard-container {
    padding: 15px;
  }
}
</style>
