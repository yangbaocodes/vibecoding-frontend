// Auth 页面逻辑 - 基于 Figma 设计
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { userApi } from '@/api'
import { useUserStore } from '@/store/modules/user'

// 导出组合函数
export function useAuthLogic() {
  // 路由实例
  const router = useRouter()

  // 用户store
  const userStore = useUserStore()

  // 表单引用
  const loginFormRef = ref<FormInstance>()

  // 表单数据
  const loginForm = ref({
    email: '',
    verificationCode: ''
  })

  // 其他状态
  const loading = ref(false)
  const errorMessage = ref('')
  const sendingCode = ref(false)
  const countdown = ref(0)
  const sendCodeDisabled = computed(() => {
    const emailPattern = /^[^\s@]+@cognizant\.com$/
    return !emailPattern.test(loginForm.value.email) || countdown.value > 0 || sendingCode.value
  })
  const sendCodeButtonText = computed(() => {
    if (sendingCode.value) return 'Sending...'
    if (countdown.value > 0) return `${countdown.value}s`
    return 'Send'
  })

  // 表单验证规则
  const loginRules: FormRules = {
    email: [
      { required: true, message: 'Please enter your email', trigger: 'blur' },
      {
        pattern: /^[^\s@]+@cognizant\.com$/,
        message: 'Please enter a valid @cognizant.com email address',
        trigger: 'blur'
      }
    ],
    verificationCode: [
      { required: true, message: 'Please enter verification code', trigger: 'blur' },
      { min: 4, max: 8, message: 'Verification code length should be 4 to 8', trigger: 'blur' }
    ]
  }

  // 计算表单是否有效
  const isFormValid = computed(() => {
    const emailPattern = /^[^\s@]+@cognizant\.com$/
    return emailPattern.test(loginForm.value.email) && loginForm.value.verificationCode.length >= 4
  })

  // 登录处理
  const handleLogin = async () => {
    if (!loginFormRef.value) return

    try {
      const valid = await loginFormRef.value.validate()
      if (!valid) return

      loading.value = true
      errorMessage.value = '' // 清除之前的错误消息

      // 调用真实的登录或注册API
      const response = await userApi.loginOrRegister({
        email: loginForm.value.email,
        verificationCode: loginForm.value.verificationCode
      })

      console.log('Login response:', response)

      // 根据API返回的数据结构保存信息
      if (response.data) {
        const { token, user, isNewUser } = response.data

        // 使用store保存用户状态
        userStore.setToken(token)
        userStore.setUserInfo(user)

        console.log('Token saved via store:', token)
        console.log('User info saved via store:', user)

        // 显示成功消息，区分新用户和老用户
        if (isNewUser) {
          ElMessage.success('Registration successful! Welcome!')
        } else {
          ElMessage.success('Login successful!')
        }

        // 跳转到仪表板
        console.log('Attempting to navigate to dashboard...')
        await router.push('/converter')
        console.log('Navigation completed')
      } else {
        console.error('No response data received')
        errorMessage.value = 'Login failed: No data received from server'
      }
    } catch (error: any) {
      console.error('Login error:', error)

      // 处理不同类型的错误
      if (error.response?.data?.message) {
        errorMessage.value = error.response.data.message
      } else if (error.message) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = 'Login failed. Please check your credentials.'
      }
    } finally {
      loading.value = false
    }
  }

  // 发送验证码处理
  const handleSendCode = async () => {
    // 验证邮箱格式
    const emailPattern = /^[^\s@]+@cognizant\.com$/
    if (!emailPattern.test(loginForm.value.email)) {
      ElMessage.error('Please enter a valid @cognizant.com email address')
      return
    }

    try {
      sendingCode.value = true

      // 调用真实的发送验证码API
      await userApi.sendVerificationCode({ email: loginForm.value.email })

      ElMessage.success('Verification code sent successfully!')

      // 开始倒计时 - 30秒
      countdown.value = 30
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } catch (error: any) {
      console.error('Send verification code error:', error)

      // 处理错误消息
      if (error.response?.data?.message) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('Failed to send verification code. Please try again.')
      }
    } finally {
      sendingCode.value = false
    }
  }

  return {
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
  }
}
