/**
 * API接口统一管理
 */

import Request from '@/utils/request'
import type { ApiResponse, User, LoginResponse } from '@/types'

// 用户相关API
export const userApi = {
  /**
   * 用户登录
   */
  login(data: {
    username: string
    password: string
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    return Request.post('/auth/login', data)
  },

  /**
   * 用户注册
   */
  register(data: {
    username: string
    email: string
    password: string
  }): Promise<ApiResponse<User>> {
    return Request.post('/auth/register', data)
  },

  /**
   * 获取用户信息
   */
  getUserInfo(): Promise<ApiResponse<User>> {
    return Request.get('/user/info')
  },

  /**
   * 更新用户信息
   */
  updateUserInfo(data: Partial<User>): Promise<ApiResponse<User>> {
    return Request.put('/user/info', data)
  },

  /**
   * 修改密码
   */
  changePassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<void>> {
    return Request.put('/user/password', data)
  },

  /**
   * 用户登出
   */
  logout(): Promise<ApiResponse<void>> {
    return Request.post('/auth/logout')
  },

  /**
   * 发送验证码
   */
  sendVerificationCode(data: { email: string }): Promise<ApiResponse<void>> {
    return Request.post('/auth/send-verification-code', data)
  },

  /**
   * 验证码登录或注册
   */
  loginOrRegister(data: {
    email: string
    verificationCode: string
  }): Promise<ApiResponse<LoginResponse>> {
    return Request.post('/auth/login-or-register', data)
  }
}

// 文件相关API
export const fileApi = {
  /**
   * 上传文件
   */
  upload(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
    return Request.upload('/file/upload', file)
  },

  /**
   * 下载文件
   */
  download(fileId: string, filename?: string): Promise<void> {
    return Request.download(`/file/download/${fileId}`, undefined, filename)
  },

  converter(fileUrl: string): Promise<ApiResponse<{ url: string; filename: string }>> {
    return Request.post('/resume/generate', {
      resumeUrl: fileUrl,
      responseMode: 'blocking'
    }, {
      timeout: 3 * 60 * 1000
    })
  }
}

// 通用API
export const commonApi = {
  /**
   * 获取系统配置
   */
  getSystemConfig(): Promise<ApiResponse<Record<string, any>>> {
    return Request.get('/system/config')
  },

  /**
   * 健康检查
   */
  healthCheck(): Promise<ApiResponse<{ status: string; timestamp: number }>> {
    return Request.get('/health')
  }
}

// 导出所有API
export default {
  user: userApi,
  file: fileApi,
  common: commonApi
}
