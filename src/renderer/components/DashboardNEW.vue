<template>
  <div class="dashboard-new">
    <!-- 欢迎卡片区 -->
    <div class="welcome-section">
      <div class="welcome-card">
        <div class="welcome-left">
          <div class="character-avatar">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23FFE8D6'/%3E%3Ccircle cx='25' cy='30' r='6' fill='%233D3530'/%3E%3Ccircle cx='55' cy='30' r='6' fill='%233D3530'/%3E%3Cpath d='M30 45 Q40 50 50 45' stroke='%23FF8C42' stroke-width='2' fill='none'/%3E%3C/svg%3E" alt="user" />
          </div>
          <div class="welcome-text">
            <h2 class="welcome-title">进入书房了～</h2>
            <p class="welcome-subtitle">早安，科研人！ 🥐</p>
            <p class="welcome-date">2026年4月15日 星期三</p>
          </div>
        </div>
        <div class="welcome-quote">
          <p class="quote-text">"每次叫醒我的不是闹钟，是做稿日期"</p>
        </div>
      </div>
    </div>

    <!-- 任务和概况区 -->
    <div class="main-content">
      <!-- 左侧任务区 -->
      <div class="left-panel">
        <!-- 今日任务 -->
        <div class="task-section">
          <div class="section-header">
            <h3 class="section-title">📌 今日任务</h3>
            <span class="task-count">(0/3)</span>
            <button class="btn-add-task">+ 新建任务</button>
          </div>

          <!-- 任务列表 -->
          <div class="task-list">
            <div class="task-item">
              <input type="checkbox" class="task-checkbox" />
              <span class="task-name">跑模型数据</span>
              <span class="task-tag task-tag-exp">实验</span>
            </div>
            <div class="task-item">
              <input type="checkbox" class="task-checkbox" />
              <span class="task-name">修改引言部分</span>
              <span class="task-tag task-tag-paper">论文</span>
            </div>
            <div class="task-item">
              <input type="checkbox" class="task-checkbox" />
              <span class="task-name">阅读 CVPR 最新文献</span>
              <span class="task-tag task-tag-paper">文献</span>
            </div>
          </div>
        </div>

        <!-- 今日活动摘要 -->
        <div class="activity-section">
          <div class="activity-grid">
            <div class="activity-card">
              <div class="activity-icon">🎯</div>
              <div class="activity-label">该隅水了</div>
              <div class="activity-value">1.2h 2min</div>
            </div>
            <div class="activity-card">
              <div class="activity-icon">📝</div>
              <div class="activity-label">记录</div>
              <div class="activity-value">-</div>
            </div>
            <div class="activity-card">
              <div class="activity-icon">⚡</div>
              <div class="activity-label">起来走走</div>
              <div class="activity-value">4.2 min</div>
            </div>
            <div class="activity-card">
              <div class="activity-icon">😴</div>
              <div class="activity-label">休息</div>
              <div class="activity-value">-</div>
            </div>
            <div class="activity-card">
              <div class="activity-icon">⏲️</div>
              <div class="activity-label">番茄钟</div>
              <div class="activity-value">25:00</div>
            </div>
            <div class="activity-card">
              <div class="activity-icon">▶️</div>
              <div class="activity-label">-</div>
              <div class="activity-value">-</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧信息区 -->
      <div class="right-panel">
        <!-- 用户等级卡片 -->
        <div class="user-card">
          <div class="user-card-header">
            <div class="user-avatar-small">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%23FFE8D6'/%3E%3Ccircle cx='18' cy='22' r='5' fill='%233D3530'/%3E%3Ccircle cx='42' cy='22' r='5' fill='%233D3530'/%3E%3Cpath d='M22 35 Q30 40 38 35' stroke='%23FF8C42' stroke-width='2' fill='none'/%3E%3C/svg%3E" alt="user" />
            </div>
            <div class="user-info">
              <h4 class="user-name">Lv.4 • 实验室常客</h4>
              <p class="user-quote">"每个角色，都是你努力的见证"</p>
            </div>
          </div>

          <div class="user-stats">
            <div class="stat-row">
              <span class="stat-label">总经验值 (EXP)</span>
              <span class="stat-value">1,245 pts</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">已达成徽章</span>
              <span class="stat-value">4 / 12</span>
            </div>
          </div>

          <div class="user-buttons">
            <button class="btn btn-primary">🏅 打卡勋章</button>
            <button class="btn btn-secondary">📚 科研勋章</button>
            <button class="btn btn-secondary">💚 健康勋章</button>
          </div>
        </div>

        <!-- 今日概况 -->
        <div class="today-overview">
          <h4 class="overview-title">今日概况</h4>
          <div class="overview-item">
            <span class="overview-label">在岗时长</span>
            <span class="overview-value">6.5 h</span>
          </div>
          <div class="overview-item">
            <span class="overview-label">完成任务</span>
            <span class="overview-value">0</span>
          </div>
          <div class="overview-item">
            <span class="overview-label">摸鱼次数</span>
            <span class="overview-value">3 次</span>
          </div>
          <div class="overview-item">
            <span class="overview-label">起身次数</span>
            <span class="overview-value">2 次</span>
          </div>
        </div>

        <!-- AI 建议 -->
        <div class="ai-tips">
          <p class="tips-text">"每个奋斗者都有梦想，可是等等，你开了吗？"</p>
        </div>
      </div>
    </div>

    <!-- 打卡操作区 -->
    <div class="action-section">
      <button class="btn-large btn-checkin-start">👮 上班打卡</button>
      <button class="btn-large btn-checkin-end">🌙 下班打卡</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PandaCard from '../components/PandaCard.vue'
import { ref, computed } from 'vue'

// 组件状态
const taskCount = ref<number>(0)
const totalTasks = ref<number>(3)
const userLevel = ref<number>(4)
const userExp = ref<number>(1245)
const userMedals = ref<number>(4)
const totalMedals = ref<number>(12)

// 计算属性
const expPercentage = computed<number>(() => {
  return Math.min((userExp.value / 2000) * 100, 100)
})

// 方法
const handleAddTask = (): void => {
  console.log('Add task clicked')
}

const handleCheckIn = (type: 'start' | 'end'): void => {
  console.log(`Check in ${type} clicked`)
}

const handleTaskToggle = (index: number): void => {
  console.log(`Task ${index} toggled`)
}

const handleMedalClick = (medalType: string): void => {
  console.log(`Medal ${medalType} clicked`)
}
</script>

<style scoped>
.dashboard-new {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FAF7F2 0%, #FFF5E6 100%);
  padding: 20px;
  overflow-y: auto;
}

/* 欢迎卡片区 */
.welcome-section {
  margin-bottom: 24px;
}

.welcome-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #FFF5E6 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.08);
  border: 1px solid #EDE8E0;
}

.welcome-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.character-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #FFE8D6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.character-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.welcome-title {
  font-size: 18px;
  font-weight: 600;
  color: #3D3530;
  margin: 0;
}

.welcome-subtitle {
  font-size: 16px;
  color: #5BAD7F;
  margin: 0;
  font-weight: 500;
}

.welcome-date {
  font-size: 12px;
  color: #9E9189;
  margin: 0;
}

.welcome-quote {
  flex: 1;
  background: #FFF0E6;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
}

.quote-text {
  font-size: 14px;
  color: #3D3530;
  text-align: center;
  margin: 0;
  font-weight: 500;
}

/* 主要内容区 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  margin-bottom: 24px;
}

/* 左侧面板 */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-section {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #EDE8E0;
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #3D3530;
  margin: 0;
}

.task-count {
  font-size: 14px;
  color: #9E9189;
}

.btn-add-task {
  background: #FF8C42;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;
}

.btn-add-task:hover {
  background: #E67E30;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.25);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #FFFAF5;
  border-radius: 8px;
  border: 1px solid #F5F0EA;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: #FFF5E6;
  border-color: #EDE8E0;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #5BAD7F;
}

.task-name {
  flex: 1;
  font-size: 14px;
  color: #3D3530;
  font-weight: 500;
}

.task-tag {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.task-tag-exp {
  background: #E8F5EE;
  color: #5BAD7F;
}

.task-tag-paper {
  background: #FFF0E6;
  color: #FF8C42;
}

/* 活动部分 */
.activity-section {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #EDE8E0;
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.08);
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.activity-card {
  background: linear-gradient(135deg, #FFFAF5 0%, #FFF5E6 100%);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  border: 1px solid #F5F0EA;
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(61, 53, 48, 0.12);
}

.activity-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.activity-label {
  font-size: 12px;
  color: #9E9189;
  margin-bottom: 4px;
}

.activity-value {
  font-size: 13px;
  font-weight: 600;
  color: #3D3530;
}

/* 右侧面板 */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-card {
  background: linear-gradient(135deg, #FFFAF5 0%, #FFF0E6 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #EDE8E0;
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.08);
}

.user-card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar-small {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #FFE8D6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3530;
  margin: 0;
}

.user-quote {
  font-size: 11px;
  color: #9E9189;
  margin: 0;
}

.user-stats {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #EDE8E0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-label {
  color: #9E9189;
}

.stat-value {
  font-weight: 600;
  color: #3D3530;
}

.user-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #FF8C42;
  color: #FFFFFF;
}

.btn-primary:hover {
  background: #E67E30;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.25);
}

.btn-secondary {
  background: #F0F7F0;
  color: #5BAD7F;
  border: 1px solid #E8F5EE;
}

.btn-secondary:hover {
  background: #E8F5EE;
  border-color: #5BAD7F;
}

/* 今日概况 */
.today-overview {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #EDE8E0;
  box-shadow: 0 2px 8px rgba(61, 53, 48, 0.08);
}

.overview-title {
  font-size: 14px;
  font-weight: 600;
  color: #3D3530;
  margin: 0 0 12px 0;
}

.overview-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
}

.overview-item:last-child {
  margin-bottom: 0;
}

.overview-label {
  color: #9E9189;
}

.overview-value {
  font-weight: 600;
  color: #3D3530;
}

/* AI 提示 */
.ai-tips {
  background: linear-gradient(135deg, #FFF0E6 0%, #FFE8D6 100%);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #EDE8E0;
  border-left: 4px solid #FF8C42;
}

.tips-text {
  font-size: 12px;
  color: #3D3530;
  margin: 0;
  text-align: center;
  font-weight: 500;
}

/* 操作按钮区 */
.action-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 600px;
}

.btn-large {
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-checkin-start {
  background: #5BAD7F;
  color: #FFFFFF;
}

.btn-checkin-start:hover {
  background: #4A9A6F;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(91, 173, 127, 0.3);
}

.btn-checkin-end {
  background: linear-gradient(135deg, #FF8C42 0%, #FFB3A3 100%);
  color: #FFFFFF;
}

.btn-checkin-end:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 140, 66, 0.3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .welcome-card {
    flex-direction: column;
    gap: 16px;
  }

  .welcome-quote {
    margin-left: 0;
  }

  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-new {
    padding: 12px;
  }

  .welcome-left {
    flex-direction: column;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }

  .action-section {
    grid-template-columns: 1fr;
  }
}
</style>
