<template>
  <div class="panda-card">
    <!-- 熊猫图片，点击切换 -->
    <div class="panda-wrap" @click="nextPanda">
      <img
        v-if="pandaUrl && !pandaError"
        :key="pandaKey"
        :src="pandaUrl"
        class="panda-img"
        alt="panda"
        @error="onPandaError"
      />
      <!-- 图片加载失败时的占位 -->
      <div v-else class="panda-fallback">🐼</div>
    </div>

    <!-- 毒鸡汤文字，无气泡 -->
    <div class="panda-say">{{ currentSay }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ── 毒鸡汤列表 ────────────────────────────
const sayings = [
  '我不是在偷懒，我是在等灵感',
  '科研的尽头是摸鱼，摸鱼的尽头是答辩',
  '今天的实验数据，明天的SCI（也许）',
  '不是在摸鱼，是在进行学术冥想',
  '导师说要坐冷板凳，我坐的很认真',
  '每一次摸鱼，都是在为下一次爆发蓄力',
  '论文写不完，但摸鱼停不了',
  '我不是不努力，是努力了数据还是不对',
  '文献看了100篇，自己的字还没写100个',
  '代码跑不通，但心态要稳住',
  '答辩倒计时每减一天，我的头发也少一根',
  '今天的你，已经很棒了（但明天要更努力）',
  '摸鱼一时爽，截止日期火葬场',
  '滚滚也很累，但滚滚不说',
  '不是不行，是还没到最后关头',
]

// ── 熊猫图片（按1,2,3...命名）──────────────
// 你有多少张就填多少，这里先设12张上限，实际加载失败会自动跳过
const PANDA_COUNT = 12  // 你的熊猫图片总数，按实际修改

const pandaIndex = ref(1)
const pandaError = ref(false)
const pandaKey = ref(0)
const currentSay = ref(sayings[Math.floor(Math.random() * sayings.length)])

const pandaUrl = computed(() => {
  try {
    return new URL(
      `../assets/avatars/panda/${pandaIndex.value}.png`,
      import.meta.url
    ).href
  } catch { return '' }
})

function nextPanda() {
  pandaError.value = false
  // 随机换一句话
  currentSay.value = sayings[Math.floor(Math.random() * sayings.length)]
  // 循环切换图片
  pandaIndex.value = (pandaIndex.value % PANDA_COUNT) + 1
  pandaKey.value++
}

function onPandaError() {
  // 当前图片不存在，跳到下一张
  if (pandaIndex.value < PANDA_COUNT) {
    pandaIndex.value++
    pandaKey.value++
  } else {
    // 所有图片都不存在，显示占位符
    pandaError.value = true
  }
}
</script>

<style scoped>
.panda-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(61,53,48,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.panda-wrap {
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  transition: transform 0.15s;
}
.panda-wrap:hover { transform: scale(1.05); }
.panda-wrap:active { transform: scale(0.95); }

.panda-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.panda-fallback {
  font-size: 60px;
  line-height: 1;
}

.panda-say {
  font-size: 13px;
  color: #9E9189;
  text-align: center;
  line-height: 1.5;
  padding: 0 8px;
}
</style>