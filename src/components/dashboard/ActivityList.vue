<template>
  <div class="activity-list">
    <div v-if="activities.length === 0" class="empty">
      <ElIcon :size="48" color="var(--text-color-secondary)">
        <Document />
      </ElIcon>
      <p class="empty__text">{{ $t('No recent activities') }}</p>
    </div>

    <div v-else class="activity-list__items">
      <div v-for="activity in activities" :key="activity.id" class="activity-item">
        <div class="activity-item__icon" :class="`activity-item__icon--${activity.type}`">
          <ElIcon>
            <component :is="getActivityIcon(activity.type)" />
          </ElIcon>
        </div>

        <div class="activity-item__content">
          <div class="activity-item__title">{{ activity.title }}</div>
          <div class="activity-item__description">{{ activity.description }}</div>
        </div>

        <div class="activity-item__time">
          {{ activity.time }}
        </div>
      </div>
    </div>

    <div v-if="activities.length > 0" class="activity-list__footer">
      <ElButton link @click="handleViewAll">
        {{ $t('View all activities') }}
        <ElIcon><ArrowRight /></ElIcon>
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document, User, ShoppingCart, Setting, ArrowRight } from '@element-plus/icons-vue'

interface Activity {
  id: string
  title: string
  description: string
  time: string
  type: 'user' | 'order' | 'system' | 'default'
}

interface Props {
  activities: Activity[]
}

defineProps<Props>()

// 获取活动图标
const getActivityIcon = (type: string) => {
  const iconMap = {
    user: User,
    order: ShoppingCart,
    system: Setting,
    default: Document
  }
  return iconMap[type as keyof typeof iconMap] || iconMap.default
}

// 查看所有活动
const handleViewAll = () => {
  // 这里可以跳转到活动列表页面
  console.log('View all activities')
}
</script>

<style lang="scss" scoped>
.activity-list {
  height: 100%;
  @include flex(column);

  &__items {
    flex: 1;
    overflow-y: auto;
    @include scrollbar();
  }

  &__footer {
    padding-top: $spacing-md;
    border-top: 1px solid var(--border-color-lighter);
    text-align: center;
  }
}

.activity-item {
  @include flex(row, flex-start, flex-start);
  gap: $spacing-md;
  padding: $spacing-md 0;
  @include transition(background-color);

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color-lighter);
  }

  &:hover {
    background-color: rgba($primary-color, 0.02);
    border-radius: $border-radius-sm;
    margin: 0 - $spacing-sm;
    padding-left: $spacing-sm;
    padding-right: $spacing-sm;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    @include flex(row, center, center);
    flex-shrink: 0;

    &--user {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
    }

    &--order {
      background-color: rgba($success-color, 0.1);
      color: $success-color;
    }

    &--system {
      background-color: rgba($warning-color, 0.1);
      color: $warning-color;
    }

    &--default {
      background-color: rgba($info-color, 0.1);
      color: $info-color;
    }

    .el-icon {
      font-size: 18px;
    }
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
    @include ellipsis(1);
  }

  &__time {
    font-size: $font-size-small;
    color: var(--text-color-placeholder);
    white-space: nowrap;
    flex-shrink: 0;
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
  .activity-item {
    gap: $spacing-sm;

    &__icon {
      width: 36px;
      height: 36px;

      .el-icon {
        font-size: 16px;
      }
    }

    &__title {
      font-size: $font-size-small;
    }

    &__description {
      font-size: $font-size-extra-small;
    }

    &__time {
      font-size: $font-size-extra-small;
    }
  }
}
</style>
