<template>
  <AppLayout />
</template>

<script setup lang="ts">
import { provide, onMounted } from 'vue'
import AppLayout from './renderer/components/AppLayout.vue'
import { userStore } from './renderer/stores/userStore'
import './renderer/styles/theme.css'

provide('userStore', userStore)

// 页面加载时应用主题，确保刷新后主题不丢失
onMounted(() => {
  applyTheme(userStore.theme || 'bamboo')
})

function applyTheme(id: string) {
  const root = document.documentElement
  if (id === 'bamboo') {
    root.style.setProperty('--color-main', '#6BAE8C')
    root.style.setProperty('--color-accent', '#F4956A')
    root.style.setProperty('--color-bg', '#FAF6EE')
    root.style.setProperty('--color-bg-card', '#FFFFFF')
    root.style.setProperty('--color-text', '#3D3530')
  } else if (id === 'sakura') {
    root.style.setProperty('--color-main', '#D4537E')
    root.style.setProperty('--color-accent', '#C9B8FF')
    root.style.setProperty('--color-bg', '#FDF7F9')
    root.style.setProperty('--color-bg-card', '#FFFFFF')
    root.style.setProperty('--color-text', '#3D2540')
  } else if (id === 'night') {
    root.style.setProperty('--color-main', '#4A9EBF')
    root.style.setProperty('--color-accent', '#F0C040')
    root.style.setProperty('--color-bg', '#1A1A2E')
    root.style.setProperty('--color-bg-card', '#242438')
    root.style.setProperty('--color-text', '#E8E8F0')
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100vh;
  font-family: var(--font-family-base);
  background-color: var(--color-bg);
}
</style>
