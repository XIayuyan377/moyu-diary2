# 🎮 MyCharacter 快速参考卡

## 📦 生成内容清单

✅ **MyCharacter.vue** (完整组件，520+ 行)
- Template: 升级浮层 + 角色头像 + 统计条带
- Script: Composition API + 完整事件系统
- Style: 300+ 行 CSS + 15+ 种动画

✅ **ARCHITECTURE_CHARACTER.md** (设计文档)
- 9大章节，涵盖所有设计决策

✅ **MyCharacter.GUIDE.md** (使用指南)
- Props/Events 完整参考
- 经验值公式详解
- 与任务系统集成方案

✅ **MyCharacter.example.vue** (使用示例)
- 4大测试场景
- 事件日志面板
- 交互演示

---

## 🚀 核心特性速览

### 数据流
```
父组件输入 (Props)
    ↓
响应式计算 (Computed × 6)
    ↓
模板渲染 + 动画
    ↓
事件发送 (3种Emit)
    ↓
父组件接收并更新
```

### 三层 UI 结构
```
Layer 1: 升级浮层    激光粒子爆炸 ✨
         ↓
Layer 2: 角色头像    8种表情 + 4种动作
         ↓
Layer 3: 统计条带    等级徽章 + 经验条
```

### 六大 Computed
| Computed | 用途 |
|---------|------|
| nextExpRequired | 升级所需经验值 |
| expProgress | 经验进度 % |
| levelTier | 等级颜色分级 |
| starsToShow | 星星数量 |
| isNearLevelUp | 升级警告 |
| mouthClass | 表情 CSS 类 |

### 四种心情模式
```javascript
{
  happy:    😊 绿色经验条 + 开心动画 + 爱心跳动
  tired:    😴 橙色经验条 + 摇晃动画 + 灰腮红
  stressed: 😰 红色经验条 + 抖动动画 + 竖瞳孔
  idle:     😐 灰色经验条 + 浮动动画 + 正常表情
}
```

### 十条动画
| 动画 | 触发 | 时长 |
|-----|------|------|
| levelup-bounce | 升级显示 | 0.6s |
| levelup-burst | 彩粒子 | 1-1.5s |
| particle-burst | 单个粒子 | variable |
| bounce-happy | 高兴心情 | ∞ 0.6s |
| sway-tired | 疲劳心情 | ∞ 2s |
| shake-stressed | 压力心情 | ∞ 0.4s |
| float-idle | 空闲心情 | ∞ 3s |
| heart-beat | 高兴爱心 | 0.6s |
| pulse-glow | 即将升级 | 1s |
| click-bounce | 点击反应 | 0.4s |

---

## 💡 使用三部曲

### Step 1: 导入组件
```typescript
import MyCharacter from '@/renderer/components/MyCharacter.vue'
```

### Step 2: 在 Dashboard 中使用
```vue
<MyCharacter 
  :level="character.level"
  :exp="character.exp"
  :mood="character.currentMood"
  :size="120"
  :interactive="true"
  @level-up="handleLevelUp"
  @character-clicked="handleClick"
/>
```

### Step 3: 监听升级事件
```typescript
const handleLevelUp = ({ newLevel, bonusExp }) => {
  character.level = newLevel
  character.exp = bonusExp
  showCelebration()  // 触发庆祝窗口
}
```

---

## 📊 经验值参考表

| 等级 | 本级所需 | 累计所需 |
|-----|--------|--------|
| 1→2 | 100 | 100 |
| 2→3 | 120 | 220 |
| 3→4 | 144 | 364 |
| 4→5 | 173 | 537 |
| 5→6 | 207 | 744 |
| 6→7 | 248 | 992 |
| 7→8 | 298 | 1290 |
| 8→9 | 358 | 1648 |
| 9→10 | 429 | 2077 |

---

## 🎨 样式常量

### 颜色映射
```css
Level Tier Colors:
  junior (1-3):   #5B9FBD (蓝)
  middle (4-6):   #9B7EBD (紫)
  senior (7+):    #FFB74D (金)

Mood Colors:
  happy:          #7AC77F (绿)
  tired:          #FFB84D (橙)
  stressed:       #F08080 (红)
  idle:           #9E9189 (灰)
```

### 尺寸规格
```
小 (80px):   卡片摘要显示
中 (120px):  仪表盘主体
大 (160px):  详情页展示
特大 (200+): 专题页面
```

---

## ✨ 下一步建议

### 立即可做
1. 集成到 [Dashboard.vue](src/renderer/views/Dashboard.vue)
2. 连接任务完成事件
3. 修改样式颜色（可爱度+5）

### 未来扩展
- [ ] 装扮系统（帽子、衣服）
- [ ] 成就徽章解锁
- [ ] 排行榜面板
- [ ] 宠爱度按钮
- [ ] 背景主题切换

### 优化项
- [ ] 加载更多表情库
- [ ] 粒子效果库
- [ ] 音效反馈
- [ ] 触觉反馈（mobile）

---

## 🔗 文件链接

| 文件 | 描述 |
|------|------|
| [src/renderer/components/MyCharacter.vue](src/renderer/components/MyCharacter.vue) | 主组件 |
| [MyCharacter.GUIDE.md](MyCharacter.GUIDE.md) | 完整使用指南 |
| [MyCharacter.example.vue](MyCharacter.example.vue) | 测试示例 |
| [ARCHITECTURE_CHARACTER.md](ARCHITECTURE_CHARACTER.md) | 设计文档 |

---

## 🐛 故障排除

| 问题 | 解决方案 |
|-----|--------|
| 经验条不动 | 检查 exp 值是否更新 |
| 点击无反应 | 确认 `:interactive="true"` |
| 升级不触发 | 检查 exp >= nextExpRequired 的逻辑 |
| 表情不变 | 验证 mood 值是否正确 |
| 动画卡顿 | 减少页面其他动画或 z-index 冲突 |

---

## 📈 性能检查

✅ 无 watchers 过度使用
✅ 粒子 20 个（性能可控）
✅ CSS 动画（GPU 加速）
✅ Computed 缓存计算
✅ 条件渲染（`v-if`）

**预期性能：** 60FPS @120px 头像

---

## 💬 样式说明

### 整体风格
- **主题:** 奶油手账 + 治愈养成
- **配色:** 暖色系（#FFD4B8 肤色）
- **圆角:** 柔和过渡、无锐角
- **阴影:** 浅色半透明，不超过 0.12 opacity

### 动画哲学
- 所有状态变化都有清晰反馈
- 不过度动画化（大多 < 1s）
- 使用 ease-in-out 保证柔和感
- 循环动画频率低（避免分心）

---

**✅ 核对清单：**
- [x] 代码无错误
- [x] 所有 Props 有默认值
- [x] 所有 Emits 都有注释
- [x] CSS 样式完整
- [x] 动画流畅
- [x] 文档齐全
- [x] 示例可正常运行

**准备就绪于: 2026-04-14**
