#!/bin/bash
# 🐼 摸鱼日记 UI 重构 - 快速启动脚本

echo "=========================================="
echo "🐼 摸鱼日记 UI 重构 - 快速启动"
echo "=========================================="
echo ""

# 第一步：检查依赖
echo "📦 第一步: 检查和安装依赖..."
echo ""

# 检查是否已安装 pinia
if ! grep -q '"pinia"' package.json; then
  echo "⚠️  检测到未安装 pinia，正在安装..."
  npm install pinia
else
  echo "✅ pinia 已安装"
fi

# 第二步：验证 main.js
echo ""
echo "🔧 第二步: 验证 main.js 配置..."

if grep -q "createPinia" src/main.js; then
  echo "✅ Pinia 已在 main.js 中配置"
else
  echo "⚠️  需要在 src/main.js 中添加 Pinia 配置"
  echo "   请参考 UI_REFACTOR_GUIDE.md 的配置说明"
fi

echo ""

# 第三步：显示项目结构
echo "📁 第三步: 项目文件检查..."
echo ""

files=(
  "src/stores/user.js"
  "src/renderer/components/Avatar.vue"
  "src/renderer/components/SidebarLogo.vue"
  "src/renderer/components/SidebarUserCard.vue"
  "src/renderer/components/HeaderUserInfo.vue"
  "src/renderer/components/CalendarHeatmap.vue"
  "src/renderer/components/PandaAssistant.vue"
  "src/renderer/components/StatCard.vue"
  "src/renderer/views/DashboardRefactored.vue"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (缺失)"
  fi
done

echo ""
echo "=========================================="
echo "✨ 准备完成！"
echo "=========================================="
echo ""
echo "🚀 快速开始命令:"
echo ""
echo "  npm run dev"
echo ""
echo "📚 文档位置:"
echo ""
echo "  • UI_REFACTOR_GUIDE.md          - 详细使用指南"
echo "  • UI_REFACTOR_DEPENDENCIES.md  - 依赖配置"
echo "  • REFACTOR_COMPLETE.md         - 完整总结"
echo ""
echo "🎯 推荐阅读顺序:"
echo ""
echo "  1️⃣  REFACTOR_COMPLETE.md       - 了解项目结构"
echo "  2️⃣  UI_REFACTOR_GUIDE.md       - 学习各组件使用"
echo "  3️⃣  SettingsIntegrationExample.vue - 查看完整集成示例"
echo ""
echo "💡 快速参考:"
echo ""
echo "  导入状态管理:"
echo "  import { useUserStore } from '@/stores/user'"
echo ""
echo "  导入组件:"
echo "  import SidebarLogo from '@/components/SidebarLogo.vue'"
echo ""
echo "  修改用户头像:"
echo "  userStore.setAvatar('graduate')"
echo ""
echo "  增加经验值:"
echo "  userStore.addExp(10)"
echo ""
echo "=========================================="
echo ""
echo "🎉 祝你摸鱼愉快！"
echo ""
