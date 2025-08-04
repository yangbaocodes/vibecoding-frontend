<template>
  <div class="login-form">
    <div class="form-header">
      <h2 class="form-title">{{ $t('auth.login') }}</h2>
      <p class="form-subtitle">{{ $t('app.welcome') }}</p>
    </div>

    <ElForm ref="formRef" :model="formData" :rules="formRules" @keyup.enter="handleLogin">
      <ElFormItem prop="username">
        <ElInput
          v-model="formData.username"
          :placeholder="$t('auth.username')"
          size="large"
          :prefix-icon="User"
          clearable
        />
      </ElFormItem>

      <ElFormItem prop="password">
        <ElInput
          v-model="formData.password"
          type="password"
          :placeholder="$t('auth.password')"
          size="large"
          :prefix-icon="Lock"
          show-password
          clearable
        />
      </ElFormItem>

      <ElFormItem>
        <div class="form-options">
          <ElCheckbox v-model="formData.rememberMe">
            {{ $t('auth.rememberMe') }}
          </ElCheckbox>
          <ElLink type="primary" underline="never">
            {{ $t('auth.forgotPassword') }}
          </ElLink>
        </div>
      </ElFormItem>

      <ElFormItem>
        <ElButton
          type="primary"
          size="large"
          :loading="loading"
          @click="handleLogin"
          class="login-button"
        >
          {{ $t('auth.login') }}
        </ElButton>
      </ElFormItem>
    </ElForm>

    <div class="form-footer">
      <ElDivider>{{ $t('or') }}</ElDivider>
      <p class="register-link">
        {{ $t("Don't have an account?") }}
        <ElLink type="primary" underline="never">
          {{ $t('auth.register') }}
        </ElLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: t('auth.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: 'Username must be 3-20 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('auth.passwordTooShort'), trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    await userStore.login({
      username: formData.username,
      password: formData.password
    })

    ElMessage.success(t('auth.loginSuccess'))

    // 直接跳转到dashboard
    router.replace('/converter')
  } catch (error: any) {
    console.error('Login failed:', error)

    if (error.response?.status === 401) {
      ElMessage.error(t('auth.invalidCredentials'))
    } else {
      ElMessage.error(error.message || t('auth.loginFailed'))
    }
  } finally {
    loading.value = false
  }
}

// 开发环境自动填充（可选）
if (import.meta.env.DEV) {
  formData.username = 'admin'
  formData.password = '123456'
}
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: $spacing-xl;
}

.form-title {
  font-size: $font-size-extra-large * 1.5;
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: $spacing-sm;
}

.form-subtitle {
  color: var(--text-color-secondary);
  font-size: $font-size-base;
  margin: 0;
}

.form-options {
  @include flex(row, space-between, center);
  width: 100%;
  margin-bottom: $spacing-sm;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: $font-size-medium;
  font-weight: 500;
}

.form-footer {
  margin-top: $spacing-xl;
  text-align: center;
}

.register-link {
  margin: $spacing-md 0 0 0;
  color: var(--text-color-secondary);
  font-size: $font-size-small;
}

:deep(.el-form-item) {
  margin-bottom: $spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-input__wrapper) {
  padding: 12px 16px;
  border-radius: $border-radius-md;
}

:deep(.el-checkbox__label) {
  font-size: $font-size-small;
  color: var(--text-color-regular);
}

// 响应式调整
@include respond-to(xs) {
  .login-form {
    padding: 0 $spacing-sm;
  }

  .form-title {
    font-size: $font-size-extra-large * 1.25;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-sm;
  }
}
</style>
