<template>
  <div class="settings-page">
    <!-- 页面标题 -->
    <div class="settings-header">
      <h1>⚙️ 系统设置</h1>
      <p>定制你的专属摸鱼体验</p>
    </div>

    <!-- 设置内容 -->
    <div class="settings-container">
      <!-- 左列：用户信息 -->
      <section class="settings-section">
        <h2 class="section-title">👤 我的档案</h2>

        <!-- 昵称设置 -->
        <div class="setting-item">
          <label>昵称</label>
          <div class="input-group">
            <input
              v-model="form.nickname"
              type="text"
              placeholder="输入昵称"
              class="input"
            />
            <button @click="updateNickname" class="btn-save">
              保存
            </button>
          </div>
        </div>

        <!-- 头像选择 -->
        <div class="setting-item">
          <label>角色头像</label>
          <div class="avatar-selector" style="grid-template-columns: repeat(2, 1fr);">
            <button
              v-for="avatar in avatarOptions"
              :key="avatar.id"
              class="avatar-btn"
              :class="{ selected: form.avatar === avatar.id }"
               @click="updateAvatar(avatar.id)"
                :title="avatar.label"
              >
                 <img :src="avatar.src" class="avatar-real-img" />
                <span class="avatar-name">{{ avatar.label }}</span>
               </button>
              </div>
          <p class="setting-desc">
            当前选择: <strong>{{ getAvatarName(form.avatar) }}</strong>
          </p>
        </div>

        <!-- 性别 -->
        <div class="setting-item">
          <label>性别</label>
          <select v-model="form.gender" class="input">
            <option value="female">女研究生 👩</option>
            <option value="male">男研究生 👨</option>
          </select>
        </div>

        <!-- 专业方向 -->
        <div class="setting-item">
          <label>研究方向</label>
          <input
            v-model="form.major"
            type="text"
            placeholder="人工智能与计算机视觉"
            class="input"
          />
        </div>
      </section>

      <!-- 右列：熊猫个性设置 -->
      <section class="settings-section">
        <h2 class="section-title">🐼 熊猫个性设置</h2>

        <!-- 性格选择 -->
        <div class="setting-item">
          <label>滚滚性格</label>
          <div class="style-selector">
            <button
              v-for="style in pandaStyles"
              :key="style.id"
              class="style-btn"
              :class="{ selected: form.pandaStyle === style.id }"
              @click="updatePandaStyle(style.id)"
            >
              <div class="style-icon">{{ style.emoji }}</div>
              <div class="style-info">
                <div class="style-title">{{ style.title }}</div>
                <div class="style-desc">{{ style.desc }}</div>
              </div>
            </button>
          </div>
          <p class="setting-desc">
            影响情绪日记的回复语气
          </p>
        </div>

        <!-- 主题选择 -->
        <div class="setting-item">
          <label>主题风格</label>
          <div class="theme-selector">
            <button
              v-for="theme in themes"
              :key="theme.id"
              class="theme-btn"
              :class="{ selected: form.theme === theme.id }"
              @click="updateTheme(theme.id)"
            >
              <div
                class="theme-preview"
                :style="{ background: theme.previewBg }"
              >
                {{ theme.icon }}
              </div>
              <span>{{ theme.name }}</span>
            </button>
          </div>
          <p class="setting-desc">
            切换主题后，熊猫会换上相应的装扮
          </p>
        </div>
      </section>
    </div>

    <!-- 预览区 -->
    <section class="preview-section">
      <h2 class="section-title">👀 效果预览</h2>
      <div class="preview-container">
        <!-- 左：用户卡片预览 -->
        <div class="preview-card">
          <h3>用户卡片</h3>
          <SidebarUserCard />
        </div>

        <!-- 中：头部信息预览 -->
        <div class="preview-card">
          <h3>顶部用户信息</h3>
          <HeaderUserInfo />
        </div>

        <!-- 右：熊猫状态 -->
        <div class="preview-card">
          <h3>熊猫助手状态</h3>
          <div class="panda-preview">
            <PandaAssistant />
          </div>
        </div>
      </div>
    </section>

    <!-- 操作按钮 -->
    <div class="settings-footer">
      <button @click="saveAllSettings" class="btn-primary">
        💾 保存所有设置
      </button>
      <button @click="resetSettings" class="btn-secondary">
        ↶ 重置为默认
      </button>
    </div>

    <!-- 提示信息 -->
    <transition name="toast-fade">
      <div v-if="showSaveToast" class="toast-message">
        ✓ 设置已保存！
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import Avatar from '@/components/Avatar.vue'
import SidebarUserCard from '@/components/SidebarUserCard.vue'
import HeaderUserInfo from '@/components/HeaderUserInfo.vue'
import PandaAssistant from '@/components/PandaAssistant.vue'

// =====================================
// 状态管理
// =====================================
const userStore = useUserStore()
const showSaveToast = ref(false)

// =====================================
// 表单数据
// =====================================
const form = ref({
  nickname: userStore.nickname,
  avatar: userStore.avatar,
  pandaStyle: userStore.pandaStyle,
  gender: 'female',
  major: '人工智能与计算机视觉',
  theme: userStore.theme,
})

// =====================================
// 配置数据
// =====================================
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

const pandaStyles = [
  {
    id: 'gentle',
    emoji: '🤗',
    title: '温柔陪伴型',
    desc: '多鼓励，多提醒喝水休息',
  },
  {
    id: 'toxic',
    emoji: '😤',
    title: '毒舌导师型',
    desc: '今天文献看了吗？还不去跑数据？',
  },
  {
    id: 'yin_yang',
    emoji: '🌀',
    title: '阴阳怪气型',
    desc: '哇，今天又这么努力呢（斜眼）',
  },
]

const themes = [
  {
    id: 'bamboo',
    name: '竹林清风',
    icon: '🌿',
    previewBg: 'linear-gradient(135deg, #E8F5EE, #C8E8D8)',
    outfit: 'normal',
  },
  {
    id: 'sakura',
    name: '樱花物语',
    icon: '🌸',
    previewBg: 'linear-gradient(135deg, #FFE8F0, #F8D0E0)',
    outfit: 'flower',
  },
  {
    id: 'night',
    name: '深夜实验室',
    icon: '🌙',
    previewBg: 'linear-gradient(135deg, #1A1A2E, #2D2D4E)',
    outfit: 'goggle',
  },
]

// =====================================
// 计算属性
// =====================================
const getAvatarName = computed(() => (avatarId) => {
  return avatarOptions.find((a) => a.id === avatarId)?.name || '未知'
})

// =====================================
// 方法
// =====================================

/**
 * 更新昵称
 */
const updateNickname = () => {
  userStore.setNickname(form.value.nickname)
  showToast()
}

/**
 * 更新头像（实时同步）
 */
const updateAvatar = (avatarId) => {
  form.value.avatar = avatarId
  userStore.setAvatar(avatarId)
  showToast('头像已切换')
}

/**
 * 更新熊猫性格（实时同步）
 */
const updatePandaStyle = (styleId) => {
  form.value.pandaStyle = styleId
  userStore.setPandaStyle(styleId)
  showToast('性格已更新')
}

/**
 * 更新主题（实时同步 + 换装）
 */
const updateTheme = (themeId) => {
  form.value.theme = themeId
  userStore.setTheme(themeId)

  // 根据主题更新熊猫装扮
  const theme = themes.find((t) => t.id === themeId)
  if (theme) {
    userStore.setPandaOutfit(theme.outfit)
  }

  showToast('主题已切换，熊猫换装了')
}

/**
 * 保存所有设置
 */
const saveAllSettings = () => {
  userStore.setNickname(form.value.nickname)
  userStore.setAvatar(form.value.avatar)
  userStore.setPandaStyle(form.value.pandaStyle)
  userStore.setTheme(form.value.theme)
  userStore.saveAllSettings()
  showToast('所有设置已保存')
}

/**
 * 重置为默认设置
 */
const resetSettings = () => {
  if (confirm('确定要重置为默认设置吗？')) {
    form.value = {
      nickname: '摸鱼研究生',
      avatar: 'default',
      pandaStyle: 'gentle',
      gender: 'female',
      major: '人工智能与计算机视觉',
      theme: 'bamboo',
    }
    saveAllSettings()
    showToast('已重置为默认设置')
  }
}

/**
 * 显示提示信息
 */
const showToast = (message = '设置已保存') => {
  showSaveToast.value = true
  setTimeout(() => {
    showSaveToast.value = false
  }, 2000)
}
</script>

<style scoped>
/* ========================================
   基础样式
   ======================================== */
.avatar-real-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.settings-page {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.settings-header {
  text-align: center;
  margin-bottom: 32px;
}

.settings-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.settings-header p {
  margin: 8px 0 0;
  font-size: 14px;
  color: #718096;
}

/* ========================================
   设置容器
   ======================================== */

.settings-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
}

/* ========================================
   设置项
   ======================================== */

.setting-item {
  margin-bottom: 20px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-desc {
  margin: 8px 0 0;
  font-size: 12px;
  color: #a0aec0;
  line-height: 1.4;
}

/* ========================================
   输入框
   ======================================== */

.input,
.input-group {
  width: 100%;
}

.input {
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #5BAD7F;
  box-shadow: 0 0 8px rgba(91, 173, 127, 0.2);
}

.input-group {
  display: flex;
  gap: 8px;
}

.input-group .input {
  flex: 1;
}

.btn-save {
  padding: 10px 16px;
  background: #5BAD7F;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  background: #4a9a6f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.3);
}

/* ========================================
   头像选择器
   ======================================== */

.avatar-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.avatar-btn {
  padding: 12px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-btn:hover {
  border-color: #5BAD7F;
  background: #f0fff4;
}

.avatar-btn.selected {
  border-color: #5BAD7F;
  background: linear-gradient(135deg, #f0fff4 0%, #e8f5ee 100%);
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.2);
}

.avatar-name {
  font-size: 11px;
  font-weight: 600;
  color: #718096;
  text-align: center;
}

/* ========================================
   风格选择器
   ======================================== */

.style-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.style-btn {
  padding: 12px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;
}

.style-btn:hover {
  border-color: #5BAD7F;
  background: #f0fff4;
}

.style-btn.selected {
  border-color: #5BAD7F;
  background: linear-gradient(135deg, #f0fff4 0%, #e8f5ee 100%);
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.2);
}

.style-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.style-info {
  flex: 1;
}

.style-title {
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
}

.style-desc {
  font-size: 11px;
  color: #a0aec0;
  margin-top: 2px;
}

/* ========================================
   主题选择器
   ======================================== */

.theme-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.theme-btn {
  flex: 1;
  padding: 12px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.theme-btn:hover {
  border-color: #5BAD7F;
  transform: translateY(-2px);
}

.theme-btn.selected {
  border-color: #5BAD7F;
  box-shadow: 0 4px 12px rgba(91, 173, 127, 0.2);
}

.theme-preview {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.theme-btn span {
  font-size: 12px;
  font-weight: 600;
  color: #2d3748;
}

/* ========================================
   预览区
   ======================================== */

.preview-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.preview-card {
  padding: 12px;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.preview-card h3 {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
}

.panda-preview {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ========================================
   操作按钮
   ======================================== */

.settings-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #5BAD7F 0%, #4a9a6f 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(91, 173, 127, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

/* ========================================
   提示信息
   ======================================== */

.toast-message {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3748;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  z-index: 1000;
  animation: toast-fade-in 0.3s ease;
}

@keyframes toast-fade-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* ========================================
   响应式设计
   ======================================== */

@media (max-width: 1024px) {
  .settings-container {
    grid-template-columns: 1fr;
  }

  .avatar-selector {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }

  .settings-header h1 {
    font-size: 22px;
  }

  .settings-section {
    padding: 16px;
  }

  .avatar-selector {
    grid-template-columns: repeat(3, 1fr);
  }

  .theme-selector {
    flex-wrap: wrap;
  }

  .preview-container {
    grid-template-columns: 1fr;
  }

  .settings-footer {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
