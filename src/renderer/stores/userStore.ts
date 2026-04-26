import { reactive, watch } from 'vue'

const STORAGE_KEY = 'moyu_user_state'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

export const userStore = reactive({
  nickname: '科研人',
  level: 4,
  currentExp: 340,
  maxExp: 400,
  avatar: 'girl_ponytail',
  pandaStyle: 'gentle',
  pandaOutfit: 'normal',
  defenseDate: '2027-06-30',
  equippedTitle: '调参老中医',
  theme: 'bamboo',
  ...loadState()
})

export function saveUserStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userStore))
}

watch(userStore, saveUserStore, { deep: true })

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: '文献复读机 📚', 2: '文献复读机 📚',
    3: '实验室常客 🧪', 4: '调参老中医 🔬',
    5: '调参老中医 🔬', 6: '发量卫士 💈',
    7: '秃头预备役 🧑‍🦲', 8: '卷王附体 👑',
    9: '卷王附体 👑', 10: '传说级打工机器 ⭐'
  }
  return titles[level] || '初级科研民工'
}
