/**
 * Storage Utilities
 */

class Storage {
  private storage: globalThis.Storage

  constructor(storage: globalThis.Storage) {
    this.storage = storage
  }

  /**
   * 设置存储项
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      this.storage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`Error setting storage item ${key}:`, error)
    }
  }

  /**
   * 获取存储项
   */
  getItem<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key)
      if (item === null) return null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error getting storage item ${key}:`, error)
      return null
    }
  }

  /**
   * 移除存储项
   */
  removeItem(key: string): void {
    try {
      this.storage.removeItem(key)
    } catch (error) {
      console.error(`Error removing storage item ${key}:`, error)
    }
  }

  /**
   * 清空存储
   */
  clear(): void {
    try {
      this.storage.clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  /**
   * 获取所有键
   */
  getAllKeys(): string[] {
    try {
      const keys: string[] = []
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i)
        if (key) keys.push(key)
      }
      return keys
    } catch (error) {
      console.error('Error getting all storage keys:', error)
      return []
    }
  }

  /**
   * 检查键是否存在
   */
  hasKey(key: string): boolean {
    return this.storage.getItem(key) !== null
  }

  /**
   * 获取存储大小（字节）
   */
  getSize(): number {
    try {
      let size = 0
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i)
        if (key) {
          const value = this.storage.getItem(key)
          if (value) {
            size += key.length + value.length
          }
        }
      }
      return size
    } catch (error) {
      console.error('Error calculating storage size:', error)
      return 0
    }
  }
}

// 创建localStorage和sessionStorage实例
export const localStorage = new Storage(window.localStorage)
export const sessionStorage = new Storage(window.sessionStorage)

// 默认导出localStorage
export default localStorage
