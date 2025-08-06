/**
 * Application Constants
 */

// API相关常量
export const API_CONSTANTS = {
  BASE_URL: import.meta.env.VITE_APP_BASE_API || 'https://vibecoding-api.aistudio.ltd/api',
  TIMEOUT: 10000,
  RETRY_COUNT: 3
} as const

// 存储键常量
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  LANGUAGE_PREFERENCES: 'app_language_preferences',
  TEMPLATE_PREFERENCES: 'app_template_preferences',
  LANGUAGE: 'app_language',
  THEME: 'app_theme'
} as const

// 路由常量
export const ROUTE_NAMES = {
  HOME: 'Home',
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard',
  CONVERTER: 'Converter',
  NOT_FOUND: 'NotFound'
} as const

// 默认配置常量
export const DEFAULT_CONFIG = {
  LANGUAGE: 'en',
  THEME: 'light',
  PAGE_SIZE: 20
} as const

// HTTP状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const

// 组件尺寸常量
export const COMPONENT_SIZE = {
  LARGE: 'large',
  DEFAULT: 'default',
  SMALL: 'small'
} as const

// 通用常量
export const COMMON_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
} as const

// 用户偏好设置
export { LanguagePreference, TemplatePreference, DEFAULT_PREFERENCES } from './preferences'
