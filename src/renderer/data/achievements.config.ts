/**
 * 研究生成就体系配置
 * 定义所有可解锁的成就及其属性
 */

export const ACHIEVEMENTS = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 基础成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'first_clock',
    title: '入学报到',
    desc: '完成第一次打卡',
    emoji: '🎓',
    exp: 50,
    rarity: 'common',
    category: 'basic',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 时间相关成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'early_bird',
    title: '早八战士',
    desc: '8点前完成打卡',
    emoji: '⏰',
    exp: 30,
    rarity: 'common',
    category: 'time',
    condition: {
      type: 'clock_before_hour',
      hour: 8,
    },
  },

  {
    id: 'midnight_scholar',
    title: '不眠学者',
    desc: '凌晨2点后仍在工作',
    emoji: '🌙',
    exp: 50,
    rarity: 'rare',
    category: 'time',
    condition: {
      type: 'active_after_hour',
      hour: 2,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 连续打卡成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'streak_7',
    title: '7天不摆烂',
    desc: '连续打卡7天',
    emoji: '🔥',
    exp: 200,
    rarity: 'rare',
    category: 'streak',
    condition: {
      type: 'consecutive_days',
      days: 7,
    },
  },

  {
    id: 'streak_30',
    title: '月度卷王',
    desc: '连续打卡30天',
    emoji: '👑',
    exp: 500,
    rarity: 'epic',
    category: 'streak',
    condition: {
      type: 'consecutive_days',
      days: 30,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 摸鱼/冥想相关成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'fish_master',
    title: '冥想大师',
    desc: '单日学术冥想超3小时',
    emoji: '🧘',
    exp: 30,
    rarity: 'uncommon',
    category: 'meditation',
    condition: {
      type: 'daily_meditation_hours',
      hours: 3,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 加班相关成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'overtime_30',
    title: '秃头预备役',
    desc: '累计加班30小时',
    emoji: '💈',
    exp: 100,
    rarity: 'rare',
    category: 'work',
    condition: {
      type: 'cumulative_overtime_hours',
      hours: 30,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 论文相关成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'paper_1000',
    title: '千字达人',
    desc: '单日论文推进超1000字',
    emoji: '✍️',
    exp: 80,
    rarity: 'uncommon',
    category: 'paper',
    condition: {
      type: 'daily_paper_words',
      words: 1000,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 导师相关成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'advisor_survive',
    title: '导师克星',
    desc: '连续30天未被导师催',
    emoji: '🛡️',
    exp: 300,
    rarity: 'epic',
    category: 'advisor',
    condition: {
      type: 'days_without_advisor_contact',
      days: 30,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 交互相关成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'panda_chat_50',
    title: '滚滚铁粉',
    desc: '和滚滚对话超50次',
    emoji: '🐼',
    exp: 100,
    rarity: 'uncommon',
    category: 'interaction',
    condition: {
      type: 'panda_interactions',
      count: 50,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 心情相关成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'mood_week',
    title: '情绪稳定人',
    desc: '连续7天记录心情',
    emoji: '🎭',
    exp: 100,
    rarity: 'uncommon',
    category: 'mood',
    condition: {
      type: 'consecutive_mood_records',
      days: 7,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 任务相关成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'all_task_done',
    title: '今日无愧',
    desc: '完成当天所有课题',
    emoji: '⭐',
    exp: 120,
    rarity: 'rare',
    category: 'task',
    condition: {
      type: 'daily_tasks_completed',
      percentage: 100,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 隐藏成就
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'phoenix_rebirth',
    title: '涅槃重生',
    desc: '24小时内连续工作并完成突破性进展',
    emoji: '🔥',
    exp: 1000,
    rarity: 'legendary',
    category: 'hidden',
    hidden: true,
    condition: {
      type: 'epic_session',
    },
  },

  {
    id: 'thesis_master',
    title: '论文大师',
    desc: '完成超过5万字的论文稿',
    emoji: '📚',
    exp: 1500,
    rarity: 'legendary',
    category: 'hidden',
    hidden: true,
    condition: {
      type: 'paper_words_total',
      words: 50000,
    },
  },
]

// ═══════════════════════════════════════════════════════════
// 辅助函数
// ═══════════════════════════════════════════════════════════

/**
 * 按ID获取成就
 */
export function getAchievementById(id) {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

/**
 * 按类别获取成就列表
 */
export function getAchievementsByCategory(category) {
  return ACHIEVEMENTS.filter((a) => a.category === category)
}

/**
 * 获取所有非隐藏成就
 */
export function getVisibleAchievements() {
  return ACHIEVEMENTS.filter((a) => !a.hidden)
}

/**
 * 按稀有度对成就分组
 */
export function groupAchievementsByRarity() {
  return {
    common: ACHIEVEMENTS.filter((a) => a.rarity === 'common'),
    uncommon: ACHIEVEMENTS.filter((a) => a.rarity === 'uncommon'),
    rare: ACHIEVEMENTS.filter((a) => a.rarity === 'rare'),
    epic: ACHIEVEMENTS.filter((a) => a.rarity === 'epic'),
    legendary: ACHIEVEMENTS.filter((a) => a.rarity === 'legendary'),
  }
}

/**
 * 计算成就总EXP（用于显示玩家等级）
 */
export function calculateTotalExp(unlockedAchievementIds) {
  return unlockedAchievementIds.reduce((total, id) => {
    const achievement = getAchievementById(id)
    return total + (achievement?.exp || 0)
  }, 0)
}
