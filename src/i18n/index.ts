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

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_CONFIG.LANGUAGE,
  fallbackLocale: 'en',
  messages,
  globalInjection: true
})

export default i18n
