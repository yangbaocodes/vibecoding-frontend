/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 解决 @element-plus/icons-vue 模块声明问题
declare module '@element-plus/icons-vue' {
  import type { DefineComponent } from 'vue'
  export const User: DefineComponent<{}, {}, any>
  export const Switch: DefineComponent<{}, {}, any>
  export const Setting: DefineComponent<{}, {}, any>
  export const Settings: DefineComponent<{}, {}, any>
  export const SwitchButton: DefineComponent<{}, {}, any>
  export const ArrowDown: DefineComponent<{}, {}, any>
  export const ArrowUp: DefineComponent<{}, {}, any>
  export const ArrowRight: DefineComponent<{}, {}, any>
  export const ArrowLeft: DefineComponent<{}, {}, any>
  export const Sunny: DefineComponent<{}, {}, any>
  export const Moon: DefineComponent<{}, {}, any>
  export const House: DefineComponent<{}, {}, any>
  export const Expand: DefineComponent<{}, {}, any>
  export const Fold: DefineComponent<{}, {}, any>
  export const Logout: DefineComponent<{}, {}, any>
  export const Profile: DefineComponent<{}, {}, any>
  export const Document: DefineComponent<{}, {}, any>
  export const ShoppingCart: DefineComponent<{}, {}, any>
  export const Operation: DefineComponent<{}, {}, any>
  export const Lock: DefineComponent<{}, {}, any>
  export const Refresh: DefineComponent<{}, {}, any>
  export const QuestionFilled: DefineComponent<{}, {}, any>
  // 可以根据需要添加其他图标组件
}

// 解决 store 模块路径解析问题
declare module '@/store/modules/app' {
  export const useAppStore: any
}

// 解决 constants 模块路径解析问题
declare module '@/constants' {
  export const ROUTE_NAMES: any
  export const API_CONSTANTS: any
  export const STORAGE_KEYS: any
  export const DEFAULT_CONFIG: any
  export const HTTP_STATUS: any
  export const COMPONENT_SIZE: any
  export const COMMON_CONSTANTS: any
}

// 解决 vue-router 模块声明问题
declare module 'vue-router' {
  export * from 'vue-router'
  export const createRouter: any
  export const createWebHistory: any
  export const useRouter: any
  export const useRoute: any
  export type RouteRecordRaw = any
}

// 解决 store 模块路径解析问题
declare module '@/store/modules/user' {
  export const useUserStore: any
}
