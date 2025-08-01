<template>
  <div class="sidebar-menu">
    <ElScrollbar>
      <ElMenu
        :default-active="activeMenu"
        :collapse="sidebarCollapsed"
        :unique-opened="true"
        mode="vertical"
        router
        @select="handleMenuSelect"
      >
        <template v-for="item in menuItems" :key="item.path">
          <ElMenuItem v-if="!item.children || item.children.length === 0" :index="item.path">
            <ElIcon v-if="item.icon">
              <component :is="item.icon" />
            </ElIcon>
            <template #title>{{ $t(item.meta?.title || item.name) }}</template>
          </ElMenuItem>

          <ElSubMenu v-else :index="item.path">
            <template #title>
              <ElIcon v-if="item.icon">
                <component :is="item.icon" />
              </ElIcon>
              <span>{{ $t(item.meta?.title || item.name) }}</span>
            </template>
            <ElMenuItem v-for="child in item.children" :key="child.path" :index="child.path">
              <ElIcon v-if="child.icon">
                <component :is="child.icon" />
              </ElIcon>
              <template #title>{{ $t(child.meta?.title || child.name) }}</template>
            </ElMenuItem>
          </ElSubMenu>
        </template>
      </ElMenu>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import type { MenuItem } from '@/types'

const route = useRoute()
const appStore = useAppStore()

const { sidebarCollapsed } = appStore

// 菜单项配置
const menuItems: MenuItem[] = [
  {
    id: 'converter',
    name: 'Converter',
    path: '/converter',
    icon: 'Upload',
    meta: {
      title: 'navigation.converter',
      requiresAuth: true
    }
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'House',
    meta: {
      title: 'navigation.dashboard',
      requiresAuth: true
    }
  }
  // 这里可以添加更多菜单项
]

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  console.log('Menu selected:', index)
}
</script>

<style lang="scss" scoped>
.sidebar-menu {
  height: 100%;

  :deep(.el-menu) {
    border-right: none;
    background-color: var(--bg-color);

    .el-menu-item,
    .el-sub-menu__title {
      height: 50px;
      line-height: 50px;
      color: var(--text-color-regular);
      @include transition(all);

      &:hover {
        background-color: rgba($primary-color, 0.06);
        color: $primary-color;
      }

      &.is-active {
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 3px;
          height: 100%;
          background-color: $primary-color;
        }
      }
    }

    .el-menu-item-group__title {
      padding: 7px 0 7px 20px;
      font-size: $font-size-small;
      color: var(--text-color-secondary);
    }

    .el-sub-menu {
      .el-menu-item {
        min-width: 0;
        background-color: transparent !important;

        &:hover {
          background-color: rgba($primary-color, 0.06) !important;
        }

        &.is-active {
          background-color: rgba($primary-color, 0.1) !important;
        }
      }
    }

    // 折叠状态样式
    &.el-menu--collapse {
      width: $sidebar-collapsed-width;

      .el-menu-item,
      .el-sub-menu__title {
        padding: 0 !important;
        text-align: center;

        .el-icon {
          margin-right: 0;
        }
      }

      .el-sub-menu {
        .el-sub-menu__title {
          .el-sub-menu__icon-arrow {
            display: none;
          }
        }
      }
    }
  }

  :deep(.el-scrollbar__bar.is-vertical) {
    right: 0;
    width: 6px;

    .el-scrollbar__thumb {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}

// 暗色主题适配
.dark {
  :deep(.el-menu) {
    .el-menu-item,
    .el-sub-menu__title {
      &:hover {
        background-color: rgba($primary-color, 0.1);
      }

      &.is-active {
        background-color: rgba($primary-color, 0.15);
      }
    }
  }
}
</style>
