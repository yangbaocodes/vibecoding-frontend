<template>
  <div class="auth-layout">
    <div class="auth-layout__container">
      <div class="auth-layout__left">
        <div class="auth-layout__brand">
          <h1 class="brand-title">{{ $t('app.title') }}</h1>
          <p class="brand-description">{{ $t('app.description') }}</p>
        </div>
        <div class="auth-layout__illustration">
          <!-- 这里可以放置插图或图片 -->
          <div class="illustration">
            <ElIcon :size="120" color="var(--el-color-primary)">
              <User />
            </ElIcon>
          </div>
        </div>
      </div>
      <div class="auth-layout__right">
        <div class="auth-layout__form">
          <div class="form-header">
            <LanguageSelector />
            <ThemeToggle />
          </div>
          <div class="form-content">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import LanguageSelector from '@/components/layout/LanguageSelector.vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
</script>

<style lang="scss" scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba($primary-color, 0.1) 0%,
    rgba($primary-color, 0.05) 100%
  );
  @include flex(row, center, center);
  padding: $spacing-lg;

  &__container {
    width: 100%;
    max-width: 1000px;
    background: var(--bg-color);
    border-radius: $border-radius-xl;
    box-shadow: $box-shadow-dark;
    overflow: hidden;
    @include flex(row);
    min-height: 600px;
  }

  &__left {
    flex: 1;
    background: linear-gradient(
      135deg,
      $primary-color 0%,
      color-mix(in srgb, $primary-color 90%, white) 100%
    );
    color: white;
    @include flex(column, center, center);
    padding: $spacing-xxl;
    text-align: center;
  }

  &__brand {
    margin-bottom: $spacing-xl;
  }

  &__illustration {
    opacity: 0.8;
  }

  &__right {
    flex: 1;
    @include flex(column);
    position: relative;
  }

  &__form {
    flex: 1;
    @include flex(column);
    padding: $spacing-xl;
  }
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: $spacing-md;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-description {
  font-size: $font-size-large;
  opacity: 0.9;
  margin: 0;
}

.form-header {
  @include flex(row, flex-end, center);
  gap: $spacing-sm;
  margin-bottom: $spacing-xl;
}

.form-content {
  flex: 1;
  @include flex(column, center, center);
}

.illustration {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 响应式
@include respond-to(md) {
  .auth-layout {
    &__container {
      flex-direction: column;
      max-width: 500px;
    }

    &__left {
      padding: $spacing-xl $spacing-lg;
      min-height: 200px;
    }

    &__right {
      min-height: 400px;
    }
  }

  .brand-title {
    font-size: 2rem;
  }
}

@include respond-to(xs) {
  .auth-layout {
    padding: $spacing-md;

    &__container {
      min-height: auto;
    }

    &__left {
      padding: $spacing-lg;
      min-height: 150px;
    }

    &__form {
      padding: $spacing-lg;
    }
  }

  .brand-title {
    font-size: 1.75rem;
  }

  .brand-description {
    font-size: $font-size-base;
  }
}
</style>
