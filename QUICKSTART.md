# 快速开始指南

## 📦 项目文件结构

```
students-diary/
├── src/
│   ├── styles/
│   │   └── theme.css                    # 🎨 全局主题设计系统（所有颜色、字体、间距规范）
│   ├── components/
│   │   ├── PandaWidget.vue             # 🐼 熊猫宠物组件
│   │   └── DiaryEntry.vue              # 📝 日记条目组件
│   ├── App.vue                         # 🏠 主应用页面（三列布局）
│   ├── main.js                         # 🚀 Vue 应用入口
│   ├── electron.js                     # ⚡ Electron 主进程
│   └── preload.js                      # 🔐 安全隔离脚本
├── index.html                          # 📄 HTML 入口
├── package.json                        # 📋 项目配置
├── vite.config.js                      # ⚙️ Vite 构建配置
├── README.md                           # 📖 项目文档
├── DESIGN_SYSTEM.md                    # 🎨 详细设计规范文档
└── QUICKSTART.md                       # ⚡ 本文件
```

---

## 🚀 安装和开发

### 1️⃣ 安装依赖

```bash
cd c:\Aigame\students-diary
npm install
```

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

This will:
- 启动 Vite 开发服务器（端口 5173）
- 打开 Electron 应用窗口
- 启用 DevTools 便于调试

### 3️⃣ 构建生产版本

```bash
npm run build
```

---

## 🎨 设计系统快速参考

所有设计规范都已集成在 `src/styles/theme.css` 中。

### 颜色快速查询

```
主颜色库
├── 背景：#FAF7F2 (米白)、#FFFFFF (白)、#FFF5E6 (暖橘)、#F0F7F0 (竹叶绿)
├── 强调：#5BAD7F (竹叶绿CTA)、#FF8C42 (暖橘)
├── 文字：#3D3530 (暖棕)、#9E9189 (次要)
└── 熊猫：#2C2C2C (黑)、#FFB6C1 (粉)
```

### 常用样式类

```html
<!-- 按钮 -->
<button class="btn btn-primary">主按钮</button>
<button class="btn btn-secondary">次按钮</button>
<button class="btn btn-ghost">幽灵按钮</button>
<button class="btn btn-accent">强调按钮</button>

<!-- 卡片 -->
<div class="card">默认白卡</div>
<div class="card card-warm">暖橘卡片</div>
<div class="card card-green">绿色卡片</div>

<!-- 标签 -->
<span class="tag tag-green">完成</span>
<span class="tag tag-orange">进行中</span>

<!-- 布局工具 -->
<div class="flex gap-md">Flexbox 布局</div>
<div class="flex-between">两端对齐</div>
<div class="flex-col gap-lg">竖向布局</div>

<!-- 文字类 -->
<p class="text-muted">次要文字</p>
<p class="text-secondary">副标题</p>

<!-- 间距工具 -->
<div class="mt-md">上边距 12px</div>
<div class="mb-lg">下边距 16px</div>
<div class="p-lg">内边距 16px</div>

<!-- 动画 -->
<div class="animate-fade-in">淡入动画</div>
<div class="animate-slide-up">向上滑入</div>
<div class="animate-float">浮动效果</div>
```

---

## 📋 主要组件说明

### App.vue - 主应用界面

**布局结构**
```
┌─────────────────────────────────────────┐
│      Header (日期、状态、设置按钮)       │
├──────────────┬──────────────┬──────────┤
│              │              │          │
│  左侧面板    │  中间面板    │ 右侧面板 │
│              │              │          │
│ • 熊猫宠物   │ • 日期选择   │ • 周统计 │
│ • 快速操作   │ • 今日摘要   │ • 鸡汤   │
│              │ • 工作记录   │ • 成就   │
│              │              │          │
└──────────────┴──────────────┴──────────┘
```

**关键数据**
- `pandaMood`: 心情值 (0-100)
- `pandaEnergy`: 活力值 (0-100)
- `diaryEntries`: 日记条目数组
- `statusText`: 工作状态显示

### PandaWidget.vue - 熊猫组件

**功能**
- 显示熊猫卡通形象
- 实时更新温柔讽刺文案
- 显示心情值、活力值、投入度
- 快速操作按钮

**Props**
```javascript
{
  mood: 'normal' | 'happy' | 'tired' | 'sad',
  moodValue: 0-100,
  energyValue: 0-100,
  focusValue: 0-100
}
```

### DiaryEntry.vue - 日记条目

**功能**
- 显示单条工作记录
- emoji + 标题 + 时间 + 标签 + 内容
- 悬停效果和交互

**Props**
```javascript
{
  entry: {
    emoji: String,
    title: String,
    time: String (HH:mm),
    tag: String,
    tagType: 'green' | 'orange' | 'blue' | 'pink',
    content: String,
    mood?: String,
    duration?: String
  }
}
```

---

## 💡 开发技巧

### 1. 使用 CSS 变量

```vue
<style scoped>
.my-component {
  background-color: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  transition: all var(--duration-base) var(--easing-ease-out);
}
</style>
```

### 2. Flexbox 工具类

```html
<!-- 水平排列，间距 md -->
<div class="flex gap-md">
  <span>左</span>
  <span>右</span>
</div>

<!-- 两端对齐 -->
<div class="flex-between">
  <span>左边</span>
  <span>右边</span>
</div>

<!-- 竖向排列 -->
<div class="flex-col gap-lg">
  <div>上</div>
  <div>下</div>
</div>
```

### 3. 快速原型文本样式

```html
<h1>大标题 32px Bold</h1>
<h3>中标题 20px Semibold</h3>
<p>正文 14px Normal</p>
<p class="text-muted">辅助文本 12px Muted</p>
```

---

## 🐛 常见问题

### Q: 如何改变熊猫的情绪？
A: 通过修改 `PandaWidget.vue` 的 `mood` prop：
```vue
<PandaWidget 
  :mood="currentMood"
  :moodValue="moodValue"
/>
```

### Q: 怎么添加新的卡片类型？
A: 在 `theme.css` 中添加新的卡片背景色变量和类名：
```css
--color-bg-purple: #F3E8FF;

.card-purple {
  background-color: var(--color-bg-purple);
}
```

### Q: 如何调整整体间距？
A: 修改 `theme.css` 中的 spacing 变量即可全局生效：
```css
--spacing-md: 12px; /* 改为想要的值 */
```

---

## 📚 参考资源

| 文件 | 内容 |
|------|------|
| [README.md](README.md) | 项目概述和功能说明 |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | 详细设计规范（推荐详读！） |
| [src/styles/theme.css](src/styles/theme.css) | 所有 CSS 变量定义 |
| [src/App.vue](src/App.vue) | 主应用组件代码 |

---

## ⚡ 下一步

1. **安装依赖** → `npm install`
2. **启动开发** → `npm run dev`
3. **查看设计规范** → 打开 `DESIGN_SYSTEM.md`
4. **开始开发** → 修改 components 中的组件
5. **测试** → 在 Electron 窗口中实时预览

---

**祝你开开心心地摸鱼！🐼💚**

