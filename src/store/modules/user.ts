/**
 * 用户状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api'
import { STORAGE_KEYS } from '@/constants'
import { localStorage } from '@/utils/storage'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem<string>(STORAGE_KEYS.TOKEN))
  const userInfo = ref<User | null>(localStorage.getItem<User>(STORAGE_KEYS.USER_INFO))

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => userInfo.value)
  const userRoles = computed(() => userInfo.value?.role?.split(',') || [])

  // Actions
  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
    }
  }

  const setUserInfo = (user: User | null) => {
    userInfo.value = user
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER_INFO, user)
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_INFO)
    }
  }

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await userApi.login(credentials)
      const { token: newToken, user } = response.data

      setToken(newToken)
      setUserInfo(user)

      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await userApi.logout()
    } catch (error) {
      console.error('Logout API failed:', error)
    } finally {
      setToken(null)
      setUserInfo(null)
    }
  }

  const getUserInfo = async () => {
    try {
      const response = await userApi.getUserInfo()
      setUserInfo(response.data)
      return response
    } catch (error) {
      console.error('Get user info failed:', error)
      // 如果获取用户信息失败，清除本地存储
      setToken(null)
      setUserInfo(null)
      throw error
    }
  }

  const updateUserInfo = async (userData: Partial<User>) => {
    try {
      const response = await userApi.updateUserInfo(userData)
      setUserInfo(response.data)
      return response
    } catch (error) {
      console.error('Update user info failed:', error)
      throw error
    }
  }

  const hasRole = (role: string) => {
    return userRoles.value.includes(role)
  }

  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => userRoles.value.includes(role))
  }

  const hasAllRoles = (roles: string[]) => {
    return roles.every(role => userRoles.value.includes(role))
  }

  return {
    // State
    token,
    userInfo,

    // Getters
    isAuthenticated,
    currentUser,
    userRoles,

    // Actions
    setToken,
    setUserInfo,
    login,
    logout,
    getUserInfo,
    updateUserInfo,
    hasRole,
    hasAnyRole,
    hasAllRoles
  }
})