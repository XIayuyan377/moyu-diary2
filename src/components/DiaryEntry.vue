<template>
  <div class="entry-card card" :class="{ 'entry-highlight': isHighlight }">
    <div class="entry-header flex-between">
      <div class="entry-left flex gap-md">
        <span class="entry-emoji">{{ entry.emoji }}</span>
        <div class="entry-info flex-col gap-xs">
          <h4 class="entry-title">{{ entry.title }}</h4>
          <span class="entry-time text-muted">{{ formatTime(entry.time) }}</span>
        </div>
      </div>
      <div class="entry-right flex gap-md">
        <span class="tag" :class="'tag-' + entry.tagType">
          {{ entry.tag }}
        </span>
        <button class="btn-ghost btn-sm" @click="handleMore">⋯</button>
      </div>
    </div>

    <div class="entry-content text-secondary mt-md">
      {{ entry.content }}
    </div>

    <!-- 可选的内容补充 -->
    <div v-if="entry.mood" class="entry-footer mt-md flex gap-md">
      <span class="entry-mood">心情: {{ entry.mood }}</span>
      <span v-if="entry.duration" class="entry-duration">耗时: {{ entry.duration }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'DiaryEntry',
  props: {
    entry: {
      type: Object,
      required: true
      // Properties: emoji, title, time, tag, tagType, content, mood, duration
    },
    isHighlight: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const showMore = ref(false)

    const formatTime = (time) => {
      // 假设 time 是 HH:mm 的字符串
      const [hour, minute] = time.split(':')
      const date = new Date()
      date.setHours(parseInt(hour), parseInt(minute))
      
      const now = new Date()
      const diff = Math.floor((now - date) / 1000 / 60) // 分钟
      
      if (diff < 1) return '刚刚'
      if (diff < 60) return `${diff}分钟前`
      if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
      
      return time
    }

    const handleMore = () => {
      showMore.value = !showMore.value
      // 可以弹出菜单进行编辑/删除操作
    }

    return {
      formatTime,
      handleMore,
      showMore
    }
  }
}
</script>

<style scoped>
.entry-card {
  transition: all var(--duration-base) var(--easing-ease-out);
  border-left: 3px solid transparent;
}

.entry-card:hover {
  border-left-color: var(--color-main);
  transform: translateX(2px);
}

.entry-highlight {
  background-color: var(--color-tag-orange);
  border-left-color: var(--color-accent);
}

.entry-header {
  align-items: flex-start;
}

.entry-left {
  align-items: flex-start;
  flex: 1;
}

.entry-emoji {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
  line-height: 1;
  margin-top: 2px;
}

.entry-info {
  flex: 1;
}

.entry-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--color-text);
}

.entry-time {
  font-size: var(--font-size-xs);
}

.entry-content {
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
}

.entry-footer {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  align-items: center;
}

.entry-mood,
.entry-duration {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* 不同类型的标签颜色 */
.tag-green {
  background-color: var(--color-tag-green);
  color: #2F8F5B;
}

.tag-orange {
  background-color: var(--color-tag-orange);
  color: #D97706;
}

.tag-blue {
  background-color: var(--color-tag-blue);
  color: #0891B2;
}

.tag-pink {
  background-color: var(--color-tag-pink);
  color: #DB2777;
}
</style>
