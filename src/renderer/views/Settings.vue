<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <div class="page-title">⚙️ 系统设置</div>
        <div class="page-sub">定制你的专属摸鱼体验</div>
      </div>
      <button class="btn-save" @click="saveSettings">💾 保存设置</button>
    </div>

    <div class="settings-grid">
      <!-- 左列 -->
      <div class="settings-col">
        <!-- 我的档案 -->
        <div class="card">
          <div class="card-title">👤 我的档案</div>
          <div class="form-group">
            <label class="form-label">角色昵称</label>
            <input v-model="form.nickname" class="form-input" placeholder="摸鱼研究生" />
          </div>

          <!-- 角色头像选择 -->
          <div class="form-group">
            <label class="form-label">角色头像</label>
            <div class="avatar-selector">
              <button
                v-for="avatar in avatarOptions"
                :key="avatar.id"
                class="avatar-option"
                :class="{ selected: form.avatar === avatar.id }"
                @click="form.avatar = avatar.id"
              >
                <img
                  :src="avatar.src"
                  :alt="avatar.label"
                  class="avatar-real-img"
                  @error="onAvatarImgError($event)"
                />
                <div class="avatar-label">{{ avatar.label }}</div>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">研究方向/专业</label>
            <input v-model="form.major" class="form-input" placeholder="人工智能与计算机视觉" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">性别</label>
              <select v-model="form.gender" class="form-input">
                <option value="female">女研究生 👩</option>
                <option value="male">男研究生 👨</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">答辩日期</label>
              <input v-model="form.defenseDate" type="date" class="form-input" />
            </div>
          </div>
          <div v-if="daysToDefense !== null" class="defense-countdown">
            🎓 距离答辩还有 <span class="countdown-num">{{ daysToDefense }}</span> 天，加油！
          </div>
        </div>

        <!-- 主题风格 -->
        <div class="card">
          <div class="card-title">🎨 主题风格</div>
          <div class="theme-grid">
            <div
              v-for="theme in themes"
              :key="theme.id"
              class="theme-card"
              :class="{ active: form.theme === theme.id }"
              @click="switchTheme(theme)"
            >
              <div class="theme-content">
                <div class="theme-icon">{{ theme.icon }}</div>
                <div class="theme-info">
                  <div class="theme-name">{{ theme.name }}</div>
                  <div class="theme-desc">{{ theme.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右列 -->
      <div class="settings-col">
        <!-- AI模型 -->
        <div class="card">
          <div class="card-title">🤖 滚滚大脑模型（AI）</div>
          <div class="form-group">
            <label class="form-label">提供商 PROVIDER</label>
            <select v-model="form.aiProvider" class="form-input">
              <option value="deepseek">DeepSeek（免费额度多）</option>
              <option value="claude">Claude (Anthropic)</option>
              <option value="zhipu">智谱AI GLM（国内免费）</option>
              <option value="qwen">通义千问（阿里免费）</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">API KEY</label>
            <div class="input-with-toggle">
              <input
                v-model="form.apiKey"
                :type="showKey ? 'text' : 'password'"
                class="form-input"
                placeholder="填写对应服务商的 API Key"
              />
              <button class="key-toggle" @click="showKey = !showKey">
                {{ showKey ? '🙈' : '👁' }}
              </button>
            </div>
            <div class="api-link">
              <a :href="currentProviderLink" target="_blank" class="link">
                → 前往 {{ currentProviderName }} 获取 Key
              </a>
            </div>
          </div>
        </div>

        <!-- 滚滚性格设定 -->
        <div class="card">
          <div class="card-title">🤗 滚滚性格设定</div>
          <div class="panda-style-selector">
            <button
              v-for="style in pandaStyles"
              :key="style.id"
              class="panda-style-btn"
              :class="{ active: form.pandaStyle === style.id }"
              @click="form.pandaStyle = style.id"
            >
              <div class="style-emoji">{{ style.emoji }}</div>
              <div class="style-title">{{ style.title }}</div>
              <div class="style-hint">{{ pandaStyleHints[style.id] }}</div>
            </button>
          </div>
        </div>

        <!-- 基础偏好 -->
        <div class="card">
          <div class="card-title">⚡ 基础偏好</div>
          <div class="toggle-list">
            <div class="toggle-item">
              <div class="toggle-info">
                <div class="toggle-title">开机自启</div>
                <div class="toggle-sub">早起打工第一步，启动摸鱼日记</div>
              </div>
              <div class="toggle-switch" :class="{ on: form.autoStart }" @click="form.autoStart = !form.autoStart">
                <div class="toggle-thumb"></div>
              </div>
            </div>
            <div class="toggle-item">
              <div class="toggle-info">
                <div class="toggle-title">桌面悬浮球</div>
                <div class="toggle-sub">滚滚常驻右下角，随时准备呼唤</div>
              </div>
              <div class="toggle-switch" :class="{ on: form.floatBall }" @click="form.floatBall = !form.floatBall">
                <div class="toggle-thumb"></div>
              </div>
            </div>
          </div>
          <div class="form-group" style="margin-top: 16px">
            <label class="form-label">休息提醒间隔（分钟）</label>
            <select v-model="form.breakInterval" class="form-input">
              <option value="30">30 分钟</option>
              <option value="45">45 分钟</option>
              <option value="60">60 分钟</option>
              <option value="90">90 分钟</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">天气服务提供商</label>
            <select v-model="form.weatherProvider" class="form-input">
              <option value="qweather">和风天气（QWeather）</option>
              <option value="openweather">OpenWeatherMap</option>
            </select>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="card">
          <div class="card-title">🗄 数据管理</div>
          <div class="data-btns">
            <button class="btn-export-data" @click="exportData">🗃 导出全部数据 (.json)</button>
            <button class="btn-clear-data" @click="confirmClear">🗑 清空所有记录</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="saveSuccess" class="save-toast">✓ 设置已保存！</div>

    <div v-if="showClearConfirm" class="modal-overlay" @click.self="showClearConfirm = false">
      <div class="confirm-modal">
        <div class="confirm-icon">🗑</div>
        <div class="confirm-title">确定清空所有数据？</div>
        <div class="confirm-sub">此操作不可恢复，请谨慎操作</div>
        <div class="confirm-btns">
          <button class="btn-cancel" @click="showClearConfirm = false">取消</button>
          <button class="btn-danger" @click="clearData">确定清空</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { userStore } from '../stores/userStore'

const saveSuccess = ref(false)
const showKey = ref(false)
const showClearConfirm = ref(false)

const form = ref({
  nickname: '摸鱼研究生',
  major: '人工智能与计算机视觉',
  gender: 'female',       // 统一用 'female'/'male'
  avatar: 'female',       // 默认女生
  defenseDate: '2027-06-30',
  theme: 'bamboo',
  pandaStyle: 'gentle',
  aiProvider: 'deepseek',
  apiKey: '',
  autoStart: true,
  floatBall: true,
  breakInterval: '45',
  weatherProvider: 'qweather',
})

const pandaStyleHints: Record<string, string> = {
  gentle: '多鼓励，常提醒休息喝水',
  toxic: '今天文献看了吗？快去跑模型！',
  sarcasm: '哦，今天这么努力，太阳从西边出来了',
}

// 头像选项 - 用真实图片
const avatarOptions = [
  {
    id: 'female',
    label: '女生',
    src: new URL('../assets/avatars/profile-female.png', import.meta.url).href,
  },
  {
    id: 'male',
    label: '男生',
    src: new URL('../assets/avatars/profile-male.png', import.meta.url).href,
  },
]

function onAvatarImgError(e: Event) {
  // 图片加载失败时显示占位符
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
  const parent = target.parentElement
  if (parent) {
    const fallback = document.createElement('div')
    fallback.style.cssText = 'width:64px;height:64px;border-radius:50%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:28px;'
    fallback.textContent = target.alt === '女生' ? '👧' : '👦'
    parent.insertBefore(fallback, target)
  }
}

const pandaStyles = [
  { id: 'gentle', emoji: '🤗', title: '温柔陪伴型' },
  { id: 'toxic',  emoji: '😤', title: '毒舌导师型' },
  { id: 'sarcasm',emoji: '🌀', title: '阴阳怪气型' },
]

const themes = [
  { id: 'bamboo', name: '竹林清风', icon: '🌿', desc: '清新自然，专注科研' },
  { id: 'sakura', name: '樱花物语', icon: '🌸', desc: '粉嫩温柔，治愈打工' },
  { id: 'night',  name: '深夜实验室', icon: '🌙', desc: '暗黑沉浸，疯狂上分' },
]

const providerLinks: Record<string, { name: string; url: string }> = {
  deepseek: { name: 'DeepSeek',  url: 'https://platform.deepseek.com' },
  claude:   { name: 'Anthropic', url: 'https://console.anthropic.com' },
  zhipu:    { name: '智谱AI',    url: 'https://open.bigmodel.cn' },
  qwen:     { name: '通义千问',  url: 'https://dashscope.console.aliyun.com' },
}

const currentProviderName = computed(() => providerLinks[form.value.aiProvider]?.name || '')
const currentProviderLink = computed(() => providerLinks[form.value.aiProvider]?.url || '#')

const daysToDefense = computed(() => {
  if (!form.value.defenseDate) return null
  const diff = new Date(form.value.defenseDate).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days > 0 ? days : null
})

function applyTheme(id: string) {
  const root = document.documentElement
  const themes: Record<string, Record<string, string>> = {
    bamboo: { '--color-main': '#5BAD7F', '--color-accent': '#FF8C42', '--color-bg': '#FAF7F2', '--color-bg-card': '#FFFFFF', '--color-text': '#3D3530' },
    sakura: { '--color-main': '#D4537E', '--color-accent': '#C9B8FF', '--color-bg': '#FDF7F9', '--color-bg-card': '#FFFFFF', '--color-text': '#3D2540' },
    night:  { '--color-main': '#4A9EBF', '--color-accent': '#F0C040', '--color-bg': '#1A1A2E', '--color-bg-card': '#242438', '--color-text': '#E8E8F0' },
  }
  const t = themes[id]
  if (t) Object.entries(t).forEach(([k, v]) => root.style.setProperty(k, v))
}

function switchTheme(theme: any) {
  form.value.theme = theme.id
  userStore.theme = theme.id
  applyTheme(theme.id)
  const outfitMap: Record<string, string> = { bamboo: 'normal', sakura: 'flower', night: 'goggle' }
  localStorage.setItem('moyu_panda_outfit', outfitMap[theme.id] || 'normal')
}

function saveSettings() {
  console.log('💾 保存设置，当前头像:', form.value.avatar, '性别:', form.value.gender)
  
  localStorage.setItem('moyuSettings', JSON.stringify(form.value))
  localStorage.setItem('moyu_nickname', form.value.nickname)
  localStorage.setItem('moyu_panda_style', form.value.pandaStyle)
  
  // 统一存储，全局共享
  const profileData = {
    gender: form.value.gender,
    avatar: form.value.avatar,
    nickname: form.value.nickname,
  }
  console.log('📝 保存 moyu_user_profile:', JSON.stringify(profileData))
  localStorage.setItem('moyu_user_profile', JSON.stringify(profileData))
  
  // 广播更新事件
  console.log('📢 发送 moyu-profile-updated 事件，数据:', profileData)
  window.dispatchEvent(new CustomEvent('moyu-profile-updated', {
    detail: { gender: form.value.gender, avatar: form.value.avatar }
  }))
  
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 2500)
}

function exportData() {
  const data = { settings: form.value, exportTime: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `摸鱼日记数据_${new Date().toLocaleDateString()}.json`
  a.click()
}

function confirmClear() { showClearConfirm.value = true }

function clearData() {
  localStorage.clear()
  showClearConfirm.value = false
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 2000)
}

// 启动时读取设置，兼容新旧格式
const saved = localStorage.getItem('moyuSettings')
if (saved) {
  try {
    const parsed = JSON.parse(saved)
    // 兼容旧的中文性别值
    if (parsed.gender === '女研究生') parsed.gender = 'female'
    if (parsed.gender === '男研究生') parsed.gender = 'male'
    Object.assign(form.value, parsed)
  } catch {}
}

// 同步读取 moyu_user_profile（优先级更高）
const profile = localStorage.getItem('moyu_user_profile')
if (profile) {
  try {
    const p = JSON.parse(profile)
    if (p.gender === '女研究生') p.gender = 'female'
    if (p.gender === '男研究生') p.gender = 'male'
    if (p.gender) form.value.gender = p.gender
    if (p.avatar) form.value.avatar = p.avatar
    if (p.nickname) form.value.nickname = p.nickname
  } catch {}
}

applyTheme(userStore.theme || form.value.theme)
</script>

<style scoped>
.settings-page {
  padding: 20px 24px;
  background: #FAF7F2;
  min-height: 100vh;
  font-family: 'PingFang SC', system-ui, sans-serif;
}

.page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 24px;
}
.page-title { font-size: 22px; font-weight: 700; color: #3D3530; }
.page-sub { font-size: 13px; color: #9E9189; margin-top: 4px; }
.btn-save {
  background: #FF8C42; color: white; border: none;
  border-radius: 20px; padding: 10px 24px;
  font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-save:hover { background: #e07a38; transform: translateY(-1px); }

.settings-grid { display: flex; gap: 20px; }
.settings-col { flex: 1; display: flex; flex-direction: column; gap: 16px; }

.card {
  background: white; border-radius: 16px; padding: 24px;
  box-shadow: 0 2px 12px rgba(61,53,48,0.06);
}
.card-title { font-size: 15px; font-weight: 700; color: #3D3530; margin-bottom: 20px; }

.form-group { margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-label { display: block; font-size: 12px; color: #9E9189; margin-bottom: 6px; font-weight: 500; }
.form-input {
  width: 100%; padding: 10px 14px;
  border: 1.5px solid #EDE8E0; border-radius: 10px;
  font-size: 14px; outline: none; color: #3D3530;
  background: white; box-sizing: border-box; font-family: inherit;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: #FF8C42; }

/* 头像选择器 */
.avatar-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.avatar-option {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 16px 12px; border: 2px solid #EDE8E0; border-radius: 14px;
  background: white; cursor: pointer; transition: all 0.2s;
}
.avatar-option:hover { border-color: #FF8C42; transform: translateY(-2px); }
.avatar-option.selected {
  border: 3px solid #FF8C42; background: #FFF5F0;
  box-shadow: 0 4px 16px rgba(255,140,66,0.2);
  transform: scale(1.03);
}
.avatar-real-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.avatar-label {
  font-size: 13px; color: #3D3530; font-weight: 600; text-align: center;
}

/* 性格设定 - 居中 */
.panda-style-selector { display: flex; gap: 12px; }
.panda-style-btn {
  flex: 1; padding: 16px 8px;
  border: 2px solid #EDE8E0; border-radius: 12px;
  background: white; cursor: pointer; transition: all 0.2s;
  display: flex; flex-direction: column;
  align-items: center;      /* 横向居中 */
  justify-content: center;  /* 纵向居中 */
  gap: 6px;
  text-align: center;
}
.panda-style-btn:hover { border-color: #FF8C42; transform: translateY(-2px); }
.panda-style-btn.active {
  border-color: #FF8C42;
  background: linear-gradient(135deg, #FFF5F0, #FFFBF8);
  box-shadow: 0 4px 16px rgba(255,140,66,0.2);
}
.style-emoji { font-size: 26px; }
.style-title { font-size: 13px; font-weight: 600; color: #3D3530; text-align: center; }
.style-hint  { font-size: 11px; color: #9E9189; text-align: center; line-height: 1.4; }

/* 主题 */
.theme-grid { display: flex; gap: 12px; flex-direction: column; }
.theme-card {
  border-radius: 12px; border: 2px solid #EDE8E0; cursor: pointer;
  transition: all 0.2s; height: 80px;
  display: flex; align-items: center; padding: 16px;
}
.theme-card:hover { border-color: #FF8C42; transform: translateY(-1px); }
.theme-card.active { border-color: #FF8C42; box-shadow: 0 4px 16px rgba(255,140,66,0.2); }
.theme-content { display: flex; align-items: center; gap: 16px; width: 100%; }
.theme-icon { font-size: 28px; }
.theme-name { font-size: 14px; color: #3D3530; font-weight: 600; }
.theme-desc { font-size: 12px; color: #9E9189; margin-top: 2px; }

/* 开关 */
.toggle-list { display: flex; flex-direction: column; gap: 16px; }
.toggle-item { display: flex; justify-content: space-between; align-items: center; }
.toggle-title { font-size: 14px; color: #3D3530; font-weight: 500; }
.toggle-sub { font-size: 12px; color: #9E9189; margin-top: 2px; }
.toggle-switch {
  width: 44px; height: 24px; background: #EDE8E0;
  border-radius: 12px; position: relative; cursor: pointer; transition: background 0.3s;
}
.toggle-switch.on { background: #5BAD7F; }
.toggle-thumb {
  width: 18px; height: 18px; background: white;
  border-radius: 50%; position: absolute; top: 3px; left: 3px;
  transition: transform 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.toggle-switch.on .toggle-thumb { transform: translateX(20px); }

.input-with-toggle { position: relative; }
.input-with-toggle .form-input { padding-right: 44px; }
.key-toggle {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%); background: none; border: none;
  cursor: pointer; font-size: 16px;
}
.api-link { margin-top: 6px; }
.link { font-size: 12px; color: #5BAD7F; text-decoration: none; }

.defense-countdown {
  background: #F0FFF4; border-radius: 10px; padding: 10px 14px;
  font-size: 13px; color: #5BAD7F; margin-top: 4px;
}
.countdown-num { font-size: 20px; font-weight: 700; color: #FF8C42; }

.data-btns { display: flex; gap: 12px; }
.btn-export-data {
  flex: 1; padding: 12px; border: 1.5px solid #5BAD7F;
  background: #F0FFF4; color: #5BAD7F; border-radius: 10px;
  font-size: 13px; cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.btn-export-data:hover { background: #5BAD7F; color: white; }
.btn-clear-data {
  flex: 1; padding: 12px; border: 1.5px solid #FFD0D0;
  background: #FFF5F5; color: #FF6B6B; border-radius: 10px;
  font-size: 13px; cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.btn-clear-data:hover { background: #FF6B6B; color: white; border-color: #FF6B6B; }

.save-toast {
  position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
  background: #3D3530; color: white; padding: 10px 24px;
  border-radius: 20px; font-size: 14px; z-index: 999;
  animation: toastIn 0.3s ease;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.confirm-modal {
  background: white; border-radius: 20px; padding: 36px;
  text-align: center; min-width: 280px;
}
.confirm-icon { font-size: 40px; margin-bottom: 12px; }
.confirm-title { font-size: 18px; font-weight: 700; color: #3D3530; margin-bottom: 8px; }
.confirm-sub { font-size: 13px; color: #9E9189; margin-bottom: 24px; }
.confirm-btns { display: flex; gap: 12px; }
.btn-cancel {
  flex: 1; padding: 10px; background: #EDE8E0; border: none;
  border-radius: 10px; color: #9E9189; font-size: 14px; cursor: pointer;
}
.btn-danger {
  flex: 1; padding: 10px; background: #FF6B6B; border: none;
  border-radius: 10px; color: white; font-size: 14px; cursor: pointer; font-weight: 600;
}
</style>