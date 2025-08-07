/**
 * 国际化配置
 */

import { createI18n } from 'vue-i18n'
import { DEFAULT_CONFIG } from '@/constants'
import en from './locales/en.json'
import zh from './locales/zh.json'

const messages = {
  en,
  zh
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_CONFIG.LANGUAGE,
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  // 生产环境兼容性配置
  allowComposition: true,
  useScope: 'global',
  // 添加错误处理
  missingWarn: false,
  fallbackWarn: false
})

export default i18n
