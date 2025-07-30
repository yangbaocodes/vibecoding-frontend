<template>
  <div class="quick-actions">
    <div v-if="actions.length === 0" class="empty">
      <ElIcon :size="48" color="var(--text-color-secondary)">
        <Operation />
      </ElIcon>
      <p class="empty__text">{{ $t('No quick actions available') }}</p>
    </div>

    <div v-else class="quick-actions__grid">
      <div
        v-for="action in actions"
        :key="action.id"
        class="action-item"
        @click="handleActionClick(action)"
      >
        <div class="action-item__icon" :style="{ backgroundColor: getIconBgColor(action.color) }">
          <ElIcon :color="action.color" :size="24">
            <component :is="action.icon" />
          </ElIcon>
        </div>

        <div class="action-item__content">
          <div class="action-item__title">{{ action.title }}</div>
          <div class="action-item__description">{{ action.description }}</div>
        </div>

        <div class="action-item__arrow">
          <ElIcon color="var(--text-color-placeholder)">
            <ArrowRight />
          </ElIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Operation, ArrowRight } from '@element-plus/icons-vue'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  color: string
  action: () => void
}

interface Props {
  actions: QuickAction[]
}

defineProps<Props>()

// 获取图标背景色
const getIconBgColor = (color: string) => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgba(${r}, ${g}, ${b}, 0.1)`
}

// 处理操作点击
const handleActionClick = (action: QuickAction) => {
  if (action.action && typeof action.action === 'function') {
    action.action()
  }
}
</script>

<style lang="scss" scoped>
.quick-actions {
  height: 100%;

  &__grid {
    display: grid;
    gap: $spacing-md;
  }
}

.action-item {
  @include flex(row, flex-start, center);
  gap: $spacing-md;
  padding: $spacing-md;
  border: 1px solid var(--border-color-lighter);
  border-radius: $border-radius-md;
  cursor: pointer;
  @include transition(all);

  &:hover {
    border-color: var(--border-color);
    box-shadow: $box-shadow-light;
    transform: translateY(-1px);

    .action-item__arrow {
      transform: translateX(2px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: $border-radius-lg;
    @include flex(row, center, center);
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: $font-size-base;
    font-weight: 500;
    color: var(--text-color-primary);
    margin-bottom: $spacing-xs;
    @include ellipsis(1);
  }

  &__description {
    font-size: $font-size-small;
    color: var(--text-color-secondary);
    @include ellipsis(2);
  }

  &__arrow {
    flex-shrink: 0;
    @include transition(transform);

    .el-icon {
      font-size: 16px;
    }
  }
}

.empty {
  @include flex(column, center, center);
  padding: $spacing-xxl;
  text-align: center;

  &__text {
    margin-top: $spacing-md;
    color: var(--text-color-secondary);
    font-size: $font-size-base;
  }
}

// 响应式调整
@include respond-to(xs) {
  .action-item {
    padding: $spacing-sm;
    gap: $spacing-sm;

    &__icon {
      width: 40px;
      height: 40px;

      .el-icon {
        font-size: 20px !important;
      }
    }

    &__title {
      font-size: $font-size-small;
    }

    &__description {
      font-size: $font-size-extra-small;
    }
  }
}
</style>
