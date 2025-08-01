<template>
  <div
    class="upload-zone"
    :class="{
      'upload-zone--dragover': isDragOver,
      'upload-zone--disabled': disabled
    }"
    @click="triggerFileInput"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      ref="fileInputRef"
      type="file"
      multiple
      :accept="acceptedTypesString"
      @change="handleFileSelect"
      style="display: none"
    />

    <div class="upload-zone__content">
      <div class="upload-zone__icon">
        <ElIcon size="64">
          <UploadFilled />
        </ElIcon>
      </div>

      <div class="upload-zone__text">
        <p class="upload-zone__description">
          {{ $t('converter.uploadZone.description_1') }}
          <span class="upload-zone__description--highlight">
            {{ $t('converter.uploadZone.description_2') }}
          </span>
        </p>
        <p class="upload-zone__description">
          {{ $t('converter.uploadZone.instruction') }}
        </p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isProcessing" class="upload-zone__loading">
      <ElIcon class="is-loading">
        <Loading />
      </ElIcon>
      <p>{{ $t('converter.processing') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElIcon, ElMessage } from 'element-plus'
import { UploadFilled, Loading } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

interface Props {
  acceptedTypes?: string[]
  maxSize?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  acceptedTypes: () => ['.docx', '.pdf'],
  maxSize: 5 * 1024 * 1024, // 5MB
  disabled: false
})

const emit = defineEmits<{
  'files-selected': [files: File[]]
}>()

const { t } = useI18n()

// 响应式数据
const fileInputRef = ref<HTMLInputElement>()
const isDragOver = ref(false)
const isProcessing = ref(false)

// 计算属性
const acceptedTypesString = computed(() => {
  return props.acceptedTypes.join(',')
})

// 方法
const triggerFileInput = () => {
  if (props.disabled || isProcessing.value) return
  fileInputRef.value?.click()
}

const validateFiles = (files: File[]): { validFiles: File[]; hasLimitExceeded: boolean } => {
  const validFiles: File[] = []
  let hasLimitExceeded = false

  for (const file of files) {
    // 检查文件类型
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!props.acceptedTypes.includes(fileExtension)) {
      ElMessage.error(t('converter.errors.invalidType', { name: file.name }))
      continue
    }

    validFiles.push(file)
  }

  // 检查文件数量限制 (最多10个文件)
  if (validFiles.length > 10) {
    hasLimitExceeded = true
    // 只保留前10个文件
    validFiles.splice(10)
  }

  return { validFiles, hasLimitExceeded }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const filesArray = Array.from(target.files)
    processFiles(filesArray)
    // 清空input值，允许重复选择相同文件
    target.value = ''
  }
}

const handleDragOver = (event: DragEvent) => {
  if (props.disabled || isProcessing.value) return
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  if (props.disabled || isProcessing.value) return
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  if (props.disabled || isProcessing.value) return
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files) {
    const filesArray = Array.from(files)
    processFiles(filesArray)
  }
}

const processFiles = async (files: File[]) => {
  if (files.length === 0) return

  isProcessing.value = true

  try {
    const { validFiles, hasLimitExceeded } = validateFiles(files)

    // 如果有限制超出，显示错误提示
    if (hasLimitExceeded) {
      ElMessage.error(t('converter.errors.uploadLimitExceeded'))
    }

    if (validFiles.length > 0) {
      emit('files-selected', validFiles)
      ElMessage.success(t('converter.filesAdded', { count: validFiles.length }))
    }
  } catch (error) {
    console.error('Error processing files:', error)
    ElMessage.error(t('converter.processingError'))
  } finally {
    isProcessing.value = false
  }
}
</script>

<style lang="scss" scoped>
.upload-zone {
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &--dragover {
    border-color: #3b82f6;
    background: #dbeafe;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
  }

  &__content {
    text-align: center;
    //padding: 1rem;
  }

  &__icon {
    color: #6b7280;

    // .upload-zone:hover &,
    // .upload-zone--dragover & {
    //   color: #3b82f6;
    // }
  }

  &__description {
    margin: 0;
    color: #606266;
    font-size: 1rem;

    &--highlight {
      color: #0133a0;
      font-weight: 500;
    }

    &:not(:last-child) {
      margin-bottom: 0.25rem;
    }
  }

  &__button {
    .el-button {
      padding: 0.5rem 1.5rem;
    }
  }

  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;

    .el-icon {
      font-size: 24px;
      color: #3b82f6;
    }
  }
}

// 工具类
.mr-2 {
  margin-right: 0.5rem;
}

// 响应式调整
@media (max-width: 640px) {
  .upload-zone {
    min-height: 150px;

    &__content {
      padding: 1.5rem;
    }

    &__title {
      font-size: 1rem;
    }

    &__button .el-button {
      padding: 0.375rem 1rem;
      font-size: 0.875rem;
    }
  }
}
</style>
