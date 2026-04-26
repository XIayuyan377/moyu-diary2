<template>
  <div class="panda-widget card-green">
    <!-- 熊猫卡通形象 -->
    <div class="panda-display">
      <div class="panda-emoji" :class="'panda-' + mood">{{ pandaEmoji }}</div>
      <div class="panda-name">熊猫助手</div>
    </div>

    <!-- 当前状态描述 -->
    <div class="panda-status mt-lg">
      <p class="panda-message animate-slide-up" :key="messageIndex">
        {{ currentMessage }}
      </p>
    </div>

    <!-- 状态条 -->
    <div class="panda-stats mt-lg gap-md flex-col">
      <!-- 心情值 -->
      <div class="stat-item">
        <div class="flex-between mb-sm">
          <span class="stat-label">心情值</span>
          <span class="stat-value">{{ moodValue }}%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill mood-fill" :style="{ width: moodValue + '%' }"></div>
        </div>
      </div>

      <!-- 活力值 -->
      <div class="stat-item">
        <div class="flex-between mb-sm">
          <span class="stat-label">活力值</span>
          <span class="stat-value">{{ energyValue }}%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill energy-fill" :style="{ width: energyValue + '%' }"></div>
        </div>
      </div>

      <!-- 工作投入度 -->
      <div class="stat-item">
        <div class="flex-between mb-sm">
          <span class="stat-label">投入度</span>
          <span class="stat-value">{{ focusValue }}%</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill focus-fill" :style="{ width: focusValue + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="panda-actions mt-lg gap-md flex-col" style="width: 100%;">
      <button class="btn btn-primary" style="width: 100%" @click="handleStartWork">
        😴 {{ isWorking ? '正在摸鱼' : '开始工作' }}
      </button>
      <button class="btn btn-secondary" style="width: 100%" @click="handleRest">
        🌟 给我打气
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'

export default {
  name: 'PandaWidget',
  props: {
    mood: {
      type: String,
      default: 'normal' // 'happy', 'normal', 'tired', 'sad'
    },
    moodValue: {
      type: Number,
      default: 65
    },
    energyValue: {
      type: Number,
      default: 45
    },
    focusValue: {
      type: Number,
      default: 70
    }
  },
  emits: ['start-work', 'rest'],
  setup(props, { emit }) {
    const isWorking = ref(false)
    const messageIndex = ref(0)
    const messages = [
      '又开始摸鱼了呢~ 放松一下吧',
      '该喝水了，别忘了💧',
      '坚持住，你已经很努力了',
      '今天的提交了吗？😜',
      '你的热情值得被看见❤️',
      '摸鱼也要摸得有品质'
    ]

    const moodEmojis = {
      happy: '😊',
      normal: '🐼',
      tired: '😴',
      sad: '😢'
    }

    const pandaEmoji = computed(() => {
      return moodEmojis[props.mood] || '🐼'
    })

    const currentMessage = computed(() => {
      return messages[messageIndex.value % messages.length]
    })

    const handleStartWork = () => {
      isWorking.value = !isWorking.value
      emit('start-work', isWorking.value)
    }

    const handleRest = () => {
      emit('rest')
      // 暂时增加心情值
    }

    // 定时更新消息
    onMounted(() => {
      setInterval(() => {
        messageIndex.value++
      }, 8000)
    })

    return {
      isWorking,
      messageIndex,
      pandaEmoji,
      currentMessage,
      handleStartWork,
      handleRest
    }
  }
}
</script>

<style scoped>
.panda-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-lg);
  min-height: 400px;
}

.panda-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.panda-emoji {
  font-size: 100px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-lg);
  animation: float 3s ease-in-out infinite;
}

.panda-emoji.panda-happy {
  background: linear-gradient(135deg, #FFE8F0 0%, #FFF5E6 100%);
}

.panda-emoji.panda-tired {
  opacity: 0.7;
  animation: none;
}

.panda-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-main);
}

.panda-message {
  font-size: var(--font-size-lg);
  color: var(--color-main);
  margin: 0;
  font-weight: var(--font-weight-medium);
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panda-stats {
  width: 100%;
}

.stat-item {
  width: 100%;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.stat-value {
  font-size: var(--font-size-sm);
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
}

.stat-bar {
  width: 100%;
  height: 10px;
  background-color: rgba(91, 173, 127, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-base) var(--easing-ease-out);
}

.mood-fill {
  background: linear-gradient(90deg, #5BAD7F 0%, #7AC77F 100%);
}

.energy-fill {
  background: linear-gradient(90deg, #FF8C42 0%, #FFB84D 100%);
}

.focus-fill {
  background: linear-gradient(90deg, #0891B2 0%, #06B6D4 100%);
}

.panda-actions {
  width: 100%;
}
</style>
