<template>
  <div class="not-found">
    <div class="not-found__container">
      <div class="not-found__illustration">
        <div class="error-code">404</div>
        <div class="error-animation">
          <ElIcon :size="120" color="var(--text-color-secondary)">
            <QuestionFilled />
          </ElIcon>
        </div>
      </div>
      
      <div class="not-found__content">
        <h1 class="error-title">{{ $t('error.404') }}</h1>
        <p class="error-description">
          {{ $t('The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.') }}
        </p>
        
        <div class="error-actions">
          <ElButton type="primary" @click="goHome">
            <ElIcon><House /></ElIcon>
            {{ $t('Go to Homepage') }}
          </ElButton>
          <ElButton @click="goBack">
            <ElIcon><ArrowLeft /></ElIcon>
            {{ $t('common.back') }}
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { House, ArrowLeft, QuestionFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { ROUTE_NAMES } from '@/constants'

const router = useRouter()
const { t } = useI18n()

// 回到首页
const goHome = () => {
  router.push({ name: ROUTE_NAMES.DASHBOARD })
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.not-found {
  min-height: 100vh;
  @include flex(column, center, center);
  padding: $spacing-xl;
  background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-color, 0.02) 100%);

  &__container {
    text-align: center;
    max-width: 600px;
  }

  &__illustration {
    position: relative;
    margin-bottom: $spacing-xl;
  }

  &__content {
    // 内容样式
  }
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: var(--text-color-secondary);
  opacity: 0.3;
  line-height: 1;
  margin-bottom: $spacing-lg;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;

  @include respond-to(xs) {
    font-size: 6rem;
  }
}

.error-animation {
  animation: bounce 2s ease-in-out infinite;
}

.error-title {
  font-size: $font-size-extra-large * 1.5;
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: $spacing-md;

  @include respond-to(xs) {
    font-size: $font-size-extra-large * 1.25;
  }
}

.error-description {
  font-size: $font-size-base;
  color: var(--text-color-regular);
  line-height: 1.6;
  margin-bottom: $spacing-xl;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  @include flex(row, center, center);
  gap: $spacing-md;
  flex-wrap: wrap;

  .el-button {
    @include flex(row, center, center);
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-base;
  }
}

// 动画效果
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

// 响应式调整
@include respond-to(xs) {
  .not-found {
    padding: $spacing-lg $spacing-md;

    &__container {
      width: 100%;
    }
  }

  .error-actions {
    flex-direction: column;
    width: 100%;

    .el-button {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>