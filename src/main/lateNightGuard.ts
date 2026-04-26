/**
 * 熬夜守护系统
 * 在主进程中运行，定时检测当前时间并发出提醒
 * 通过IPC与渲染进程通信
 */

import { ipcMain } from 'electron'

// ═══════════════════════════════════════════════════════════
// 状态管理
// ═══════════════════════════════════════════════════════════

let guardActive = false
let currentOvertime = 0
let hourly24Check = null
let workStartTime = null
let mainWindow = null

// ═══════════════════════════════════════════════════════════
// 提醒配置
// ═══════════════════════════════════════════════════════════

const LATE_NIGHT_REMINDERS = {
  22: {
    emoji: '😟',
    message: '今天能按时走吗？',
    actionType: 'reminder',
  },
  23: {
    emoji: '🛏️',
    message: '主人你还在？',
    actionType: 'pajama', // 换睡衣
  },
  0: {
    emoji: '🎺',
    message: '跨越今天了，建议立刻去睡',
    actionType: 'fullscreen', // 全屏卡片
  },
}

// ═══════════════════════════════════════════════════════════
// 初始化守护系统
// ═══════════════════════════════════════════════════════════

export function initLateNightGuard(window) {
  mainWindow = window

  // 启动定时检测
  hourly24Check = setInterval(() => {
    checkLateNightTime()
  }, 60000) // 每分钟检查一次

  console.log('[LateNightGuard] 熬夜守护系统已启动')
}

// ═══════════════════════════════════════════════════════════
// 检测当前时间并发送提醒
// ═══════════════════════════════════════════════════════════

function checkLateNightTime() {
  const now = new Date()
  const hour = now.getHours()
  const minutes = now.getMinutes()

  // 如果在检查间隔内已经触发过，则跳过
  if (!shouldTriggerReminder(hour)) {
    return
  }

  const reminder = LATE_NIGHT_REMINDERS[hour]
  if (!reminder) {
    return
  }

  // 计算当日已工作时间
  const hoursWorked = calculateHoursWorked()

  // 发送提醒到渲染进程
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('late-night-reminder', {
      hour,
      emoji: reminder.emoji,
      message: reminder.message,
      actionType: reminder.actionType,
      hoursWorked: Math.floor(hoursWorked),
      timestamp: now.toISOString(),
    })
  }

  // 凌晨2点后解锁成就
  if (hour >= 2 && hour < 6) {
    unlockAchievement('midnight_scholar')
  }

  // 记录提醒已触发
  logReminderTriggered(hour)
}

// ═══════════════════════════════════════════════════════════
// 检查是否应该在此小时触发提醒
// ═══════════════════════════════════════════════════════════

let lastTriggeredHour = -1

function shouldTriggerReminder(hour) {
  if (lastTriggeredHour === hour) {
    return false
  }
  lastTriggeredHour = hour
  return true
}

// ═══════════════════════════════════════════════════════════
// 计算当日已工作时间
// ═══════════════════════════════════════════════════════════

function calculateHoursWorked() {
  if (!workStartTime) {
    return 0
  }

  const now = new Date()
  const diff = now.getTime() - new Date(workStartTime).getTime()
  return diff / (1000 * 60 * 60) // 转换为小时
}

// ═══════════════════════════════════════════════════════════
// 解锁成就
// ═══════════════════════════════════════════════════════════

function unlockAchievement(achievementId) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('achievement-unlocked', {
      id: achievementId,
      timestamp: new Date().toISOString(),
    })
  }
}

// ═══════════════════════════════════════════════════════════
// 记录提醒已触发
// ═══════════════════════════════════════════════════════════

function logReminderTriggered(hour) {
  const triggeredToday = JSON.parse(
    localStorage.getItem('lateNightRemindersTriggered') || '[]'
  )
  if (!triggeredToday.includes(hour)) {
    triggeredToday.push(hour)
    localStorage.setItem('lateNightRemindersTriggered', JSON.stringify(triggeredToday))
  }
}

// ═══════════════════════════════════════════════════════════
// IPC事件处理
// ═══════════════════════════════════════════════════════════

/**
 * 设置今日工作开始时间
 */
ipcMain.handle('set-work-start-time', (event, time) => {
  workStartTime = time
  return { success: true }
})

/**
 * 获取当前加班时间
 */
ipcMain.handle('get-current-overtime', () => {
  return {
    hours: Math.floor(calculateHoursWorked()),
    startTime: workStartTime,
  }
})

/**
 * 检查今日是否触发过特定提醒
 */
ipcMain.handle('check-reminder-triggered', (event, hour) => {
  const triggeredToday = JSON.parse(
    localStorage.getItem('lateNightRemindersTriggered') || '[]'
  )
  return triggeredToday.includes(hour)
})

/**
 * 重置每日提醒状态（午夜0点）
 */
ipcMain.handle('reset-daily-reminders', () => {
  lastTriggeredHour = -1
  localStorage.removeItem('lateNightRemindersTriggered')
  return { success: true }
})

// ═══════════════════════════════════════════════════════════
// 清理函数
// ═══════════════════════════════════════════════════════════

export function destroyLateNightGuard() {
  if (hourly24Check) {
    clearInterval(hourly24Check)
    hourly24Check = null
  }
  console.log('[LateNightGuard] 熬夜守护系统已关闭')
}
