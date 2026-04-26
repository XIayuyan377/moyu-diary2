import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import TaskManager from './views/TaskManager.vue'
import MoodDiary from './views/MoodDiary.vue'
import Report from './views/Report.vue'
import Achievements from './views/Achievements.vue'
import Settings from './views/Settings.vue'

const routes = [
  {
    path: '/',
    component: Dashboard,
    meta: { title: '摸鱼大厅' },
  },
  {
    path: '/tasks',
    component: TaskManager,
    meta: { title: '今日课题' },
  },
  {
    path: '/mood',
    component: MoodDiary,
    meta: { title: '情绪日记' },
  },
  {
    path: '/report',
    component: Report,
    meta: { title: '摸鱼报表' },
  },
  {
    path: '/achievements',
    component: Achievements,
    meta: { title: '成就墙' },
  },
  {
    path: '/settings',
    component: Settings,
    meta: { title: '系统设置' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
