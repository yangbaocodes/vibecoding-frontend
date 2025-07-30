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
  // 可以根据需要添加其他图标组件
}

// 解决 store 模块路径解析问题
declare module '@/store/modules/app' {
  export const useAppStore: any
}