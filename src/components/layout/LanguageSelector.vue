<template>
  <ElDropdown trigger="click" @command="handleLanguageChange">
    <ElButton link class="language-selector">
      <ElIcon><Switch /></ElIcon>
      <span class="language-text">{{ currentLanguageLabel }}</span>
    </ElButton>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="lang in languages"
          :key="lang.value"
          :command="lang.value"
          :class="{ 'is-active': currentLanguage === lang.value }"
        >
          <span class="language-item">
            <span class="language-flag">{{ lang.flag }}</span>
            <span class="language-label">{{ lang.label }}</span>
          </span>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Switch } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'

const { locale } = useI18n()
const appStore = useAppStore()

const { currentLanguage, setLanguage } = appStore

// 支持的语言列表
const languages = [
  {
    value: 'en',
    label: 'English',
    flag: '🇺🇸'
  },
  {
    value: 'zh',
    label: '中文',
    flag: '🇨🇳'
  }
]

// 当前语言标签
const currentLanguageLabel = computed(() => {
  const lang = languages.find(item => item.value === currentLanguage)
  return lang?.label || 'English'
})

// 处理语言切换
const handleLanguageChange = (langValue: string) => {
  setLanguage(langValue)
  locale.value = langValue
  
  // 可以在这里添加其他语言切换后的逻辑
  // 比如重新加载某些数据、更新页面标题等
}
</script>

<style lang="scss" scoped>
.language-selector {
  @include flex(row, center, center);
  gap: $spacing-xs;
  height: 32px;
  padding: 0 $spacing-sm;
  color: var(--text-color-regular);
  @include transition(color);

  &:hover {
    color: $primary-color;
  }

  .language-text {
    font-size: $font-size-small;
    
    @include respond-to(xs) {
      display: none;
    }
  }
}

:deep(.el-dropdown-menu__item) {
  padding: $spacing-sm $spacing-md;

  &.is-active {
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
  }

  &:hover {
    background-color: rgba($primary-color, 0.06);
  }
}

.language-item {
  @include flex(row, flex-start, center);
  gap: $spacing-sm;
  width: 100%;
}

.language-flag {
  font-size: $font-size-base;
}

.language-label {
  font-size: $font-size-small;
}
</style>