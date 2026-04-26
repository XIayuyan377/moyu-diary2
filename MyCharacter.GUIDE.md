# 🎮 MyCharacter 角色系统 - 使用指南

## 概述

完全重构的 Vue 3 Composition API 角色系统，包含：
- ✅ 等级数据递进系统（1-10+级）
- ✅ 经验值动态计算与进度条
- ✅ 四种情绪状态（happy/tired/stressed/idle）
- ✅ 升级彩粒子特效
- ✅ 等级星星、数字显示
- ✅ 心情颜色联动、表情切换
- ✅ 鼠标悬停缩放、点击弹跳
- ✅ 经验条即将升级脉冲效果

---

## 快速开始

### Props（父组件传入）

```typescript
<MyCharacter 
  :level="5"              // 当前等级 | 默认: 1
  :exp="75"               // 当前经验 | 默认: 0
  mood="happy"            // 情绪状态: happy/tired/stressed/idle | 默认: idle
  :size="120"             // 头像尺寸(px) | 默认: 120
  :show-stats="true"      // 是否显示等级和经验条 | 默认: true
  :show-bubble="false"    // 是否显示气泡 | 默认: false
  bubble-text="加油哦!"   // 气泡文字 | 默认: ''
  :interactive="true"     // 是否可交互(点击) | 默认: false
  @level-up="handleLevelUp"
  @character-clicked="handleClick"
  @mood-changed="handleMoodChange"
/>
```

### Events（父组件监听）

1. **@level-up** 升级事件
```typescript
emit('level-up', {
  newLevel: 6,           // 新等级
  bonusExp: 15           // 溢出的经验值
})
```

2. **@character-clicked** 点击事件
```typescript
emit('character-clicked', {
  level: 5,
  mood: 'happy',
  exp: 75
})
```

3. **@mood-changed** 心情改变事件
```typescript
emit('mood-changed', {
  oldMood: 'idle',
  newMood: 'happy'
})
```

---

## 数据结构

### 响应式计算

| Computed | 作用 | 示例 |
|---------|------|------|
| `nextExpRequired` | 升级所需经验 | Lv5: 206 exp |
| `expProgress` | 进度百分比 (0-100) | 75 exp / 206 = 36% |
| `levelTier` | 等级分级 | 'junior'(1-3) / 'middle'(4-6) / 'senior'(7+) |
| `starsToShow` | 显示星星数 | Lv5: 3个⭐ |
| `isNearLevelUp` | 是否即将升级 | exp >= 90% 时 true |

### 经验值计算公式

```
升级所需经验 = baseExpRequired × (expGrowthRate ^ (级数-1))
             = 100 × (1.2 ^ (5-1))
             = 100 × 2.0736
             = 207 exp
```

| 等级 | 所需经验 | 总经验 |
|----|--------|-------|
| 1→2 | 100 | 100 |
| 2→3 | 120 | 220 |
| 3→4 | 144 | 364 |
| 4→5 | 173 | 537 |
| 5→6 | 207 | 744 |

---

## 内部状态管理

### Reactive 局部状态

```typescript
const isHovered = ref(false)              // 鼠标悬停
const showLevelUpAnimation = ref(false)   // 升级动画显示
const previousLevel = ref(props.level)    // 记录升级前等级
const particleStyles = reactive({})       // 彩粒子位置数据
```

---

## 动画效果

### Level Up（升级）

```
触发条件: exp >= nextExpRequired
效果:
  1. 升级提示 Layer 浮出（中心）
  2. 彩粒子从中心放射（20个粒子）
  3. 显示 "LV 5 → 6" 过渡
  4. 2秒后自动隐藏
```

### Experience Bar（经验条）

```
平滑填充: width 0 → 100% 过度时间 0.6s
脉冲效果: 当 exp >= 90% 时触发
  - 脉冲圈从 0px → 6px 扩散
  - 循环周期 1s
```

### Character Body（角色身体）

```
Happy:      上下弹跳 0.6s
Tired:      左右摇晃 2s
Stressed:   左右抖动 0.4s
Idle:       轻微浮动 3s
```

### 交互动画

```
Hover:      scale 1 → 1.08（放大8%）
Click:      弹跳序列（缩放+位移组合）
```

---

## 与任务系统的集成

### 父组件（Dashboard）更新模式

```typescript
// 完成任务后
const completeTask = (task) => {
  character.exp += calculateExpBonus(task)
  
  // 组件内部自动监听 exp 变化
  // 若 exp >= expRequired，自动发送 @level-up 事件
  // 父组件接收后更新状态
}

// 升级事件处理
const handleLevelUp = ({ newLevel, bonusExp }) => {
  character.level = newLevel
  character.exp = bonusExp
  
  // 触发庆祝动画、获得奖励等
  showCelebration()
  awardMilestoneReward(newLevel)
}
```

### Exp 收入来源

```
1. 完成任务: +10~50 exp
2. 工作时长: 1小时 +5 exp
3. 打卡签到: +20 exp
4. 心情奖励: 开心 ×1.2，疲劳 ×0.8
```

---

## 样式定制

### 颜色系统集成

```css
/* 继承全局主题变量 */
--color-success    /* 成功绿 - 经验条底色 */
--color-warning    /* 警告橙 - 疲劳模式 */
--color-error      /* 柔和红 - 压力模式 */
--color-text-muted /* 灰色 - 空闲模式 */
```

### 心情颜色映射

| 心情 | 经验条颜色 | 眼睛状态 | 腮红状态 |
|-----|---------|--------|--------|
| happy | 绿 → 浅绿 | 闭眼笑 | 加深 |
| tired | 橙 → 黄橙 | 半睁眼 | 变灰 |
| stressed | 红 → 鲜红 | 竖瞳孔 | 不变 |
| idle | 灰 → 浅灰 | 正常 | 减淡 |

---

## 性能考虑

### 优化点

1. **Computed 缓存** - 避免重复计算
2. **动画用 CSS** - 不用 JS 定时器
3. **粒子延迟销毁** - 2秒后才移除 DOM
4. **按需渲染** - `v-if="showStats"` 条件渲染

### 适用场景

```
✅ 小屏幕：size 80-100px
✅ 仪表盘卡片：size 120-150px
✅ 大屏展示：size 180-240px
```

---

## 调试技巧

### 快速升级测试

```typescript
// 在浏览器控制台
character.exp = 999  // 快速升级

// 切换心情
currentMood.value = 'happy'
```

### 查看计算值

```javascript
// computed 属性在 vue devtools 中可见
nextExpRequired  // 当前升级所需
expProgress      // 进度百分比
levelTier        // 等级分级
```

---

## 常见问题

**Q: 经验条突然回到0%？**  
A: 这是升级触发事件，父组件应该处理 `@level-up` 事件更新等级和经验

**Q: 星星不闪烁？**  
A: 检查 CSS 是否加载(`star-twinkle` 动画)

**Q: 点击没有反应？**  
A: 确认 `:interactive="true"` 且绑定了 `@character-clicked`

**Q: 彩粒子不显示？**  
A: 检查是否有 z-index 冲突，升级提示 z-index 是 1000

---

## 后续规划

- [ ] 装扮系统（帽子、衣服、背景）
- [ ] 成就徽章（完成 10 个任务等）
- [ ] 特殊表情库（30+ 细节表情）
- [ ] 等级排行榜
- [ ] 角色昵称编辑
- [ ] 宠物宠爱度系统

---

## API 完整参考

### Props 完整列表

```typescript
{
  // 成长数据
  level: number = 1              // 当前等级
  exp: number = 0                // 当前经验值
  
  // 情感数据
  mood: 'happy'|'tired'|'stressed'|'idle' = 'idle'
  
  // 展示控制
  size: number = 120             // 尺寸（px）
  showStats: boolean = true      // 显示等级+经验条
  showBubble: boolean = false    // 显示台词气泡
  bubbleText: string = ''        // 气泡内容
  
  // 交互控制
  interactive: boolean = false   // 允许点击交互
}
```

### Emits 完整列表

```typescript
'level-up'           (ev: { newLevel: number, bonusExp: number })
'character-clicked'  (ev: { level: number, mood: string, exp: number })
'mood-changed'       (ev: { oldMood: string, newMood: string })
```

---

**最后更新:** 2026-04-14  
**版本:** v1.0.0 (Composition API)
