<template>
  <div class="avatar-wrapper" :style="{ width: sizePixels, height: sizePixels }">
    <div
      class="avatar-container"
      :class="[
        'rounded-full overflow-hidden',
        'flex items-center justify-center',
        'transition-transform duration-300 hover:scale-110',
        sizeClass,
        statusClass,
      ]"
    >
      <!-- 如果有 src，显示图片 -->
      <img
        v-if="src"
        :src="src"
        :alt="alt"
        class="w-full h-full object-cover"
      />
      <!-- 否则显示 emoji 或首字母 -->
      <div v-else class="flex items-center justify-center w-full h-full text-center" :style="{ fontSize: fontSize }">
        {{ displayContent }}
      </div>

      <!-- 在线状态指示器 -->
      <div
        v-if="showStatus"
        class="absolute bottom-0 right-0"
        :class="[
          'rounded-full border-2 border-white',
          statusColor,
        ]"
        :style="{ width: statusDotSize, height: statusDotSize }"
      />
    </div>

    <!-- 可选的昵称显示 -->
    <div v-if="showName && name" class="text-center mt-2 text-sm font-medium truncate w-full">
      {{ name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  content?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away'
  showStatus?: boolean
  showName?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '用户头像',
  size: 'md',
  status: 'online',
  showStatus: false,
  showName: false,
  content: '👤',
})

// =====================================
// 计算属性
// =====================================

const sizeMap = {
  xs: { size: 24, statusDot: 6 },
  sm: { size: 32, statusDot: 8 },
  md: { size: 48, statusDot: 10 },
  lg: { size: 64, statusDot: 12 },
  xl: { size: 96, statusDot: 16 },
}

const sizePixels = computed(() => `${sizeMap[props.size].size}px`)

const fontSize = computed(() => {
  const fontSizeMap = {
    xs: '12px',
    sm: '14px',
    md: '20px',
    lg: '28px',
    xl: '40px',
  }
  return fontSizeMap[props.size]
})

const statusDotSize = computed(() => `${sizeMap[props.size].statusDot}px`)

const sizeClass = computed(() => {
  const classMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  }
  return classMap[props.size]
})

const statusColor = computed(() => {
  const colorMap = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  }
  return colorMap[props.status]
})

const statusClass = computed(() => {
  const baseClass = 'relative border-2'
  const borderMap = {
    online: 'border-emerald-100 shadow-md shadow-emerald-200/50',
    offline: 'border-gray-200',
    away: 'border-amber-100',
  }
  return `${baseClass} ${borderMap[props.status]}`
})

const displayContent = computed(() => {
  return props.content || '👤'
})
</script>

<style scoped>
.avatar-wrapper {
  display: inline-block;
}

.avatar-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-container img {
  object-fit: cover;
}
</style>
