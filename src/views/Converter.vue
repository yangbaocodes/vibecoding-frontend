<template>
  <div class="converter-page">
    <div class="page-header">
      <div>
        <p class="page-header__description">{{ $t('converter.description') }}</p>
      </div>
    </div>

    <div class="converter-content">
      <!-- 文件上传区域 -->
      <ConverterUploadZone
        @files-selected="handleFilesSelected"
        :accepted-types="acceptedTypes"
        :max-size="maxFileSize"
        :disabled="false"
      />

      <!-- 文件列表展示区域 -->
      <FileListDisplay
        :files="uploadedFiles"
        @selected-multiple="handleSelectedMultiple"
        @selected-single="handleSelectedSingle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import ConverterUploadZone from '@/components/converter/ConverterUploadZone.vue'
import FileListDisplay from '@/components/converter/FileListDisplay.vue'
import { FileItem, FileStatus } from '@/utils/converterUtils'

const { t } = useI18n()

// 响应式数据
const uploadedFiles = ref<FileItem[]>([])
const acceptedTypes = ref(['.docx', '.pdf'])
const maxFileSize = ref(5 * 1024 * 1024) // 5MB

// 处理文件选择
const handleFilesSelected = (files: File[]) => {
  const newFiles: FileItem[] = files.map(file => ({
    name: file.name,
    size: file.size,
    file: file,
    status: FileStatus.PENDING
  }))

  // 检查重复文件
  const existingFileNames = uploadedFiles.value.map(f => f.name)
  const uniqueFiles = newFiles.filter(file => !existingFileNames.includes(file.name))

  if (uniqueFiles.length !== newFiles.length) {
    ElMessage.warning(t('converter.duplicateFiles'))
  }

  uploadedFiles.value.push(...uniqueFiles)

  // 记录文件路径（TODO部分）
  uniqueFiles.forEach(file => {
    console.log('File selected for future upload:', {
      name: file.name,
      size: file.size,
      type: getFileTypeDisplay(file.name),
      path: file.file.webkitRelativePath || `pending_upload/${file.name}`
    })
  })
}

const handleSelectedMultiple = (indices: number[], files: FileItem[], operation: OperationType) => {
  console.log('mmmmmmmmmmmm:Selected multiple files:', files)
}

const handleSelectedSingle = (index: number, file: FileItem, operation: OperationType) => {
  console.log('mmmmmmmmmmmm:Selected single file:', file)
}

const getFileTypeDisplay = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
      return 'PDF'
    case 'docx':
      return 'DOCX'
    case 'doc':
      return 'DOC'
    default:
      return extension?.toUpperCase() || 'FILE'
  }
}
</script>

<style lang="scss" scoped>
.converter-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;

  &__title {
    margin: 0 0 0.5rem 0;
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
  }

  &__description {
    margin: 0;
    font-size: 1rem;
    color: #6b7280;
  }
}

.converter-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.converter-info {
  margin-top: 1rem;
}

.info-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;

  &__title {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  &__list {
    margin: 0;
    padding-left: 1.25rem;
    color: #6b7280;

    li {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .converter-page {
    padding: 1rem;
  }

  .page-header {
    &__title {
      font-size: 1.5rem;
    }

    &__description {
      font-size: 0.875rem;
    }
  }

  .info-card {
    padding: 1rem;

    &__title {
      font-size: 1rem;
    }
  }
}
</style>
