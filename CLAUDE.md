# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本代码库工作时提供指导。

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (端口 3000)
npm run dev

# 生产构建
npm run build

# TypeScript 类型检查
npm run lint

# 预览生产构建
npm run preview

# 清理构建输出
npm run clean
```

## 环境配置

需要在 `.env.local` 中配置环境变量：
- `GEMINI_API_KEY` - Gemini API 密钥（AI 功能必需）
- `APP_URL` - 应用 URL（可选，部署后使用）

将 `.env.example` 复制为 `.env.local` 并填写你的配置值。

## 架构说明

这是一个基于 React + TypeScript + Vite 的单页应用，提供蔚来牛屋二维码展示和预约功能。

**核心技术栈：**
- React 19 + TypeScript
- Vite 构建工具
- Tailwind CSS v4（通过 Vite 插件）
- Motion（动画库）
- Lucide React（图标库）

**项目结构：**
```
├── src/
│   ├── App.tsx          # 主应用组件（包含所有 UI 逻辑）
│   ├── main.tsx         # 应用入口
│   └── index.css        # 全局样式（Tailwind 导入）
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
└── package.json         # 依赖和脚本配置
```

**应用流程：**
1. 登录页面 → 登录后显示仪表盘
2. 仪表盘有两个功能选项："牛屋二维码" 和 "虹桥牛屋预约"
3. 二维码弹窗显示动态二维码，每秒更新时间
4. 预约弹窗提供时间段选择和预订表单

**说明：**
- 所有 UI 都包含在单个 `App.tsx` 组件中，使用 framer-motion 实现动画过渡
- 使用 Tailwind 工具类样式，遵循蔚来品牌美学
- 移动优先设计，在浏览器中模拟移动端应用体验
