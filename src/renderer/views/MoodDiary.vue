<template>
  <div class="mood-diary">
    <div class="header-bar">
      <div class="header-left">
        <div class="panda-avatar">🐼</div>
        <div class="header-title">情绪树洞</div>
      </div>
      <button class="btn-export" @click="exportDiary">⬇ 导出</button>
    </div>

    <div class="main-area">
      <div class="chat-col">
        <div class="chat-area" ref="chatAreaRef">
          <div v-if="messages.length === 0" class="empty-state">
            <div class="empty-panda">🐼</div>
            <div class="empty-text">滚滚在打盹... 点心情叫醒它 💤</div>
          </div>

          <template v-for="(msg, idx) in messages" :key="msg.id">
            <div v-if="shouldShowTime(idx)" class="msg-time-group">{{ msg.time }}</div>
            <div class="msg-group" :class="msg.role">
              <template v-if="msg.role === 'panda'">
                <div class="panda-icon">🐼</div>
                <div class="msg-bubble panda-bubble">
                  <span v-if="msg.loading" class="typing">
                    <span></span><span></span><span></span>
                  </span>
                  <span v-else>{{ msg.text }}</span>
                </div>
              </template>
              <template v-else>
                <div class="msg-bubble user-bubble">{{ msg.text }}</div>
                <div class="mood-icon">{{ msg.moodEmoji }}</div>
              </template>
            </div>
          </template>
        </div>

        <div class="input-area">
          <textarea
            v-model="inputText"
            class="chat-input"
            placeholder="跟滚滚倒倒苦水..."
            @keydown.enter.exact.prevent="sendMessage"
          ></textarea>
          <button class="send-btn" :class="{ active: inputText.trim() }" @click="sendMessage">⟳</button>
        </div>
      </div>

      <div class="mood-col">
        <div class="panda-card">
          <div class="panda-display">🐼</div>
          <div class="panda-status">{{ currentMoodStatus }}</div>
        </div>

        <div class="mood-card">
          <div class="mood-title">今天的心情</div>
          <div class="mood-grid">
            <button
              v-for="m in moods"
              :key="m.id"
              class="mood-btn"
              :class="{ selected: selectedMood?.id === m.id }"
              :style="selectedMood?.id === m.id ? { backgroundColor: m.lightColor, borderColor: m.color, borderWidth: '2px' } : {}"
              @click="selectMoodAndSend(m)"
            >
              <span class="mood-emoji">{{ m.emoji }}</span>
              <span class="mood-label">{{ m.label }}</span>
            </button>
          </div>
        </div>

        <div class="mood-record">
          <div class="record-title">今日：</div>
          <div v-if="todayMoodRecord.length > 0" class="record-emojis">
            {{ todayMoodRecord.join(' ') }}
          </div>
          <div v-else class="record-empty">还没有记录哦</div>
        </div>
      </div>
    </div>

    <div class="particles-container">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="{ left: particle.x + 'px', top: particle.y + 'px', backgroundColor: particle.color }"
      ></div>
    </div>

    <transition name="slide-up">
      <div v-if="showComfortModal" class="modal-overlay" @click="showComfortModal = false">
        <div class="comfort-card" @click.stop>
          <button class="modal-close" @click="showComfortModal = false">×</button>
          <div class="modal-panda">😊</div>
          <div class="modal-title">主人，你今天不太好受 💗</div>
          <div class="modal-message">{{ comfortMessage }}</div>
          <div class="modal-tea">滚滚递来虚拟奶茶 🧋</div>
          <button class="modal-btn" @click="showComfortModal = false">好的，谢谢滚滚</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Message {
  id: number
  role: 'user' | 'panda'
  text: string
  time: string
  moodEmoji?: string
  loading?: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
}

interface Mood {
  id: string
  emoji: string
  label: string
  color: string
  lightColor: string
}

const messages = ref<Message[]>([])
const inputText = ref('')
const chatAreaRef = ref<HTMLElement>()
const particles = ref<Particle[]>([])
const showComfortModal = ref(false)
const comfortMessage = ref('')
const selectedMood = ref<Mood | null>(null)
const currentMood = ref<string>('happy')
let particleId = 0

const comfortMessages = [
  '你已经很努力了，有滚滚陪着呢',
  '允许自己难过一会儿，明天会更好',
  '先停下来休息一下，不用一直撑着',
  '发生什么了？跟滚滚说说就会好很多',
  '你比你想象的更强大，相信自己',
  '今天不行就明天，没有什么过不去的坎',
]

const moods: Mood[] = [
  { id: 'happy', emoji: '😄', label: '开心', color: '#FFD700', lightColor: '#FFF9E6' },
  { id: 'tired', emoji: '😩', label: '累了', color: '#87CEEB', lightColor: '#E6F7FF' },
  { id: 'broken', emoji: '🤡', label: '崩溃', color: '#FF6B9D', lightColor: '#FFE6F0' },
  { id: 'fish', emoji: '🎣', label: '摸鱼', color: '#90EE90', lightColor: '#E6FFE6' },
  { id: 'hyper', emoji: '🔥', label: '鸡血', color: '#FF8C42', lightColor: '#FFE6D5' },
  { id: 'anxious', emoji: '😰', label: '焦虑', color: '#DDA0DD', lightColor: '#F5E6FF' },
]

const pandaReplies: Record<string, string[]> = {
  happy: [
    '哦吼！主人今天开心，滚滚也跟着开心！',
    '好心情要保持哦，继续加油！',
    '开心就好！今天运气一定不错～',
    '主人笑起来最好看了！',
    '这股好心情能撑到答辩不？',
    '看到你开心，滚滚也不想摸鱼了！',
  ],
  tired: [
    '累了就趴一会，滚滚帮你看着',
    '休息是为了走更远的路，不是借口',
    '主人今天已经很棒了，可以停下来',
    '累了就喝杯水，稍微动一动',
    '没事的，今天能做多少算多少',
    '再坚持一下，或者就此放弃也是允许的',
  ],
  broken: [
    '先深呼吸——好了，现在可以骂了',
    '破防了也没关系，滚滚在这里',
    '崩溃是暂时的，你比你想象的更厉害',
    '来，先喝杯奶茶，再决定要不要躺平',
    '今天发生什么了？跟滚滚说说',
    '不用强撑，允许自己难过一会儿',
  ],
  fish: [
    '哦吼！被我抓到摸鱼了！不过没关系～',
    '适度摸鱼是科学，你在做正确的事',
    '摸完这条鱼就回去工作，好不好？',
    '滚滚也想摸鱼，我们一起吧',
    '摸鱼快乐！健康第一！',
    '劳逸结合是王道，你这样才能走更远',
  ],
  hyper: [
    '冲冲冲！今天感觉要出成果了！',
    '这股劲保持住！',
    '打了鸡血的主人最好看了',
    '感觉今天能写完一章？！',
    '好！那我们开始！',
    '这就是科研人的样子，干就完了！',
  ],
  anxious: [
    '焦虑说明你在乎，在乎说明你认真',
    '先把今天能做的做完，其他的明天说',
    '深呼吸，然后告诉滚滚最担心什么',
    '没事的，一步一步来，不用全部一起做',
    '滚滚陪着你，不用一个人扛',
    '你已经很努力了，相信自己准没错',
  ],
  default: [
    '主人说得对！滚滚完全理解！',
    '哦吼～滚滚听到了，你继续说',
    '没事的，有滚滚陪着呢～',
    '主人今天也很努力呢，给自己点个赞',
  ],
}

const currentMoodStatus = computed(() => {
  const mood = moods.find(m => m.id === currentMood.value)
  return mood ? `今日心情：${mood.emoji} ${mood.label}` : '今日心情：平静'
})

const todayMoodRecord = computed(() => {
  return messages.value
    .filter(m => m.role === 'user' && m.moodEmoji)
    .map(m => m.moodEmoji || '')
    .filter(e => e)
})

function getTime(): string {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function shouldShowTime(idx: number): boolean {
  if (idx === 0) return true
  const currentMsg = messages.value[idx]
  const prevMsg = messages.value[idx - 1]
  return currentMsg.time !== prevMsg.time
}

function createParticles(x: number, y: number, color: string): void {
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const velocity = 3 + Math.random() * 2
    const particle: Particle = {
      id: particleId++,
      x,
      y,
      color,
    }
    particles.value.push(particle)

    let startX = x
    let startY = y
    const startTime = Date.now()
    const duration = 800

    const animate = (): void => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        const distX = Math.cos(angle) * velocity * elapsed
        const distY = Math.sin(angle) * velocity * elapsed - (elapsed * elapsed) / 1000

        particle.x = startX + distX
        particle.y = startY + distY

        requestAnimationFrame(animate)
      } else {
        particles.value = particles.value.filter(p => p.id !== particle.id)
      }
    }
    animate()
  }
}

async function selectMoodAndSend(mood: Mood): Promise<void> {
  selectedMood.value = selectedMood.value?.id === mood.id ? null : mood
  currentMood.value = mood.id

  if (selectedMood.value) {
    await sendMessage()
  }
}

async function sendMessage(): Promise<void> {
  const text = inputText.value.trim() || selectedMood.value?.label || ''
  if (!text) return

  const moodEmoji = selectedMood.value?.emoji || '💬'

  const userMsg: Message = {
    id: Date.now(),
    role: 'user',
    text,
    time: getTime(),
    moodEmoji,
  }
  messages.value.push(userMsg)
  inputText.value = ''

  if (selectedMood.value) {
    createParticles(window.innerWidth / 2, window.innerHeight / 2, selectedMood.value.color)
  }

  await nextTick()
  scrollToBottom()

  const pandaMsg: Message = {
    id: Date.now() + 1,
    role: 'panda',
    text: '',
    time: getTime(),
    loading: true,
  }
  messages.value.push(pandaMsg)

  await nextTick()
  scrollToBottom()

  setTimeout(() => {
    const moodId = currentMood.value
    const replies = moodId ? pandaReplies[moodId] || pandaReplies.default : pandaReplies.default
    const reply = replies[Math.floor(Math.random() * replies.length)]
    pandaMsg.loading = false
    pandaMsg.text = reply
    scrollToBottom()

    if (moodId) {
      checkMoodConsecutive(moodId)
    }
  }, 800)
}

function checkMoodConsecutive(moodId: string): void {
  if (moodId !== 'broken' && moodId !== 'anxious') return

  const userMessages = messages.value.filter(m => m.role === 'user')
  const recentMoods = userMessages.slice(-5)

  if (recentMoods.length >= 3) {
    const lastThree = recentMoods.slice(-3)
    const allNegative = lastThree.every(m => {
      const moodEmoji = m.moodEmoji
      return (
        moods.find(mood => mood.emoji === moodEmoji)?.id === 'broken' ||
        moods.find(mood => mood.emoji === moodEmoji)?.id === 'anxious'
      )
    })

    if (allNegative) {
      comfortMessage.value =
        comfortMessages[Math.floor(Math.random() * comfortMessages.length)]
      showComfortModal.value = true
    }
  }
}

function scrollToBottom(): void {
  nextTick(() => {
    if (chatAreaRef.value) {
      chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
    }
  })
}

function exportDiary(): void {
  const lines = messages.value
    .map(m => `[${m.time}] ${m.role === 'user' ? '我' : '滚滚'}: ${m.text}`)
    .join('\n')
  const blob = new Blob([lines], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `情绪日记_${new Date().toLocaleDateString()}.txt`
  a.click()
}
</script>

<style scoped>
.mood-diary {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
  padding: 20px 24px;
  gap: 0;
  background: #FAF6EE;
  font-family: 'LXGW WenKai', 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
}

.header-bar {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid #EDE8E0;
  flex-shrink: 0;
  margin: -20px -24px 0 -24px;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panda-avatar {
  font-size: 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #3D3530;
}

.btn-export {
  background: transparent;
  border: 1.5px solid #F4956A;
  color: #F4956A;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-export:hover {
  background: #F4956A;
  color: white;
}

.btn-export:active {
  transform: scale(0.95);
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 20px;
  overflow: hidden;
}

.chat-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  border: 1.5px solid #EDE8E0;
  box-shadow: 2px 3px 0px rgba(61,53,48,0.06);
  overflow: hidden;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #FEFCF8;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(237,232,224,0.3) 28px);
}

.chat-area::-webkit-scrollbar {
  width: 6px;
}

.chat-area::-webkit-scrollbar-track {
  background: transparent;
}

.chat-area::-webkit-scrollbar-thumb {
  background: #D4CCBE;
  border-radius: 3px;
}

.chat-area::-webkit-scrollbar-thumb:hover {
  background: #BFAD9F;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.empty-panda {
  font-size: 80px;
  animation: pandaSleep 3s ease-in-out infinite;
}

@keyframes pandaSleep {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px) scaleX(-1); }
  75% { transform: translateX(8px); }
}

.empty-text {
  color: #9E9189;
  font-size: 14px;
}

.msg-time-group {
  text-align: center;
  font-size: 11px;
  color: #C0B8B0;
  margin: 8px 0;
  padding: 0 12px;
}

.msg-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  animation: msgSlideIn 0.3s ease-out;
}

.msg-group.user {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

@keyframes msgSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.panda-icon {
  font-size: 32px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  max-width: 65%;
  animation: bubbleIn 0.2s ease-out;
}

@keyframes bubbleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.panda-bubble {
  background: white;
  color: #3D3530;
  border-radius: 4px 12px 12px 12px;
  box-shadow: 1px 2px 0px rgba(61,53,48,0.06);
}

.mood-icon {
  font-size: 28px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-bubble {
  background: #F4956A;
  color: white;
  border-radius: 12px 4px 12px 12px;
}

.typing {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 12px;
}

.typing span {
  width: 6px;
  height: 6px;
  background: #9E9189;
  border-radius: 50%;
  animation: typing 1.2s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
  30% { transform: translateY(-6px); opacity: 1; }
}

.input-area {
  border-top: 1px solid #EDE8E0;
  padding: 12px 16px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: white;
}

.chat-input {
  flex: 1;
  min-height: 52px;
  max-height: 120px;
  border: 1.5px solid #EDE8E0;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 1.5;
  font-family: inherit;
  resize: none;
  outline: none;
  background: white;
  color: #3D3530;
  transition: border-color 0.2s ease;
}

.chat-input:focus {
  border-color: #F4956A;
  box-shadow: 0 0 0 3px rgba(244,149,106,0.1);
}

.chat-input::placeholder {
  color: #C0B8B0;
}

.send-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  background: #EDE8E0;
  color: #9E9189;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  padding: 0;
  font-family: inherit;
  font-weight: 700;
}

.send-btn:hover:not(.active) {
  background: #E0D9D0;
}

.send-btn.active {
  background: #F4956A;
  color: white;
}

.send-btn.active:hover {
  background: #E67E4F;
  transform: translateY(-2px);
  box-shadow: 2px 4px 0px rgba(244,149,106,0.3);
}

.send-btn.active:active {
  transform: translateY(0);
}

.mood-col {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panda-card {
  background: white;
  border-radius: 20px;
  border: 1.5px solid #EDE8E0;
  box-shadow: 2px 3px 0px rgba(61,53,48,0.06);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.panda-display {
  font-size: 80px;
}

.panda-status {
  font-size: 13px;
  color: #3D3530;
  font-weight: 600;
}

.mood-card {
  background: white;
  border-radius: 20px;
  border: 1.5px solid #EDE8E0;
  box-shadow: 2px 3px 0px rgba(61,53,48,0.06);
  padding: 16px;
}

.mood-title {
  font-size: 13px;
  color: #9E9189;
  margin-bottom: 12px;
  font-weight: 600;
}

.mood-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.mood-btn {
  height: 56px;
  background: white;
  border: 1.5px solid #EDE8E0;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.mood-btn:hover {
  transform: translateY(-2px);
  box-shadow: 2px 3px 0px rgba(61,53,48,0.08);
}

.mood-btn.selected {
  border-width: 2px;
}

.mood-emoji {
  font-size: 24px;
}

.mood-label {
  font-size: 12px;
  color: #3D3530;
  font-weight: 600;
}

.mood-record {
  background: white;
  border-radius: 20px;
  border: 1.5px solid #EDE8E0;
  box-shadow: 2px 3px 0px rgba(61,53,48,0.06);
  padding: 12px 16px;
}

.record-title {
  font-size: 12px;
  color: #9E9189;
  font-weight: 600;
  display: inline;
}

.record-emojis {
  font-size: 16px;
  line-height: 1.8;
  color: #3D3530;
  word-break: break-word;
  display: inline;
}

.record-empty {
  font-size: 12px;
  color: #C0B8B0;
  display: inline;
}

.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

.particle {
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.8;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.comfort-card {
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: slideUp 0.3s ease-out;
  position: relative;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: #FAF6EE;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #EDE8E0;
}

.modal-panda {
  font-size: 60px;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #3D3530;
  text-align: center;
}

.modal-message {
  font-size: 14px;
  color: #6B6259;
  text-align: center;
  line-height: 1.6;
}

.modal-tea {
  font-size: 32px;
}

.modal-btn {
  background: #6BAE8C;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.modal-btn:hover {
  background: #5A9A76;
  transform: translateY(-2px);
  box-shadow: 2px 4px 0px rgba(107,174,140,0.3);
}

.modal-btn:active {
  transform: translateY(0);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
