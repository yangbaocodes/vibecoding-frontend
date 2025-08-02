// Auth 页面逻辑 - 基于 Figma 设计
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

// 路由实例
const router = useRouter()

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

    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 模拟登录失败的情况 (基于Figma错误状态设计)
    if (
      loginForm.value.email === 'demo@cognizant.com' &&
      loginForm.value.verificationCode === 'wrong'
    ) {
      errorMessage.value = 'Invalid email or verification code. Please try again.'
      return
    }

    // 登录成功
    ElMessage.success('Login successful!')

    // 跳转到仪表板
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.'
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

    // 模拟发送验证码API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success('Verification code sent successfully!')

    // 开始倒计时 - 30秒
    countdown.value = 30
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('Failed to send verification code. Please try again.')
  } finally {
    sendingCode.value = false
  }
}

// 导出组合函数
export function useAuthLogic() {
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
