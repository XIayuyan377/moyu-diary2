# Settings.vue 快速参考指南

## 🎨 头像CSS实现参考

### 基础模板
```css
.avatar-头像id {
  background: #肤色;  /* 背景色 */
}

.avatar-头像id::before {
  content: '';
  position: absolute;
  width: 尺寸; height: 尺寸;
  background: #颜色;
  border-radius: 圆角值;
  top: 距离; left: 距离;
}

.avatar-头像id::after {
  content: '';
  position: absolute;
  width: 尺寸; height: 尺寸;
  background: #颜色;
  border-radius: 圆角值;
  bottom: 距离; right/left: 距离;
}
```

### 颜色参考表
```ts
肤色选项：
- 女性: #FFD4B8 (浅皮肤)
- 男性: #FFCC99 (中皮肤)

发色选项：
- 深棕: #3D2B1F (扎辫/短发女)
- 黑棕: #4A3C2E (男生)
- 黑色: #000 (学士帽/熊猫)
```

### 高级技巧
| 效果 | CSS |
|------|-----|
| 眼镜框 | `box-shadow: inset 6px 8px 0 -3px rgba(0,0,0,0.3)` |
| 辫子 | `box-shadow: 8px -2px 0 -6px颜色` |
| 方形帽子 | `clip-path: polygon(10% 60%, 50% 10%, 90% 60%, ...)` |
| 熊猫眼 | `box-shadow: inset 10px 10px 0 -6px #000` |

---

## 📝 性格设定配置

### 添加新性格
```ts
// 1. 在 pandaStyles 数组中添加
const pandaStyles = [
  // 既有的...
  { 
    id: 'new-id', 
    emoji: '🌟', 
    title: '新性格名称', 
    desc: '简短描述' 
  },
]

// 2. 在 pandaStyleHints 中添加提示
const pandaStyleHints: Record<string, string> = {
  'new-id': '卡片下方的灰字提示',
}

// 3. 在 pandaPreviewText 中添加预览（如果保留气泡功能）
const pandaPreviewText: Record<string, string> = {
  'new-id': '「新性格的示范回复」',
}
```

### 三种现有性格
| ID | Emoji | 名称 | 卡片描述 | 底部提示 |
|----|-------|------|---------|---------|
| gentle | 🤗 | 温柔陪伴型 | 多鼓励，多提醒喝水休息 | 多鼓励，常提醒休息喝水 |
| toxic | 😤 | 毒舌导师型 | 今天文献看了吗？还不去跑数据？ | 今天文献看了吗？快去跑模型！ |
| sarcasm | 🌀 | 阴阳怪气型 | 哇，今天又这么努力呢（斜眼） | 哦，今天这么努力，太阳从西边出来了 |

---

## 🎨 主题配置

### 三个预设主题
```ts
const themes = [
  {
    id: 'bamboo',
    name: '竹林清风',
    icon: '🌿',
    desc: '清新自然，专注科研',
    mainColor: '#5BAD7F',        // 绿色
    accentColor: '#FF8C42',      // 橙色
    bgColor: '#FAF7F2',          // 浅色背景
    textColor: '#3D3530',        // 深文字
    cardBgColor: '#FFFFFF',      // 白卡片
  },
  {
    id: 'sakura',
    name: '樱花物语',
    icon: '🌸',
    desc: '粉嫩温柔，治愈打工',
    mainColor: '#D4537E',        // 粉色
    accentColor: '#C9B8FF',      // 紫色
    bgColor: '#FDF7F9',          // 粉背景
    textColor: '#3D3530',
    cardBgColor: '#FFFFFF',
  },
  {
    id: 'night',
    name: '深夜实验室',
    icon: '🌙',
    desc: '深色沉浸，疯狂上分',
    mainColor: '#4A9EBF',        // 蓝色
    accentColor: '#F0C040',      // 黄色
    bgColor: '#1A1A2E',          // 深背景
    textColor: '#E8E8F0',        // 浅文字
    cardBgColor: '#242438',      // 深卡片
  },
]
```

### 切换主题
```ts
function switchTheme(theme: any) {
  form.value.theme = theme.id
  const root = document.documentElement
  root.style.setProperty('--color-main', theme.mainColor)
  root.style.setProperty('--color-accent', theme.accentColor)
  root.style.setProperty('--color-bg', theme.bgColor)
  root.style.setProperty('--color-text', theme.textColor)
  root.style.setProperty('--color-bg-card', theme.cardBgColor)
}
```

### 添加新主题
```ts
{
  id: 'custom',
  name: '自定义主题',
  icon: '🎨',
  desc: '自定义描述文字',
  mainColor: '#新颜色',
  accentColor: '#新颜色',
  bgColor: '#新颜色',
  textColor: '#新颜色',
  cardBgColor: '#新颜色',
}
```

---

## 📐 布局尺寸参考

### 头像
```css
.avatar-draw {
  width: 64px;       /* 直径64px */
  height: 64px;
  border-radius: 50%; /* 圆形 */
}
```

### 表单
```css
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 两列等宽 */
  gap: 12px;                       /* 间距 */
}

.form-input {
  width: 100%;                     /* 全宽 */
  box-sizing: border-box;          /* 包含padding */
}
```

### 主题卡片
```css
.theme-card {
  height: 110px;                   /* 高度110px */
  display: flex;
  align-items: center;             /* 垂直居中 */
  padding: 16px;
}

.theme-icon {
  font-size: 32px;                 /* 图标32px */
}

.theme-name {
  font-size: 14px;                 /* 标题14px */
  font-weight: 600;
}

.theme-desc {
  font-size: 12px;                 /* 描述12px */
  color: #9E9189;
}
```

### 性格设定
```css
.panda-style-btn {
  padding: 16px 12px;
  gap: 8px;
}

.style-emoji {
  font-size: 24px;
}

.style-title {
  font-size: 13px;
  font-weight: 600;
}

.style-desc-old {
  font-size: 11px;
  color: #9E9189;
}

.style-hint {
  font-size: 11px;                 /* 新增提示 */
  color: #9E9189;
  margin-top: 4px;
}
```

---

## 🎯 常见修改

### 修改头像背景颜色
```css
.avatar-girl_ponytail {
  background: #新颜色;  /* 改这里 */
}
```

### 修改表单间距
```css
.form-row {
  gap: 12px;  /* 改这里 */
}
```

### 修改主题高度
```css
.theme-card {
  height: 110px;  /* 改这里 */
}
```

### 修改提示文字颜色
```css
.style-hint {
  color: #新颜色;  /* 改这里 */
}
```

### 修改提示文字内容
```ts
const pandaStyleHints: Record<string, string> = {
  gentle: '改这里',  /* 改这里 */
  toxic: '改这里',
  sarcasm: '改这里',
}
```

---

## 🔍 CSS类查询表

| 类名 | 用途 | 关键特性 |
|------|------|--------|
| `.avatar-draw` | 头像容器 | 64×64px, 圆形 |
| `.avatar-option` | 头像选项 | flex column, padding |
| `.avatar-selector` | 头像网格 | grid 3列 |
| `.panda-style-btn` | 性格按钮 | flex column, 3个子元素 |
| `.style-emoji` | 性格emoji | 24px |
| `.style-title` | 性格标题 | 13px bold |
| `.style-hint` | 性格提示 | 11px gray |
| `.theme-card` | 主题卡片 | 110px, flex center |
| `.theme-icon` | 主题图标 | 32px |
| `.theme-name` | 主题名称 | 14px bold |
| `.theme-desc` | 主题描述 | 12px gray |
| `.form-row` | 表单行 | grid 2列 |
| `.form-input` | 输入框 | 100% width |

---

## ⚡ 性能提示

1. **头像CSS** - 无图片加载，首屏加速
2. **Grid布局** - 浏览器原生支持，性能优异
3. **范围CSS** - 使用scoped，无全局污染
4. **响应式** - 考虑添加媒体查询以适配平板

---

## 🐛 常见问题排查

### 头像显示不正确
- [ ] 确认`.avatar-draw`有相对定位：`position: relative;`
- [ ] 确认`::before`和`::after`有`content: '';`
- [ ] 检查z-index是否有冲突

### 表单对齐不齐
- [ ] 检查所有`.form-input`是否都有`width: 100%;`
- [ ] 检查`.form-row`是否使用grid: `grid-template-columns: 1fr 1fr;`
- [ ] 检查`box-sizing: border-box;`是否存在

### 主题卡片高度不对
- [ ] 检查`.theme-card`的`height: 110px;`
- [ ] 检查`padding`是否会导致溢出（已用110px固定）
- [ ] 检查内部`flex`布局是否生效

### 性格提示不显示
- [ ] 检查`pandaStyleHints`对象中是否有对应的id
- [ ] 检查template中`.style-hint`是否存在
- [ ] 检查样式`.style-hint`是否有visibility问题

---

## 📚 参考资源

- MDN: [border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)
- MDN: [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)
- MDN: [clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
- MDN: [CSS Grid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid)
- MDN: [伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)

