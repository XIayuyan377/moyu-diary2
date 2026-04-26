import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // =====================================
  // 状态定义
  // =====================================
  const nickname = ref(localStorage.getItem('moyu_nickname') || '摸鱼研究生')
  const avatar = ref(localStorage.getItem('moyu_avatar') || 'default')
  const pandaStyle = ref(localStorage.getItem('moyu_panda_style') || 'gentle')
  const pandaOutfit = ref(localStorage.getItem('moyu_panda_outfit') || 'normal')
  const level = ref(4)
  const currentExp = ref(340)
  const maxExp = ref(400)
  const levelTitle = ref('调参老中医')
  const theme = ref(localStorage.getItem('moyu_theme') || 'bamboo')

  // =====================================
  // 计算属性
  // =====================================
  const expPercentage = computed(() => {
    return Math.round((currentExp.value / maxExp.value) * 100)
  })

  const levelDisplay = computed(() => {
    return `Lv.${level.value} · ${levelTitle.value}`
  })

  // =====================================
  // 方法 - 更新用户信息
  // =====================================

  /**
   * 更新用户昵称
   */
  const setNickname = (newNickname) => {
    nickname.value = newNickname
    localStorage.setItem('moyu_nickname', newNickname)
  }

  /**
   * 更新头像
   * @param {string} avatarId - 头像ID（default, short_hair, boy, glasses, graduate, panda）
   */
  const setAvatar = (avatarId) => {
    avatar.value = avatarId
    localStorage.setItem('moyu_avatar', avatarId)
  }

  /**
   * 更新熊猫性格
   * @param {string} styleId - 性格ID（gentle, toxic, yin_yang）
   */
  const setPandaStyle = (styleId) => {
    pandaStyle.value = styleId
    localStorage.setItem('moyu_panda_style', styleId)
  }

  /**
   * 更新熊猫装扮
   * @param {string} outfitId - 装扮ID（normal, flower, goggle）
   */
  const setPandaOutfit = (outfitId) => {
    pandaOutfit.value = outfitId
    localStorage.setItem('moyu_panda_outfit', outfitId)
  }

  /**
   * 更新主题
   * @param {string} themeId - 主题ID
   */
  const setTheme = (themeId) => {
    theme.value = themeId
    localStorage.setItem('moyu_theme', themeId)
  }

  /**
   * 增加经验值
   * @param {number} exp - 经验值
   */
  const addExp = (exp) => {
    currentExp.value += exp
    if (currentExp.value >= maxExp.value) {
      currentExp.value = 0
      level.value += 1
    }
  }

  /**
   * 保存所有用户设置
   */
  const saveAllSettings = () => {
    const settings = {
      nickname: nickname.value,
      avatar: avatar.value,
      pandaStyle: pandaStyle.value,
      pandaOutfit: pandaOutfit.value,
      level: level.value,
      currentExp: currentExp.value,
      theme: theme.value,
    }
    localStorage.setItem('moyuSettings', JSON.stringify(settings))
  }

  /**
   * 从localStorage加载用户设置
   */
  const loadSettings = () => {
    const saved = localStorage.getItem('moyuSettings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        nickname.value = settings.nickname || nickname.value
        avatar.value = settings.avatar || avatar.value
        pandaStyle.value = settings.pandaStyle || pandaStyle.value
        pandaOutfit.value = settings.pandaOutfit || pandaOutfit.value
        level.value = settings.level || level.value
        currentExp.value = settings.currentExp || currentExp.value
        theme.value = settings.theme || theme.value
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }

  return {
    // 状态
    nickname,
    avatar,
    pandaStyle,
    pandaOutfit,
    level,
    currentExp,
    maxExp,
    levelTitle,
    theme,
    // 计算属性
    expPercentage,
    levelDisplay,
    // 方法
    setNickname,
    setAvatar,
    setPandaStyle,
    setPandaOutfit,
    setTheme,
    addExp,
    saveAllSettings,
    loadSettings,
  }
})
