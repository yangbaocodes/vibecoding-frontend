# VibeCoding Frontend

一个基于 Vue 3 + TypeScript + Vite 的现代化企业级前端项目。

## 🚀 技术栈

- **核心框架**: Vue 3 + Composition API + TypeScript
- **构建工具**: Vite 5（配置优化选项）
- **路由管理**: Vue Router 4（动态路由、嵌套路由、导航守卫）
- **状态管理**: Pinia（模块化设计，支持 TS 类型推导）
- **网络请求**: Axios（封装请求拦截器、响应拦截器，统一错误处理）
- **UI 库**: Element Plus（桌面端）
- **代码规范**: ESLint + Prettier + Stylelint
- **国际化**: Vue I18n（支持多语言，默认英文，生产环境兼容）
- **样式处理**: SCSS + 响应式设计

## 🔧 最近修复

### 国际化生产环境白屏问题修复

**问题描述**: 在生产环境中，使用 `const { t } = useI18n()` 会导致应用白屏，而开发环境正常。

**根本原因**: 
1. Vue I18n 配置中的 `legacy: false` 在生产环境中存在兼容性问题
2. AutoImport 配置中包含了 `vue-i18n`，可能导致时序问题
3. 国际化实例在生产环境中初始化失败

**解决方案**:
1. **优化 Vue I18n 配置**: 添加生产环境兼容性配置
   ```typescript
   const i18n = createI18n({
     legacy: false,
     locale: DEFAULT_CONFIG.LANGUAGE,
     fallbackLocale: 'en',
     messages,
     globalInjection: true,
     allowComposition: true,
     useScope: 'global',
     missingWarn: false,
     fallbackWarn: false
   })
   ```

2. **移除 AutoImport 中的 vue-i18n**: 避免自动导入导致的时序问题
   ```typescript
   AutoImport({
     imports: ['vue', 'vue-router', 'pinia'], // 移除 vue-i18n
     // ...
   })
   ```

3. **创建安全的国际化工具函数**: 提供错误处理和回退机制
   ```typescript
   export function useSafeI18n() {
     try {
       const i18n = useI18n()
       return { t: i18n.t, locale: i18n.locale, availableLocales: i18n.availableLocales }
     } catch (error) {
       console.warn('I18n not available, using fallback:', error)
       return { t: (key: string) => key, locale: { value: 'en' }, availableLocales: ['en'] }
     }
   }
   ```

**使用方式**: 在组件中使用 `useSafeI18n()` 替代 `useI18n()`
```typescript
import { useSafeI18n } from '@/utils/i18n'
const { t } = useSafeI18n()
```

## 📁 项目结构

```
frontend/
├── public/                     # 静态资源
│   └── vite.svg               # 网站图标
├── src/
│   ├── api/                   # API 接口管理
│   │   └── index.ts          # 统一的 API 接口
│   ├── assets/               # 静态资源（图片、字体等）
│   ├── components/           # 公共组件
│   │   ├── dashboard/        # 仪表盘组件
│   │   │   ├── StatsCard.vue        # 统计卡片
│   │   │   ├── ActivityList.vue     # 活动列表
│   │   │   └── QuickActions.vue     # 快捷操作
│   │   └── layout/           # 布局组件
│   │       ├── SidebarMenu.vue      # 侧边栏菜单
│   │       ├── LanguageSelector.vue # 语言选择器
│   │       ├── ThemeToggle.vue      # 主题切换
│   │       └── UserMenu.vue         # 用户菜单
│   ├── constants/            # 常量定义
│   │   └── index.ts         # 统一常量管理
│   ├── i18n/                # 国际化配置
│   │   ├── index.ts         # i18n 配置
│   │   └── locales/         # 语言包
│   │       ├── en.json      # 英文语言包
│   │       └── zh.json      # 中文语言包
│   ├── layouts/             # 页面布局
│   │   ├── DefaultLayout.vue # 默认布局
│   │   └── AuthLayout.vue   # 认证页面布局
│   ├── router/              # 路由配置
│   │   └── index.ts         # 路由定义和守卫
│   ├── store/               # 状态管理
│   │   ├── index.ts         # Pinia 配置
│   │   └── modules/         # 状态模块
│   │       ├── app.ts       # 应用状态
│   │       ├── user.ts      # 用户状态
│   │       └── theme.ts     # 主题状态
│   ├── styles/              # 样式文件
│   │   ├── index.scss       # 主样式文件
│   │   ├── variables.scss   # SCSS 变量
│   │   ├── mixins.scss      # SCSS 混合
│   │   ├── base.scss        # 基础样式
│   │   ├── components.scss  # 组件样式
│   │   ├── utilities.scss   # 工具类样式
│   │   └── responsive.scss  # 响应式样式
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts         # 通用类型
│   ├── utils/               # 工具函数
│   │   ├── index.ts         # 通用工具函数
│   │   ├── storage.ts       # 存储工具
│   │   ├── request.ts       # HTTP 请求工具
│   │   └── i18n.ts         # 国际化工具函数
│   ├── views/               # 页面组件
│   │   ├── auth/            # 认证相关页面
│   │   │   └── Login.vue    # 登录页面
│   │   ├── error/           # 错误页面
│   │   │   └── NotFound.vue # 404 页面
│   │   └── Dashboard.vue    # 仪表盘页面
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── .eslintrc.js             # ESLint 配置
├── .prettierrc              # Prettier 配置
├── .stylelintrc.js          # Stylelint 配置
├── .gitignore               # Git 忽略文件
├── env.d.ts                 # 环境变量类型声明
├── index.html               # HTML 模板
├── package.json             # 项目依赖和脚本
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── README.md                # 项目说明文档
```

## ✨ 核心特性

### 🎯 架构设计
- **模块化设计**: 按功能模块组织代码结构
- **组件化开发**: 可复用的功能组件
- **类型安全**: 完整的 TypeScript 类型定义
- **响应式设计**: 支持桌面端和移动端

### 🔧 开发体验
- **热重载**: Vite 提供极速的开发体验
- **代码规范**: ESLint + Prettier + Stylelint 统一代码风格
- **自动导入**: 组件和 API 自动导入
- **国际化安全**: 生产环境兼容的国际化配置
- **路径别名**: 简化模块导入路径

### 🎨 UI/UX
- **Element Plus**: 企业级 UI 组件库
- **主题切换**: 支持亮色/暗色主题
- **国际化**: 多语言支持（默认英文）
- **响应式布局**: 适配不同设备屏幕

### 🔐 功能特性
- **用户认证**: 完整的登录/登出流程
- **权限控制**: 基于角色的路由权限
- **状态管理**: Pinia 模块化状态管理
- **请求拦截**: 统一的 HTTP 请求处理
- **文档转换器**: 支持 DOCX 和 PDF 文件上传，支持点击和拖拽上传，文件类型验证和大小限制
- **默认页面**: 登录后默认显示文档转换页面

## 🛠️ 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0 or yarn >= 1.22.0

### 安装依赖
```bash
npm install
# or
yarn install
```

### 开发服务器
```bash
npm run dev
# or
yarn dev
```

### 构建项目
```bash
npm run build
# or
yarn build
```

### 预览构建
```bash
npm run preview
# or
yarn preview
```

### 代码检查
```bash
# ESLint
npm run lint

# 样式检查
npm run lint:style

# TypeScript 类型检查
npm run type-check
```

## 📝 开发规范

### 文件命名
- **组件文件**: PascalCase (如: `UserMenu.vue`)
- **工具文件**: camelCase (如: `request.ts`)
- **常量文件**: UPPER_SNAKE_CASE (如: `API_CONSTANTS`)

### 代码风格
- 使用 TypeScript 进行类型约束
- 遵循 Vue 3 Composition API 风格
- 组件使用 `<script setup>` 语法
- 样式使用 SCSS 预处理器

### 目录组织
- **按功能模块组织**: 相关文件放在同一目录
- **组件分层**: 区分页面组件和功能组件
- **统一导出**: 使用 index.ts 统一导出模块

## 🔧 配置说明

### Vite 配置
- 路径别名配置
- 插件自动导入
- 构建优化配置
- 开发服务器代理

### 样式系统
- SCSS 变量和混合
- 响应式断点
- 主题切换支持
- 工具类系统

### 国际化
- 支持多语言切换
- 按模块组织翻译文件
- 默认语言为英文

## 🚀 部署

### 构建优化
- 代码分割和懒加载
- 资源压缩和缓存
- Tree-shaking 优化
- 现代浏览器支持

### 环境变量
创建相应的环境变量文件：
- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env.local` - 本地环境（已创建，API地址为 https://vibecoding-api.aistudio.ltd/api）

### API 配置
项目已配置API基础地址为 `https://vibecoding-api.aistudio.ltd/api`，可通过以下方式修改：
1. 修改 `.env.local` 文件中的 `VITE_APP_BASE_API` 变量（推荐）
2. 或修改 `src/constants/index.ts` 中的默认值
3. 开发环境代理配置在 `vite.config.ts` 中，会自动读取环境变量 `VITE_APP_BASE_API`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请联系项目维护者。