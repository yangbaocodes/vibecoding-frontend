/**
 * 国际化工具函数
 */

import { useI18n } from 'vue-i18n'

/**
 * 安全的国际化使用函数
 * 确保在生产环境中不会因为国际化问题导致白屏
 */
export function useSafeI18n() {
  try {
    const i18n = useI18n()
    return {
      t: i18n.t,
      locale: i18n.locale,
      availableLocales: i18n.availableLocales
    }
  } catch (error) {
    console.warn('I18n not available, using fallback:', error)
    // 返回一个安全的回退函数
    return {
      t: (key: string) => key,
      locale: { value: 'en' },
      availableLocales: ['en']
    }
  }
}

/**
 * 获取翻译文本的安全方法
 * @param key 翻译键
 * @param defaultValue 默认值
 * @returns 翻译文本或默认值
 */
export function getTranslation(key: string, defaultValue?: string): string {
  try {
    const { t } = useSafeI18n()
    const result = t(key)
    return result !== key ? result : defaultValue || key
  } catch (error) {
    console.warn(`Translation failed for key: ${key}`, error)
    return defaultValue || key
  }
}
