/**
 * 用户偏好设置枚举和常量
 */

// 语言偏好设置枚举
export enum LanguagePreference {
  ENGLISH = 'English',
  CHINESE = 'Chinese'
}

// 模板偏好设置枚举
export enum TemplatePreference {
  WORD = 'Word',
  PPT = 'PPT'
}

// 偏好设置默认值
export const DEFAULT_PREFERENCES = {
  LANGUAGE: LanguagePreference.ENGLISH,
  TEMPLATE: TemplatePreference.WORD
} as const
