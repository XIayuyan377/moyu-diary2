# MoodDiary.vue 快速参考指南

## 🎨 颜色方案

```ts
// 心情对应颜色
happy:   #FFD700  (金黄)
tired:   #87CEEB  (天蓝)
broken:  #FF6B9D  (深粉)
fish:    #90EE90  (浅绿)
hyper:   #FF8C42  (橙色)
anxious: #DDA0DD  (紫罗兰)

// 基础颜色
主色橙:  #FF8C42
背景:    #FAFAF8
边框:    #EDE8E0
文字:    #3D3530
辅文:    #9E9189
```

## 📐 布局尺寸

```ts
// 三区布局
Header:  80px (固定)
Chat:    flex:1 (可滚动)
Input:   120px (固定)

// 心情按钮
尺寸:     70×70px
排列:     6个横排，gap:12px
emoji:   28px
标签:    11px
```

## 🐼 滚滚状态系统

### mood 属性映射
```ts
// 根据最后消息判断
messages[最后].moodEmoji === '😄' → mood: 'happy'
messages[最后].moodEmoji === '😩' → mood: 'tired'
messages[最后].moodEmoji === '🤡' → mood: 'mad'
无消息或其他               → mood: 'sleeping'
```

### emoji 显示
```css
/* 使用伪元素 ::before 显示 */
.panda-status[mood="happy"]::before    { content: '😄'; }
.panda-status[mood="tired"]::before    { content: '😴'; }
.panda-status[mood="mad"]::before      { content: '😤'; }
.panda-status[mood="sleeping"]::before { content: '🐼'; animation: pandaSleep; }
```

## 💬 消息气泡

### 用户消息
```
位置:      右侧
背景:      #FF8C42 (橙色)
文字:      white
圆角:      右下4px，其他16px
位置:      msg-group.user (flex-direction: row-reverse)
```

### 滚滚消息
```
位置:      左侧
背景:      #F5F5F5 (灰色)
文字:      #3D3530
圆角:      左下4px，其他16px
图标:      🐼 (28px)
动画:      打字气泡 (typing span)
```

## ⌨️ 输入区组件

### 心情按钮

**按钮状态：**
```ts
const mood = {
  id: string;
  emoji: string;        // emoji (28px)
  label: string;        // 心情标签 (11px)
  color: string;        // #HEX值
}

@click clickMood(mood)
→ 添加用户消息
→ 创建粒子效果
→ 延迟1s后添加滚滚回复
→ 检查连击
```

### 输入框
```
Placeholder: 「跟滚滚倒倒苦水...」
最小高度:    40px
最大高度:    80px
Focus边框:   #FF8C42
自动换行:    word-break
```

### 发送按钮
```
尺寸:        40×40px (圆形)
未激活:      background #EDE8E0, color #9E9189
激活:        background #FF8C42, color white
hover.active: background #e07a38, translateY(-2px)
```

## 💗 情绪连击系统

### 检测逻辑
```ts
function checkMoodConsecutive(moodId: string) {
  if (moodId !== 'broken' && moodId !== 'anxious') return
  
  const userMessages = messages.filter(m => m.role === 'user')
  const lastThree = userMessages.slice(-3)
  
  if (lastThree.length >= 3 && 所有都是负面) {
    showComfortModal.value = true
  }
}
```

### 弹窗弹出条件
- ✅ 触发心情为 'broken' 或 'anxious'
- ✅ 最近5条消息中最后3条都是负面
- ✅ 会显示随机安慰语

## 🎭 弹窗（Comfort Modal）

### 触发显示
```ts
showComfortModal = true
↓
<transition name="slide-up">
  <div v-if="showComfortModal" class="modal-overlay">
    <div class="comfort-card">...</div>
  </div>
</transition>
```

### 弹窗结构
```
┌─────────────────────────────────────┐
│ ×                                   │ (右上关闭按钮)
│                                     │
│              😊                     │ (滚滚emoji，80px)
│                                     │
│ 主人，你今天不太好受 💗              │ (标题)
│ [comfortMessage]                   │ (随机安慰语)
│ 滚滚递来虚拟奶茶 🧋                  │ (茶emoji，浮动动画)
│                                     │
│    [好的，谢谢滚滚]                 │ (按钮，#FF8C42)
└─────────────────────────────────────┘
```

### 动画
- 进入：slideUp 0.4s from 100%
- 茶emoji：浮动 2s 循环
- 关闭按钮：hover rotate(90deg)

## 📊 数据结构

### Message 接口
```ts
interface Message {
  id: number                    // 唯一标识
  role: 'user' | 'panda'       // 消息者
  text: string                 // 消息内容
  time: string                 // HH:MM 格式
  moodEmoji?: string           // 心情/消息emoji
  loading?: boolean            // 打字状态
}
```

### 计算属性

**currentPandaMood:**
```ts
computed(() => {
  if (messages.length === 0) return 'sleeping'
  const lastUserMsg = lastMessage where role === 'user'
  
  const mood = moods.find(m => m.emoji === lastUserMsg.moodEmoji)
  if mood.id === 'happy' return 'happy'
  if mood.id === 'tired' return 'tired'
  if mood.id === 'broken' return 'mad'
  return 'default'
})
```

**todayMoodEmojis:**
```ts
computed(() => {
  const userMsgs = messages.filter(m => m.role === 'user')
  return [...new Set(userMsgs.map(m => m.moodEmoji).filter(e => e && e !== '💬'))]
  // 去重后的emoji数组
})
```

## 🎬 核心方法

### clickMood(m: Mood)
```ts
1. 创建用户消息 (role='user')
2. push到messages
3. scrollToBottom()
4. createParticles()       // 粒子效果
5. 创建滚滚消息 (loading=true)
6. setTimeout 1s:
   - 获取对应的随机回复
   - 更新消息文本
   - checkMoodConsecutive()
```

### sendMessage()
```ts
1. 获取输入框文本
2. 清空输入框
3. 创建用户消息 (moodEmoji='💬')
4. scrollToBottom()
5. 创建滚滚消息 (loading=true)
6. setTimeout 1s:
   - 显示随机回复
```

### createParticles(x, y, color)
```ts
1. 循环6次创建粒子
2. 每个粒子方向不同 (angle = i/6 * 2π)
3. 使用requestAnimationFrame 循环动画
4. 800ms 后移除粒子
```

## 🎨 CSS 变量

```css
/* mood-btn-item 使用 */
--mood-color: #HEX  /* 传入的心情颜色 */

/* 应用方式 */
.mood-btn-item:hover {
  border-color: var(--mood-color);
  background-color: color-mix(in srgb, var(--mood-color) 20%, white);
}
```

## 🔧 常用修改

### 修改心情列表
```ts
const moods = [
  { id: 'new', emoji: '🎉', label: '庆祝', color: '#新颜色' },
  // 添加新心情
]
```

### 修改滚滚回复
```ts
const pandaReplies = {
  happy: [
    '新回复文本...',
    // 添加更多回复
  ],
  // ...
}
```

### 修改安慰语
```ts
const comfortMessages = [
  '新安慰语...',
  // 添加更多
]
```

### 修改布局尺寸
```css
.header-bar { height: 新高度; }
.input-area { height: 新高度; }
.mood-btn-item { width: 新宽度; height: 新高度; }
```

## ⚡ 性能优化建议

1. **粒子数量** - 当前6个，可调整 `for (let i = 0; i < 6; i++)`
2. **动画帧率** - 使用 requestAnimationFrame，自动优化
3. **消息缓存** - messages 数组长度可设置上限
4. **重新渲染** - 使用 nextTick() 确保DOM更新

## 📱 响应式注意事项

- Header 固定80px（不随屏幕变化）
- Input 固定120px（不随屏幕变化）
- Chat区域 flex:1 自适应
- 按钮在小屏幕上保持70×70px
- 考虑添加媒体查询适配平板

