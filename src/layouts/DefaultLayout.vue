<template>
  <div class="layout">
    <!-- 头部 -->
    <header class="layout__header">
      <div class="header-left">
        <!-- <ElButton :icon="sidebarCollapsed ? 'Expand' : 'Fold'" link @click="toggleSidebar" /> -->
        <h1 class="header-title">Cognizant Resume Format</h1>
      </div>
      <div class="header-right">
        <!-- <LanguageSelector /> -->
        <!-- <ThemeToggle /> -->
        <UserMenu />
      </div>
    </header>

    <!-- 侧边栏 -->
    <!-- <aside :class="['layout__sidebar', { 'layout__sidebar--collapsed': sidebarCollapsed }]">
      <SidebarMenu />
    </aside> -->

    <!-- 主内容区 -->
    <main>
      <ElScrollbar>
        <RouterView />
      </ElScrollbar>
    </main>

    <!-- 移动端遮罩 -->
    <div
      v-if="isMobile && !sidebarCollapsed"
      class="layout__overlay"
      @click="setSidebarCollapsed(true)"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
//import SidebarMenu from '@/components/layout/SidebarMenu.vue'
//import LanguageSelector from '@/components/layout/LanguageSelector.vue'
//import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import UserMenu from '@/components/layout/UserMenu.vue'

const appStore = useAppStore()

const { sidebarCollapsed, isMobile, setSidebarCollapsed } = appStore
</script>

<style lang="scss" scoped>
.header-left {
  @include flex(row, flex-start, center);
  gap: $spacing-md;
}

.header-right {
  @include flex(row, flex-end, center);
  gap: $spacing-sm;
}

.header-title {
  font-size: $font-size-large;
  font-weight: 500;
  color: var(--text-color-primary);
  margin: 0;
}

.layout__overlay {
  position: fixed;
  top: $header-height;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $z-index-modal-backdrop;
}

@include respond-to(xs) {
  .layout__sidebar {
    transform: translateX(-100%);

    &:not(.layout__sidebar--collapsed) {
      transform: translateX(0);
    }
  }

  .layout__content {
    //margin-left: 0 !important;
  }
}
</style>
