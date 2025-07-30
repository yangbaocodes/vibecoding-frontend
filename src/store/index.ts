/**
 * Pinia Store Configuration
 */

import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出所有store模块
export * from './modules/app'
export * from './modules/user'
export * from './modules/theme'