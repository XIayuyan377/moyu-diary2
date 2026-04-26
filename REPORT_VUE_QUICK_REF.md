# Report.vue 快速参考指南

## 🎨 竹林系色彩方案

```css
/* 主色调 */
--bamboo-green: #5BAD7F;      /* 竹叶绿 - 主色 */
--accent-orange: #FF8C42;     /* 浅橘 - 强调色 */
--bg-cream: #FAFAF8;          /* 燕麦白 - 卡片背景 */
--text-dark: #3D3530;         /* 深棕 - 主文字 */
--text-light: #9E9189;        /* 浅棕 - 副文字 */
--border-light: #F0EDE8;      /* 浅灰 - 边框/分割 */
```

## 📐 今日Tab两栏布局

### 左栏结构（55%）
```
┌─────────────────────────┐
│ 🎯 目标工时卡片          │
│  - 进度条                 │
│  - 人设评语               │
└─────────────────────────┘
┌──────────────┬──────────┐
│ 💧 喝水       │ ⚡ 起身   │
│  蓝色背景     │ 绿色背景  │
└──────────────┴──────────┘
┌─────────────────────────┐
│ 软件使用分布              │
│ ┌─────────────────────┐  │
│ │ 🏆 最爱宠妃          │  │
│ │ [顶部高亮卡片]       │  │
│ └─────────────────────┘  │
│ ┌─────────────────────┐  │
│ │ 🔬 疯狂掉发区        │  │
│ │ 🌊 冲浪吃瓜区        │  │
│ │ 🐟 神秘摸鱼区        │  │
│ └─────────────────────┘  │
└─────────────────────────┘
```

### 右栏结构（45%）
```
┌─────────────────┐
│ 📅 打卡热力图     │
│ [7×当月 18px格] │
└─────────────────┘
┌─────────────────┐
│ 😊 今日心情      │
│ 😄 😊 🥰        │
└─────────────────┘
┌─────────────────┐
│ ✨ 今日打工总结  │
│ 🐼 AI评语       │
│ 📋 复制日报      │
└─────────────────┘
```

## 🎋 竹子柱状图规格

### 尺寸参数
- **宽度**：28px（固定）
- **高度**：`(hours/10*150)px`（动态）
- **圆角**：上 6px，下 0
- **颜色**：#5BAD7F（纯竹叶绿）
- **阴影**：0 2px 8px rgba(91,173,127,0.3)

### 竹叶装饰（::before伪元素）
- **位置**：`top: -8px; left: 50%`
- **尺寸**：8×12px（椭圆）
- **颜色**：#5BAD7F
- **旋转**：±30deg（两个叶片）

## 📊 热力图规格（今日Tab右侧）

### 网格配置
- **布局**：7列 × 当月行数
- **单格大小**：18×18px
- **圆角**：4px
- **间距**：3px

### 单格状态
```
打卡日    → background: #5BAD7F
今天      → border: 2px solid #FF8C42
未来      → background: #F0EDE8
未打卡    → background: #EDE8E0
```

## 💾 数据结构

### 今日心情（todayMoods）
```ts
const todayMoods = ref(['😄', '😊', '🥰'])
```

### 周情绪统计（weekMoodStats）
```ts
const weekMoodStats = computed(() => [
  { emoji: '😄', count: 5 },
  { emoji: '😊', count: 3 },
  { emoji: '🥰', count: 2 },
])
```

### 周报内容（weekAiReport）
```ts
const weekAiReport = ref('本周工作稳定推进...')
```

### 月报内容（monthAiReport）
```ts
const monthAiReport = ref('四月春光明媚...')
```

## 🔧 CSS类速查表

| 类名 | 用途 | 关键属性 |
|------|------|--------|
| `.today-two-col` | 两栏容器 | `flex; gap: 20px` |
| `.today-left-col` | 左栏 | `flex: 0 0 55%` |
| `.today-right-col` | 右栏 | `flex: 0 0 45%` |
| `.heatmap-grid-today` | 热力网格 | `grid-template-columns: repeat(7, 1fr); gap: 3px` |
| `.heatmap-cell-today` | 热力单格 | `18×18px; border-radius: 4px` |
| `.mood-card` | 心情卡片 | `min-height: 120px` |
| `.mood-emoji` | emoji | `font-size: 28px` |
| `.bamboo-nodes-wrap` | 竹竿 | `width: 28px; border-radius: 6px 6px 0 0` |
| `.stats-grid-four` | 4格布局 | `grid-template-columns: repeat(4, 1fr)` |
| `.stats-grid-two` | 2格布局 | `grid-template-columns: repeat(2, 1fr)` |

## 🎯 功能调用

### 复制功能
```ts
copyReport()        // 复制今日日报
copyWeekReport()    // 复制本周周报
copyMonthReport()   // 复制本月月报
```

## 📝 Tab内容一览

| Tab | 内容 | 特色 |
|-----|------|------|
| 今日 | 工时进度、应用统计、热力图、心情、AI日报 | 55%-45%两栏 |
| 本周 | 竹子图、4项统计、情绪统计、AI周报 | 新增情绪和报告 |
| 本月 | 月工时图、2项统计、AI月报 | 新增月报卡片 |
| 年报 | 年度统计汇总 | 保持原样 |

## 🚀 开发建议

1. **修改心情数据**：编辑 `todayMoods` ref
2. **修改周情绪**：编辑 `weekMoodStats` computed
3. **修改AI报告**：编辑 `weekAiReport` 和 `monthAiReport` ref
4. **扩展热力图**：修改 `heatmapDaysCalendar` 计算属性
5. **调整颜色**：查找替换CSS中的六值色值

## ⚠️ 注意事项

- ✅ 所有div都正确闭合
- ✅ 只有一个template/script/style标签
- ✅ 所有类名使用kebab-case
- ✅ 所有颜色使用十六进制
- ✅ 竹子图高度动态计算
- ✅ 热力图支持hover放大
- ⚠️ localStorage读取'moyu_clockin_dates'键

