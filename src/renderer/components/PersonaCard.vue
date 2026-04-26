<template>
  <div class="persona-wrapper">
    <div v-if="!isRevealed" class="card-back" @click="revealCard">
      <div class="back-icon">🎴</div>
      <div class="back-title">今日人设</div>
      <div class="back-hint">点击抽取</div>
    </div>

    <div v-else class="card-front" :style="{ background: `linear-gradient(135deg, ${persona.bgColor} 0%, #fff 100%)` }">
      <div class="card-heading">✦ 今日人设 ✦</div>
      <div class="card-main">
        <div class="card-img-box">
          <img
            v-if="imgSrc && !imgError"
            :key="imgKey"
            :src="imgSrc"
            :alt="persona.name"
            class="card-img"
            @error="handleImgError"
          />
          <div v-else class="card-img-fallback" :style="{ color: persona.color }">
            {{ persona.name.charAt(0) }}
          </div>
        </div>
        <div class="card-info">
          <div class="card-name" :style="{ color: persona.color }">{{ persona.name }}</div>
          <div class="card-line" :style="{ background: persona.color }"></div>
          <div class="card-desc">{{ persona.tagline }}</div>
          <button class="card-btn" :style="{ borderColor: persona.color, color: persona.color }" @click.stop="redraw">
            🔄 重新抽取
          </button>
        </div>
      </div>
      <div class="card-deco" :style="{ color: persona.color }">✦</div>
    </div>
  </div>
</template>

<script>
import { PERSONAS, getTodayPersona } from '../data/personas.js'

export default {
  name: 'PersonaCard',
  props: {
    stats: { type: Object, default: () => ({}) },
    gender: { type: String, default: 'female' }
  },
  data() {
    return {
      isRevealed: false,
      persona: null,
      currentIndex: 0,
      imgSrc: '',
      imgKey: 0,
      imgError: false,
    }
  },
  watch: {
    gender(newVal) {
      this.imgError = false
      if (this.isRevealed && this.persona) {
        this.buildImgSrc()
      }
    }
  },
  mounted() {
    this.persona = getTodayPersona(this.stats, this.gender)
    this.currentIndex = PERSONAS.findIndex(p => p.id === this.persona?.id)
    if (this.currentIndex < 0) this.currentIndex = 0

    const savedDate = localStorage.getItem('persona_date')
    const today = new Date().toDateString()
    if (savedDate === today) {
      const savedId = localStorage.getItem('persona_id')
      if (savedId) {
        const idx = PERSONAS.findIndex(p => p.id === savedId)
        if (idx >= 0) {
          this.currentIndex = idx
          this.persona = PERSONAS[idx]
        }
        this.isRevealed = true
        this.buildImgSrc()
      }
    }
  },
  methods: {
    buildImgSrc() {
      if (!this.persona) return
      this.imgError = false
      const folder = (this.gender === 'male') ? 'male' : 'female'
      const name = this.persona.name
      try {
        const base = new URL(
          `../assets/avatars/${folder}/${name}.png`,
          import.meta.url
        ).href
        this.imgSrc = `${base}?t=${Date.now()}`
        this.imgKey++
      } catch {
        this.imgSrc = ''
        this.imgError = true
      }
    },
    revealCard() {
      this.isRevealed = true
      this.imgError = false
      this.buildImgSrc()
      localStorage.setItem('persona_date', new Date().toDateString())
      localStorage.setItem('persona_id', this.persona.id)
    },
    redraw() {
      this.imgError = false
      this.currentIndex = (this.currentIndex + 1) % PERSONAS.length
      this.persona = PERSONAS[this.currentIndex]
      this.buildImgSrc()
      localStorage.setItem('persona_id', this.persona.id)
    },
    handleImgError() {
      this.imgError = true
    },
  }
}
</script>

<style scoped>
.persona-wrapper { width: 100%; margin: 12px 0; }

.card-back {
  background: linear-gradient(135deg, #2C3E50, #3498DB);
  border-radius: 16px; padding: 28px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-back:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(52,152,219,0.35); }
.back-icon { font-size: 32px; }
.back-title { font-size: 18px; font-weight: 700; color: #fff; }
.back-hint { font-size: 13px; color: rgba(255,255,255,0.7); }

.card-front {
  border-radius: 16px; padding: 18px 20px 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  position: relative; overflow: hidden;
  animation: cardIn 0.35s ease;
  display: flex; flex-direction: column; align-items: center;
}
@keyframes cardIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }

.card-heading {
  font-size: 14px; font-weight: 700; letter-spacing: 4px;
  color: #bbb; text-align: center; margin-bottom: 16px;
}
.card-main {
  display: flex; flex-direction: row;
  align-items: center; justify-content: center;
  gap: 20px; width: 100%;
}
.card-img-box {
  flex-shrink: 0; width: 120px; height: 120px;
  border-radius: 16px; overflow: hidden; background: #f5f5f5;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}
.card-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-img-fallback {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #e8e8e8, #f5f5f5);
  font-size: 40px; font-weight: 700;
}
.card-info {
  flex: 0 1 auto; max-width: 190px;
  display: flex; flex-direction: column; gap: 8px; align-items: flex-start;
}
.card-name { font-size: 20px; font-weight: 800; line-height: 1.2; }
.card-line { width: 32px; height: 2px; border-radius: 2px; opacity: 0.45; }
.card-desc { font-size: 13px; color: #666; line-height: 1.6; }
.card-btn {
  background: transparent; border: 1.5px solid;
  border-radius: 20px; padding: 5px 14px;
  font-size: 12px; cursor: pointer; margin-top: 4px; white-space: nowrap;
}
.card-btn:hover { opacity: 0.65; }
.card-deco { position: absolute; top: 12px; right: 14px; font-size: 16px; opacity: 0.2; }
</style>