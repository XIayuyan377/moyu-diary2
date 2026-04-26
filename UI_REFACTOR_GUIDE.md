# 🐼 摸鱼日记 UI 重构指南

## 📋 项目结构

```
src/
├── stores/
│   └── user.js                 # Pinia 用户状态管理
├── renderer/
│   ├── components/
│   │   ├── Avatar.vue          # 通用头像组件
│   │   ├── SidebarLogo.vue     # 优化Logo区
│   │   ├── SidebarUserCard.vue # 左下角用户卡片
│   │   ├── HeaderUserInfo.vue  # 顶部用户信息
│   │   ├── CalendarHeatmap.vue # 日历热力图
│   │   ├── PandaAssistant.vue  # 右下角熊猫助手
│   │   ├── StatCard.vue        # 统计卡片
│   └── views/
│       └── DashboardRefactored.vue  # 完整示例页面
├── main.js                     # 应用入口（已配置Pinia）
└── styles/
    └── theme.css               # 主题样式
```

---

## 🎯 核心组件说明

### 1️⃣ **Pinia 用户状态管理** (`stores/user.js`)

#### 功能：
- 管理全局用户信息（昵称、头像、等级、经验值等）
- 自动与 localStorage 同步
- 提供响应式的状态更新

#### 使用示例：

```typescript
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const userStore = useUserStore()

    // 获取状态
    console.log(userStore.nickname)      // 用户昵称
    console.log(userStore.avatar)        // 头像ID
    console.log(userStore.level)         // 等级
    console.log(userStore.expPercentage) // 经验条百分比

    // 更新状态
    userStore.setNickname('新昵称')
    userStore.setAvatar('graduate')      // 切换头像
    userStore.addExp(10)                 // 增加经验值

    return { userStore }
  }
}
```

#### 可用的 Avatar IDs：
- `default` - 👧 扎辫子女生
- `short_hair` - 👩 短发女生
- `boy` - 🧑 男生款
- `glasses` - 👓 戴眼镜书呆子
- `graduate` - 🎓 学士帽款
- `panda` - 🐼 直接用熊猫

---

### 2️⃣ **Avatar 通用头像组件** (`Avatar.vue`)

#### Props：

```typescript
interface Props {
  src?: string              // 图片URL
  content?: string          // 显示内容（emoji或首字母）
  alt?: string             // 图片alt文本
  name?: string            // 用户名（可选）
  size?: 'xs'|'sm'|'md'|'lg'|'xl'  // 大小
  status?: 'online'|'offline'|'away' // 在线状态
  showStatus?: boolean     // 是否显示状态指示器
  showName?: boolean       // 是否显示用户名
}
```

#### 使用示例：

```vue
<template>
  <Avatar
    content="👧"
    size="lg"
    status="online"
    showStatus
    name="摸鱼研究生"
    showName
  />
</template>
```

---

### 3️⃣ **SidebarLogo 优化Logo区** (`SidebarLogo.vue`)

#### 特点：
- 圆形图标背景（渐变绿色）
- 主标题 + 胶囊Tag副标题
- 整体居中布局
- Hover 效果

#### 使用示例：

```vue
<template>
  <div class="sidebar">
    <SidebarLogo />
    <!-- 其他内容 -->
  </div>
</template>
```

---

### 4️⃣ **SidebarUserCard 左下角用户卡片** (`SidebarUserCard.vue`)

#### 包含内容：
- 用户头像 + 昵称 + 等级
- 经验条进度显示
- 快速操作按钮（打卡、摸鱼）
- 设置按钮

#### 自动功能：
- 头像自动从 userStore 读取
- 快速打卡自动加经验值
- 点击设置按钮可跳转设置页

#### 使用示例：

```vue
<template>
  <aside class="sidebar">
    <SidebarLogo />
    <!-- 导航菜单 -->
    <nav>...</nav>
    <!-- 用户卡片 -->
    <SidebarUserCard />
  </aside>
</template>
```

---

### 5️⃣ **HeaderUserInfo 顶部用户信息** (`HeaderUserInfo.vue`)

#### 包含内容：
- 面包屑导航
- 当前页面标签
- 用户信息卡片（头像 + 昵称 + 等级）
- 通知按钮

#### 特点：
- 自动读取当前路由显示页面名称
- 响应式设计
- 通知徽章支持

#### 使用示例：

```vue
<template>
  <header>
    <HeaderUserInfo />
  </header>
</template>
```

---

### 6️⃣ **CalendarHeatmap 日历热力图** (`CalendarHeatmap.vue`)

#### 特点：
- GitHub 风格的热力图
- 支持 hover 显示日期信息
- 模拟打卡数据
- 强度从弱到强 5 个等级
- 今天高亮显示

#### 包含数据：
- 自动生成当月日历
- 模拟打卡次数（0-5次）
- 自动计算强度级别

#### 使用示例：

```vue
<template>
  <div class="sidebar-right">
    <CalendarHeatmap />
  </div>
</template>
```

---

### 7️⃣ **PandaAssistant 右下角熊猫助手** (`PandaAssistant.vue`)

#### 特点：
- Position: fixed 右下角
- CSS 绘制的熊猫形象
- 4 种状态切换：idle、happy、tired、angry
- 自动呼吸动画
- Hover 显示快速操作按钮

#### 交互功能：

| 操作 | 功能 | 经验值 |
|------|------|--------|
| 💧 喝水 | 提醒喝水 | +5 exp |
| 🏃 起身 | 活动提醒 | +10 exp |
| 😊 心情 | 记录心情 | - |
| 🎯 番茄钟 | 启动计时 | +15 exp |

#### 点击熊猫的行为：
- 连续点击会改变熊猫情绪
- 3 秒后自动恢复空闲状态

#### 使用示例：

```vue
<template>
  <div class="app">
    <!-- 其他内容 -->
    <PandaAssistant />
  </div>
</template>
```

---

### 8️⃣ **StatCard 统计卡片** (`StatCard.vue`)

#### Props：

```typescript
interface Props {
  icon: string                              // 图标emoji
  title: string                             // 标题
  value: string                             // 主要数值
  trend: string                             // 趋势文本
  trendClass?: 'positive'|'negative'|'neutral' // 趋势样式
}
```

#### 趋势样式：
- `positive` - 绿色背景，向上趋势
- `negative` - 红色背景，向下趋势
- `neutral` - 灰色背景，中性

#### 使用示例：

```vue
<template>
  <div class="stats-grid">
    <StatCard
      icon="🎯"
      title="今日打卡"
      value="3次"
      trend="↑ 2次"
      trendClass="positive"
    />
  </div>
</template>
```

---

## 🚀 集成指南

### 第一步：安装依赖

```bash
# 需要 Pinia
npm install pinia

# TailwindCSS（如果还没装）
npm install -D tailwindcss postcss autoprefixer
```

### 第二步：更新 main.js

```javascript
import { createPinia } from 'pinia'

const pinia = createPinia()
app.use(pinia)
```

### 第三步：在页面中使用

```vue
<template>
  <div class="dashboard-layout">
    <!-- 左侧边栏 -->
    <aside class="sidebar">
      <SidebarLogo />
      <nav><!-- 导航菜单 --></nav>
      <SidebarUserCard />
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <HeaderUserInfo />
      <div class="content">
        <!-- 页面内容 -->
      </div>
      <aside class="sidebar-right">
        <CalendarHeatmap />
      </aside>
    </main>

    <!-- 熊猫助手 -->
    <PandaAssistant />
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import SidebarLogo from '@/components/SidebarLogo.vue'
import SidebarUserCard from '@/components/SidebarUserCard.vue'
import HeaderUserInfo from '@/components/HeaderUserInfo.vue'
import CalendarHeatmap from '@/components/CalendarHeatmap.vue'
import PandaAssistant from '@/components/PandaAssistant.vue'

const userStore = useUserStore()
</script>
```

---

## 🎨 主要改进点

### 1. **视觉一致性**
- ✅ 统一的配色方案（绿色系 #5BAD7F）
- ✅ 统一的圆角大小（8px-12px）
- ✅ 统一的阴影效果
- ✅ 统一的间距规范

### 2. **趣味性**
- ✅ 熊猫助手右下角陪伴
- ✅ 丰富的交互反馈动画
- ✅ 状态变化提示
- ✅ 热力图可视化

### 3. **功能性**
- ✅ 全局状态管理（Pinia）
- ✅ 自动同步 localStorage
- ✅ 经验值系统
- ✅ 快速操作按钮

### 4. **易用性**
- ✅ 组件高度模块化
- ✅ Prop 接口清晰
- ✅ 代码注释完整
- ✅ 支持响应式设计

---

## 🔧 常见问题

### Q: 如何修改熊猫的表情？
A: 编辑 `PandaAssistant.vue` 中的 `.panda-mouth` 样式，修改不同 state 的嘴巴形状。

### Q: 如何自定义头像？
A: 在 `SidebarUserCard.vue` 中修改 `avatarMap` 对象，添加新的 emoji 或图片 URL。

### Q: 日历数据如何更新？
A: 修改 `CalendarHeatmap.vue` 的 `calendarDays` 计算属性，连接实际的打卡数据接口。

### Q: 如何添加新的快速操作？
A: 编辑 `PandaAssistant.vue` 中的 `quickButtons` 数组，添加新按钮，在 `handleQuickAction` 中处理逻辑。

---

## 📱 响应式支持

所有组件都支持响应式设计：
- **Desktop** (1200px+): 完整布局，所有功能显示
- **Tablet** (768px-1200px): 自适应布局，部分功能合并
- **Mobile** (<768px): 单列布局，简化功能

---

## 🎯 下一步优化建议

- [ ] 连接实际的 API 数据
- [ ] 添加主题切换功能
- [ ] 实现番茄钟计时器
- [ ] 添加成就系统动画
- [ ] 实现打卡统计图表
- [ ] 添加离线模式支持

---

## 📄 许可证

MIT License

---

**祝你摸鱼愉快！🐼**
