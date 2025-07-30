/**
 * 应用状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS, DEFAULT_CONFIG } from '@/constants'
import { localStorage } from '@/utils/storage'

export const useAppStore = defineStore('app', () => {
  // 状态
  const loading = ref(false)
  const language = ref(
    localStorage.getItem<string>(STORAGE_KEYS.LANGUAGE) || DEFAULT_CONFIG.LANGUAGE
  )
  const sidebarCollapsed = ref(false)
  const deviceType = ref<'desktop' | 'tablet' | 'mobile'>('desktop')

  // Getters
  const isLoading = computed(() => loading.value)
  const currentLanguage = computed(() => language.value)
  const isSidebarCollapsed = computed(() => sidebarCollapsed.value)
  const isMobile = computed(() => deviceType.value === 'mobile')

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setLanguage = (lang: string) => {
    language.value = lang
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang)
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  const setDeviceType = (type: 'desktop' | 'tablet' | 'mobile') => {
    deviceType.value = type
  }

  const initializeApp = () => {
    // 检测设备类型
    const width = window.innerWidth
    if (width < 768) {
      setDeviceType('mobile')
      setSidebarCollapsed(true)
    } else if (width < 1024) {
      setDeviceType('tablet')
    } else {
      setDeviceType('desktop')
    }

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType('mobile')
        setSidebarCollapsed(true)
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    })
  }

  return {
    // State
    loading,
    language,
    sidebarCollapsed,
    deviceType,

    // Getters
    isLoading,
    currentLanguage,
    isSidebarCollapsed,
    isMobile,

    // Actions
    setLoading,
    setLanguage,
    toggleSidebar,
    setSidebarCollapsed,
    setDeviceType,
    initializeApp
  }
})
