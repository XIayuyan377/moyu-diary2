# 摸鱼日记 - UI 设计规范文档

## 📐 设计系统概览

本文档详细说明摸鱼日记桌面应用的完整 UI 设计系统，包括色彩、字体、间距、组件和交互规范。

---

## 🎨 第一部分：色彩系统

### 色彩理念
**温暖、舒适、有人情味** - 奶油手账风配色，向用户传达"我在陪你"的感觉。

### 主色板

#### 中性色系 - 背景和基础
| 颜色名称 | 十六进制 | 用途 | RGB |
|---------|--------|------|-----|
| 米白暖底 | #FAF7F2 | 主要页面背景，营造暖感 | 250, 247, 242 |
| 卡片白 | #FFFFFF | 卡片、按钮默认背景 | 255, 255, 255 |
| 暖橘卡片底 | #FFF5E6 | 温暖强调卡片、热点区域 | 255, 245, 230 |
| 竹叶绿卡片底 | #F0F7F0 | 清爽卡片、正面反馈区域 | 240, 247, 240 |
| 极淡米白 | #FFFAF5 | 悬停态、浅色交互背景 | 255, 250, 245 |

#### 强调色系 - 操作和反馈
| 颜色名称 | 十六进制 | 用途 | RGB |
|---------|--------|------|-----|
| 竹叶绿 | #5BAD7F | CTA按钮、主要交互、确认操作 | 91, 173, 127 |
| 竹叶绿深 | #4FA06F | 竹叶绿悬停态 | 79, 160, 111 |
| 暖橘 | #FF8C42 | 重要提示、活跃状态、特殊关注 | 255, 140, 66 |
| 暖橘深 | #FF7A2E | 暖橘悬停态 | 255, 122, 46 |
| 成功绿 | #7AC77F | 完成状态、成功反馈 | 122, 199, 127 |
| 警告橙 | #FFB84D | 警告提示、进行中状态 | 255, 184, 77 |
| 错误红 | #F08080 | 错误、删除、警告 | 240, 128, 128 |

#### 文字色系 - 层级和可读性
| 颜色名称 | 十六进制 | 用途 | RGB |
|---------|--------|------|-----|
| 暖棕主文 | #3D3530 | 主要文本、标题 | 61, 53, 48 |
| 次要文字 | #6B6259 | 次级标题、强调文本 | 107, 98, 89 |
| 哑光次文 | #9E9189 | 辅助文本、提示文字 | 158, 145, 137 |
| 浅灰文字 | #C4BDB3 | 禁用态、极淡文本 | 196, 189, 179 |

#### 熊猫专属色系
| 颜色名称 | 十六进制 | 用途 | RGB |
|---------|--------|------|-----|
| 熊猫黑 | #2C2C2C | 熊猫宠物主色、深色强调 | 44, 44, 44 |
| 熊猫次黑 | #4A4A4A | 熊猫阴影、细节深度 | 74, 74, 74 |
| 熊猫粉 | #FFB6C1 | 熊猫眼睛、表情亮点、可爱感 | 255, 182, 193 |

#### 标签色系 - 分类和标记
| 颜色名称 | 十六进制 | 用途 | 配文字色 |
|---------|--------|------|---------|
| 绿色标签底 | #E8F5EE | 完成、积极标签 | #2F8F5B |
| 橙色标签底 | #FFF0E6 | 进行中、活跃标签 | #D97706 |
| 蓝色标签底 | #E8F4F8 | 计划、待处理标签 | #0891B2 |
| 粉色标签底 | #FFE8F0 | 特殊、重点标签 | #DB2777 |

### 颜色应用规则

#### 背景层级
```
页面背景：#FAF7F2 (米白)
  ↓
卡片容器：(根据语义选择)
  - 默认卡片：#FFFFFF
  - 温暖卡片：#FFF5E6
  - 清爽卡片：#F0F7F0
  ↓
交互元素：白色、强调色
```

#### 交互状态色流
```
默认状态：主色 (#5BAD7F) 或中性色
  ↓
悬停状态：深一级 (#4FA06F) + 阴影加强
  ↓
活跃/按下：更深 + 无阴影
  ↓
禁用态：灰色 + opacity 0.6
```

---

## 🔤 第二部分：字体系统

### 字体选择

#### 主字体族
```css
'PingFang SC', 'HarmonyOS Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
```
- **第一选择**：PingFang SC（苹果原生简体字体，圆润友好）
- **备选方案**：HarmonyOS Sans 或系统字体
- **跨平台兼容**：system-ui 提供最佳本地渲染

#### 等宽字体
```css
'Menlo', 'Monaco', 'Courier New', monospace
```
- 用于数据、代码、时间戳显示

### 字体大小系统

| 大小 | 像素值 | 用途 | 示例 |
|-----|-------|------|-----|
| --font-size-xs | 12px | 说明文字、次级标签 | 时间、状态提示 |
| --font-size-sm | 13px | 辅助文本、小按钮 | 标签、卡片副标题 |
| --font-size-base | 14px | 正文、段落 | 日记内容、说明 |
| --font-size-lg | 16px | 小标题、说明标题 | 卡片标题、按钮 |
| --font-size-xl | 18px | 中等标题 | 部分大标题 |
| --font-size-2xl | 20px | 大标题 | 主要统计数字 |
| --font-size-3xl | 24px | 更大标题 | 日期、重要标题 |
| --font-size-4xl | 32px | 最大标题 | 应用标题"摸鱼日记" |

### 字体权重

| 权重值 | CSS值 | 用途 |
|------|------|------|
| Light | 300 | 不常用，偶尔用于大标题的优雅感 |
| Normal | 400 | 正文、基础内容 |
| Medium | 500 | 部分标题、强调文本 |
| Semibold | 600 | 卡片标题、重要标签 |
| Bold | 700 | 大标题、加粗强调 |

### 行高系统

| 类型 | 数值 | 用途 |
|-----|------|------|
| line-height-tight | 1.4 | 标题、紧凑布局 |
| line-height-normal | 1.6 | 标准段落、正文 |
| line-height-relaxed | 1.8 | 引用、长段落、舒适感 |

### 字体应用示例

```
应用标题（App Title）
  大小：32px
  权重：700 (Bold)
  行高：1.4
  例：摸鱼日记

卡片标题
  大小：18px
  权重：600 (Semibold)
  行高：1.4
  
正文
  大小：14px
  权重：400 (Normal)
  行高：1.6
  
辅助文本
  大小：12px
  权重：400 (Normal)
  行高：1.4
  颜色：#9E9189
```

---

## 📏 第三部分：间距系统

### 间距标度

| 变量 | 像素值 | 用途 |
|-----|-------|------|
| --spacing-xs | 4px | 极小间距、icon和文字间距 |
| --spacing-sm | 8px | 小间距、相邻元素间 |
| --spacing-md | 12px | 标准间距、卡片内部 |
| --spacing-lg | 16px | 大间距、卡片之间、段落间 |
| --spacing-xl | 20px | 更大间距、主容器内部 |
| --spacing-2xl | 24px | 大块元素间距 |
| --spacing-3xl | 32px | 主要区域分割 |
| --spacing-4xl | 40px | 最大间距 |

### 应用规则

- **最小单位**：4px (spacing-xs)
- **黄金比例**：遵循 4px 的倍数递增
- **避免使用**：随意的间距值，破坏系统一致性

---

## 🔄 第四部分：圆角系统

### 圆角标度

| 变量 | 像素值 | 用途 |
|-----|-------|------|
| --radius-sm | 10px | 小组件、标签、小按钮 |
| --radius-md | 16px | 卡片、标准按钮、输入框 |
| --radius-lg | 24px | 大卡片、大容器 |
| --radius-xl | 32px | 最大容器、主卡片 |
| --radius-full | 9999px | 完全圆形、完全胶囊按钮 |

### 圆角应用规则

圆角代表组件的"温柔感"，越大越圆润友好：

```
非常小（4-6px）：非常少见，几乎不用

小（10px）：
  - 小标签
  - 小按钮
  - icon 容器

中（16px）：
  - 卡片
  - 输入框
  - 标准按钮

大（24px）：
  - 大卡片
  - 大容器
  - 列表卡片

超大（32px）：
  - 主要卡片
  - 宠物容器
  - 大统计区域

圆形（9999px）：
  - 标签
  - 完全圆形头像
  - 胶囊形按钮
```

---

## 💫 第五部分：阴影系统

### 阴影标度

| 变量 | 值 | 用途 | 强度 |
|-----|---|-----|------|
| --shadow-xs | 0 1px 2px 0 rgba(61, 53, 48, 0.05) | 极轻阴影、线框强化 | 非常轻 |
| --shadow-sm | 0 1px 3px 0 rgba(61, 53, 48, 0.08) | 轻阴影、卡片边缘 | 轻 |
| --shadow-card | 0 2px 16px rgba(61, 53, 48, 0.08) | 标准卡片阴影 | 中等 |
| --shadow-hover | 0 4px 24px rgba(61, 53, 48, 0.14) | 悬停状态加深 | 中等强 |
| --shadow-lifted | 0 8px 32px rgba(61, 53, 48, 0.12) | 提起感效果 | 强 |
| --shadow-floating | 0 12px 48px rgba(61, 53, 48, 0.16) | 浮动对话框、模态 | 非常强 |

### 阴影色值选择

所有阴影使用 **暖色系阴影** (rgba(61, 53, 48, opacity))，而非标准黑色：
- 这样可以保持整体的温暖基调
- 与米白背景配合更协调
- 显得更加柔和而非生硬

### 阴影应用场景

```
普通卡片（静止）: --shadow-card
悬停卡片: --shadow-hover + transform: translateY(-2px)
浮动按钮: --shadow-lifted
打开的菜单/模态: --shadow-floating
按下状态: 无阴影（贴近表面）
输入框焦点: --shadow-sm + 焦点色边框
```

---

## 🎯 第六部分：组件规范

### 按钮系统

#### 按钮基础规范
```
高度：40px (正常)、32px (小)、48px (大)
padding: 12px 16px (正常)
border-radius: 16px
font-size: 14px
font-weight: 500
transition: 250ms ease-out
cursor: pointer
user-select: none
```

#### 按钮样式类型

##### 1. 主按钮 (btn-primary) - 竹叶绿
```
默认：#5BAD7F, 白文字, box-shadow: card
悬停：#4FA06F, box-shadow: hover, translateY(-1px)
按下：#4FA06F, no-shadow, translateY(0)
禁用：opacity 0.6, cursor not-allowed
```

##### 2. 次按钮 (btn-secondary) - 白底绿边
```
默认：白底, 绿边框 2px, 绿文字
悬停：浅米白底, 绿边框, 绿文字, box-shadow: xs
按下：更浅底色
禁用：灰化
```

##### 3. 幽灵按钮 (btn-ghost) - 纯文字
```
默认：透明底, 绿文字, 无边框
悬停：极淡米白底
按下：米白底
实际应用：标题栏按钮、链接样式按钮
```

##### 4. 强调按钮 (btn-accent) - 暖橘
```
默认：#FF8C42, 白文字, box-shadow: card
悬停：#FF7A2E, box-shadow: hover
用途：重要操作、特殊提示
```

### 卡片系统

#### 卡片基础规范
```
background: 根据语义选择 (白/暖橘/竹叶绿)
border: 1px solid #EDE8E0
border-radius: 16px
padding: 16px
box-shadow: --shadow-card
transition: all 250ms ease-out
```

#### 卡片交互
```
悬停: 
  - box-shadow: --shadow-hover
  - transform: translateY(-2px)
  - smooth transition
```

#### 卡片类型
```
.card - 默认白卡
.card-warm - 暖橘背景卡片
.card-green - 竹叶绿背景卡片
```

### 标签系统

#### 标签规范
```
padding: 8px 12px
font-size: 12px
border-radius: 9999px (完全胶囊)
font-weight: 500
display: inline-flex
align-items: center
gap: 8px
```

#### 标签类型

| 类名 | 背景色 | 文字色 | 用途 |
|------|------|-------|------|
| .tag-green | #E8F5EE | #2F8F5B | 完成、积极 |
| .tag-orange | #FFF0E6 | #D97706 | 进行中、活跃 |
| .tag-blue | #E8F4F8 | #0891B2 | 计划、待处理 |
| .tag-pink | #FFE8F0 | #DB2777 | 特殊、重点 |

### 输入框规范

```
padding: 12px 16px
font-size: 14px
border: 2px solid #EDE8E0
border-radius: 16px
background: #FFFFFF
color: #3D3530
transition: all 250ms ease-out

焦点状态:
  outline: none
  border-color: #5BAD7F
  background: #FFFAF5
  box-shadow: 0 0 0 3px rgba(91, 173, 127, 0.1)

placeholder:
  color: #9E9189
```

---

## ✨ 第七部分：动画和过渡

### 时长标度

| 变量 | 毫秒值 | 用途 |
|-----|-------|------|
| --duration-fast | 150ms | 小元素、快速反馈 |
| --duration-base | 250ms | 标准过渡 |
| --duration-slow | 350ms | 较大动画、入场 |

### 缓动函数

| 变量 | 值 | 用途 |
|-----|---|------|
| --easing-ease-in | cubic-bezier(0.4, 0, 1, 1) | 运动结束加速 |
| --easing-ease-out | cubic-bezier(0, 0, 0.2, 1) | 运动开始减速（常用） |
| --easing-ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | 两端缓解 |
| --easing-bounce | cubic-bezier(0.68, -0.55, 0.265, 1.55) | 弹性效果（特殊） |

### 预设动画

#### 1. fadeIn - 淡入
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
用途：页面加载、元素出现
时长：250ms ease-out
```

#### 2. slideUp - 向上滑入
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
用途：列表项动画、对话框入场
时长：250ms ease-out
```

#### 3. bounce - 弹跳
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
用途：提醒、强调
时长：400ms infinite
```

#### 4. float - 浮动
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
用途：宠物呼吸、待命状态
时长：3s ease-in-out infinite
```

### 使用类
```
.animate-fade-in   /* 淡入 */
.animate-slide-up  /* 滑入 */
.animate-bounce    /* 弹跳 */
.animate-float     /* 浮动 */
```

---

## 📱 第八部分：响应式设计

### 断点

| 名称 | 最大宽度 | 布局 |
|------|--------|------|
| desktop | 1400px | 3列布局：左260px + 中间自适应 + 右260px |
| laptop | 1200px | 2列布局 |
| tabletl | 992px | 单列布局（全宽） |
| tablet | 768px | 单列 + 滚动 |
| mobile | 480px | 单列 + 优化触摸 |

### 响应式栅格

```css
/* 桌面 1400+px */
.content-layout {
  grid-template-columns: 280px 1fr 300px;
  gap: 16px;
}

/* 笔记本 1200px */
.content-layout {
  grid-template-columns: 260px 1fr 260px;
  gap: 12px;
}

/* 平板及以下 768px */
.content-layout {
  grid-template-columns: 1fr;
}
```

---

## 🎭 第九部分：主题状态

### 工作状态指示

| 状态 | 标签背景 | 文字色 | emoji | 含义 |
|------|--------|-------|-------|------|
| working | 绿标签 | 深绿 | 🟢 | 工作中 |
| resting | 橙标签 | 深橙 | 🟠 | 摸鱼中 |
| idle | 蓝标签 | 深蓝 | 🔵 | 离线 |

### 熊猫情绪状态

| 情绪 | emoji | 表情背景 | 文案示例 |
|------|-------|---------|---------|
| happy | 😊 | 粉白渐变 | "棒极了！" |
| normal | 🐼 | 半透明 | "又开始摸鱼了呢~" |
| tired | 😴 | 灰暗 | "该睡了..." |
| sad | 😢 | 蓝调 | "继续加油！" |

---

## 🔐 第十部分：无障碍设计

### 颜色对比度
- 标准文本 (14px) 与背景最少 4.5:1
- 大文本 (18px+) 与背景最少 3:1
- 确保色值独立，不仅依靠颜色区分

### 焦点管理
- 所有交互元素都有明确的焦点状态
- 焦点指示器最少 3px 宽
- 焦点色为 #5BAD7F

### 动画考虑
- 提供 `prefers-reduced-motion` 媒体查询
- 关键信息不应仅依赖动画传达

---

## 📝 设计文件导出

### CSS 文件位置
[src/styles/theme.css] - 包含所有 CSS 变量和预设样式

### 使用方式

```html
<!-- HTML 引入 -->
<link rel="stylesheet" href="src/styles/theme.css">

<!-- Vue 组件引入 -->
<style>
import './styles/theme.css'
</style>

<!-- 使用 CSS 变量 -->
.my-element {
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  font-size: var(--font-size-lg);
  color: var(--color-text);
}
```

---

**设计更新日期**: 2026-04-13  
**设计理念**: 奶油手账风 × 赛博宠物 × 温柔陪伴

