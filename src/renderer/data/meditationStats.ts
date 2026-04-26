/**
 * 学术冥想统计系统
 * 原名为"摸鱼时间统计"，现改名为"学术冥想"
 * 提供冥想数据记录、分级评价和建议
 */

// ═══════════════════════════════════════════════════════════
// 冥想等级评级系统
// ═══════════════════════════════════════════════════════════

export const MEDITATION_TIERS = {
  BRONZE: { name: '青铜冥想家', minHours: 0, maxHours: 1, emoji: '🥉' },
  SILVER: { name: '白银冥想家', minHours: 1, maxHours: 3, emoji: '🥈' },
  GOLD: { name: '黄金冥想家', minHours: 3, maxHours: 6, emoji: '🥇' },
  DIAMOND: { name: '钻石冥想家', minHours: 6, maxHours: Infinity, emoji: '💎' },
}

// ═══════════════════════════════════════════════════════════
// 冥想评语库
// ═══════════════════════════════════════════════════════════

export const MEDITATION_COMMENTS = {
  BRONZE: [
    '冥想是生产力的补充，你已初步理解这个道理',
    '走马观花的休息，已经有意识记录了呢',
    '冥想也是工作的一部分，别妄自菲薄',
    '休息得好才能做得好，保持节奏',
  ],
  SILVER: [
    '冥想是生产力的补充，你已深刻理解这个道理',
    '学会劳逸结合，这是聪明人的选择',
    '冥想习惯养得不错，效率杠杠的',
    '这种冥想频率，要不要准备冥想大赛啊',
  ],
  GOLD: [
    '冥想时间不少呢，要不要改名"冥想大师"？',
    '你的冥想程度已经登堂入室，有大师风范',
    '这劲头，要不要把主业改成冥想啊',
    '冥想有成，别忘了标志性动作是啥',
  ],
  DIAMOND: [
    '你已成为冥想界的传奇，滚滚很尊敬你',
    '这冥想程度，已经可以开班授徒了',
    '冥想修炼到这个地步，或许可以悟道了',
    '滚滚都替你感到骄傲，怎么做到的啊',
  ],
}

// ═══════════════════════════════════════════════════════════
// 数据结构和管理
// ═══════════════════════════════════════════════════════════

export class MeditationTracker {
  constructor() {
    this.dailyRecords = {} // 日期 -> 分钟数
    this.weeklyStats = {}
    this.monthlyStats = {}
    this.loadFromStorage()
  }

  /**
   * 记录一次冥想
   */
  recordMeditation(date = null, minutes = 0) {
    const dateKey = date
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    if (!this.dailyRecords[dateKey]) {
      this.dailyRecords[dateKey] = 0
    }

    this.dailyRecords[dateKey] += minutes

    this.saveToStorage()
    return {
      date: dateKey,
      totalMinutes: this.dailyRecords[dateKey],
      hours: this.dailyRecords[dateKey] / 60,
    }
  }

  /**
   * 获取特定日期的冥想数据
   */
  getDailyMeditation(date = null) {
    const dateKey = date
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    return {
      date: dateKey,
      minutes: this.dailyRecords[dateKey] || 0,
      hours: (this.dailyRecords[dateKey] || 0) / 60,
    }
  }

  /**
   * 获取本周冥想统计
   */
  getWeeklyStats(date = null) {
    const endDate = date ? new Date(date) : new Date()
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6) // 过去7天

    let totalMinutes = 0
    const recordDays = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dateKey = d.toISOString().split('T')[0]

      if (this.dailyRecords[dateKey]) {
        totalMinutes += this.dailyRecords[dateKey]
        recordDays.push(dateKey)
      }
    }

    return {
      totalMinutes,
      totalHours: parseFloat((totalMinutes / 60).toFixed(2)),
      recordDays: recordDays.length,
      averagePerDay: recordDays.length > 0 ? totalMinutes / 7 : 0,
      averagePerRecordDay:
        recordDays.length > 0 ? totalMinutes / recordDays.length : 0,
    }
  }

  /**
   * 获取本月冥想统计
   */
  getMonthlyStats(date = null) {
    const now = date ? new Date(date) : new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    let totalMinutes = 0
    const recordDays = []

    // 获取本月所有日期
    const lastDay = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= lastDay; day++) {
      const d = new Date(year, month, day)
      const dateKey = d.toISOString().split('T')[0]

      if (this.dailyRecords[dateKey]) {
        totalMinutes += this.dailyRecords[dateKey]
        recordDays.push(dateKey)
      }
    }

    return {
      totalMinutes,
      totalHours: parseFloat((totalMinutes / 60).toFixed(2)),
      recordDays: recordDays.length,
      averagePerDay: recordDays.length > 0 ? totalMinutes / lastDay : 0,
      averagePerRecordDay:
        recordDays.length > 0 ? totalMinutes / recordDays.length : 0,
    }
  }

  /**
   * 计算冥想等级
   */
  calculateTier(hours) {
    if (hours >= MEDITATION_TIERS.DIAMOND.minHours) return MEDITATION_TIERS.DIAMOND
    if (hours >= MEDITATION_TIERS.GOLD.minHours) return MEDITATION_TIERS.GOLD
    if (hours >= MEDITATION_TIERS.SILVER.minHours) return MEDITATION_TIERS.SILVER
    return MEDITATION_TIERS.BRONZE
  }

  /**
   * 获取冥想评语
   */
  getMeditationComment(hours) {
    const tier = this.calculateTier(hours)
    let tierKey = 'BRONZE'

    if (tier === MEDITATION_TIERS.DIAMOND) tierKey = 'DIAMOND'
    else if (tier === MEDITATION_TIERS.GOLD) tierKey = 'GOLD'
    else if (tier === MEDITATION_TIERS.SILVER) tierKey = 'SILVER'

    const comments = MEDITATION_COMMENTS[tierKey]
    // 根据小时数选择不同的评语
    const index = Math.min(Math.floor(hours), comments.length - 1)
    return comments[index] || comments[0]
  }

  /**
   * 生成周报摘要
   */
  generateWeeklySummary() {
    const weeklyData = this.getWeeklyStats()
    const tier = this.calculateTier(weeklyData.totalHours)
    const comment = this.getMeditationComment(weeklyData.totalHours)

    return {
      title: '📚 学术冥想周报',
      content: `
本周学术冥想总时长：${weeklyData.totalHours} 小时
冥想指数：${tier.emoji} ${tier.name}
记录天数：${weeklyData.recordDays} 天
日均冥想：${Math.round(weeklyData.averagePerDay)} 分钟

💭 滚滚的评语：
"${comment}"
      `.trim(),
      stats: {
        ...weeklyData,
        tier: tier.name,
        emoji: tier.emoji,
      },
    }
  }

  /**
   * 生成月报摘要
   */
  generateMonthlySummary() {
    const monthlyData = this.getMonthlyStats()
    const tier = this.calculateTier(monthlyData.totalHours)
    const comment = this.getMeditationComment(monthlyData.totalHours)

    return {
      title: '📚 学术冥想月报',
      content: `
本月学术冥想总时长：${monthlyData.totalHours} 小时
冥想指数：${tier.emoji} ${tier.name}
记录天数：${monthlyData.recordDays} 天
日均冥想：${Math.round(monthlyData.averagePerDay)} 分钟

💭 滚滚的评语：
"${comment}"
      `.trim(),
      stats: {
        ...monthlyData,
        tier: tier.name,
        emoji: tier.emoji,
      },
    }
  }

  /**
   * 从本地存储加载数据
   */
  loadFromStorage() {
    const saved = localStorage.getItem('meditationStats')
    if (saved) {
      const data = JSON.parse(saved)
      this.dailyRecords = data.dailyRecords || {}
    }
  }

  /**
   * 保存数据到本地存储
   */
  saveToStorage() {
    localStorage.setItem(
      'meditationStats',
      JSON.stringify({
        dailyRecords: this.dailyRecords,
      })
    )
  }

  /**
   * 获取所有记录
   */
  getAllRecords() {
    return this.dailyRecords
  }

  /**
   * 清空所有记录（谨慎使用）
   */
  clearAllRecords() {
    this.dailyRecords = {}
    this.saveToStorage()
  }
}

// ═══════════════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════════════

/**
 * 格式化分钟数为可读的时间
 */
export function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins}分钟`
  }

  if (mins === 0) {
    return `${hours}小时`
  }

  return `${hours}小时${mins}分钟`
}

/**
 * 格式化小时数为可读格式
 */
export function formatHours(hours) {
  return hours % 1 === 0 ? `${hours}小时` : `${hours.toFixed(1)}小时`
}

/**
 * 获取冥想程度的描述
 */
export function getMeditationLevelDescription(hours) {
  const tier = getTierFromHours(hours)
  const comment = getMeditationCommentFromHours(hours)

  return {
    tier: tier.name,
    emoji: tier.emoji,
    comment,
    percentage: Math.min(100, Math.round((hours / 6) * 100)),
  }
}

/**
 * 根据小时数获取等级（工具函数）
 */
function getTierFromHours(hours) {
  if (hours >= MEDITATION_TIERS.DIAMOND.minHours) return MEDITATION_TIERS.DIAMOND
  if (hours >= MEDITATION_TIERS.GOLD.minHours) return MEDITATION_TIERS.GOLD
  if (hours >= MEDITATION_TIERS.SILVER.minHours) return MEDITATION_TIERS.SILVER
  return MEDITATION_TIERS.BRONZE
}

/**
 * 根据小时数获取评语（工具函数）
 */
function getMeditationCommentFromHours(hours) {
  const tier = getTierFromHours(hours)
  let tierKey = 'BRONZE'

  if (tier === MEDITATION_TIERS.DIAMOND) tierKey = 'DIAMOND'
  else if (tier === MEDITATION_TIERS.GOLD) tierKey = 'GOLD'
  else if (tier === MEDITATION_TIERS.SILVER) tierKey = 'SILVER'

  const comments = MEDITATION_COMMENTS[tierKey]
  const index = Math.min(Math.floor(hours), comments.length - 1)
  return comments[index] || comments[0]
}
