/**
 * 主题状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS, DEFAULT_CONFIG } from '@/constants'
import { localStorage } from '@/utils/storage'

export type ThemeType = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const theme = ref<ThemeType>(
    localStorage.getItem<ThemeType>(STORAGE_KEYS.THEME) || (DEFAULT_CONFIG.THEME as ThemeType)
  )
  const primaryColor = ref('#409eff')

  // Getters
  const currentTheme = computed(() => theme.value)
  const isDark = computed(() => {
    if (theme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })

  // Actions
  const setTheme = (newTheme: ThemeType) => {
    theme.value = newTheme
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
    applyTheme()
  }

  const setPrimaryColor = (color: string) => {
    primaryColor.value = color
    document.documentElement.style.setProperty('--el-color-primary', color)
  }

  const applyTheme = () => {
    const htmlElement = document.documentElement

    if (isDark.value) {
      htmlElement.classList.add('dark')
      htmlElement.classList.remove('light')
    } else {
      htmlElement.classList.add('light')
      htmlElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const initTheme = () => {
    applyTheme()

    // 监听系统主题变化
    if (theme.value === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', applyTheme)
    }
  }

  return {
    // State
    theme,
    primaryColor,

    // Getters
    currentTheme,
    isDark,

    // Actions
    setTheme,
    setPrimaryColor,
    applyTheme,
    toggleTheme,
    initTheme
  }
})
