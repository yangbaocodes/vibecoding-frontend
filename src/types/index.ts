/**
 * Common Types
 */

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页数据类型
export interface PaginationData<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 用户类型
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
  createdAt: string
  updatedAt: string
}

// 路由元信息类型
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  icon?: string
  hidden?: boolean
}

// 菜单项类型
export interface MenuItem {
  id: string
  name: string
  path: string
  icon?: string
  children?: MenuItem[]
  meta?: RouteMeta
}

// 表单规则类型
export interface FormRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  min?: number
  max?: number
  type?: string
  validator?: (rule: any, value: any, callback: any) => void
}

// 表格列类型
export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
  formatter?: (row: any, column: any, cellValue: any, index: number) => any
}

// 通用选项类型
export interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

// HTTP请求配置类型
export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  params?: Record<string, any>
  data?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
}

// 环境变量类型
export interface EnvConfig {
  VITE_APP_TITLE: string
  VITE_APP_BASE_API: string
  VITE_APP_BASE_URL: string
}
