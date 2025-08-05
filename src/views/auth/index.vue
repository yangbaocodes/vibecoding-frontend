<template>
  <div class="auth-page">
    <!-- 渐变背景 -->
    <div class="background-gradient">
      <!-- 主容器 -->
      <div class="auth-container">
        <!-- 左侧面板 - 背景图片区域 -->
        <div class="left-panel">
          <div class="background-image">
            <!-- 使用Figma中的截屏图片 -->
            <img src="/login-left.svg" alt="Login Background" class="screenshot-image" />
          </div>
        </div>

        <!-- 右侧面板 - 登录表单 -->
        <div class="right-panel">
          <div class="login-form-container">
            <!-- 登录标题 - 左对齐 -->
            <div class="login-header">
              <h1 class="login-title">{{ $t('auth.login') }}</h1>
            </div>

            <!-- 登录表单 -->
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
              size="large"
              @submit.prevent="handleLogin"
            >
              <!-- 邮箱输入框 -->
              <el-form-item prop="email" class="form-item">
                <div class="input-label">{{ $t('auth.email') }} :</div>
                <el-input
                  v-model="loginForm.email"
                  :placeholder="$t('auth.emailPlaceholder')"
                  size="large"
                  class="form-input"
                />
              </el-form-item>

              <!-- 验证码输入框 -->
              <el-form-item prop="verificationCode" class="form-item">
                <div class="input-label">{{ $t('auth.verificationCode') }} :</div>
                <div class="verification-input-container">
                  <el-input
                    v-model="loginForm.verificationCode"
                    :placeholder="$t('auth.verificationCodePlaceholder')"
                    size="large"
                    class="form-input verification-input"
                  >
                    <template #suffix>
                      <el-button
                        :disabled="sendCodeDisabled"
                        :loading="sendingCode"
                        text
                        type="primary"
                        class="send-code-text-button"
                        @click="handleSendCode"
                      >
                        {{ sendCodeButtonText }}
                      </el-button>
                    </template>
                  </el-input>
                </div>
              </el-form-item>

              <!-- 错误提示区域 (基于Figma设计) -->
              <div v-if="errorMessage" class="error-message">
                <span class="error-icon">⚠</span>
                <span>{{ errorMessage }}</span>
              </div>

              <!-- 登录按钮 -->
              <el-form-item class="form-item">
                <el-button
                  type="primary"
                  size="large"
                  :loading="loading"
                  :disabled="!isFormValid"
                  class="login-button"
                  @click="handleLogin"
                >
                  <span v-if="!loading">{{ $t('auth.login') }}</span>
                  <span v-else>{{ $t('auth.loggingIn') }}</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthLogic } from './index'

// 使用认证逻辑
const {
  loginFormRef,
  loginForm,
  loginRules,
  loading,
  isFormValid,
  errorMessage,
  sendingCode,
  sendCodeDisabled,
  sendCodeButtonText,
  handleLogin,
  handleSendCode
} = useAuthLogic()
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
