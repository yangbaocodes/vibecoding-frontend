/**
 * Vue Router Configuration
 */

import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from '@/constants'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    redirect: '/dashboard',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: ROUTE_NAMES.DASHBOARD,
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
          icon: 'House'
        }
      },
      {
        path: '/reports',
        name: 'REPORTS',
        component: () => import('@/views/reports/index.vue'),
        meta: {
          title: 'Reports',
          requiresAuth: true,
          icon: 'Document'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '/auth/login',
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/views/auth/Login.vue'),
        meta: {
          title: 'Login',
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: '/404',
    name: ROUTE_NAMES.NOT_FOUND,
    component: () => import('@/views/error/NotFound.vue'),
    meta: {
      title: 'Page Not Found'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to: any, _from: any, savedPosition: any) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  const userStore = useUserStore()
  const appStore = useAppStore()

  // 开始加载
  appStore.setLoading(true)

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - VibeCoding`
  }

  // 开发环境：跳过所有认证检查
  // if (import.meta.env.DEV) {
  //   console.warn('🚫 开发模式：已跳过认证检查')
  //   next()
  //   return
  // }

  // 检查是否需要认证
  if (to.meta?.requiresAuth) {
    if (!userStore.isAuthenticated) {
      next({
        name: ROUTE_NAMES.LOGIN,
        query: { redirect: to.fullPath }
      })
      return
    }

    // 如果已登录但没有用户信息，尝试获取
    if (!userStore.currentUser) {
      try {
        await userStore.getUserInfo()
      } catch (error) {
        next({
          name: ROUTE_NAMES.LOGIN,
          query: { redirect: to.fullPath }
        })
        return
      }
    }

    // 检查角色权限
    if (to.meta?.roles && Array.isArray(to.meta.roles)) {
      if (!userStore.hasAnyRole(to.meta.roles)) {
        // 没有权限，跳转到首页或403页面
        next({ name: ROUTE_NAMES.DASHBOARD })
        return
      }
    }
  }

  // 如果已登录用户访问登录页，重定向到首页
  if (to.name === ROUTE_NAMES.LOGIN && userStore.isAuthenticated) {
    next({ name: ROUTE_NAMES.DASHBOARD })
    return
  }

  next()
})

// 全局后置守卫
router.afterEach(() => {
  const appStore = useAppStore()
  // 结束加载
  appStore.setLoading(false)
})

export default router
