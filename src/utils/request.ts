/**
 * HTTP Request Utilities
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { API_CONSTANTS, STORAGE_KEYS, HTTP_STATUS } from '@/constants'
import { localStorage } from '@/utils/storage'
import type { ApiResponse } from '@/types'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: API_CONSTANTS.BASE_URL,
  timeout: API_CONSTANTS.TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证token
    const token = localStorage.getItem<string>(STORAGE_KEYS.TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加时间戳防止缓存
    if (config.method === 'get' && config.params) {
      config.params._t = Date.now()
    }

    return config
  },
  error => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): any => {
    const { data } = response

    // 如果是文件下载，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    // 检查业务状态码
    if (data.code === HTTP_STATUS.OK) {
      return data.data
    } else {
      // 处理业务错误
      ElMessage.error(data.message || 'Request failed')
      return Promise.reject(new Error(data.message || 'Request failed'))
    }
  },
  error => {
    console.error('Response interceptor error:', error)

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          ElMessageBox.confirm(
            'Your session has expired. Please log in again.',
            'Session Expired',
            {
              confirmButtonText: 'Re-login',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }
          ).then(() => {
            localStorage.removeItem(STORAGE_KEYS.TOKEN)
            localStorage.removeItem(STORAGE_KEYS.USER_INFO)
            window.location.reload()
          })
          break
        case HTTP_STATUS.FORBIDDEN:
          ElMessage.error('Access denied')
          break
        case HTTP_STATUS.NOT_FOUND:
          ElMessage.error('Resource not found')
          break
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          ElMessage.error('Server error')
          break
        default:
          ElMessage.error(data?.message || `Request failed with status ${status}`)
      }
    } else if (error.request) {
      ElMessage.error('Network error, please check your connection')
    } else {
      ElMessage.error('Request configuration error')
    }

    return Promise.reject(error)
  }
)

// 请求重试机制
const retryRequest = async (
  config: AxiosRequestConfig,
  retryCount: number = API_CONSTANTS.RETRY_COUNT
) => {
  try {
    return await service(config)
  } catch (error) {
    if (retryCount > 1) {
      console.warn(
        `Request failed, retrying... (${API_CONSTANTS.RETRY_COUNT - retryCount + 1}/${API_CONSTANTS.RETRY_COUNT})`
      )
      await new Promise(resolve => setTimeout(resolve, 1000))
      return retryRequest(config, retryCount - 1)
    }
    throw error
  }
}

// 封装请求方法
class Request {
  /**
   * GET请求
   */
  static get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return service.get(url, { params, ...config })
  }

  /**
   * POST请求
   */
  static post<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return service.post(url, data, config)
  }

  /**
   * PUT请求
   */
  static put<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return service.put(url, data, config)
  }

  /**
   * DELETE请求
   */
  static delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.delete(url, config)
  }

  /**
   * PATCH请求
   */
  static patch<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return service.patch(url, data, config)
  }

  /**
   * 文件上传
   */
  static upload<T = any>(
    url: string,
    file: File | FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }

    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  }

  /**
   * 文件下载
   */
  static download(url: string, params?: Record<string, any>, filename?: string): Promise<void> {
    return service
      .get(url, {
        params,
        responseType: 'blob'
      })
      .then((response: AxiosResponse) => {
        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      })
  }
}

export default Request
export { service, retryRequest }
