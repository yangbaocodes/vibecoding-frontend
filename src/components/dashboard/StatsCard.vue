<template>
  <div class="stats-card" :class="`stats-card--${color.replace('#', '')}`">
    <div class="stats-card__content">
      <div class="stats-card__info">
        <div class="stats-card__value">{{ value }}</div>
        <div class="stats-card__title">{{ title }}</div>
        <div v-if="trend" class="stats-card__trend" :class="trendClass">
          <ElIcon><component :is="trendIcon" /></ElIcon>
          <span>{{ trend.value }}%</span>
        </div>
      </div>
      <div class="stats-card__icon" :style="{ backgroundColor: iconBgColor }">
        <ElIcon :color="color" :size="24">
          <component :is="icon" />
        </ElIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

interface Props {
  title: string
  value: string | number
  icon: string
  color: string
  trend?: {
    value: number
    isUp: boolean
  }
}

const props = defineProps<Props>()

// 趋势图标
const trendIcon = computed(() => {
  return props.trend?.isUp ? ArrowUp : ArrowDown
})

// 趋势样式类
const trendClass = computed(() => {
  if (!props.trend) return ''
  return props.trend.isUp ? 'stats-card__trend--up' : 'stats-card__trend--down'
})

// 图标背景色
const iconBgColor = computed(() => {
  // 将颜色转换为带透明度的背景色
  const hex = props.color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgba(${r}, ${g}, ${b}, 0.1)`
})
</script>

<style lang="scss" scoped>
.stats-card {
  @include card($spacing-lg, $border-radius-lg, $box-shadow-light);
  @include transition(all);
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $box-shadow-dark;
  }

  &__content {
    @include flex(row, space-between, flex-start);
  }

  &__info {
    flex: 1;
  }

  &__value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-color-primary);
    line-height: 1;
    margin-bottom: $spacing-xs;

    @include respond-to(xs) {
      font-size: 1.75rem;
    }
  }

  &__title {
    font-size: $font-size-base;
    color: var(--text-color-secondary);
    margin-bottom: $spacing-sm;
    font-weight: 500;
  }

  &__trend {
    @include flex(row, flex-start, center);
    gap: $spacing-xs;
    font-size: $font-size-small;
    font-weight: 500;

    &--up {
      color: $success-color;
    }

    &--down {
      color: $danger-color;
    }

    .el-icon {
      font-size: 14px;
    }
  }

  &__icon {
    width: 60px;
    height: 60px;
    border-radius: $border-radius-lg;
    @include flex(row, center, center);
    flex-shrink: 0;

    @include respond-to(xs) {
      width: 50px;
      height: 50px;

      .el-icon {
        font-size: 20px !important;
      }
    }
  }
}

// 响应式调整
@include respond-to(xs) {
  .stats-card {
    &__content {
      gap: $spacing-sm;
    }

    &__title {
      font-size: $font-size-small;
    }

    &__trend {
      font-size: $font-size-extra-small;
    }
  }
}
</style>
