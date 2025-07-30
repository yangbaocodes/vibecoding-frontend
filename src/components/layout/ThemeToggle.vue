<template>
  <ElTooltip
    :content="$t(isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode')"
    placement="bottom"
  >
    <ElButton link class="theme-toggle" @click="toggleTheme">
      <ElIcon :class="{ 'rotate-animation': isToggling }">
        <Sunny v-if="!isDark" />
        <Moon v-else />
      </ElIcon>
    </ElButton>
  </ElTooltip>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()
const { isDark, toggleTheme: storeToggleTheme, initTheme } = themeStore

const isToggling = ref(false)

// 切换主题
const toggleTheme = async () => {
  if (isToggling.value) return

  isToggling.value = true

  // 添加过渡动画效果
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'

  storeToggleTheme()

  // 动画结束后移除过渡效果
  setTimeout(() => {
    document.documentElement.style.transition = ''
    isToggling.value = false
  }, 300)
}

onMounted(() => {
  initTheme()
})
</script>

<style lang="scss" scoped>
.theme-toggle {
  @include flex(row, center, center);
  height: 32px;
  width: 32px;
  padding: 0;
  color: var(--text-color-regular);
  @include transition(color);

  &:hover {
    color: $primary-color;
  }

  .el-icon {
    font-size: 18px;
    @include transition(transform);
  }

  .rotate-animation {
    animation: rotateTheme 0.3s ease-in-out;
  }
}

@keyframes rotateTheme {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

// 暗色主题特定样式
.dark .theme-toggle {
  &:hover {
    color: #ffd700; // 月亮图标使用金色
  }
}
</style>
